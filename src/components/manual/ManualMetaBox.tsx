import React from 'react';
import { cn } from '@/lib/utils';
import { getGradeColor, DarknessManualItem } from '@/data/manualData';

interface ManualMetaBoxProps {
    manual: DarknessManualItem;
}

export const ManualMetaBox = ({ manual }: ManualMetaBoxProps) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 h-full shadow-sm relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none select-none opacity-[0.03]">
                <span className="text-6xl font-black uppercase text-slate-900 whitespace-nowrap">Confidential</span>
            </div>

            {/* Grade Bar */}
            <div className={cn("absolute top-0 left-0 w-full h-1", getGradeColor(manual.grade).replace('text-white', ''))} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm h-full items-center relative z-10">
                <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">식별 코드</span>
                    <span className="font-mono text-slate-700 font-bold tracking-tight">{manual.id}</span>
                </div>
                <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">관리 부서</span>
                    <span className="text-slate-700 font-medium">{manual.department}</span>
                </div>
                <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">최종 갱신일</span>
                    <span className="text-slate-700 font-mono">2024.12.23</span>
                </div>
            </div>
        </div>
    );
};
