import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DarknessManualItem, getGradeColor, ManualSection } from '@/data/manualData';
import { TextRenderer } from '@/components/common/TextRenderer';
import { NotionToggle } from '@/components/common/NotionToggle';

interface StandardManualContentProps {
    manual: DarknessManualItem;
    sectionTitles: {
        entry: string;
        guide: string;
        toggleEntry: string;
    };
    isAccessAllowed: (level?: string) => boolean;
    handleLockedClick: (e: React.MouseEvent, level: string) => void;
}

// Recursive render helper inside the component file but outside the component
const renderSection = (
    section: ManualSection,
    idx: number,
    isAccessAllowed: (level?: string) => boolean,
    handleLockedClick: (e: React.MouseEvent, level: string) => void
) => {
    const isLocked = !isAccessAllowed(section.securityLevel);

    if (section.isCallout) {
        return (
            <div key={idx} className="bg-amber-50/50 border-l-4 border-amber-200 p-4 my-4 rounded-r-sm text-sm">
                <div className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <span className="text-amber-500">💡</span>
                    <TextRenderer text={section.title} inline />
                </div>
                <div className="space-y-2 text-slate-700">
                    {section.content && <TextRenderer text={section.content} />}
                    {section.children && (
                        <div className="ml-4 border-l border-amber-200/50 pl-4 mt-2 space-y-2">
                            {section.children.map((child, cIdx) =>
                                renderSection(child, cIdx, isAccessAllowed, handleLockedClick)
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <NotionToggle
            key={idx}
            title={<TextRenderer text={section.title} inline className="font-bold tracking-tight" />}
            className="mb-2"
            isLocked={isLocked}
            onLockedClick={(e) => handleLockedClick(e, section.securityLevel || 'C')}
        >
            <div className="space-y-4">
                {section.content && <TextRenderer text={section.content} className="text-slate-700" />}
                {section.children && (
                    <div className="pl-0 mt-2 space-y-2 border-l border-slate-200 ml-1">
                        {section.children.map((child, cIdx) =>
                            renderSection(child, cIdx, isAccessAllowed, handleLockedClick)
                        )}
                    </div>
                )}
            </div>
        </NotionToggle>
    );
};

export const StandardManualContent = ({
    manual,
    sectionTitles,
    isAccessAllowed,
    handleLockedClick
}: StandardManualContentProps) => {
    return (
        <>
            {/* 1. Overview */}
            <section id="section-overview" className="space-y-4 scroll-mt-36">
                <h2 className={cn("text-lg font-bold text-slate-900 flex items-center gap-3 border-l-4 pl-3 py-1", getGradeColor(manual.grade).replace('text-white', 'border-current text-slate-900 bg-transparent'))}>
                    개요
                </h2>
                <div className="pl-4">
                    <TextRenderer text={manual.overview} className="text-slate-700 leading-relaxed" />
                </div>
            </section>

            {/* 2. Entry Protocol */}
            <section id="section-entry" className="space-y-4 scroll-mt-36">
                <h2 className={cn("text-lg font-bold text-slate-900 flex items-center gap-3 border-l-4 pl-3 py-1", getGradeColor(manual.grade).replace('text-white', 'border-current text-slate-900 bg-transparent'))}>
                    {sectionTitles.entry}
                </h2>
                <div className="pl-4">
                    {manual.entryNodes && manual.entryNodes.length > 0 ? (
                        <div className="space-y-1">
                            {manual.entryNodes.map((section, idx) =>
                                renderSection(section, idx, isAccessAllowed, handleLockedClick)
                            )}
                        </div>
                    ) : (
                        <NotionToggle
                            title={<span className="font-mono font-bold tracking-tight">{sectionTitles.toggleEntry}</span>}
                            defaultOpen={isAccessAllowed(manual.entryMethodSecurityLevel)}
                            isLocked={!isAccessAllowed(manual.entryMethodSecurityLevel)}
                            onLockedClick={(e) => handleLockedClick(e, manual.entryMethodSecurityLevel || 'D')}
                        >
                            <div className="mt-4 border-l-2 border-slate-200 pl-4 py-2 bg-slate-100/50 rounded-r-md">
                                <TextRenderer text={manual.entryMethod} className="text-slate-700 font-medium" />
                            </div>
                        </NotionToggle>
                    )}
                </div>
            </section>

            {/* 3. Exploration Guide */}
            <section id="section-guide" className="space-y-6 scroll-mt-36">
                <h2 className={cn("text-lg font-bold text-slate-900 flex items-center gap-3 border-l-4 pl-3 py-1", getGradeColor(manual.grade).replace('text-white', 'border-current text-slate-900 bg-transparent'))}>
                    {sectionTitles.guide}
                </h2>

                <div className="pl-4 flex flex-col gap-6">
                    <div className="space-y-1">
                        {Array.isArray(manual.explorationGuide) ? (
                            manual.explorationGuide.map((section, idx) =>
                                renderSection(section, idx, isAccessAllowed, handleLockedClick)
                            )
                        ) : (
                            <p className="text-red-500">데이터 형식이 올바르지 않습니다. (Array Required)</p>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. Special Notes */}
            {manual.specialNotes && (
                <section id="section-notes" className="space-y-4 scroll-mt-36">
                    <h2 className="text-lg font-bold text-red-600 flex items-center gap-3 border-l-4 border-red-500 pl-3 py-1">
                        <FileText className="h-5 w-5" />
                        특이사항
                    </h2>
                    <div className="pl-4">
                        <NotionToggle
                            title={<span className="text-red-600 font-bold">SPECIAL NOTES</span>}
                            defaultOpen={isAccessAllowed(manual.specialNotesSecurityLevel)}
                            isLocked={!isAccessAllowed(manual.specialNotesSecurityLevel)}
                            onLockedClick={(e) => handleLockedClick(e, manual.specialNotesSecurityLevel || 'D')}
                        >
                            <div className="bg-red-50 border border-red-100 rounded-md p-4 mt-2">
                                {manual.specialNoteNodes && manual.specialNoteNodes.length > 0 ? (
                                    <div className="space-y-1">
                                        {manual.specialNoteNodes.map((section, idx) =>
                                            renderSection(section, idx, isAccessAllowed, handleLockedClick)
                                        )}
                                    </div>
                                ) : (
                                    <TextRenderer text={manual.specialNotes} className="text-slate-800" />
                                )}
                            </div>
                        </NotionToggle>
                    </div>
                </section>
            )}
        </>
    );
};
