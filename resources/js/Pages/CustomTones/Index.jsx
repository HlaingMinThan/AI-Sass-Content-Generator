import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Save, X, MessageSquare, Info, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ customTones, preferredTone }) {
    const [editingTone, setEditingTone] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        sample_content: '',
    });

    const startEditing = (tone) => {
        setEditingTone(tone.id);
        setData({
            name: tone.name,
            description: tone.description || '',
            sample_content: tone.sample_content || '',
        });
        clearErrors();
    };

    const cancelEditing = () => {
        setEditingTone(null);
        reset();
        clearErrors();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(route('custom-tones.update', editingTone), {
            onSuccess: () => {
                setEditingTone(null);
                reset();
            },
        });
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('custom-tones.store'), {
            onSuccess: () => {
                setIsCreating(false);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this custom tone?')) {
            destroy(route('custom-tones.destroy', id));
        }
    };

    const handleSetDefault = (id) => {
        post(route('custom-tones.default', id));
    };

    return (
        <AppLayout header={<h2 className="text-xl font-semibold leading-tight text-foreground">Custom Writing Tones</h2>}>
            <Head title="Custom Tones" />

            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manage Your Tones</h1>
                        <p className="text-muted-foreground mt-1">Define your unique writing styles to personalize AI generations.</p>
                    </div>
                    {!isCreating && (
                        <button
                            onClick={() => { setIsCreating(true); reset(); clearErrors(); }}
                            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Tone
                        </button>
                    )}
                </div>

                {/* Create Form */}
                {isCreating && (
                    <div className="bg-card border rounded-2xl shadow-sm mb-8 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h2 className="font-semibold text-lg">Create New Custom Tone</h2>
                            </div>
                            <button onClick={() => setIsCreating(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="name" value="Tone Name" />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full"
                                        placeholder="e.g., Casual Hlaing, Professional SaaS"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel htmlFor="description" value="Short Description (Optional)" />
                                    <TextInput
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full"
                                        placeholder="Briefly describe when to use this tone"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <InputLabel htmlFor="sample_content" value="Sample Content" />
                                    <div className="group relative">
                                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-popover text-popover-foreground border rounded-lg shadow-xl text-xs z-20">
                                            Providing 100-200 words of your own writing helps the AI accurately mimic your style and vocabulary.
                                        </div>
                                    </div>
                                </div>
                                <textarea
                                    id="sample_content"
                                    value={data.sample_content}
                                    onChange={(e) => setData('sample_content', e.target.value)}
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Paste examples of your previous writing here..."
                                />
                                <InputError message={errors.sample_content} />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton disabled={processing}>
                                    Save Custom Tone
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                )}

                {/* List of Tones */}
                <div className="grid grid-cols-1 gap-4">
                    {customTones.length === 0 && !isCreating ? (
                        <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                            <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-primary/40" />
                            </div>
                            <h3 className="text-lg font-semibold">No custom tones yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-2">Create your first custom tone to make your generated content sound more like you.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="mt-6 text-primary font-semibold hover:underline"
                            >
                                Get started by creating a tone
                            </button>
                        </div>
                    ) : (
                        customTones.map((tone) => (
                            <div key={tone.id} className="bg-card border rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
                                {editingTone === tone.id ? (
                                    <form onSubmit={handleUpdate} className="p-6 space-y-4 animate-in fade-in duration-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <InputLabel value="Tone Name" />
                                                <TextInput
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <InputLabel value="Description" />
                                                <TextInput
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <InputLabel value="Sample Content" />
                                            <textarea
                                                value={data.sample_content}
                                                onChange={(e) => setData('sample_content', e.target.value)}
                                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="p-2 text-muted-foreground hover:text-foreground"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold truncate">{tone.name}</h3>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">Custom</span>
                                                {preferredTone === `custom-${tone.id}` && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 animate-in zoom-in duration-300">
                                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            {tone.description && (
                                                <p className="text-sm text-muted-foreground mt-1 truncate">{tone.description}</p>
                                            )}
                                            {tone.sample_content && (
                                                <p className="text-xs text-muted-foreground/60 mt-2 line-clamp-1 italic">
                                                    "{tone.sample_content.substring(0, 100)}..."
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 self-end md:self-center">
                                            {preferredTone !== `custom-${tone.id}` && (
                                                <button
                                                    onClick={() => handleSetDefault(tone.id)}
                                                    className="p-2.5 rounded-xl border border-border hover:bg-amber-500/10 hover:text-amber-500 transition-all text-muted-foreground group"
                                                    title="Set as Default"
                                                >
                                                    <Bookmark className="w-4 h-4 group-hover:fill-amber-500/20" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => startEditing(tone)}
                                                className="p-2.5 rounded-xl border border-border hover:bg-muted hover:text-primary transition-all text-muted-foreground"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tone.id)}
                                                className="p-2.5 rounded-xl border border-border hover:bg-destructive/10 hover:text-destructive transition-all text-muted-foreground"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
