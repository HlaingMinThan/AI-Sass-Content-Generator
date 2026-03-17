import { Sparkles } from 'lucide-react';

export default function ApplicationLogo(props) {
    return (
        <div className={`flex items-center gap-2 ${props.className}`}>
            <div className="bg-primary rounded-lg p-1.5">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">AI SaaS</span>
        </div>
    );
}
