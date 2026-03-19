import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { 
    Sparkles, 
    Loader2, 
    Type, 
    MessageSquare, 
    Languages, 
    Key, 
    Zap, 
    Info, 
    ArrowRight,
    CheckCircle2,
    Video,
    Facebook,
    Megaphone,
    MessageSquareQuote,
    FileText,
    MousePointer2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreateContent() {
    const { customTones } = usePage().props;
    const user = usePage().props.auth.user;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        topic: '',
        content_type: 'Blog Post',
        tone: 'professional',
        language: 'burmese',
        keywords: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('content.store'));
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Draft Premium Content</h2>}>
            <Head title="Create Content" />

            <div className="max-w-6xl mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Main Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Global Error Display */}
                        {(errors.ai_error || errors.credits) && (
                            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="p-2 bg-destructive/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-destructive uppercase tracking-wider">Attention Required</h4>
                                    <p className="text-sm text-destructive/90 font-medium leading-relaxed">
                                        {errors.ai_error || errors.credits}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-sm shadow-xl border-white/10">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Sparkles className="w-32 h-32" />
                            </div>
                            
                            <form onSubmit={submit} className="relative p-8 md:p-10 space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Type className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold">Content Core</h3>
                                    </div>
                                    
                                    <label htmlFor="topic" className="text-sm font-semibold text-muted-foreground ml-1">
                                        What should the AI write about?
                                    </label>
                                    <textarea
                                        id="topic"
                                        value={data.topic}
                                        onChange={(e) => setData('topic', e.target.value)}
                                        className="flex min-h-[140px] w-full rounded-2xl border-border/50 bg-background/50 px-4 py-4 text-base shadow-inner transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g., A breakdown of why React Server Components are the future of web development..."
                                        required
                                        maxLength={1000}
                                    />
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-xs text-muted-foreground">
                                            {1000 - data.topic.length} characters remaining
                                        </p>
                                        {errors.topic && <p className="text-sm text-destructive font-medium">{errors.topic}</p>}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <MousePointer2 className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <h3 className="text-lg font-bold">Content Type</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {[
                                            { id: 'TikTok Script', icon: Video, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                                            { id: 'Facebook Post', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10' },
                                            { id: 'Marketing Copy', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                                            { id: 'Caption', icon: MessageSquareQuote, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                            { id: 'Blog Post', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                                        ].map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setData('content_type', type.id)}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-3 group",
                                                    data.content_type === type.id 
                                                        ? "bg-primary/10 border-primary shadow-md ring-2 ring-primary/20" 
                                                        : "bg-background/40 border-border/50 hover:border-primary/40 hover:bg-background/60"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", type.bg)}>
                                                    <type.icon className={cn("w-5 h-5", type.color)} />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider text-center",
                                                    data.content_type === type.id ? "text-primary" : "text-muted-foreground"
                                                )}>
                                                    {type.id}
                                                </span>
                                                {data.content_type === type.id && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <CheckCircle2 className="w-4 h-4 text-primary fill-background" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.content_type && <p className="text-sm text-destructive font-medium mt-1">{errors.content_type}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <label htmlFor="tone" className="text-sm font-semibold text-muted-foreground">
                                                Tone of Voice
                                            </label>
                                        </div>
                                        <div className="relative group">
                                            <select
                                                id="tone"
                                                value={data.tone}
                                                onChange={(e) => setData('tone', e.target.value)}
                                                className="w-full rounded-xl border-border/50 bg-background/50 px-4 py-3 text-sm shadow-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            >
                                                <optgroup label="Default Tones">
                                                    <option value="professional">Professional</option>
                                                    <option value="casual">Casual & Conversational</option>
                                                    <option value="enthusiastic">Enthusiastic</option>
                                                    <option value="informative">Educational / Informative</option>
                                                    <option value="persuasive">Persuasive (Sales)</option>
                                                </optgroup>
                                                {Array.isArray(customTones) && customTones.length > 0 && (
                                                    <optgroup label="Your Custom Tones">
                                                        {customTones.map((tone) => (
                                                            <option key={tone.id} value={`custom-${tone.id}`}>
                                                                {tone.name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ArrowRight className="w-3 h-3 rotate-90" />
                                            </div>
                                        </div>
                                        {errors.tone && <p className="text-sm text-destructive font-medium">{errors.tone}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <Languages className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <label htmlFor="language" className="text-sm font-semibold text-muted-foreground">
                                                Output Language
                                            </label>
                                        </div>
                                        <div className="relative group">
                                            <select
                                                id="language"
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                                className="w-full rounded-xl border-border/50 bg-background/50 px-4 py-3 text-sm shadow-sm appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            >
                                                <option value="burmese">Burmese (Myanmar)</option>
                                                <option value="english">English</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                <ArrowRight className="w-3 h-3 rotate-90" />
                                            </div>
                                        </div>
                                        {errors.language && <p className="text-sm text-destructive font-medium">{errors.language}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                            <Key className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <label htmlFor="keywords" className="text-sm font-semibold text-muted-foreground">
                                            Keywords (Optional)
                                        </label>
                                    </div>
                                    <input
                                        id="keywords"
                                        type="text"
                                        value={data.keywords}
                                        onChange={(e) => setData('keywords', e.target.value)}
                                        className="w-full rounded-xl border-border/50 bg-background/50 px-4 py-3 text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Comma separated: SaaS, AI, Marketing..."
                                    />
                                    {errors.keywords && <p className="text-sm text-destructive font-medium">{errors.keywords}</p>}
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={cn(
                                            "relative w-full group overflow-hidden rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100",
                                            processing && "cursor-not-allowed"
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <div className="flex items-center justify-center gap-3">
                                            {processing ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span>Crafting your masterpiece...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                                    <span>Generate Magical Copy</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                    <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
                                        costs 1 generation credit
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Content */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Credits Widget */}
                        <div className="rounded-3xl border bg-card/50 backdrop-blur-sm p-6 shadow-lg border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Your Balance</h4>
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-400">
                                    {user.available_credits}
                                </span>
                                <span className="text-sm font-bold text-muted-foreground">Credits left</span>
                            </div>
                            <div className="mt-8 space-y-3">
                                <Link 
                                    href={route('billing.index')}
                                    className="flex items-center justify-between w-full p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary group hover:bg-primary transition-all hover:text-primary-foreground"
                                >
                                    <span className="font-bold text-sm">Refill Credits</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Tips Widget */}
                        <div className="rounded-3xl border bg-secondary/30 backdrop-blur-sm p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-secondary-foreground font-bold italic">
                                <Info className="w-4 h-4" />
                                <span>Pro Tips</span>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Be specific in your topic description for better results.',
                                    'Custom tones help the AI match your unique brand voice.',
                                    'Mentioning keywords helps SEO optimization.',
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-xs leading-relaxed text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recent Hint Card */}
                        <div className="p-1 rounded-3xl bg-gradient-to-r from-primary/20 to-purple-500/20">
                            <div className="bg-card rounded-[calc(1.5rem-2px)] p-6">
                                <p className="text-xs text-muted-foreground italic leading-relaxed text-center">
                                    "The best way to predict the future is to create it."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
