import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Eye, Clock, CalendarDays, ArrowRight } from 'lucide-react';

export default function HistoryIndex({ histories }) {
    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Content History</h2>}>
            <Head title="Generated Content History" />

            <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-foreground">Your Generations</h3>
                        <p className="text-sm text-muted-foreground">View and manage the content you've generated with our AI.</p>
                    </div>
                    <Link
                        href={route('content.create')}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 w-full sm:w-auto"
                    >
                        New Generation
                    </Link>
                </div>

                <div className="bg-card text-card-foreground border rounded-xl shadow-sm overflow-hidden">
                    {histories.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Content & Prompt</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground whitespace-nowrap">Model</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground text-right w-[100px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {histories.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground line-clamp-1 mb-1 max-w-[400px]">
                                                    {item.generated_content.replace(/<[^>]+>/g, '')}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                                                    <FileText className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="line-clamp-1 italic max-w-[300px]">"{item.prompt}"</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase text-muted-foreground bg-muted/50 border-border/50">
                                                    {item.model_used}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route('content.history.show', item.id)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-muted h-8 px-3"
                                                >
                                                    View
                                                    <Eye className="ml-2 h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center border-t border-border">
                            <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No history yet</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                                You haven't generated any AI content yet. Start your first generation to see it here.
                            </p>
                            <Link
                                href={route('content.create')}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6"
                            >
                                Generate something now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    )}

                    {/* Simple Pagination */}
                    {histories.links.length > 3 && (
                        <div className="p-4 border-t bg-muted/20 flex flex-wrap items-center justify-center gap-1">
                            {histories.links.map((link, index) => {
                                const isCurrent = link.active;
                                const isPreviousOrNext = link.label.includes('Previous') || link.label.includes('Next');
                                let label = link.label;
                                if (label.includes('&laquo;')) label = '«';
                                if (label.includes('&raquo;')) label = '»';

                                return link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4
                                            ${isCurrent ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}
                                        `}
                                    >
                                        {label}
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 text-muted-foreground/50 border border-transparent"
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
