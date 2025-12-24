import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { notices } from '@/data/notices';

const NoticeList = () => {
  const navigate = useNavigate();

  // Sort notices: Important/Emergency first, then by date descending
  const sortedNotices = [...notices].sort((a, b) => {
    // Check for pinning conditions
    const isAPinned = a.isImportant || a.title.includes('[긴급]') || a.title.includes('[필독]');
    const isBPinned = b.isImportant || b.title.includes('[긴급]') || b.title.includes('[필독]');

    if (isAPinned && !isBPinned) return -1;
    if (!isAPinned && isBPinned) return 1;

    // Secondary sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Limit to 8 items per page
  const ITEMS_PER_PAGE = 8;
  const displayedNotices = sortedNotices.slice(0, ITEMS_PER_PAGE);
  const emptyRows = Math.max(0, ITEMS_PER_PAGE - displayedNotices.length);

  const getBadgeStyle = (category: string, isPinned: boolean) => {
    // Red style for Security, Field, and Pinned items
    if (category === '보안' || category === '현장' || isPinned) {
      return 'bg-red-100 text-red-600 hover:bg-red-200 border-red-100';
    }
    // Blue/Slate style for others
    return 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-100';
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              공지사항
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">사내 주요 소식과 안내사항을 확인하세요.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="제목 또는 내용 검색" className="pl-9" />
            </div>
            <Button>검색</Button>
          </div>
        </div>

        {/* Notice Board Table */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-0">
            <div className="w-full text-sm text-left overflow-x-auto">
              <div className="w-full">
                {/* Table Header */}
                <div className="flex items-center bg-slate-50 border-b border-border py-3 px-3 md:px-6 font-medium text-slate-500">
                  <div className="w-10 md:w-16 text-center shrink-0">번호</div>
                  <div className="w-16 md:w-24 text-center shrink-0">구분</div>
                  <div className="flex-1 px-2 md:px-4">제목</div>
                  <div className="w-32 text-center shrink-0 hidden md:block">작성자</div>
                  <div className="w-24 text-center shrink-0">작성일</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                  {displayedNotices.map((notice, index) => {
                    const isPinned = notice.isImportant || notice.title.includes('[긴급]') || notice.title.includes('[필독]');
                    return (
                      <div
                        key={notice.id}
                        onClick={() => navigate(`/notices/${notice.id}`)}
                        className={`flex items-center py-3 px-3 md:px-6 cursor-pointer hover:bg-blue-50/50 transition-colors group ${notice.isHorror ? 'hover:bg-red-50/50' : ''
                          } ${isPinned ? 'bg-red-50/10' : ''}`}
                      >
                        <div className="w-10 md:w-16 text-center text-slate-400 shrink-0 font-mono text-xs">
                          {/* Show Pinned Icon or Number */}
                          {isPinned ? (
                            <span className="font-bold text-red-500">공지</span>
                          ) : (
                            notices.length - index
                          )}
                        </div>
                        <div className="w-16 md:w-24 text-center shrink-0">
                          <Badge
                            variant="secondary"
                            className={`font-normal ${getBadgeStyle(notice.category, isPinned)}`}
                          >
                            {notice.category}
                          </Badge>
                        </div>
                        <div className={`flex-1 min-w-0 px-2 md:px-4 font-medium transition-colors truncate ${isPinned ? 'text-slate-900 font-semibold' : 'text-slate-700'} group-hover:text-primary`}>
                          {notice.title}
                        </div>
                        <div className="w-32 text-center text-slate-500 shrink-0 hidden md:block text-xs">
                          {notice.author}
                        </div>
                        <div className="w-24 text-center text-slate-400 shrink-0 text-xs">
                          {notice.date}
                        </div>
                      </div>
                    )
                  })}

                  {/* Empty Rows Filler (Visual) */}
                  {Array.from({ length: emptyRows }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex items-center py-3 px-3 md:px-6 opacity-40">
                      <div className="w-10 md:w-16 text-center text-slate-300 shrink-0 font-mono text-xs">-</div>
                      <div className="w-16 md:w-24 text-center shrink-0"></div>
                      <div className="flex-1 min-w-0 px-2 md:px-4 text-slate-300"></div>
                      <div className="w-32 text-center shrink-0 hidden md:block"></div>
                      <div className="w-24 text-center shrink-0"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination (Mock) */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="w-8 h-8 p-0">1</Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">2</Button>
          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">3</Button>
          <span className="text-muted-foreground">...</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NoticeList;
