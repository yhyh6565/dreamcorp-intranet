import React from 'react';
import { TextRenderer } from '@/components/common/TextRenderer';

interface NoticeCardProps {
    content: string;
    index: number;
}

export const NoticeCard = ({ content, index }: NoticeCardProps) => {
    return (
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-300 shadow-2xl rounded-sm overflow-hidden">
            {/* Ornate border decoration */}
            <div className="absolute inset-0 border-4 border-double border-slate-400/20 pointer-events-none" />

            {/* Top decorative bar */}
            <div className="h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

            {/* Notice header */}
            <div className="text-center py-6 border-b border-slate-300/50 bg-gradient-to-b from-slate-100/50 to-transparent">
                <div className="inline-flex items-center gap-3">
                    <div className="w-12 h-px bg-slate-400" />
                    <span className="font-serif text-lg text-slate-700 tracking-widest uppercase">Notice #{index + 1}</span>
                    <div className="w-12 h-px bg-slate-400" />
                </div>
            </div>

            {/* Notice content */}
            <div className="px-12 py-10">
                <TextRenderer text={content} className="text-slate-800 leading-loose font-serif" />
            </div>

            {/* Bottom decorative bar */}
            <div className="h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

            {/* Corner ornaments */}
            <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-slate-400/40" />
            <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-slate-400/40" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-slate-400/40" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-slate-400/40" />
        </div>
    );
};
