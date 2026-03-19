import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { 
    CreditCard, 
    Search, 
    Filter, 
    ArrowUpRight, 
    ArrowDownLeft, 
    Coins, 
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    Receipt,
    Plus
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function TransactionsIndex({ transactions }) {
    const [search, setSearch] = useState('');

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'succeeded':
                return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case 'pending':
                return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            default:
                return "bg-destructive/10 text-destructive border-destructive/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'succeeded':
                return <CheckCircle2 className="w-3.5 h-3.5" />;
            case 'pending':
                return <Clock className="w-3.5 h-3.5" />;
            default:
                return <XCircle className="w-3.5 h-3.5" />;
        }
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Financial Ledger</h2>}>
            <Head title="Admin: Transactions" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">+12% vs last month</span>
                        </div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Revenue</h3>
                        <div className="text-3xl font-black tracking-tight text-foreground">$12,450.00</div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500">
                                <Coins className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Credits Distributed</h3>
                        <div className="text-3xl font-black tracking-tight text-foreground">850,000</div>
                    </div>

                    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                                <Receipt className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Subscriptions</h3>
                        <div className="text-3xl font-black tracking-tight text-foreground">142</div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-2xl font-black tracking-tight">Recent Activity</h2>
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Filter records..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-background border-white/5 rounded-2xl shadow-inner focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Reference</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Customer</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Credits</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                                <Receipt className="w-12 h-12 opacity-20" />
                                                <p className="font-bold text-sm uppercase tracking-widest">No transactions found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <tr key={tx.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-mono text-xs font-bold text-foreground truncate max-w-[120px]" title={tx.stripe_id}>
                                                        {tx.stripe_id.substring(0, 12)}...
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                                        {tx.user?.name.charAt(0) || '?'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">{tx.user?.name || 'Unknown User'}</span>
                                                        <span className="text-[10px] text-muted-foreground">{tx.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-1.5 font-black text-xs text-orange-500">
                                                    <Plus className="w-3 h-3" />
                                                    {tx.credits_purchased}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-foreground">${parseFloat(tx.amount).toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                                    getStatusStyle(tx.status)
                                                )}>
                                                    {getStatusIcon(tx.status)}
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-bold text-foreground">{new Date(tx.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 border-t border-border/40 flex items-center justify-between bg-muted/10">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            End of Ledger • {transactions.total} Total Records
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/40 text-xs font-bold hover:bg-muted transition-all disabled:opacity-30" disabled={!transactions.prev_page_url}>
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border/40 text-xs font-bold hover:bg-muted transition-all disabled:opacity-30" disabled={!transactions.next_page_url}>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
