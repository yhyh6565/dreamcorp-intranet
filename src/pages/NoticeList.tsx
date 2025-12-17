import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';

const NoticeList = () => {
  const navigate = useNavigate();

  const notices = [
    { 
      id: '1', 
      tag: '경영', 
      title: '[경영] 사내 보안 시스템 점검 안내',
      date: formatDate(getRelativeDate(-7)),
      isHorror: false 
    },
    { 
      id: '2', 
      tag: '안내', 
      title: '[안내] 하반기 독감 예방접종 지원 안내',
      date: formatDate(getRelativeDate(-14)),
      isHorror: false 
    },
    { 
      id: '3', 
      tag: '필독', 
      title: '[필독] 3층 휴게실 분실물 습득 안내',
      date: formatDate(getRelativeDate(-3)),
      isHorror: true 
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드
          </Button>
          <h1 className="text-2xl font-bold text-foreground">공지사항</h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => navigate(`/notices/${notice.id}`)}
                  className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                    notice.isHorror ? 'hover:bg-destructive/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={notice.isHorror ? 'destructive' : 'secondary'}>
                      {notice.tag}
                    </Badge>
                    <span className="text-foreground flex-1">{notice.title}</span>
                    <span className="text-sm text-muted-foreground">{notice.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NoticeList;
