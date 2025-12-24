import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SYSTEM_MESSAGES } from '@/constants/messages';

interface TextRendererProps {
    text: string;
    className?: string;
    allowLineBreaks?: boolean;
    inline?: boolean;
}

// Helper to determine token type
const parseContent = (text: string): React.ReactNode[] => {
    if (!text) return [];

    // 1. Images: ![alt](src) -> Polaroid Style
    const imageRegex = /(!\[.*?\]\(.*?\))/g; // Simple non-nested image
    if (text.match(imageRegex)) {
        const parts = text.split(imageRegex);
        return parts.map((part, idx) => {
            if (part.startsWith('![') && part.endsWith(')')) {
                const match = part.match(/!\[(.*?)\]\((.*?)\)/);
                if (match) {
                    return (
                        <div key={idx} className="my-6 inline-block transform rotate-1 hover:rotate-0 transition-transform duration-300">
                            <div className="bg-white p-3 pb-8 shadow-md border border-slate-200">
                                <img src={match[2]} alt={match[1]} className="max-w-full h-auto block" />
                                <div className="mt-3 text-center">
                                    <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">FIG 1. EVIDENCE_CAPTURE</span>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            return <React.Fragment key={idx}>{parseContent(part)}</React.Fragment>;
        });
    }

    // 2. Strikethrough: ~~text~~
    const strikeRegex = /(~~.*?~~)/g;
    if (text.match(strikeRegex)) {
        const parts = text.split(strikeRegex);
        return parts.map((part, idx) => {
            if (part.startsWith('~~') && part.endsWith('~~')) {
                const content = part.slice(2, -2);
                return <span key={idx} className="line-through text-slate-500">{parseContent(content)}</span>;
            }
            return <React.Fragment key={idx}>{parseContent(part)}</React.Fragment>;
        });
    }

    // 3. Bold: **text**
    const boldRegex = /(\*\*.*?\*\*)/g;
    if (text.match(boldRegex)) {
        const parts = text.split(boldRegex);
        return parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const content = part.slice(2, -2);
                return <strong key={idx} className="font-bold text-slate-900 bg-yellow-100/50 px-0.5">{parseContent(content)}</strong>;
            }
            return <React.Fragment key={idx}>{parseContent(part)}</React.Fragment>;
        });
    }



    // 4. Special Tags & Glitch
    const parts = text.split(/(\[검열 삭제\]|\[열람 제한\]|[■◾]+)/g);

    return parts.map((part, index) => {
        if (part === '[검열 삭제]') {
            return <CensorshipTag key={index} text={part} />;
        } else if (part === '[열람 제한]') {
            return <RestrictionTag key={index} text={part} />;
        } else if (part.match(/^[■◾]+$/)) {
            return (
                <span key={index} className="inline-block animate-glitch font-black text-slate-800 tracking-tighter shadow-red-500/20 drop-shadow-sm">
                    {part}
                </span>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

const CensorshipTag = ({ text }: { text: string }) => {
    const { toast } = useToast();
    const handleAction = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        toast({
            variant: "destructive",
            title: SYSTEM_MESSAGES.CENSORSHIP_WARNING.title,
            description: SYSTEM_MESSAGES.CENSORSHIP_WARNING.description,
            duration: 5000,
        });
    };
    return (
        <span
            className="text-red-500 font-bold mx-1 cursor-pointer hover:bg-red-100 px-1 rounded transition-colors"
            onMouseEnter={handleAction}
            onClick={handleAction}
        >
            {text}
        </span>
    );
};

const RestrictionTag = ({ text }: { text: string }) => {
    const { toast } = useToast();
    const handleAction = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        toast({
            variant: "destructive",
            title: SYSTEM_MESSAGES.SECURITY_VERIFICATION.title,
            description: SYSTEM_MESSAGES.SECURITY_VERIFICATION.description("B"),
            duration: 5000,
        });
    };
    return (
        <span
            className="text-red-600 font-black mx-1 cursor-pointer hover:bg-red-100 px-1 rounded transition-colors inline-flex items-center gap-1 align-bottom"
            onMouseEnter={handleAction}
            onClick={handleAction}
        >
            <Lock className="inline h-3 w-3" />
            {text}
        </span>
    );
};

export const TextRenderer = ({ text, className, allowLineBreaks = true, inline = false }: TextRendererProps) => {
    const content = parseContent(text);

    if (inline) {
        return (
            <span className={cn("inline leading-8 whitespace-pre-wrap", className)}>
                {content}
            </span>
        );
    }

    return (
        <div className={cn("relative leading-8 whitespace-pre-wrap", className)}>
            {content}
        </div>
    );
};
