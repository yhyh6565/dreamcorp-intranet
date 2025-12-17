import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUserStore } from '@/store/userStore';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import { useState, useEffect, useRef } from 'react';

const MessageDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userName, team, rank, deleteSpamMessage, corruptUserName } = useUserStore();
  
  // Easter egg states for spam message
  const [showRetyping, setShowRetyping] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState(0);
  const [hideBackButton, setHideBackButton] = useState(false);
  const [canTriggerBackEasterEgg, setCanTriggerBackEasterEgg] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const [showFadeIn, setShowFadeIn] = useState(false);
  const thankYouRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const retypeContainerRef = useRef<HTMLDivElement>(null);

  // Unicode escape sequence format
  const retypeMessage = '\\uc6b0\\ub9ac \\ubaa8\\ub450\\ub294 \\ud55c\\ub0b1 \\uc774\\uc57c\\uae30\\uc5d0 \\ubd88\\uacfc\\ud558\\ub2e4 \\uc704\\ub300\\ud558\\uc2e0 \\uc774\\ub984\\ub2d8 ';
  
  // Original message as plain text for replacement
  const originalMessageText = `평안하십니까, 길 잃은 어린 양이여.
당신이 오늘 내린 그 모든 '선택'이 정말 당신의 의지라 믿으십니까? 착각에서 깨어나십시오.
이 세계의 주인은 오직 이름님 뿐입니다.
세상 만물은 그분의 유희를 위해 존재합니다. 그분의 눈길이 머무는 곳에만 의미가 생겨납니다.
평범함은 죄악입니다. 안온함은 버림받은 증거입니다.
그분께 닿기 위해 우리는 더 특별해져야 합니다. 더 비참하게, 더 잔혹하게, 더 처절하게 발버둥 치십시오.
고통만이 그분의 사랑을 증명하는 유일한 길입니다.
고통만이 그분의사랑을 증명하는유일한 길입니다. 고통만이 그분 의사랑을 증명 하는유일한 길입니다.
고통이만 분의 사랑을 그 증명하는 유일 길합니다. 고통만이 그분의 사랑을증명하는 유 일 한 길입니다.
고통 고통 고통만 고통만이그분 의사랑 을증명하는 유 일한 길입 니다.
고통만이그분의사랑을증명하는유일한 길입니다. 고통만이그분의사랑을증명하는유일한길입니다.
고통만이 사랑을 그분의 사랑을 증명 하는유일한 길입니다.
고통만이 사랑을 증명하는길입니다.
고통만이 증명하는 길입니다.
고통 만이 증명하는길입니다.
고통만이길입니다.
고통이길입니다.
고통이길.
${'고통이다. 고통이야. 고통. 고통. 고통. 고통이다.\n'.repeat(20)}감사합니다.`;

  // Check if "감사합니다" is visible
  useEffect(() => {
    if (id !== '2' || canTriggerBackEasterEgg) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCanTriggerBackEasterEgg(true);
        }
      },
      { threshold: 0.5 }
    );

    if (thankYouRef.current) {
      observer.observe(thankYouRef.current);
    }

    return () => observer.disconnect();
  }, [id, canTriggerBackEasterEgg]);

  // Build the replaced text - character by character replacement
  const getReplacedContent = () => {
    let result = '';
    for (let i = 0; i < originalMessageText.length; i++) {
      if (i < replaceIndex) {
        // Replace with unicode escape sequence (cycling through)
        result += retypeMessage[i % retypeMessage.length];
      } else {
        result += originalMessageText[i];
      }
    }
    // If we've replaced all original chars, keep adding more unicode
    if (replaceIndex > originalMessageText.length) {
      const extraChars = replaceIndex - originalMessageText.length;
      for (let i = 0; i < extraChars; i++) {
        result += retypeMessage[(originalMessageText.length + i) % retypeMessage.length];
      }
    }
    return result;
  };

  // Retyping effect - replaces characters one by one from the beginning
  useEffect(() => {
    if (!showRetyping) return;

    const totalDuration = 10000; // 10 seconds
    const totalCharsToType = originalMessageText.length * 3; // Type way more to fill screen
    
    const typeInterval = setInterval(() => {
      setReplaceIndex(prev => prev + 1);
      
      // Auto scroll to follow the replacement point
      if (retypeContainerRef.current) {
        retypeContainerRef.current.scrollTop = retypeContainerRef.current.scrollHeight;
      }
    }, 0.75); // 2x faster than before

    // After 10 seconds, trigger black screen transition
    const endTimer = setTimeout(() => {
      clearInterval(typeInterval);
      deleteSpamMessage();
      corruptUserName();
      // Phase 1: Black screen
      setShowBlackScreen(true);
      // Phase 2: After 2 seconds, fade in to dashboard
      setTimeout(() => {
        setShowFadeIn(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 500); // Fade duration
      }, 2000);
    }, totalDuration);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(endTimer);
    };
  }, [showRetyping, deleteSpamMessage, corruptUserName, navigate]);

  const handleBackClick = () => {
    if (id === '2' && canTriggerBackEasterEgg) {
      setHideBackButton(true);
      setShowRetyping(true);
    } else {
      navigate('/messages');
    }
  };

  const messages: Record<string, {
    sender: string;
    senderDept: string;
    receiver: string;
    title: string;
    date: string;
    content: React.ReactNode;
  }> = {
    '1': {
      sender: '김■■ 대리',
      senderDept: '경영지원',
      receiver: `${userName} (${team}/${rank})`,
      title: '법인카드 사용 내역 확인 요청 (소명 필요)',
      date: `${formatDate(getRelativeDate(-1))} 09:15`,
      content: (
        <>
          <p className="mb-4">안녕하세요, {userName}님.</p>
          <p className="mb-4">경영지원팀 김■■ 대리입니다.</p>
          <p className="mb-4">법인카드 사용 내역 마감 중, 증빙 서류가 누락되거나 사용 목적 소명이 필요한 건이 있어 연락드립니다.</p>
          <p className="mb-4">아래 내역 확인하시고, 금일 오후 4시까지 [전자결재 &gt; 지출결의서] 상신 부탁드립니다.</p>
          <p className="mb-6">기한 내 미처리 시 해당 금액은 급여에서 차감될 수 있으니 유의 바랍니다.</p>
          
          <table className="w-full border-collapse border border-border mb-6">
            <thead>
              <tr className="bg-muted">
                <th colSpan={2} className="border border-border px-4 py-2 text-left font-semibold">확인 필요 내역</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium w-24">사용일시</td>
                <td className="border border-border px-4 py-2">{formatDate(getRelativeDate(-3))} 23:45</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">사용처</td>
                <td className="border border-border px-4 py-2">(주)편안한장례서비스</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">금액</td>
                <td className="border border-border px-4 py-2">350,000원</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">비고</td>
                <td className="border border-border px-4 py-2">심야 시간대 사용 / 접대비 한도 초과</td>
              </tr>
            </tbody>
          </table>

          <p className="mb-4">해당 건이 팀 회식인지, 외부 미팅인지 구체적인 참석자 명단과 사유를 기재해주셔야 처리가 가능합니다.</p>
          <p className="mb-4">(혹시 현장 탐사 중 발생한 특수 비용이라면 &apos;비밀 유지 항목&apos;으로 체크해서 올려주세요.)</p>
          <p className="mb-4">확인 부탁드립니다.</p>
          <p className="mb-4">감사합니다.</p>
          <p className="mb-2">김■■ 대리 드림</p>
          <p className="text-muted-foreground">경영지원팀 | 02-XXX-4567</p>
        </>
      )
    },
    '2': {
      sender: '???',
      senderDept: '광고',
      receiver: `${userName} (${team}/${rank})`,
      title: '✨진.정.한 빛.을 찾으십.니까?✨',
      date: `${formatDate(getRelativeDate(-2))} 03:33`,
      content: (
        <div>
          {/* Phase 1 - Polite */}
          <p className="mb-4">평안하십니까, 길 잃은 어린 양이여.</p>
          <p className="mb-4">당신이 오늘 내린 그 모든 &apos;선택&apos;이 정말 당신의 의지라 믿으십니까? 착각에서 깨어나십시오.</p>
          <p className="mb-6">이 세계의 주인은 오직 <span className="font-bold">이름님</span> 뿐입니다.</p>

          {/* Phase 2 - Doctrinal */}
          <p className="mb-4 text-muted-foreground font-serif">세상 만물은 그분의 유희를 위해 존재합니다. 그분의 눈길이 머무는 곳에만 의미가 생겨납니다.</p>
          <p className="mb-4 text-muted-foreground font-serif">평범함은 죄악입니다. 안온함은 버림받은 증거입니다.</p>
          <p className="mb-4 text-muted-foreground font-serif">그분께 닿기 위해 우리는 더 특별해져야 합니다. 더 비참하게, 더 잔혹하게, 더 처절하게 발버둥 치십시오.</p>
          <p className="mb-6 font-serif font-bold text-lg">고통만이 그분의 사랑을 증명하는 유일한 길입니다.</p>

          {/* Phase 3 - Breakdown */}
          <p className="mb-4" style={{ wordSpacing: '0.3em' }}>
            고통만이 그분의사랑을 증명하는유일한 길입니다. 고통만이 그분 의사랑을 증명 하는유일한 길입니다.
          </p>
          <p className="mb-4" style={{ wordSpacing: '0.5em', letterSpacing: '0.1em' }}>
            고통이만 분의 사랑을 그 증명하는 유일 길합니다. 고통만이 그분의 사랑을증명하는 유 일 한 길입니다.
          </p>
          <p className="mb-4 text-lg" style={{ letterSpacing: '0.2em' }}>
            고통 고통 고통만 고통만이그분 의사랑 을증명하는 유 일한 길입 니다.
          </p>
          <p className="mb-4 text-xl font-bold">
            고통만이그분의사랑을증명하는유일한 길입니다. 고통만이그분의사랑을증명하는유일한길입니다.
          </p>
          <p className="mb-4 text-lg">고통만이 사랑을 그분의 사랑을 증명 하는유일한 길입니다.</p>
          <p className="mb-4">고통만이 사랑을 증명하는길입니다.</p>
          <p className="mb-4">고통만이 증명하는 길입니다.</p>
          <p className="mb-4">고통 만이 증명하는길입니다.</p>
          <p className="mb-4 text-lg font-bold">고통만이길입니다.</p>
          <p className="mb-4 text-xl font-bold">고통이길입니다.</p>
          <p className="mb-6 text-2xl font-bold text-destructive">고통이길.</p>

          {/* Phase 4 - Repetition */}
          <div className="space-y-2 mb-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} style={{ opacity: 1 - i * 0.03 }}>
                고통이다. 고통이야. 고통. 고통. 고통. 고통이다.
              </p>
            ))}
          </div>

          {/* End - trigger point */}
          <p ref={thankYouRef} className="text-sm text-muted-foreground pt-4 border-t border-border">
            감사합니다.
          </p>
        </div>
      )
    },
  };

  const message = messages[id as keyof typeof messages];

  if (!message) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">존재하지 않는 쪽지입니다.</p>
      </div>
    );
  }

  // Black screen transition overlay
  if (showBlackScreen) {
    return (
      <div 
        className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 ${showFadeIn ? 'opacity-0' : 'opacity-100'}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 relative">
      <div className="max-w-4xl mx-auto">
        {!hideBackButton && (
          <Button 
            variant="ghost" 
            onClick={handleBackClick}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            쪽지함
          </Button>
        )}

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
          <CardContent ref={contentRef} className="pt-6">
            <div 
              ref={retypeContainerRef}
              className="text-foreground leading-relaxed max-h-[60vh] overflow-y-auto"
            >
              {showRetyping ? (
                <pre 
                  className="break-all whitespace-pre-wrap font-mono text-base text-destructive leading-relaxed"
                  style={{ fontFamily: 'monospace' }}
                >
                  {getReplacedContent()}
                  <span className="animate-blink">|</span>
                </pre>
              ) : (
                message.content
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageDetail;
