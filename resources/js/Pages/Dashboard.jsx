import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Sparkles, History, CreditCard, Palette, ArrowRight, Zap, Clock, MousePointer2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard({ stats, recentHistory }) {
    const user = usePage().props.auth.user;
    
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    const actionCards = [
        {
            name: 'New content',
            description: 'AI-powered writing.',
            href: route('content.create'),
            icon: Sparkles,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            name: 'Custom Tones',
            description: 'Define your voice.',
            href: route('custom-tones.index'),
            icon: Palette,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            name: 'Get Credits',
            description: 'Refill your balance.',
            href: route('billing.index'),
            icon: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="space-y-10 py-6">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Good {getTimeOfDay()}, {user.name.split(' ')[0]}!</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Here's what's happening with your AI writing portal today.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative group overflow-hidden rounded-2xl border bg-card p-1 shadow-sm transition-all hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Output</span>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{stats.total_generations}</div>
                                <p className="text-xs text-muted-foreground mt-1">Generations completed</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group overflow-hidden rounded-2xl border bg-card p-1 shadow-sm transition-all hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Palette className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Personalized Voice</span>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{stats.total_tones}</div>
                                <p className="text-xs text-muted-foreground mt-1">Custom tones saved</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative group overflow-hidden rounded-2xl border bg-card p-1 shadow-sm transition-all hover:shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ready to go</span>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">{stats.available_credits}</div>
                                <p className="text-xs text-muted-foreground mt-1">Available credits</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground px-1">Quick Actions</h3>
                        <div className="space-y-3">
                            {actionCards.map((action) => (
                                <Link
                                    key={action.name}
                                    href={action.href}
                                    className={cn(
                                        "group flex items-center justify-between p-4 rounded-xl border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300",
                                        action.border,
                                        "hover:-translate-y-1"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("p-2.5 rounded-lg", action.bg)}>
                                            <action.icon className={cn("w-5 h-5", action.color)} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{action.name}</h4>
                                            <p className="text-xs text-muted-foreground">{action.description}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
                            <Link href={route('content.history.index')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                View All <History className="w-3 h-3" />
                            </Link>
                        </div>
                        
                        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                            {recentHistory.length > 0 ? (
                                <div className="divide-y">
                                    {recentHistory.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route('content.history.show', item.id)}
                                            className="block p-4 hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-muted rounded-lg shrink-0">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                            {item.topic || 'Untitled Document'}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                                                            {item.tone_name ? `Tone: ${item.tone_name}` : 'Standard Generation'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/5 mb-4">
                                        <Sparkles className="w-8 h-8 text-primary/20" />
                                    </div>
                                    <h4 className="text-lg font-bold">No activity yet</h4>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
                                        Ready to create something amazing? Start with your first AI generation.
                                    </p>
                                    <Link
                                        href={route('content.create')}
                                        className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                    >
                                        <Plus className="w-4 h-4" /> Create First Draft
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
