import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Reset your password"
            description="Enter your new password below to regain access to your account."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email ADDRESS" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-xs font-medium" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="NEW PASSWORD" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <InputError message={errors.password} className="mt-2 text-xs font-medium" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="CONFIRM"
                            className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1.5"
                        />

                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            placeholder="••••••••"
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2 text-xs font-medium"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <PrimaryButton className="w-full py-3 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold tracking-tight" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
