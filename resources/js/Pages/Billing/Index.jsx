import { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CreditCard, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function BillingIndex({ auth, transactions }) {
    const { post, processing } = useForm();
    const user = auth.user;
    const { flash, errors } = usePage().props;

    const [displayCredits, setDisplayCredits] = useState(user.available_credits);

    useEffect(() => {
        // If there's a success message, animate the credit accumulation
        if (flash?.success && transactions && transactions.length > 0) {
            const justPurchased = transactions[0].credits_purchased;
            const previousBalance = Math.max(0, user.available_credits - justPurchased);

            let start = previousBalance;
            const end = user.available_credits;

            if (start >= end) {
                setDisplayCredits(end);
                return;
            }

            const duration = 1500; // 1.5 seconds
            const startTime = performance.now();

            const animateCredits = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                // Ease out quartic function for smooth deceleration
                const easeOut = 1 - Math.pow(1 - progress, 4);

                setDisplayCredits(Math.floor(start + (end - start) * easeOut));

                if (progress < 1) {
                    requestAnimationFrame(animateCredits);
                } else {
                    setDisplayCredits(end);
                }
            };

            requestAnimationFrame(animateCredits);
        } else {
            setDisplayCredits(user.available_credits);
        }
    }, [user.available_credits, flash]);

    const handleCheckout = (planId) => {
        post(route('billing.checkout', { plan: planId }));
    };

    const plans = [
        {
            id: "starter",
            name: "Starter Pack",
            credits: 10,
            price: "$5",
            description: "Perfect for testing the waters and light usage.",
        },
        {
            id: "pro",
            name: "Pro Pack",
            credits: 50,
            price: "$20",
            description: "Ideal for power users and small teams.",
            popular: true,
        },
        {
            id: "agency",
            name: "Agency Pack",
            credits: 200,
            price: "$75",
            description: "For heavy usage and maximum savings.",
        }
    ];

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Billing & Credits</h2>}>
            <Head title="Billing & Credits" />

            <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-12">

                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium rounded-lg border border-green-500/20 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {flash.success}
                    </div>
                )}

                {errors?.message && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                    </div>
                )}

                {/* Balance Card */}
                <div className="bg-card text-card-foreground border rounded-xl shadow-sm p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-muted-foreground mb-1">Available Credits</h3>
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-bold tracking-tight text-foreground">{displayCredits}</span>
                                <span className="text-muted-foreground pb-1 font-medium">Credits</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-primary" />
                                1 Credit = 1 AI Content Generation
                            </p>
                        </div>
                        <div className="bg-muted/30 border border-border/50 rounded-lg p-4 max-w-sm">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div className="text-sm text-muted-foreground leading-relaxed">
                                    Your credits never expire. Use them at your own pace to generate high-quality SaaS content.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-foreground tracking-tight">Purchase Credits</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Top up your balance manually depending on your needs.</p>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative bg-card text-card-foreground border rounded-xl shadow-sm flex flex-col transition-all hover:shadow-md ${plan.popular ? 'border-primary shadow-primary/10' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <h4 className="text-lg font-medium mb-2">{plan.name}</h4>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-medium mb-6 pb-6 border-b border-border/50 text-sm">
                                    <Sparkles className="w-4 h-4" />
                                    {plan.credits} Credits included
                                </div>

                                <p className="text-sm text-muted-foreground mb-8 flex-1">
                                    {plan.description}
                                </p>

                                <button
                                    onClick={() => handleCheckout(plan.id)}
                                    disabled={processing}
                                    className={`w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-10 px-4 disabled:pointer-events-none disabled:opacity-50 ${plan.popular ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90' : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'}`}
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Buy {plan.credits} Credits
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transaction History */}
                <div className="bg-card text-card-foreground border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="font-semibold text-lg text-foreground">Transaction History</h3>
                    </div>
                    {transactions && transactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-muted-foreground whitespace-nowrap">Date</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground text-center">Amount</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground text-center">Credits Given</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground text-right w-[150px]">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {new Date(transaction.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-center">
                                                ${parseFloat(transaction.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-primary font-semibold text-center flex items-center justify-center gap-1">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                +{transaction.credits_purchased}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize text-green-600 border-green-600/20 bg-green-600/10">
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No purchases yet</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                Your payment history and invoices will appear here once you make a purchase.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
