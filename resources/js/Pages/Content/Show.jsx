import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Copy, 
    CheckCircle2, 
    RotateCcw, 
    Loader2, 
    Sparkles, 
    Calendar, 
    Cpu, 
    Clock, 
    FileText,
    Share2,
    Trash2,
    Download
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function ShowContent({ history }) {
    const [copied, setCopied] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [readingTime, setReadingTime] = useState(0);

    const { data, setData, post: postRegenerate, processing: regenerating } = useForm({
        refinement: '',
    });

    const parsedHtml = useMemo(() => {
        if (!history?.generated_content) return '';
        // Configure marked options if needed
        const rawHtml = marked.parse(history.generated_content);
        return DOMPurify.sanitize(rawHtml);
    }, [history?.generated_content]);

    useEffect(() => {
        if (parsedHtml) {
            const doc = new DOMParser().parseFromString(parsedHtml, 'text/html');
            const text = doc.body.textContent || "";
            const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
            setWordCount(words);
            setReadingTime(Math.ceil(words / 200));
        }
    }, [parsedHtml]);

    const handleCopy = () => {
        const doc = new DOMParser().parseFromString(parsedHtml, 'text/html');
        const plainText = doc.body.textContent || "";
        navigator.clipboard.writeText(plainText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = (e) => {
        e.preventDefault();
        postRegenerate(route('content.history.regenerate', history.id));
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Content Portal</h2>}>
            <Head title={history.topic || 'Generated Content'} />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-foreground truncate max-w-2xl">
                            {history.topic || 'Untitled Masterpiece'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm ring-1 ring-inset",
                                copied 
                                    ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" 
                                    : "bg-background text-foreground ring-border hover:bg-muted hover:ring-muted-foreground/20"
                            )}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Text
                                </>
                            )}
                        </button>
                        
                        <div className="h-8 w-[1px] bg-border/50 mx-1 hidden sm:block" />
                        
                        <button className="p-2.5 rounded-xl border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-all hidden sm:flex">
                            <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2.5 rounded-xl border bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all hidden sm:flex">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Sidebar: Metadata & Info */}
                    <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                        <div className="rounded-3xl border bg-card/50 backdrop-blur-sm p-6 shadow-xl border-white/5 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Insight Panel</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 rounded-2xl p-3 border border-border/40">
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Words</div>
                                        <div className="text-xl font-black">{wordCount}</div>
                                    </div>
                                    <div className="bg-muted/30 rounded-2xl p-3 border border-border/40">
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Time</div>
                                        <div className="text-xl font-black">{readingTime}m</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-border/40">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Created</span>
                                        <span className="font-semibold">{new Date(history.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Cpu className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Model</span>
                                        <span className="font-semibold capitalize">{history.model_used}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Type</span>
                                        <span className="font-semibold">{history.content_type || 'Custom Content'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none">Tone</span>
                                        <span className="font-semibold text-primary">{history.tone_name || 'Standard'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border bg-secondary/10 p-6 space-y-4 border-white/5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Prompt Blueprint</h4>
                            <div className="text-xs leading-relaxed text-muted-foreground italic">
                                "{history.topic ? (
                                    <>Write high-quality content about '{history.topic}'. Use a <b>{history.tone_name}</b> tone.</>
                                ) : history.prompt}"
                            </div>
                        </div>
                    </div>

                    {/* Main Content: The Document */}
                    <div className="lg:col-span-9 space-y-8">
                        <div className="relative overflow-hidden rounded-[2.5rem] border bg-card shadow-2xl min-h-[600px] border-white/5">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-purple-500 to-primary/40 opacity-70" />
                            
                            <div className="p-8 md:p-16 lg:p-20">
                                <article
                                    className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                                    prose-p:leading-relaxed prose-p:text-foreground/90
                                    prose-headings:font-black prose-headings:tracking-tight
                                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-3xl prose-img:shadow-2xl
                                    format-text"
                                    dangerouslySetInnerHTML={{ __html: parsedHtml }}
                                />
                            </div>
                        </div>

                        {/* Premium Regeneration Box */}
                        <div className="relative group overflow-hidden rounded-[2rem] border bg-card/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl border-white/10">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <RotateCcw className="w-48 h-48" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
                                <div className="space-y-4 max-w-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight">Iterate</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Not quite perfect? Give the AI specific feedback to refine this version into something even better.
                                    </p>
                                </div>

                                <form onSubmit={handleRegenerate} className="flex-1 space-y-4">
                                    <div className="relative">
                                        <textarea
                                            value={data.refinement}
                                            onChange={(e) => setData('refinement', e.target.value)}
                                            placeholder="e.g. 'Make the intro catchier', 'Translate to English', 'Add a bulleted list of features'..."
                                            className="w-full rounded-2xl border-border/50 bg-background/50 px-6 py-5 text-lg shadow-inner transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none min-h-[140px] placeholder:text-muted-foreground/40"
                                        />
                                        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pointer-events-none">
                                            Feedback Input
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            AI Ready for Review
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={regenerating}
                                            className={cn(
                                                "relative group overflow-hidden inline-flex items-center justify-center rounded-2xl px-10 py-4 text-sm font-black uppercase tracking-widest transition-all shadow-2xl",
                                                regenerating 
                                                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                                                    : "bg-primary text-primary-foreground hover:scale-[1.05] active:scale-95 hover:shadow-primary/40 shadow-primary/20"
                                            )}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                            {regenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <RotateCcw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
                                                    Regenerate 
                                                    <span className="ml-2 px-1.5 py-0.5 rounded-md bg-white/20 text-[8px] font-black">1 CREDIT</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
