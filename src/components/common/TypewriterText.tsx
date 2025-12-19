import { useState, useEffect } from 'react';

interface TypewriterTextProps {
    texts: string[];
}

export const TypewriterText = ({ texts }: TypewriterTextProps) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const currentFullText = texts[currentTextIndex];

        if (charIndex < currentFullText.length) {
            const timer = setTimeout(() => {
                setDisplayText(currentFullText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                if (currentTextIndex < texts.length - 1) {
                    setCurrentTextIndex(currentTextIndex + 1);
                    setDisplayText('');
                    setCharIndex(0);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [charIndex, currentTextIndex, texts]);

    return <span className="font-horror">{displayText}<span className="animate-blink">|</span></span>;
};
