import React from 'react';
import { DarknessManualItem } from '@/data/manualData';
import { NoticeCard } from './NoticeCard';

interface CalloutManualContentProps {
    manual: DarknessManualItem;
}

export const CalloutManualContent = ({ manual }: CalloutManualContentProps) => {
    return (
        <div className="space-y-12">
            {manual.callouts?.map((callout, idx) => (
                <NoticeCard key={idx} content={callout} index={idx} />
            ))}
        </div>
    );
};
