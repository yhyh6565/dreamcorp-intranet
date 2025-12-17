import { useEffect, useState, useRef } from 'react';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay = ({ onComplete }: JumpscareOverlayProps) => {
  const [phase, setPhase] = useState<'silence' | 'typing-nugoo' | 'typing-die' | 'terminal' | 'end'>('silence');
  const [typingText, setTypingText] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [trackingBlinking, setTrackingBlinking] = useState(true);
  const typingSpeedRef = useRef(180);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start typing "누구야?" after short silence
    const silenceTimer = setTimeout(() => setPhase('typing-nugoo'), 300);
    
    // Transition to "죽어" phase after 5 seconds
    const diePhaseTimer = setTimeout(() => setPhase('typing-die'), 5000);
    
    // Transition to terminal phase after 10 seconds
    const terminalTimer = setTimeout(() => setPhase('terminal'), 10000);

    return () => {
      clearTimeout(silenceTimer);
      clearTimeout(diePhaseTimer);
      clearTimeout(terminalTimer);
    };
  }, []);

  // Terminal phase logic
  useEffect(() => {
    if (phase === 'terminal') {
      // Normal terminal logs first, then abnormal ones
      const normalLines = [
        '[root@cwg-cmdlog profile.d]# chmod +x cmd_logging.sh',
        '[root@cwg-cmdlog profile.d]# ll',
        'total 76',
        '-rw-r--r--. 1 root root  771 Oct 31 2018 256term.csh',
        '-rw-r--r--. 1 root root  841 Oct 31 2018 256term.sh',
        '-rw-r--r--. 1 root root 1348 Nov 14 2018 abort-console-notification.sh',
        '-rw-r--r--. 1 root root  660 Jun 10 2014 bash_completion.sh',
        '-rwxr-xr-x. 1 root root  293 Mar 16 09:47 cmd_logging.sh',
        '-rw-r--r--. 1 root root  196 Mar 25 2017 colorgrep.csh',
        '-rw-r--r--. 1 root root  201 Mar 25 2017 colorgrep.sh',
      ];
      
      const abnormalLines = [
        '',
        '> SYSTEM ALERT: Unauthorized Access Detected.',
        '> User: Unknown',
        '> Location: Tracking...',
        '> Camera: ON',
        '> Microphone: ON'
      ];
      
      const allLines = [...normalLines, ...abnormalLines];
      let lineIndex = 0;
      
      const addLine = () => {
        if (lineIndex < allLines.length) {
          setTerminalLines(prev => [...prev, allLines[lineIndex]]);
          lineIndex++;
          // Faster for normal logs, slower for abnormal
          const delay = lineIndex <= normalLines.length ? 80 : 400;
          setTimeout(addLine, delay);
        }
      };
      addLine();

      // Stop blinking and complete after 7 seconds
      const completeTimer = setTimeout(() => {
        setTrackingBlinking(false);
        // Update tracking line to show [완료]
        setTerminalLines(prev => prev.map(line => 
          line === '> Location: Tracking...' ? '> Location: Tracking... [완료]' : line
        ));
        
        // End after a brief moment
        setTimeout(() => {
          setPhase('end');
          onComplete();
        }, 1000);
      }, 7000);

      return () => clearTimeout(completeTimer);
    }
  }, [phase, onComplete]);

  // Auto-scroll effect
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [typingText]);

  // Typing effect for "누구야?"
  useEffect(() => {
    if (phase === 'typing-nugoo') {
      const fullText = '누구야? ';
      let charIndex = 0;
      typingSpeedRef.current = 120;
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
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

  // Typing effect for "죽어"
  useEffect(() => {
    if (phase === 'typing-die') {
      const fullText = '죽어';
      let charIndex = 0;
      typingSpeedRef.current = 40;
      
      const startTyping = () => {
        intervalRef.current = setTimeout(() => {
          setTypingText(prev => prev + fullText[charIndex]);
          charIndex++;
          
          if (charIndex >= fullText.length) {
            charIndex = 0;
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

  // Terminal phase UI
  if (phase === 'terminal') {
    return (
      <div className="fixed inset-0 z-50 bg-black overflow-hidden font-mono">
        {/* REC indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-red-500">
          <span className="animate-pulse">●</span>
          <span className="text-sm font-bold">REC</span>
        </div>

        {/* Terminal content */}
        <div className="p-4 pt-12">
          <div className="text-green-500 text-xs md:text-sm space-y-0.5 text-left">
            {terminalLines.map((line, index) => (
              <p key={index} className="font-mono whitespace-pre">
                {line === '> Location: Tracking...' && trackingBlinking ? (
                  <>
                    {'> Location: '}
                    <span className="animate-pulse">Tracking...</span>
                  </>
                ) : line.startsWith('>') ? (
                  <span className="text-red-400">{line}</span>
                ) : (
                  line
                )}
              </p>
            ))}
            <span className="animate-blink">_</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden flex items-start justify-start">
      {(phase === 'typing-nugoo' || phase === 'typing-die') && (
        <div 
          ref={textContainerRef}
          className="w-full h-full p-4 overflow-y-auto"
        >
          <p 
            className="text-4xl md:text-5xl lg:text-6xl leading-tight break-all font-bold"
            style={{ 
              fontFamily: 'Gungsuh, 궁서체, serif',
              color: 'hsl(var(--horror-red))',
              wordBreak: 'break-all',
              lineHeight: '1.2'
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
