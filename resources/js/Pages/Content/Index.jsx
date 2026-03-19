import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Eye, Clock, CalendarDays, ArrowRight, Search, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HistoryIndex({ histories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('content.history.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Content History</h2>}>
            <Head title="Generated Content History" />

            <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                            <Clock className="w-8 h-8 text-primary" />
                            Your Library
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">Manage and revisit your AI-powered creations.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group w-full sm:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search library..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-card border-white/5 rounded-2xl shadow-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                            />
                            {search && (
                                <button 
                                    onClick={() => setSearch('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        <Link
                            href={route('content.create')}
                            className="inline-flex items-center justify-center rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-xl hover:scale-[1.02] active:scale-95 transition-all h-11 px-6 w-full sm:w-auto gap-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            New Art
                        </Link>
                    </div>
                </div>

                <div className="bg-card text-card-foreground border rounded-[2rem] shadow-xl overflow-hidden border-white/5">
                    {histories.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted/30 border-b border-border/40">
                                    <tr>
                                        <th className="px-8 py-5">Content & Context</th>
                                        <th className="px-8 py-5 whitespace-nowrap text-center">Engine</th>
                                        <th className="px-8 py-5 whitespace-nowrap text-center">Date</th>
                                        <th className="px-8 py-5 text-right w-[120px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {histories.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-foreground line-clamp-1 mb-1 max-w-[450px]">
                                                    {item.generated_content?.replace(/#+\s*/g, '').replace(/\*+|_|`|\[|\]/g, '').trim() || "Generating..."}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2 group-hover:text-primary transition-colors">
                                                    <FileText className="h-3 w-3 shrink-0" />
                                                    <span className="line-clamp-1 italic max-w-[350px]">"{item.topic}"</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter text-muted-foreground bg-muted/50 border-white/5">
                                                    {item.model_used || 'Gemini'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-bold text-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">Saved</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Link
                                                    href={route('content.history.show', item.id)}
                                                    className="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all hover:bg-primary hover:text-primary-foreground bg-muted/50 h-10 px-4 border border-white/5"
                                                >
                                                    Open
                                                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            {search ? (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                                        <Search className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground mb-2">No matches found</h3>
                                    <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
                                        We couldn't find any documents matching "<span className="text-primary font-bold">{search}</span>".
                                    </p>
                                    <button
                                        onClick={() => setSearch('')}
                                        className="text-sm font-bold text-primary hover:underline"
                                    >
                                        Clear search filter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                        <Sparkles className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black text-foreground mb-2">Your library is empty</h3>
                                    <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                                        Start generating world-class AI content to build your personal library of history.
                                    </p>
                                    <Link
                                        href={route('content.create')}
                                        className="inline-flex items-center justify-center rounded-2xl text-sm font-bold bg-foreground text-background shadow-xl hover:scale-[1.02] active:scale-95 transition-all h-12 px-8"
                                    >
                                        Create New Content
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Simple Pagination */}
                    {histories.links.length > 3 && (
                        <div className="px-8 py-6 border-t border-border/40 bg-muted/10 flex items-center justify-between">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                Page {histories.current_page} of {histories.last_page} • {histories.total} Items
                            </div>
                            <div className="flex items-center gap-2">
                                {histories.prev_page_url && (
                                    <Link
                                        href={histories.prev_page_url}
                                        className="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all bg-background border border-white/5 h-10 px-4 hover:bg-muted"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {histories.next_page_url && (
                                    <Link
                                        href={histories.next_page_url}
                                        className="inline-flex items-center justify-center rounded-xl text-xs font-bold transition-all bg-background border border-white/5 h-10 px-4 hover:bg-muted"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
