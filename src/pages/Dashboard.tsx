import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Building2, Heart, LogOut, Bell, Mail, Calendar, MapPin, AlertTriangle, Cat, Archive } from 'lucide-react';
import JumpscareOverlay from '@/components/JumpscareOverlay';
import AnnexVisitModal from '@/components/modals/AnnexVisitModal';
import FoxCounselingModal from '@/components/modals/FoxCounselingModal';
import StorageRentalModal from '@/components/modals/StorageRentalModal';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, team, rank, points, isLoggedIn, logout, spamMessageDeleted } = useUserStore();
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [pointsFlicker, setPointsFlicker] = useState(false);
  const [showAnnexVisit, setShowAnnexVisit] = useState(false);
  const [showFoxCounseling, setShowFoxCounseling] = useState(false);
  const [showStorageRental, setShowStorageRental] = useState(false);
  const today = new Date();
  const isSoleum = userName === '김솔음';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setPointsFlicker(true);
        setTimeout(() => setPointsFlicker(false), 200);
      }
    }, 3000);

    return () => clearInterval(flickerInterval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNoticeClick = (index: number) => {
    if (index === 2) {
      setShowJumpscare(true);
    } else {
      navigate(`/notices/${index + 1}`);
    }
  };

  const handleMessageClick = (messageId: number) => {
    navigate(`/messages/${messageId}`);
  };

  const notices = [
    { tag: '경영', title: '사내 보안 시스템 점검', isHorror: false },
    { tag: '안내', title: '하반기 독감 예방접종 지원', isHorror: false },
    { tag: '필독', title: '3층 휴게실 분실물 습득 안내', isHorror: true },
  ];

  const allMessages = [
    { id: 1, sender: '경영지원', title: '법인카드 사용 내역...', isSpam: false },
    { id: 2, sender: '광고', title: '✨진.정.한 빛.을 찾으십.니까?✨', isSpam: true },
  ];

  const messages = spamMessageDeleted 
    ? allMessages.filter(m => m.id !== 2)
    : allMessages;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">백</span>
            </div>
            <span className="text-xl font-bold text-foreground">(주)백일몽</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {userName} 님 ({team} / {rank})
              </p>
              <p className={`text-sm ${pointsFlicker ? 'text-destructive animate-flicker' : 'text-muted-foreground'}`}>
                보유 포인트: {points.toLocaleString()} CP
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 담당 관리 구역 */}
          <Card className="lg:col-span-1 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => navigate('/floor-map')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                담당 관리 구역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-muted text-muted-foreground">F급</Badge>
                  <span className="text-xs text-muted-foreground">상태: 안정</span>
                </div>
                <h3 className="font-semibold text-foreground">웅얼거리는 맨홀</h3>
                <p className="text-sm text-muted-foreground">위치: 지하 2층</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  <span>마지막 점검: {formatDate(getRelativeDate(-5))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Center Column - 일정 및 공지사항 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/notices')}>
                <Bell className="h-5 w-5 text-primary" />
                일정 및 공지사항
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Schedule */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2 cursor-pointer hover:text-primary" onClick={() => navigate('/calendar')}>
                  <Calendar className="h-4 w-4" />
                  금주 근무 일정
                </h4>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground">{formatDate(getRelativeDate(3), 'short')} 14:00</p>
                  <p className="text-sm text-muted-foreground">[현장] 4구역 정기 순찰</p>
                </div>
              </div>

              {/* Notices */}
              <div>
                <h4 
                  className="text-sm font-medium text-muted-foreground mb-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate('/notices')}
                >
                  공지사항
                </h4>
                <ul className="space-y-2">
                  {notices.map((notice, index) => (
                    <li 
                      key={index}
                      onClick={() => handleNoticeClick(index)}
                      className={`flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors ${
                        notice.isHorror ? 'hover:bg-destructive/10' : ''
                      }`}
                    >
                      <Badge variant="secondary" className="text-xs">
                        {notice.tag}
                      </Badge>
                      <span className="text-sm text-foreground truncate">{notice.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - 퀵 메뉴 & 쪽지함 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" />
                퀵 메뉴 & 쪽지함
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Menu */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">바로가기</h4>
                <div className={`grid gap-2 ${isSoleum ? 'grid-cols-2' : 'grid-cols-2'}`}>
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-4 gap-2"
                    onClick={() => navigate('/welfare-mall')}
                  >
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="text-xs">복지몰</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex flex-col h-auto py-4 gap-2"
                    onClick={() => setShowAnnexVisit(true)}
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="text-xs">별관 방문</span>
                  </Button>
                  {isSoleum && (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-auto py-4 gap-2"
                        onClick={() => setShowFoxCounseling(true)}
                      >
                        <Cat className="h-5 w-5 text-primary" />
                        <span className="text-xs">여우상담실</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-auto py-4 gap-2"
                        onClick={() => setShowStorageRental(true)}
                      >
                        <Archive className="h-5 w-5 text-primary" />
                        <span className="text-xs">대여창고 신청</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div>
                <h4 
                  className="text-sm font-medium text-muted-foreground mb-3 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate('/messages')}
                >
                  쪽지함
                </h4>
                <ul className="space-y-2">
                  {messages.map((message) => (
                    <li 
                      key={message.id}
                      onClick={() => handleMessageClick(message.id)}
                      className={`p-3 rounded-md border border-border hover:bg-secondary/50 cursor-pointer transition-colors ${
                        message.isSpam ? 'hover:border-destructive/30' : ''
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">[{message.sender}]</p>
                      <p className={`text-sm truncate ${message.isSpam ? 'text-foreground' : 'text-foreground'}`}>
                        {message.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Horror Overlays */}
      {showJumpscare && (
        <JumpscareOverlay onComplete={() => setShowJumpscare(false)} />
      )}

      {/* Modals */}
      <AnnexVisitModal open={showAnnexVisit} onClose={() => setShowAnnexVisit(false)} />
      <FoxCounselingModal open={showFoxCounseling} onClose={() => setShowFoxCounseling(false)} />
      <StorageRentalModal open={showStorageRental} onClose={() => setShowStorageRental(false)} />
    </div>
  );
};

export default Dashboard;
