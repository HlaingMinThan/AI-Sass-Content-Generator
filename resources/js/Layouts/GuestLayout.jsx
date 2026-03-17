import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function GuestLayout({ children, title, description }) {
    return (
        <div className="min-h-screen bg-background flex flex-col sm:justify-center items-center pt-6 sm:pt-0 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]"></div>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-card text-card-foreground border border-border shadow-xl rounded-2xl relative z-10 transition-all">
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="mb-6 hover:scale-105 transition-transform duration-300">
                        <div className="bg-primary rounded-xl p-2.5 shadow-lg shadow-primary/20">
                            <Sparkles className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </Link>

                    {title && (
                        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2 text-center">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p className="text-sm text-muted-foreground text-center px-2">
                            {description}
                        </p>
                    )}
                </div>

                {children}

                <div className="mt-8 pt-6 border-t border-border flex justify-center">
                    <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            <footer className="mt-8 text-sm text-muted-foreground relative z-10">
                © 2026 AI SaaS Inc.
            </footer>
        </div>
    );
}
