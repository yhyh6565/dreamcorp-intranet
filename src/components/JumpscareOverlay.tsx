import { useEffect, useState, useRef } from 'react';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay = ({ onComplete }: JumpscareOverlayProps) => {
  const [phase, setPhase] = useState<'silence' | 'typing-nugoo' | 'typing-die' | 'end'>('silence');
  const [typingText, setTypingText] = useState('');
  const typingSpeedRef = useRef(180);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start typing "누구야?" after short silence
    const silenceTimer = setTimeout(() => setPhase('typing-nugoo'), 300);
    
    // Transition to "죽어" phase after 4 seconds
    const diePhaseTimer = setTimeout(() => setPhase('typing-die'), 4000);
    
    // End after 8 seconds
    const endTimer = setTimeout(() => {
      setPhase('end');
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(silenceTimer);
      clearTimeout(diePhaseTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Typing effect for "누구야?"
  useEffect(() => {
    if (phase === 'typing-nugoo') {
      const fullText = '누구야? ';
      let charIndex = 0;
      typingSpeedRef.current = 180;
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
            // Speed up gradually
            typingSpeedRef.current = Math.max(40, typingSpeedRef.current - 15);
          }
          
          if (phase === 'typing-nugoo') {
            startTyping();
          }
        }, typingSpeedRef.current);
      };
      
      startTyping();

      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
      };
    }
  }, [phase]);

  // Typing effect for "죽어" - faster and accelerating
  useEffect(() => {
    if (phase === 'typing-die') {
      const fullText = '죽어';
      let charIndex = 0;
      typingSpeedRef.current = 80;
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
            // Speed up more aggressively
            typingSpeedRef.current = Math.max(10, typingSpeedRef.current - 8);
          }
          
          if (phase === 'typing-die') {
            startTyping();
          }
        }, typingSpeedRef.current);
      };
      
      startTyping();

      return () => {
        if (intervalRef.current) clearTimeout(intervalRef.current);
      };
    }
  }, [phase]);

  if (phase === 'end') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex items-start justify-start">
      {(phase === 'typing-nugoo' || phase === 'typing-die') && (
        <div className="w-full h-full p-4 overflow-hidden">
          <p 
            className="text-xl md:text-2xl leading-tight break-all"
            style={{ 
              fontFamily: 'Gungsuh, 궁서체, serif',
              color: 'hsl(var(--horror-red))',
              textShadow: '0 0 8px hsl(var(--horror-red) / 0.5)',
              wordBreak: 'break-all',
              lineHeight: '1.4'
            }}
          >
            {typingText}
            <span className="animate-blink">|</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default JumpscareOverlay;
