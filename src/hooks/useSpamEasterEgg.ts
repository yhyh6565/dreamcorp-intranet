import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

const retypeMessage = '\\uc6b0\\ub9ac \\ubaa8\\ub450\\ub294 \\ud55c\\ub0b1 \\uc774\\uc57c\\uae30\\uc5d0 \\ubd88\\uacfc\\ud558\\ub2e4 \\uc704\\ub300\\ud558\\uc2e0 \\uc774\\ub984\\ub2d8 ';

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

export const useSpamEasterEgg = (id: string | undefined) => {
    const navigate = useNavigate();
    const { deleteSpamMessage, corruptUserName, setNavigationDisabled } = useUserStore();

    const [showRetyping, setShowRetyping] = useState(false);
    const [replaceIndex, setReplaceIndex] = useState(0);
    const [hideBackButton, setHideBackButton] = useState(false);
    const [canTriggerBackEasterEgg, setCanTriggerBackEasterEgg] = useState(false);
    const [showBlackScreen, setShowBlackScreen] = useState(false);
    const [showFadeIn, setShowFadeIn] = useState(false);

    const thankYouRef = useRef<HTMLParagraphElement>(null);
    const retypeContainerRef = useRef<HTMLDivElement>(null);

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

    // Build the replaced text
    const getReplacedContent = () => {
        let result = '';
        for (let i = 0; i < originalMessageText.length; i++) {
            if (i < replaceIndex) {
                result += retypeMessage[i % retypeMessage.length];
            } else {
                result += originalMessageText[i];
            }
        }
        if (replaceIndex > originalMessageText.length) {
            const extraChars = replaceIndex - originalMessageText.length;
            for (let i = 0; i < extraChars; i++) {
                result += retypeMessage[(originalMessageText.length + i) % retypeMessage.length];
            }
        }
        return result;
    };

    // Retyping effect
    useEffect(() => {
        if (!showRetyping) return;

        const totalDuration = 10000; // 10 seconds

        const typeInterval = setInterval(() => {
            setReplaceIndex(prev => prev + 1);

            if (retypeContainerRef.current) {
                retypeContainerRef.current.scrollTop = retypeContainerRef.current.scrollHeight;
            }
        }, 0.75);

        const endTimer = setTimeout(() => {
            clearInterval(typeInterval);
            deleteSpamMessage();
            corruptUserName();
            setShowBlackScreen(true);
            setTimeout(() => {
                setShowFadeIn(true);
                setTimeout(() => {
                    setNavigationDisabled(false); // Re-enable navigation before leaving
                    navigate('/dashboard');
                }, 500);
            }, 2000);
        }, totalDuration);

        return () => {
            clearInterval(typeInterval);
            clearTimeout(endTimer);
            setNavigationDisabled(false); // Ensure navigation is re-enabled on cleanup
        };
    }, [showRetyping, deleteSpamMessage, corruptUserName, navigate, setNavigationDisabled]);

    const triggerEasterEgg = () => {
        if (id === '2') {
            setHideBackButton(true);
            setShowRetyping(true);
            setNavigationDisabled(true); // Disable navigation when easter egg is triggered
            return true; // Triggered
        }
        return false; // Not triggered
    };

    return {
        showRetyping,
        hideBackButton,
        showBlackScreen,
        showFadeIn,
        thankYouRef,
        retypeContainerRef,
        replacedContent: getReplacedContent(),
        triggerEasterEgg
    };
};
