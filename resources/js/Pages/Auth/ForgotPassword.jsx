import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Forgot password?"
            description="No problem. Enter your email address and we'll send you a link to reset it."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-6 rounded-lg p-3 bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full bg-background/50 border-border focus:border-primary focus:ring-primary/20 transition-all rounded-xl shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <InputError message={errors.email} className="mt-2 text-xs font-medium" />
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full py-3 rounded-xl shadow-lg shadow-primary/20 text-sm font-bold tracking-tight" disabled={processing}>
                        Send Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
