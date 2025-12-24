import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getGradeColor, DarknessManualItem } from '@/data/manualData';

interface ManualHeaderProps {
    manual: DarknessManualItem;
    statusInfo: { label: string; className: string };
}

export const ManualHeader = ({ manual, statusInfo }: ManualHeaderProps) => {
    return (
        <div className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{manual.title}</h1>
                    <p className="font-mono text-xs md:text-sm text-slate-500">Doc No. {manual.id}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className={cn("font-bold px-3 py-1", getGradeColor(manual.grade))}>
                        {manual.grade}등급
                    </Badge>
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-normal", statusInfo.className)}>
                        {statusInfo.label}
                    </Badge>
                </div>
            </div>
        </div>
    );
};
