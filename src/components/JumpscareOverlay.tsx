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
    
    // Transition to "죽어" phase after 5 seconds
    const diePhaseTimer = setTimeout(() => setPhase('typing-die'), 5000);
    
    // End after 10 seconds
    const endTimer = setTimeout(() => {
      setPhase('end');
      onComplete();
    }, 10000);

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
      typingSpeedRef.current = 120; // Start slower for gradual acceleration
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
            // Gradually speed up
            typingSpeedRef.current = Math.max(15, typingSpeedRef.current * 0.92);
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
      typingSpeedRef.current = 40; // Start moderate, then accelerate
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
            // Accelerate more aggressively
            typingSpeedRef.current = Math.max(3, typingSpeedRef.current * 0.88);
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
            className="text-7xl md:text-8xl lg:text-9xl leading-none break-all font-bold"
            style={{ 
              fontFamily: 'Gungsuh, 궁서체, serif',
              color: 'hsl(var(--horror-red))',
              textShadow: '0 0 20px hsl(var(--horror-red) / 0.7)',
              wordBreak: 'break-all',
              lineHeight: '1.1'
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
