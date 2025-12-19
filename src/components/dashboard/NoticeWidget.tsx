import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, ChevronRight } from 'lucide-react';

import { notices as allNotices } from '@/data/notices';

const NoticeWidget = () => {
    const navigate = useNavigate();

    // Sort: Important/Emergency first, then Date descending
    const displayNotices = [...allNotices].sort((a, b) => {
        const isAPinned = a.isImportant || a.title.includes('[긴급]') || a.title.includes('[필독]');
        const isBPinned = b.isImportant || b.title.includes('[긴급]') || b.title.includes('[필독]');

        if (isAPinned !== isBPinned) return isAPinned ? -1 : 1;
        return a.date < b.date ? 1 : -1; // String comparison works for YYYY.MM.DD
    }).slice(0, 4);

    const handleNoticeClick = (index: number) => {
        // Find original index or just navigate to list. detailed navigation requires ID.
        // Dashboard usually links to detail by ID?
        // The original code used `navigate('/notices/${index + 1}')`. The IDs in data are '1', '2', '3', '100'.
        // So I should use `notice.id`.
        navigate(`/notices/${displayNotices[index].id}`);
    };

    return (
        <Card className="md:col-span-3 border-none shadow-md bg-white h-full flex flex-col">
            <CardHeader className="border-b border-slate-50 pb-4">
                <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => navigate('/notices')}
                >
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-800 group-hover:text-primary transition-colors">
                        <Bell className="h-5 w-5 text-primary" />
                        공지사항
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        전체보기 <ChevronRight className="h-3 w-3" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <ul className="divide-y divide-slate-50">
                    {displayNotices.map((notice, index) => {
                        const isPinned = notice.isImportant || notice.title.includes('[긴급]') || notice.title.includes('[필독]');
                        const isRedBadge = notice.category === '보안' || notice.category === '현장' || isPinned;

                        return (
                            <li
                                key={notice.id}
                                onClick={() => handleNoticeClick(index)}
                                className={`flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-slate-50 transition-colors group ${notice.isHorror ? 'hover:bg-red-50/50' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Badge variant="secondary" className={`text-xs font-normal shrink-0 ${isRedBadge ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {notice.category}
                                    </Badge>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors truncate">{notice.title}</span>
                                </div>
                                <span className="text-xs text-slate-400 shrink-0 ml-2">{notice.date}</span>
                            </li>
                        )
                    })}
                </ul>
            </CardContent>
        </Card>
    );
};

export default NoticeWidget;
