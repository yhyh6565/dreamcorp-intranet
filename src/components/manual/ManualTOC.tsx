import React from 'react';
import { List } from 'lucide-react';
import { DarknessManualItem } from '@/data/manualData';

interface ManualTOCProps {
    manual: DarknessManualItem;
    scrollToSection: (sectionId: string) => void;
    tocEntryTitle: string;
    tocGuideTitle: string;
}

export const ManualTOC = ({ manual, scrollToSection, tocEntryTitle, tocGuideTitle }: ManualTOCProps) => {
    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm h-full md:h-fit md:sticky md:top-24">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                <List className="h-3 w-3" />
                목차 (Table of Contents)
            </h3>
            {manual.calloutOnlyMode ? (
                <div className="text-center py-4 font-mono text-slate-400 tracking-wider">
                    ■■■ ■■■ ■ ■■■ ■■
                </div>
            ) : (
                <nav className="flex flex-col space-y-1 text-sm">
                    <button
                        onClick={() => scrollToSection('section-overview')}
                        className="text-left px-2 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-50 rounded transition-colors truncate"
                    >
                        1. 개요
                    </button>
                    <button
                        onClick={() => scrollToSection('section-entry')}
                        className="text-left px-2 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-50 rounded transition-colors truncate"
                    >
                        {tocEntryTitle}
                    </button>
                    <button
                        onClick={() => scrollToSection('section-guide')}
                        className="text-left px-2 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-50 rounded transition-colors truncate"
                    >
                        {tocGuideTitle}
                    </button>
                    {manual.specialNotes && (
                        <button
                            onClick={() => scrollToSection('section-notes')}
                            className="text-left px-2 py-1.5 text-slate-600 hover:text-primary hover:bg-slate-50 rounded transition-colors truncate"
                        >
                            4. 특이사항
                        </button>
                    )}
                </nav>
            )}
        </div>
    );
};
