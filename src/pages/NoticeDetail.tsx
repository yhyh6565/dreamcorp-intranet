import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Printer, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JumpscareOverlay from '@/components/JumpscareOverlay';
import { useUserStore } from '@/store/userStore';
import Layout from '@/components/Layout';
import { notices } from '@/data/notices';
import { Separator } from '@/components/ui/separator';

const NoticeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { jumpscareViewed, setJumpscareViewed, startSecurityTimer, userName } = useUserStore();
  const [showJumpscare, setShowJumpscare] = useState(false);

  useEffect(() => {
    if (id === '3' && !jumpscareViewed) {
      const timer = setTimeout(() => {
        setShowJumpscare(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Jumpscare skipped
    }
  }, [id, jumpscareViewed]);



  const handleJumpscareComplete = () => {
    setShowJumpscare(false);
    setJumpscareViewed();
    startSecurityTimer();
    navigate('/notices');
  };

  const currentIndex = notices.findIndex(n => n.id === id);
  const notice = notices[currentIndex];
  const prevNotice = currentIndex !== -1 && currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null;
  const nextNotice = currentIndex > 0 ? notices[currentIndex - 1] : null;

  if (!notice) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">존재하지 않는 공지사항입니다.</p>
          <Button onClick={() => navigate('/notices')}>목록으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/notices')}
          className="mb-4 text-muted-foreground hover:text-primary pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          공지사항 목록
        </Button>

        <Card className="border-none shadow-lg bg-white overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 border-b border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge
                variant="outline"
                className={`bg-white ${notice.category === '중요' || notice.category === '보안' || notice.isImportant ? 'text-red-500 border-red-200' : 'text-slate-600 border-slate-200'}`}
              >
                {notice.category}
              </Badge>
              <span className="text-sm text-muted-foreground">No. {notice.id}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-6 break-keep">
              {notice.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{notice.author}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{notice.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground">
                  <Printer className="h-4 w-4" />
                  인쇄
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground">
                  <Share2 className="h-4 w-4" />
                  공유
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-8 md:p-12 min-h-[400px]">
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-slate-800 break-keep">
                {notice.content}
              </pre>
            </div>

            {/* Attachment Mockup */}
            <div className="mt-12 p-4 bg-slate-50 rounded-lg border border-border">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> 첨부파일
              </h4>
              <div className="space-y-2">
                <div className="text-sm text-slate-500 hover:underline cursor-pointer flex items-center gap-2">
                  <span>📄</span> 관련_규정_가이드.pdf (2.4MB)
                </div>
              </div>
            </div>
          </CardContent>

          <Separator />

          {/* Footer Navigation */}
          <div className="p-6 bg-slate-50 flex justify-between">
            <Button
              variant="ghost"
              disabled={!prevNotice}
              onClick={() => prevNotice && navigate(`/notices/${prevNotice.id}`)}
              className={!prevNotice ? 'invisible' : ''}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              이전 글
            </Button>

            <Button variant="ghost" onClick={() => navigate('/notices')}>목록</Button>

            <Button
              variant="ghost"
              disabled={!nextNotice}
              onClick={() => nextNotice && navigate(`/notices/${nextNotice.id}`)}
              className={!nextNotice ? 'invisible' : ''}
            >
              다음 글
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        </Card>
      </div>

      {showJumpscare && (
        <JumpscareOverlay onComplete={handleJumpscareComplete} />
      )}
    </Layout>
  );
};

export default NoticeDetail;
