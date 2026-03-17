import { Head, Link } from '@inertiajs/react';
import { Sparkles, Zap, History, ShieldCheck, ArrowRight, Menu, X, LayoutDashboard, Database, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Welcome({ auth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const dashboardImages = [
        '/images/dashboard-1.png',
        '/images/dashboard-2.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % dashboardImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [dashboardImages.length]);

    const features = [
        {
            title: "AI Powerhouse",
            description: "Leverage Google's Gemini 1.5 Flash to generate high-converting SaaS content in seconds.",
            icon: <Zap className="w-6 h-6 text-primary" />,
        },
        {
            title: "Multilingual Support",
            description: "Generate content in English and Burmese natively with context-aware AI agents.",
            icon: <Languages className="w-6 h-6 text-primary" />,
        },
        {
            title: "Full History",
            description: "Every piece of content you generate is saved forever. Search, view, and reuse at any time.",
            icon: <History className="w-6 h-6 text-primary" />,
        },
        {
            title: "Credit System",
            description: "Fair and transparent pricing. Only pay for what you use with our secure credit system.",
            icon: <Database className="w-6 h-6 text-primary" />,
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary scroll-smooth">
            <Head title="AI SaaS Content Generator" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary rounded-lg p-1.5">
                                <Sparkles className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">AI SaaS</span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')} className="text-sm font-medium hover:text-primary transition-colors">Log in</Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-muted-foreground">
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-border bg-background p-4 space-y-4">
                        <a href="#features" className="block text-sm font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>Features</a>
                        <a href="#pricing" className="block text-sm font-medium px-2 py-1" onClick={() => setIsMenuOpen(false)}>Pricing</a>
                        {auth.user ? (
                            <Link href={route('dashboard')} className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md font-medium">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="block text-sm font-medium px-2 py-1">Log in</Link>
                                <Link href={route('register')} className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md font-medium">Get Started</Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-8 text-sm font-medium text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by Gemini 1.5 Flash</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Generate Premium AI <br /> Content in Seconds
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ultimate AI writing assistant for SaaS teams. Create high-quality, SEO-optimized content in English and Burmese effortlessly.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90"
                        >
                            Start Generating for Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <a
                            href="#features"
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border bg-background px-8 py-4 text-lg font-semibold transition-all hover:bg-accent"
                        >
                            View Features
                        </a>
                    </div>

                    {/* Dashboard Preview Carousel */}
                    <div className="mt-20 relative max-w-6xl mx-auto">
                        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-8 shadow-2xl overflow-hidden">
                            <div className="rounded-xl bg-muted/30 overflow-hidden relative aspect-[16/10] sm:aspect-[16/9]">
                                {dashboardImages.map((src, index) => (
                                    <img
                                        key={src}
                                        src={src}
                                        alt={`Dashboard Preview ${index + 1}`}
                                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    />
                                ))}
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none"></div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur border border-border rounded-lg p-4 shadow-xl hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <Zap className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold">Real-time Generation</p>
                                            <p className="text-xs text-muted-foreground underline decoration-primary/30 underline-offset-4 font-medium">Powered by Gemini 1.5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel Indicators */}
                            <div className="flex justify-center gap-2 mt-4 pb-2">
                                {dashboardImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything you need to ship content</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Built with precision for modern creators who value speed, quality, and simplicity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-card border border-border p-8 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold mb-4">Simple, transparent pricing</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            No monthly subscriptions. Just buy credits when you need them. Your credits never expire.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-card border border-border p-8 rounded-2xl flex flex-col">
                            <h4 className="text-lg font-medium mb-2">Starter Pack</h4>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">$5</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    10 AI Content Credits
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    Standard Support
                                </li>
                            </ul>
                            <Link href={route('register')} className="text-center py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">Get Started</Link>
                        </div>

                        <div className="bg-card border-2 border-primary p-8 rounded-2xl flex flex-col relative shadow-xl shadow-primary/10 scale-105 z-10">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                            <h4 className="text-lg font-medium mb-2">Pro Pack</h4>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">$20</span>
                                <span className="text-muted-foreground line-through text-sm ml-2">$25</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    50 AI Content Credits
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    Priority Support
                                </li>
                                <li className="flex items-center gap-2 text-sm font-semibold text-primary">
                                    <Sparkles className="w-4 h-4" />
                                    Best Value
                                </li>
                            </ul>
                            <Link href={route('register')} className="text-center py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold shadow shadow-primary/20">Buy Pro</Link>
                        </div>

                        <div className="bg-card border border-border p-8 rounded-2xl flex flex-col">
                            <h4 className="text-lg font-medium mb-2">Agency Pack</h4>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold">$75</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    200 AI Content Credits
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    24/7 Dedicated Support
                                </li>
                            </ul>
                            <Link href={route('register')} className="text-center py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">Contact Sales</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary rounded-lg p-1.5">
                                <Sparkles className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">AI SaaS</span>
                        </div>
                        <div className="flex gap-8 text-sm text-muted-foreground font-medium">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-muted-foreground">© 2026 AI SaaS Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CheckCircle2(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
