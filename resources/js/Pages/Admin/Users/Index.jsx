import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Trash2, 
    Coins, 
    Plus, 
    Minus,
    UserCircle,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ShieldCheck,
    X,
    Edit2,
    Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function UsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Simple manual debounce for search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(route('admin.users.index'), { search }, {
                    preserveState: true,
                    replace: true
                });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const creditForm = useForm({
        amount: 50,
        type: 'add',
    });

    const editForm = useForm({
        name: '',
        email: '',
        is_admin: false,
    });

    const handleOpenCreditModal = (user) => {
        setSelectedUser(user);
        setIsCreditModalOpen(true);
    };

    const handleUpdateCredits = (e) => {
        e.preventDefault();
        creditForm.post(route('admin.users.credits.update', selectedUser.id), {
            onSuccess: () => {
                setIsCreditModalOpen(false);
                creditForm.reset();
            }
        });
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        editForm.patch(route('admin.users.update', selectedUser.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                editForm.reset();
            }
        });
    };

    const handleDeleteUser = (user) => {
        if (confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">User Management</h2>}>
            <Head title="Admin: Users" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Stats & Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Global User Base</h1>
                        <p className="text-muted-foreground mt-1">Manage users, adjust balances, and oversee growth.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-card border-white/5 rounded-2xl shadow-xl focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/40">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">User</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Balance</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Created</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                                <Users className="w-12 h-12 opacity-20" />
                                                <p className="font-bold text-sm uppercase tracking-widest">No users found for "{search}"</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-foreground">{user.name}</span>
                                                            {user.is_admin && (
                                                                <div className="bg-primary/20 text-primary p-1 rounded-md" title="Admin">
                                                                    <ShieldCheck className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 font-black text-xs">
                                                    <Coins className="w-3.5 h-3.5" />
                                                    {user.available_credits} CREDITS
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Active
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-tighter">Registered</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleOpenEditModal(user)}
                                                        className="p-2.5 rounded-xl border border-white/5 bg-background text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOpenCreditModal(user)}
                                                        className="p-2.5 rounded-xl border border-white/5 bg-background text-muted-foreground hover:text-orange-500 hover:bg-orange-500/5 transition-all"
                                                        title="Manage Credits"
                                                    >
                                                        <Coins className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="p-2.5 rounded-xl border border-white/5 bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Pagination */}
                    <div className="px-8 py-6 border-t border-border/40 flex items-center justify-between">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Showing {users.from || 0}-{users.to || 0} of {users.total} users
                        </div>
                        <div className="flex items-center gap-2">
                            {users.prev_page_url && (
                                <Link href={users.prev_page_url} className="p-2 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </Link>
                            )}
                            {users.next_page_url && (
                                <Link href={users.next_page_url} className="p-2 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-card border-white/10 rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted"><X className="w-4 h-4" /></button>
                        <h2 className="text-2xl font-black tracking-tight">Edit Profile</h2>
                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4">Full Name</label>
                                <input 
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full bg-muted/50 border-white/5 rounded-2xl px-6 py-4 font-bold outline-none"
                                />
                                {editForm.errors.name && <p className="text-xs text-destructive px-4">{editForm.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4">Email Address</label>
                                <input 
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full bg-muted/50 border-white/5 rounded-2xl px-6 py-4 font-bold outline-none"
                                />
                                {editForm.errors.email && <p className="text-xs text-destructive px-4">{editForm.errors.email}</p>}
                            </div>
                            <div className="flex items-center justify-between px-4 py-4 bg-muted/30 rounded-2xl border border-white/5">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Status</span>
                                <button 
                                    type="button"
                                    onClick={() => editForm.setData('is_admin', !editForm.data.is_admin)}
                                    className={cn(
                                        "w-12 h-6 rounded-full transition-all relative",
                                        editForm.data.is_admin ? "bg-primary" : "bg-muted"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                        editForm.data.is_admin ? "right-1" : "left-1"
                                    )} />
                                </button>
                            </div>
                            <button type="submit" disabled={editForm.processing} className="w-full py-5 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest disabled:opacity-50">
                                {editForm.processing ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Credits Management Modal */}
            {isCreditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setIsCreditModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-card border-white/10 rounded-[2.5rem] shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsCreditModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-muted"><X className="w-4 h-4" /></button>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Manage Credits</h2>
                            <p className="text-sm text-muted-foreground italic">Adjusting balance for <span className="text-primary font-bold">{selectedUser.name}</span></p>
                        </div>
                        <form onSubmit={handleUpdateCredits} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => creditForm.setData('type', 'add')} className={cn("flex flex-col items-center justify-center py-6 rounded-3xl border-2 transition-all gap-2", creditForm.data.type === 'add' ? "bg-primary/10 border-primary text-primary" : "bg-muted/50 border-transparent text-muted-foreground")}><Plus className="w-6 h-6" /><span className="font-black text-[10px] uppercase tracking-widest">Add</span></button>
                                <button type="button" onClick={() => creditForm.setData('type', 'subtract')} className={cn("flex flex-col items-center justify-center py-6 rounded-3xl border-2 transition-all gap-2", creditForm.data.type === 'subtract' ? "bg-destructive/10 border-destructive text-destructive" : "bg-muted/50 border-transparent text-muted-foreground")}><Minus className="w-6 h-6" /><span className="font-black text-[10px] uppercase tracking-widest">Subtract</span></button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4">Credit Amount</label>
                                <input type="number" value={creditForm.data.amount} onChange={(e) => creditForm.setData('amount', e.target.value)} className="w-full bg-muted/50 border-white/5 rounded-2xl px-6 py-4 text-2xl font-black outline-none" />
                            </div>
                            <button type="submit" disabled={creditForm.processing} className="w-full py-5 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest disabled:opacity-50">
                                {creditForm.processing ? 'Updating...' : 'Confirm'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

