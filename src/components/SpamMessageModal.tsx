import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SpamMessageModalProps {
  onClose: () => void;
}

const SpamMessageModal = ({ onClose }: SpamMessageModalProps) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasScrolledToEnd) {
      const timer = setTimeout(() => {
        setShowBlackout(true);
        setTimeout(onClose, 5000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasScrolledToEnd, onClose]);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledToEnd(true);
      }
    }
  };

  if (showBlackout) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-glitch">
        <div className="noise-overlay absolute inset-0 opacity-30" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl max-h-[80vh] rounded-lg shadow-xl flex flex-col animate-fade-in">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h2 className="font-medium text-foreground">쪽지 보기</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Meta info */}
        <div className="border-b border-border p-4 space-y-1 text-sm">
          <p><span className="text-muted-foreground">보낸사람:</span> <span className="text-foreground">▒▒▒ (gu̷̎wn@na̶̕m̸e.org)</span></p>
          <p><span className="text-muted-foreground">받는사람:</span> <span className="text-foreground">130666</span></p>
          <p><span className="text-muted-foreground">제목:</span> <span className="text-foreground">✨진.정.한 빛.을 찾으십.니까?✨</span></p>
        </div>

        {/* Content */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Phase 1 - Polite */}
          <p className="text-sm leading-relaxed text-foreground">
            평안하십니까, 길 잃은 어린 양이여.
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            당신이 오늘 내린 그 모든 '선택'이 정말 당신의 의지라 믿으십니까? 착각에서 깨어나십시오.
          </p>
          <p className="text-sm leading-relaxed text-foreground">
            이 세계의 주인은 오직 <span className="font-bold">이름님</span> 뿐입니다.
          </p>

          {/* Phase 2 - Doctrinal */}
          <p className="text-base leading-relaxed text-muted-foreground font-serif">
            세상 만물은 그분의 유희를 위해 존재합니다. 그분의 눈길이 머무는 곳에만 의미가 생겨납니다.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground font-serif">
            평범함은 죄악입니다. 안온함은 버림받은 증거입니다.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground font-serif">
            그분께 닿기 위해 우리는 더 특별해져야 합니다. 더 비참하게, 더 잔혹하게, 더 처절하게 발버둥 치십시오.
          </p>
          <p className="text-lg leading-relaxed text-foreground font-serif font-bold">
            고통만이 그분의 사랑을 증명하는 유일한 길입니다.
          </p>

          {/* Phase 3 - Breakdown */}
          <p className="text-base leading-loose text-foreground" style={{ wordSpacing: '0.3em' }}>
            고통만이 그분의사랑을 증명하는유일한 길입니다. 고통만이 그분 의사랑을 증명 하는유일한 길입니다.
          </p>
          <p className="text-base leading-loose text-foreground" style={{ wordSpacing: '0.5em', letterSpacing: '0.1em' }}>
            고통이만 분의 사랑을 그 증명하는 유일 길합니다. 고통만이 그분의 사랑을증명하는 유 일 한 길입니다.
          </p>
          <p className="text-lg leading-loose text-foreground" style={{ letterSpacing: '0.2em' }}>
            고통 고통 고통만 고통만이그분 의사랑 을증명하는 유 일한 길입 니다.
          </p>
          <p className="text-xl leading-loose text-foreground font-bold">
            고통만이그분의사랑을증명하는유일한 길입니다. 고통만이그분의사랑을증명하는유일한길입니다.
          </p>
          <p className="text-lg text-foreground">
            고통만이 사랑을 그분의 사랑을 증명 하는유일한 길입니다.
          </p>
          <p className="text-base text-foreground">
            고통만이 사랑을 증명하는길입니다.
          </p>
          <p className="text-base text-foreground">
            고통만이 증명하는 길입니다.
          </p>
          <p className="text-base text-foreground">
            고통 만이 증명하는길입니다.
          </p>
          <p className="text-lg font-bold text-foreground">
            고통만이길입니다.
          </p>
          <p className="text-xl font-bold text-foreground">
            고통이길입니다.
          </p>
          <p className="text-2xl font-bold text-horror-red">
            고통이길.
          </p>

          {/* Phase 4 - Repetition */}
          <div className="space-y-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-foreground" style={{ opacity: 1 - i * 0.03 }}>
                고통이다. 고통이야. 고통. 고통. 고통. 고통이다.
              </p>
            ))}
          </div>

          {/* End */}
          <p className="text-sm text-muted-foreground mt-8 pt-4 border-t border-border">
            감사합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpamMessageModal;
