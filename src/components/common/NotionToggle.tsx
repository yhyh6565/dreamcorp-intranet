import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotionToggleProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    isLocked?: boolean;
    onLockedClick?: (e: React.MouseEvent) => void;
}

export const NotionToggle = ({
    title,
    children,
    defaultOpen = true,
    className,
    isLocked = false,
    onLockedClick
}: NotionToggleProps) => {
    // If locked, force closed (unless we want to show it? usually locked means hidden content).
    // User logic implies locked sections are collapsed.
    const [isOpen, setIsOpen] = useState(defaultOpen && !isLocked);

    // Effect to close if becomes locked dynamically
    useEffect(() => {
        if (isLocked) setIsOpen(false);
    }, [isLocked]);

    const handleClick = (e: React.MouseEvent) => {
        if (isLocked) {
            onLockedClick?.(e);
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={cn("group", className)}>
            <button
                onClick={handleClick}
                className={cn(
                    "flex items-start gap-1 w-full text-left p-1 -ml-1 rounded select-none transition-colors",
                    isLocked ? "cursor-not-allowed opacity-70" : "hover:bg-slate-50 cursor-pointer"
                )}
            >
                <div className={cn(
                    "mt-0.5 transition-colors",
                    isLocked ? "text-red-400" : "text-slate-400 group-hover:text-slate-600"
                )}>
                    {isLocked ? (
                        <Lock className="h-4 w-4" />
                    ) : (
                        isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
                    )}
                </div>
                <div className={cn(
                    "font-medium leading-relaxed py-0.5",
                    isLocked ? "text-slate-500" : "text-slate-900"
                )}>
                    {title}
                    {isLocked && <span className="ml-2 text-xs text-red-500 font-normal">[열람 제한]</span>}
                </div>
            </button>
            {isOpen && !isLocked && (
                <div className="pl-6 mt-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};
