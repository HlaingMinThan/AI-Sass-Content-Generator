import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Welcome back"
            description="Log in to your account to continue generating premium AI content."
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-lg p-3 bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email ADDRESS" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                    />

                    <InputError message={errors.email} className="mt-2 text-xs font-medium" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <InputLabel htmlFor="password" value="PASSWORD" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-primary hover:underline transition-colors"
                            >
                                Forgot?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 text-xs font-medium" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        className="rounded border-border text-primary focus:ring-primary/20"
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="ms-2 text-sm text-muted-foreground select-none">
                        Stay logged in
                    </span>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full py-3 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold tracking-tight" disabled={processing}>
                        Log in
                    </PrimaryButton>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-primary hover:underline transition-colors"
                        >
                            Create one for free
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
