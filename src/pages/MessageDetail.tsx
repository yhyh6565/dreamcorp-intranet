import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Reply, Forward, AlertTriangle, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import MessageLayout from '@/components/MessageLayout';
import { getMessages } from '@/data/messages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSpamEasterEgg } from '@/hooks/useSpamEasterEgg';

const MessageDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userName, team, rank, setNavigationDisabled, markSecurityMessageRead, securityMessageTriggered, completeSecurityEasterEgg } = useUserStore();

  const {
    showRetyping,
    hideBackButton,
    showBlackScreen,
    showFadeIn,
    thankYouRef,
    retypeContainerRef,
    replacedContent,
    triggerEasterEgg
  } = useSpamEasterEgg(id);

  const securityBottomRef = useRef<HTMLDivElement>(null);
  const hasReadSecurity = useRef(false);

  // Mark Security Message as Read (Badge)
  useEffect(() => {
    if (id === 'security-breach') {
      markSecurityMessageRead();
    }
  }, [id, markSecurityMessageRead]);

  // Observer for Security Message Bottom
  useEffect(() => {
    if (id !== 'security-breach') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasReadSecurity.current = true;
        }
      },
      { threshold: 0 }
    );

    if (securityBottomRef.current) {
      observer.observe(securityBottomRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  // Cleanup: Delete message if read
  useEffect(() => {
    return () => {
      if (id === 'security-breach' && hasReadSecurity.current) {
        completeSecurityEasterEgg();
      }
    };
  }, [id, completeSecurityEasterEgg]);

  const handleBackClick = () => {
    // Immediate deletion logic for better responsiveness
    if (id === 'security-breach' && hasReadSecurity.current) {
      completeSecurityEasterEgg();
    }

    if (!triggerEasterEgg()) {
      navigate('/messages');
    }
  };

  const messages = getMessages(userName, team, rank, securityMessageTriggered);
  const message = messages.find(m => m.id === id);

  if (!message) {
    return (
      <MessageLayout>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">존재하지 않는 쪽지입니다.</p>
        </div>
      </MessageLayout>
    );
  }

  // Black screen transition overlay
  if (showBlackScreen) {
    return (
      <div
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ${showFadeIn ? 'opacity-0' : 'opacity-100'}`}
      />
    );
  }

  return (
    <MessageLayout>
      {/* Mobile Header */}
      {!hideBackButton && (
        <div className="md:hidden p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="gap-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Button>
        </div>
      )}

      {/* Message Header */}
      <div className="p-6 border-b border-border bg-white sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            {!hideBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackClick}
                className="text-muted-foreground hover:text-slate-900 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-2xl font-bold text-slate-900 leading-tight break-keep">{message.title}</h2>
          </div>
          <div className="hidden md:flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={message.id === '2'}>
                    <Reply className="h-4 w-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>답장</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={message.id === '2'}>
                    <Forward className="h-4 w-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>전달</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={message.id === '2'}>
                    <Trash2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>삭제</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={message.id === '2'}>
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>더보기</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
              {message.sender[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900">{message.sender}</span>
              <span className="text-xs text-muted-foreground">&lt;{message.senderDept}&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>받는 사람: {userName}</span>
              <span>•</span>
              <span>{message.date} {message.time}</span>
            </div>
          </div>
          {message.isSpam && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-200">
              <AlertTriangle className="h-3 w-3" />
              스팸 또는 피싱 의심
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div
        ref={retypeContainerRef}
        className="flex-1 p-8 overflow-y-auto bg-white"
      >
        <div
          className="text-slate-800 leading-relaxed max-w-3xl"
        >
          {showRetyping ? (
            <pre
              className="break-all whitespace-pre-wrap font-mono text-base text-destructive leading-relaxed"
              style={{ fontFamily: 'monospace' }}
            >
              {replacedContent}
              <span className="animate-blink">|</span>
            </pre>
          ) : (
            <>
              {message.content}
              {/* Ref for intersection observer to trigger back button logic only for message 2 */}
              {id === '2' && <p ref={thankYouRef} className="opacity-0 h-1" />}
              {id === 'security-breach' && <div ref={securityBottomRef} className="h-10 w-full" />}
            </>
          )}
        </div>

        {!showRetyping && message.id !== '2' && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <Button variant="outline" className="gap-2">
              <Reply className="h-4 w-4" />
              답장하기
            </Button>
          </div>
        )}
      </div>
    </MessageLayout>
  );
};

export default MessageDetail;
