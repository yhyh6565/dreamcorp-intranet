import { useEffect, useState } from 'react';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay = ({ onComplete }: JumpscareOverlayProps) => {
  const [phase, setPhase] = useState<'silence' | 'typing' | 'end'>('silence');
  const [typingText, setTypingText] = useState('');
  const [typingCount, setTypingCount] = useState(0);

  useEffect(() => {
    // Start typing after short silence
    const silenceTimer = setTimeout(() => setPhase('typing'), 500);
    
    // End after sufficient time for horror effect
    const endTimer = setTimeout(() => {
      setPhase('end');
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(silenceTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  // Infinite typing effect for "누구야?"
  useEffect(() => {
    if (phase === 'typing') {
      const fullText = '누구야? ';
      let charIndex = 0;
      
      const typingInterval = setInterval(() => {
        setTypingText(prev => prev + fullText[charIndex]);
        charIndex++;
        
        if (charIndex >= fullText.length) {
          charIndex = 0;
          setTypingCount(prev => prev + 1);
        }
      }, 150);

      return () => clearInterval(typingInterval);
    }
  }, [phase]);

  if (phase === 'end') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex items-center justify-center">
      {phase === 'typing' && (
        <div className="w-full h-full p-8 overflow-hidden">
          <p 
            className="text-2xl md:text-4xl leading-relaxed break-words"
            style={{ 
              fontFamily: 'Gungsuh, 궁서체, serif',
              color: 'hsl(var(--horror-red))',
              textShadow: '0 0 10px hsl(var(--horror-red) / 0.5)'
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
