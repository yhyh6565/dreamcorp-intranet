import { useEffect, useState } from 'react';

interface JumpscareOverlayProps {
  onComplete: () => void;
}

const JumpscareOverlay = ({ onComplete }: JumpscareOverlayProps) => {
  const [phase, setPhase] = useState<'silence' | 'start' | 'escalation' | 'climax' | 'end'>('silence');
  const [texts, setTexts] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Timeline
    const silenceTimer = setTimeout(() => setPhase('start'), 500);
    const escalationTimer = setTimeout(() => setPhase('escalation'), 1000);
    const climaxTimer = setTimeout(() => setPhase('climax'), 2500);
    const endTimer = setTimeout(() => {
      setPhase('end');
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(silenceTimer);
      clearTimeout(escalationTimer);
      clearTimeout(climaxTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  useEffect(() => {
    if (phase === 'escalation' || phase === 'climax') {
      const interval = setInterval(() => {
        setTexts((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 16 + Math.random() * 32,
          },
        ]);
      }, phase === 'climax' ? 30 : 100);

      return () => clearInterval(interval);
    }
  }, [phase]);

  if (phase === 'end') return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Noise overlay */}
      {phase !== 'silence' && (
        <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />
      )}

      {/* Center text for start phase */}
      {phase === 'start' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-horror text-2xl text-horror-red animate-text-flicker">
            누구야?
          </span>
        </div>
      )}

      {/* Scattered texts */}
      {(phase === 'escalation' || phase === 'climax') && (
        <>
          {texts.map((text) => (
            <span
              key={text.id}
              className={`absolute font-horror ${phase === 'climax' ? 'animate-text-flicker' : ''}`}
              style={{
                left: `${text.x}%`,
                top: `${text.y}%`,
                fontSize: `${text.size}px`,
                color: phase === 'climax' ? undefined : 'hsl(var(--horror-red))',
                transform: 'translate(-50%, -50%)',
              }}
            >
              누구야?
            </span>
          ))}

          {/* Fill screen with text in climax */}
          {phase === 'climax' && (
            <div className="absolute inset-0 flex flex-wrap items-center justify-center overflow-hidden">
              {Array.from({ length: 200 }).map((_, i) => (
                <span
                  key={`fill-${i}`}
                  className="font-horror text-lg md:text-2xl animate-text-flicker mx-1"
                  style={{ animationDelay: `${Math.random() * 0.2}s` }}
                >
                  누구야?
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JumpscareOverlay;
