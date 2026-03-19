<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\ContentHistory;
use App\Ai\Agents\ContentGeneratorAgent;

class ContentController extends Controller
{
    public function index()
    {
        $histories = ContentHistory::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Content/Index', [
            'histories' => $histories
        ]);
    }

    public function create()
    {
        return Inertia::render('Content/Create', [
            'customTones' => Auth::user()->customTones()->get(),
            'preferredTone' => Auth::user()->preference?->preferred_tone
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:1000',
            'content_type' => 'required|string|max:50',
            'tone' => 'required|string|max:50',
            'language' => 'required|string',
            'keywords' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        if ($user->available_credits < 1) {
            return back()->withErrors(['credits' => 'You do not have enough credits. Please purchase more.']);
        }

        // Deduct credit
        $user->decrement('available_credits');

        // Create placeholder
        $history = $user->contentHistories()->create([
            'topic' => $request->topic,
            'content_type' => $request->content_type,
            'tone' => $request->tone,
            'language' => $request->language,
            'keywords' => $request->keywords,
            'generated_content' => null, 
        ]);

        return redirect()->route('content.history.show', $history->id);
    }

    public function stream(ContentHistory $history)
    {
        if ($history->user_id !== Auth::id()) {
            abort(403);
        }

        return response()->stream(function () use ($history) {
            set_time_limit(0);
            $fullContent = ""; 

            try {
                $agent = new ContentGeneratorAgent();
                $promptBody = $this->buildPromptBody($history);
                $stream = $agent->stream($promptBody);
                foreach ($stream as $event) {
                    if ($event instanceof \Laravel\Ai\Streaming\Events\TextDelta) {
                        echo "data: " . json_encode(['token' => $event->delta]) . "\n\n";
                        $fullContent .= $event->delta;
                    }
                    
                    if (connection_aborted()) break;
                    
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                }

                if ($fullContent) {
                    $history->update([
                        'generated_content' => $fullContent,
                        'last_refinement' => null, // Clear refinement after successful stream
                        'prompt' => $promptBody,
                        'model_used' => 'gemini-2.0-flash',
                    ]);
                }
            } catch (\Exception $e) {
                echo "data: " . json_encode(['error' => $e->getMessage()]) . "\n\n";
            }
            
            echo "data: [DONE]\n\n";
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function regenerate(Request $request, ContentHistory $history)
    {
        if ($history->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'refinement' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        if ($user->available_credits < 1) {
            return back()->withErrors(['credits' => 'You do not have enough credits.']);
        }

        // Create a separate history record for the attempt if needed, 
        // OR just clear the current one to trigger the stream on the frontend.
        // For simplicity and "wow" factor, we'll clear the content and redirect back.
        
        $user->decrement('available_credits');
        
        $history->update([
            'last_refinement' => $request->refinement,
        ]);

        return back()->with('success', 'Refining content...');
    }

    private function buildPromptBody(ContentHistory $history)
    {
        $templates = [
            'TikTok Script' => [
                'role' => 'You are a TikTok content strategist.',
                'instruction' => 'Create a highly engaging TikTok script (15-60s). Include scene descriptions, text-on-screen overlays, and viral hooks.',
                'format' => "### [Hook/Headline]\n(Hook here)\n\n### [Visual Strategy]\n(Scenes and camera angles)\n\n### [Script Content]\n(Dialogue and text-on-screen)\n\n### [Music/SFX Recommendations]\n(Vibe and sound cues)"
            ],
            'Facebook Post' => [
                'role' => 'You are a social media marketing expert.',
                'instruction' => 'Write a persuasive Facebook post with emojis. Include a clear call to action and natural line breaks.',
                'format' => "### [Headline]\n(Engaging headline)\n\n### [Post Body]\n(Main content with emojis)\n\n### [Call to Action]\n(What should the reader do?)"
            ],
            'Marketing Copy' => [
                'role' => 'You are a direct-response copywriter.',
                'instruction' => 'Write compelling marketing copy using the PAS (Problem-Agitate-Solution) or AIDA framework.',
                'format' => "### [Attention/Hook]\n(Powerful lead)\n\n### [Core Message]\n(Persuasive body copy)\n\n### [Closing/CTA]\n(Immediate action step)"
            ],
            'Caption' => [
                'role' => 'You are a social media caption writer.',
                'instruction' => 'Generate 10 different one-sentence captions about the topic. Each must be only ONE sentence (short and punchy), include a strong hook, and follow a specific style.',
                'format' => "### 1. Catchy:\n[one sentence caption]\n\n### 2. Story-based:\n[one sentence caption]\n\n### 3. Question:\n[one sentence caption]\n\n### 4. Bold Statement:\n[one sentence caption]\n\n### 5. Relatable:\n[one sentence caption]\n\n### 6. Problem-Solution:\n[one sentence caption]\n\n### 7. Emotional:\n[one sentence caption]\n\n### 8. Curiosity:\n[one sentence caption]\n\n### 9. CTA (Call to Action):\n[one sentence caption]\n\n### 10. Contrarian:\n[one sentence caption]\n\n### [Hashtags]\n(Relevant hashtags here)"
            ],
            'Blog Post' => [
                'role' => 'You are a blog writer.',
                'instruction' => 'Write an informative, SEO-friendly blog post. Do not use generic labels like "Introduction" or "Section 1" as headers; instead, generate creative, context-specific headings based on the topic.',
                'format' => "### [Engaging Title]\n(Your creative title)\n\n### [Hook/Opening]\n(Context-specific opening)\n\n### [Creative Header 1]\n(Detail section 1)\n\n### [Creative Header 2]\n(Detail section 2)\n\n### [Conclusion/CTA]\n(Creative closing)"
            ]
        ];

        $type = $history->content_type;
        $template = $templates[$type] ?? $templates['Marketing Copy'];

        $keywordsText = $history->keywords ? "Keywords to include: {$history->keywords}." : "";
        
        $toneName = ucfirst($history->tone);
        $toneText = $toneName;
        
        if (str_starts_with($history->tone, 'custom-')) {
            $toneId = str_replace('custom-', '', $history->tone);
            $customTone = \App\Models\CustomTone::where('user_id', $history->user_id)->find($toneId);
            if ($customTone) {
                $toneText = "{$customTone->name}. ";
                if ($customTone->description) $toneText .= "Style context: {$customTone->description}. ";
                if ($customTone->sample_content) $toneText .= "Mimic this writing sample closely: {$customTone->sample_content}. ";
            }
        }

        // Context-aware prompt construction
        if ($history->last_refinement && $history->generated_content) {
            return "You are refining existing content based on user feedback. 
            
            ORIGINAL CONTENT:
            \"\"\"
            {$history->generated_content}
            \"\"\"
            
            REFINEMENT FEEDBACK:
            \"\"\"
            {$history->last_refinement}
            \"\"\"

            CRITICAL REQUIREMENTS:
            - Update the content above while strictly following the original tone selection: {$toneText}.
            - Retain the structure but apply the specific changes requested.
            - DO NOT include meta-labels like 'Section 1'.
            - OUTPUT FORMAT: EXACTLY follow the original structure for {$type}:
            {$template['format']}";
        }

        return "{$template['role']} {$template['instruction']} 
        
        Topic: {$history->topic}
        Tone: {$toneText}
        Language: {$history->language}
        {$keywordsText}

        OUTPUT FORMAT REQUIREMENTS:
        - Use Markdown headers (###)
        - Strict Output Language: " . ucfirst($history->language) . " (Burmese or English)
        - NO meta-labels like 'Section 1'.
        - EXACTLY follow this structure:
        {$template['format']}";
    }
}
