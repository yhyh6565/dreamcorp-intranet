import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import { useUserStore } from '@/store/userStore';

const MessageList = () => {
  const navigate = useNavigate();
  const { spamMessageDeleted } = useUserStore();

  const allMessages = [
    { 
      id: '1', 
      sender: '경영지원',
      title: '법인카드 사용 내역 확인 요청...',
      date: formatDate(getRelativeDate(-1)),
      isSpam: false 
    },
    { 
      id: '2', 
      sender: '광고',
      title: '✨진.정.한 빛.을 찾으십.니까?✨',
      date: formatDate(getRelativeDate(-5)),
      isSpam: true 
    },
  ];

  // Filter out spam message if it's been deleted
  const messages = spamMessageDeleted 
    ? allMessages.filter(m => m.id !== '2')
    : allMessages;

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
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Mail className="h-6 w-6" />
            쪽지함
          </h1>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => navigate(`/messages/${message.id}`)}
                  className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                    message.isSpam ? 'hover:border-destructive/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">[{message.sender}]</p>
                      <p className="text-foreground">{message.title}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{message.date}</span>
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

export default MessageList;
