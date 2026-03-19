import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, History, CreditCard, Menu, X, Sparkles, Palette, Users, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Dropdown from '@/Components/Dropdown';

export default function AppLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Content History', href: route('content.history.index'), icon: History, current: route().current('content.history.*') },
        { name: 'Custom Tones', href: route('custom-tones.index'), icon: Palette, current: route().current('custom-tones.*') },
        { name: 'Billing', href: route('billing.index'), icon: CreditCard, current: route().current('billing.*') },
    ];

    const adminNavigation = user.is_admin ? [
        { name: 'Users', href: route('admin.users.index'), icon: Users, current: route().current('admin.users.*') },
        { name: 'Transactions', href: route('admin.transactions.index'), icon: CreditCard, current: route().current('admin.transactions.*') },
    ] : [];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile sidebar */}
            <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-lg transition-transform duration-300 ease-in-out transform flex flex-col">
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
                            <Sparkles className="h-6 w-6" />
                            AI SaaS
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                    item.current
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", item.current ? "text-primary" : "text-muted-foreground")} />
                                {item.name}
                            </Link>
                        ))}

                        {adminNavigation.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-border/40 space-y-1">
                                <div className="px-3 py-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                    Administration
                                </div>
                                {adminNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                            item.current
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5", item.current ? "text-primary" : "text-muted-foreground")} />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 border-r bg-card">
                <div className="flex items-center h-16 px-6 border-b">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Sparkles className="h-6 w-6" />
                        AI SaaS
                    </Link>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-4 py-6 space-y-1.5">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Menu
                        </div>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    item.current
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}

                        {adminNavigation.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-border/40 space-y-1.5">
                                <div className="px-3 py-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                                    Administration
                                </div>
                                {adminNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            item.current
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1 text-sm font-medium text-muted-foreground">
                        {header && <div>{header}</div>}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Credits Display */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">{user.available_credits} Credits</span>
                        </div>

                        {/* User Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block">{user.name}</span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right">
                                <div className="px-4 py-2 border-b sm:hidden">
                                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    <p className="text-xs font-semibold text-primary mt-1">{user.available_credits} Credits</p>
                                </div>
                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
