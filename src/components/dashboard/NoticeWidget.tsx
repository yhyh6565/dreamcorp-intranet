import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, ChevronRight } from 'lucide-react';

const NoticeWidget = () => {
    const navigate = useNavigate();

    const notices = [
        { tag: '경영', title: '사내 보안 시스템 점검 안내', date: '2025.12.17', isHorror: false },
        { tag: '안내', title: '하반기 독감 예방접종 지원', date: '2025.12.16', isHorror: false },
        { tag: '필독', title: '3층 휴게실 분실물 습득 안내', date: '2025.12.15', isHorror: true },
    ];

    const handleNoticeClick = (index: number) => {
        navigate(`/notices/${index + 1}`);
    };

    return (
        <Card className="md:col-span-3 border-none shadow-md bg-white">
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
            <CardContent className="p-0">
                <ul className="divide-y divide-slate-50">
                    {notices.map((notice, index) => (
                        <li
                            key={index}
                            onClick={() => handleNoticeClick(index)}
                            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors group ${notice.isHorror ? 'hover:bg-red-50/50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className={`text-xs font-normal ${notice.tag === '필독' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {notice.tag}
                                </Badge>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{notice.title}</span>
                            </div>
                            <span className="text-xs text-slate-400">{notice.date}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default NoticeWidget;
