import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUserStore } from '@/store/userStore';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import SpamMessageModal from '@/components/SpamMessageModal';
import { useState } from 'react';

const MessageDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userName, team, rank } = useUserStore();
  const [showSpamModal, setShowSpamModal] = useState(id === '2');

  const messages = {
    '1': {
      sender: '김■■ 대리',
      senderDept: '경영지원',
      receiver: `${userName} (${team}/${rank})`,
      title: '법인카드 사용 내역 확인 요청 (소명 필요)',
      date: `${formatDate(getRelativeDate(-1))} 09:15`,
      content: `안녕하세요, ${userName}님.
경영지원팀 김■■ 대리입니다.

법인카드 사용 내역 마감 중, 증빙 서류가 누락되거나 사용 목적 소명이 필요한 건이 있어 연락드립니다.

아래 내역 확인하시고, 금일 오후 4시까지 [전자결재 > 지출결의서] 상신 부탁드립니다.
기한 내 미처리 시 해당 금액은 급여에서 차감될 수 있으니 유의 바랍니다.

┌─────────────────────────────────────┐
│ 확인 필요 내역                          │
├─────────────────────────────────────┤
│ 사용일시 │ ${formatDate(getRelativeDate(-3))} 23:45        │
│ 사용처   │ (주)편안한장례서비스                │
│ 금액     │ 350,000원                         │
│ 비고     │ 심야 시간대 사용 / 접대비 한도 초과  │
└─────────────────────────────────────┘

해당 건이 팀 회식인지, 외부 미팅인지 구체적인 참석자 명단과 사유를 기재해주셔야 처리가 가능합니다.
(혹시 현장 탐사 중 발생한 특수 비용이라면 '비밀 유지 항목'으로 체크해서 올려주세요.)

확인 부탁드립니다.
감사합니다.

김■■ 대리 드림
경영지원팀 | 02-XXX-4567`
    },
  };

  // 스팸 메시지는 모달로 처리
  if (id === '2') {
    return (
      <div className="min-h-screen bg-background">
        {showSpamModal && (
          <SpamMessageModal onClose={() => navigate('/messages')} />
        )}
      </div>
    );
  }

  const message = messages[id as keyof typeof messages];

  if (!message) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">존재하지 않는 쪽지입니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/messages')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          쪽지함
        </Button>

        <Card>
          <CardHeader className="border-b border-border space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">{message.title}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">보낸사람: </span>
                <span className="text-foreground">[{message.senderDept}] {message.sender}</span>
              </div>
              <div>
                <span className="text-muted-foreground">받는사람: </span>
                <span className="text-foreground">{message.receiver}</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">날짜: </span>
                <span className="text-foreground">{message.date}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
              {message.content}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageDetail;
