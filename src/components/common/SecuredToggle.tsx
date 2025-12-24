import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Lock, ChevronDown, ChevronRight, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SecuredToggleProps {
    title: string;
    requiredLevel: string; // 'S', 'A', 'B', 'C'
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const SecuredToggle = ({
    title,
    requiredLevel,
    children,
    defaultOpen = false
}: SecuredToggleProps) => {
    const { checkSecurityClearance } = useUserStore();
    const { toast } = useToast();
    const hasAccess = checkSecurityClearance(requiredLevel);
    const [isOpen, setIsOpen] = useState(defaultOpen && hasAccess);

    const handleToggle = () => {
        if (!hasAccess) {
            toast({
                variant: "destructive",
                title: "보안 경고 (Security Warning)",
                description: `※ 해당 기록의 전문을 열람하기 위해선 ${requiredLevel}레벨 보안인증이 필요합니다.`,
                duration: 3000,
            });
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div
                onClick={handleToggle}
                className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors select-none",
                    hasAccess ? "hover:bg-slate-50" : "bg-slate-50 opacity-80"
                )}
            >
                <div className="flex items-center gap-3">
                    {hasAccess ? (
                        isOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />
                    ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                    )}

                    <span className={cn("font-bold text-sm", !hasAccess && "text-slate-500")}>
                        {title}
                    </span>

                    {!hasAccess && (
                        <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" />
                            열람 제한
                        </span>
                    )}
                </div>

                {hasAccess && (
                    <div className="text-xs text-slate-400 font-mono">
                        SEC_LEV_{requiredLevel}
                    </div>
                )}
            </div>

            {isOpen && hasAccess && (
                <div className="p-4 border-t border-slate-100 bg-white animate-accordion-down">
                    {children}
                </div>
            )}
        </div>
    );
};
