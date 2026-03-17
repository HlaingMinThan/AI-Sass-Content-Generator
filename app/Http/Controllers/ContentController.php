<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\ContentHistory;

class ContentController extends Controller
{
    public function index()
    {
        $histories = \App\Models\ContentHistory::where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Content/Index', [
            'histories' => $histories
        ]);
    }

    public function create()
    {
        return Inertia::render('Content/Create', [
            'customTones' => Auth::user()->customTones()->get()
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
            return back()->withErrors(['credits' => 'You do not have enough credits to generate content. Please purchase more.']);
        }

        $toneText = ucfirst($request->tone); // Default tone text
        $toneName = $toneText;
        
        // Handle custom tones
        if (str_starts_with($request->tone, 'custom-')) {
            $toneId = str_replace('custom-', '', $request->tone);
            $customTone = \App\Models\CustomTone::where('user_id', Auth::id())->find($toneId);
            
            if ($customTone) {
                $toneName = $customTone->name;
                $toneText = "{$customTone->name}. ";
                if ($customTone->description) {
                    $toneText .= "Style context: {$customTone->description}. ";
                }
                if ($customTone->sample_content) {
                    $toneText .= "Writing style sample: \"\"\"{$customTone->sample_content}\"\"\". ";
                }
            }
        }

        $prompt = $this->buildPrompt(
            $request->content_type, 
            $request->topic, 
            $request->language, 
            $toneText, 
            $request->keywords
        );

        try {
            $user->decrement('available_credits');

            $agent = new \App\Ai\Agents\ContentGeneratorAgent();
            $response = $agent->prompt($prompt);
            $generatedText = $response->text;

            $history = ContentHistory::create([
                'user_id' => $user->id,
                'model_used' => 'gemini',
                'prompt' => $prompt,
                'topic' => $request->topic,
                'tone_name' => $toneName,
                'content_type' => $request->content_type,
                'generated_content' => $generatedText,
            ]);

            return redirect()->route('content.history.show', $history->id)
                ->with('success', 'Content generated successfully!');

        } catch (\Exception $e) {
            $user->increment('available_credits');
            return back()->withErrors(['ai_error' => 'Failed to generate content: ' . $e->getMessage()]);
        }
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
            return back()->withErrors(['credits' => 'You do not have enough credits to generate content.']);
        }

        // Build the refinement prompt with the previous content as context
        $prompt = "You are refining existing content to make it more professional and natural.\n\n";
        $prompt .= "### PREVIOUS CONTENT FOR REFERENCE:\n\"\"\"{$history->generated_content}\"\"\"\n\n";
        $prompt .= "### REFINEMENT INSTRUCTIONS:\n\"\"\"{$request->refinement}\"\"\"\n\n";
        $prompt .= "### CRITICAL CLEANUP RULE:\n";
        $prompt .= "The previous content may contain robotic placeholder labels like 'Introduction', 'Section 1', 'Main Sections', 'Body', or 'Conclusion'. \n";
        $prompt .= "YOU MUST REMOVE THESE LABELS. Replace them with topic-specific headings or simply integrate the content naturally without a label.\n\n";
        $prompt .= "### FINAL TASK:\nRedraft the content above using strictly Markdown. Ensure a premium, readable flow. No meta-commentary.";

        try {
            $user->decrement('available_credits');

            $agent = new \App\Ai\Agents\ContentGeneratorAgent();
            $response = $agent->prompt($prompt);
            $generatedText = $response->text;

            $newHistory = ContentHistory::create([
                'user_id' => $user->id,
                'model_used' => 'gemini',
                'prompt' => $prompt, 
                'topic' => $history->topic,
                'tone_name' => $history->tone_name,
                'content_type' => $history->content_type,
                'generated_content' => $generatedText,
            ]);

            return redirect()->route('content.history.show', $newHistory->id)
                ->with('success', 'Content regenerated with clean formatting!');

        } catch (\Exception $e) {
            $user->increment('available_credits');
            return back()->withErrors(['ai_error' => 'Failed to regenerate content: ' . $e->getMessage()]);
        }
    }

    private function buildPrompt($type, $topic, $language, $toneText, $keywords = null)
    {
        $templates = [
            'TikTok Script' => [
                'role' => 'You are a social media script writer.',
                'instruction' => 'Write a short TikTok script.',
                'format' => "### [Hook]\n(Write a strong attention grabbing line here)\n\n### [Body]\n(Write 2-4 short, punchy lines explaining the idea here)\n\n### [Call To Action]\n(Write a short CTA here)"
            ],
            'Facebook Post' => [
                'role' => 'You are a social media content writer.',
                'instruction' => 'Write a Facebook post.',
                'format' => "### [Opening]\n(Write an engaging opening sentence here)\n\n### [Content]\n(Write a story or explanation in 3-5 sentences here)\n\n### [Key Points]\n- (Point 1)\n- (Point 2)\n- (Point 3)\n\n### [Call To Action]\n(Invite readers to take action here)"
            ],
            'Marketing Copy' => [
                'role' => 'You are a marketing copywriter.',
                'instruction' => 'Write persuasive marketing copy.',
                'format' => "# [Headline]\n(Clear benefit-driven headline)\n\n### [Problem]\n(Describe the problem here)\n\n### [Solution]\n(Introduce the solution here)\n\n### [Benefits]\n- (Benefit 1)\n- (Benefit 2)\n- (Benefit 3)\n\n### [Call To Action]\n(Clear CTA here)"
            ],
            'Caption' => [
                'role' => 'You are a social media caption writer.',
                'instruction' => 'Write 5 distinct types of captions for this topic. Each must have its specific title.',
                'format' => "### 1. Short & Strong Hook\n(One powerful line)\n\n### 2. Click-Worthy Hook + CTA\n(Hook and engagement line)\n\n### 3. Catchy & Creative\n(Creative angle)\n\n### 4. Professional & Authoritative\n(Formal tone)\n\n### 5. Relatable / Meme Style\n(Humorous or trend-aware)\n\n### [Recommended Hashtags]\n(Relevant tags)"
            ],
            'Blog Post' => [
                'role' => 'You are a blog writer.',
                'instruction' => 'Write an informative blog post.',
                'format' => "# (Write a Catchy Title here)\n\n(Compelling intro paragraph - no header)\n\n## (Subheading 1)\n(Content)\n\n## (Subheading 2)\n(Content)\n\n## (Subheading 3)\n(Content)\n\n## (Conclusion Summary)\n(Final insight)"
            ],
        ];

        $template = $templates[$type] ?? $templates['Blog Post'];
        
        $prompt = "{$template['role']}\n\n";
        $prompt .= "{$template['instruction']}\n\n";
        $prompt .= "Topic: {$topic}\n";
        $prompt .= "Language: {$language}\n";
        $prompt .= "Tone: {$toneText}\n";
        
        if ($keywords) {
            $prompt .= "Keywords: {$keywords}\n";
        }

        $prompt .= "\nREQUIRED OUTPUT STRUCTURE (Strict Markdown):\n\n{$template['format']}\n\n";
        $prompt .= "CRITICAL RULES:\n";
        $prompt .= "1. NO INTRODUCTORY TEXT. Start immediately with the content or header. Do not write 'Here is your content' or 'Topic: ...'.\n";
        $prompt .= "2. For Captions: You MUST include the titles like '### 1. Short & Strong Hook' as headers before each version.\n";
        $prompt .= "3. NO META-LABELS like 'Introduction', 'Section 1', or 'Conclusion' in blog posts. Use topic names as headers.\n";
        $prompt .= "4. Output ONLY the generated content. No conversational filler.";

        return $prompt;
    }
}
