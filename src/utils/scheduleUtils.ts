import { ShadowEntity } from '@/store/shadowStore';
import { getRelativeDate, isToday } from '@/utils/dateUtils';

export interface ScheduleItem {
    id: number;
    title: string;
    date: Date;
    timeStr: string;
    status: 'completed' | 'upcoming' | 'future';
    statusText: string;
    color: string;
}

// Simple seeded random function
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
};

// Generate schedule items based on shadow code
export const generateSchedule = (shadow: ShadowEntity): ScheduleItem[] => {
    const seedBase = shadow.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Helper to get a random non-weekend date
    const getSafeDate = (baseOffset: number, variance: number, seedOffset: number) => {
        let offset = baseOffset + (Math.floor(Math.abs(Math.sin(seedBase + seedOffset) * 10000) % variance));
        let date = getRelativeDate(offset);

        // Adjust if weekend (Sunday=0, Saturday=6)
        let day = date.getDay();
        if (day === 0) date = getRelativeDate(offset + 1); // Sun -> Mon
        else if (day === 6) date = getRelativeDate(offset + 2); // Sat -> Mon

        return date;
    };

    const randomTime = (seedOffset: number) => {
        const h = 9 + (Math.floor(Math.abs(Math.sin(seedBase + seedOffset) * 10000) % 9)); // 09:00 ~ 17:00
        const m = (Math.floor(Math.abs(Math.sin(seedBase + seedOffset + 1) * 10000) % 6)) * 10;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const completedDate = getSafeDate(-3, 3, 1); // 0~3 days ago
    const upcomingDate = getSafeDate(0, 2, 2); // Today or Tomorrow
    const futureDate = getSafeDate(3, 5, 3); // 3~8 days later

    return [
        {
            id: 1,
            title: '일일 상태 점검',
            date: completedDate,
            timeStr: '09:00 - 10:00',
            status: 'completed',
            statusText: '완료됨',
            color: 'green'
        },
        {
            id: 2,
            title: '정기 심층 분석',
            date: upcomingDate,
            timeStr: `${randomTime(10)} 예정`,
            status: 'upcoming',
            statusText: isToday(upcomingDate) ? '오늘 예정' : '내일 예정',
            color: 'indigo'
        },
        {
            id: 3,
            title: '주간 보고서 작성',
            date: futureDate,
            timeStr: randomTime(20),
            status: 'future',
            statusText: '예정',
            color: 'slate'
        }
    ];
};
