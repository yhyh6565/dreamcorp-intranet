import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useUserStore } from '@/store/userStore';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay = ({ onComplete }: JumpscareOverlayProps) => {
  const { setNavigationDisabled } = useUserStore();
  const [phase, setPhase] = useState<'silence' | 'typing-nugoo' | 'typing-die' | 'terminal' | 'end'>('silence');
  const [typingText, setTypingText] = useState('');
  const [terminalLines, setTerminalLines] = useState<{ timestamp: string; message: string; isAbnormal: boolean }[]>([]);
  const [trackingBlinking, setTrackingBlinking] = useState(true);
  const typingSpeedRef = useRef(180);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable navigation globally
    setNavigationDisabled(true);

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
      // Re-enable navigation on cleanup
      setNavigationDisabled(false);
    };
  }, [setNavigationDisabled]);

  // Generate random timestamp - mix of current time and old dates
  const generateTimestamp = (index: number) => {
    const now = new Date();
    // Every 3rd line has a chance of being an old random date
    if (index % 3 === 0 && Math.random() > 0.5) {
      const oldYears = [1925, 1947, 1963, 1984, 1991, 2001, 2008];
      const year = oldYears[Math.floor(Math.random() * oldYears.length)];
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    }
    // Current time with slight offset
    const offset = index * 1000 + Math.floor(Math.random() * 500);
    const time = new Date(now.getTime() + offset);
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0');
    const day = String(time.getDate()).padStart(2, '0');
    const hour = String(time.getHours()).padStart(2, '0');
    const min = String(time.getMinutes()).padStart(2, '0');
    const sec = String(time.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  };

  // Terminal phase logic
  useEffect(() => {
    if (phase === 'terminal') {
      // Normal terminal logs first, then abnormal ones
      const normalMessages = [
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

      const abnormalMessages = [
        '',
        '> SYSTEM ALERT: Unauthorized Access Detected.',
        '> User: Unknown',
        '> Location: Tracking...',
        '> Camera: ON',
        '> Microphone: ON'
      ];

      const allMessages = [...normalMessages, ...abnormalMessages];
      let lineIndex = 0;

      const addLine = () => {
        if (lineIndex < allMessages.length) {
          const timestamp = generateTimestamp(lineIndex);
          const message = allMessages[lineIndex];
          const isAbnormal = lineIndex >= normalMessages.length;
          setTerminalLines(prev => [...prev, { timestamp, message, isAbnormal }]);
          lineIndex++;
          // Faster for normal logs, slower for abnormal
          const delay = lineIndex <= normalMessages.length ? 80 : 400;
          setTimeout(addLine, delay);
        }
      };
      addLine();

      // Stop blinking after 12 seconds total (before 15s end)
      const completeTimer = setTimeout(() => {
        setTrackingBlinking(false);
        // Update tracking line to show [Finish]
        setTerminalLines(prev => prev.map(line =>
          line.message === '> Location: Tracking...'
            ? { ...line, message: '> Location: Tracking....[Finish]' }
            : line
        ));

        // End and navigate to dashboard after showing [Finish]
        setTimeout(() => {
          setPhase('end');
          onComplete();
        }, 3000); // Wait 3 more seconds after showing [Finish]
      }, 12000); // Start at 12 seconds

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

  // ... (imports remain)

  // ... (component logic remains)

  if (phase === 'end') return null;

  // Terminal phase UI
  if (phase === 'terminal') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-black/30 overflow-hidden font-mono flex items-center justify-center p-4">
        {/* Terminal Window */}
        <div className="w-full max-w-4xl h-[80vh] bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#323232] border-b border-gray-600">
            {/* macOS style buttons */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-not-allowed" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] cursor-not-allowed" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40] cursor-not-allowed" />
            </div>
            {/* Title */}
            <span className="text-gray-400 text-sm font-medium">root@daydream-corp: ~/var/log</span>
            {/* REC indicator */}
            <div className="flex items-center gap-1.5 text-red-500">
              <span className="animate-pulse text-xs">●</span>
              <span className="text-xs font-bold">REC</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-xs md:text-sm space-y-0.5 text-left">
              {terminalLines.map((line, index) => (
                <p key={index} className="font-mono whitespace-pre flex">
                  <span className="text-gray-500 mr-3 shrink-0">{line.timestamp}</span>
                  {line.message === '> Location: Tracking...' && trackingBlinking ? (
                    <span className="text-red-400">
                      {'> Location: '}
                      <span className="animate-pulse">Tracking...</span>
                    </span>
                  ) : line.isAbnormal ? (
                    <span className="text-red-400">{line.message}</span>
                  ) : (
                    <span className="text-green-400">{line.message}</span>
                  )}
                </p>
              ))}
              <span className="animate-blink text-green-400">_</span>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-start justify-start">
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
    </div>,
    document.body
  );
};

export default JumpscareOverlay;
