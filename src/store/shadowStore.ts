
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ShadowGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ShadowEntity {
    code: string;          // 코드 (PK, 예: Q-F-092)
    name: string;          // 어둠명 (예: 웅얼거리는 배수구)
    grade: ShadowGrade;    // 등급 (A~F)
    locationText: string;  // 텍스트 위치 (예: 본관 B2 기계실)
    floor: number;         // 층수 (맵 렌더링용, 예: -2, 13)
    coordinates: { x: number; y: number }; // 맵 상의 좌표 (%)
    assigneeName: string | null;  // 담당자 이름 (null이면 미배정)
    assigneeTeam: string | null;  // 담당자 소속 조
    isAssigned: boolean;   // 담당자 배정 여부
    note?: string;         // 특이사항
}

interface ShadowState {
    shadows: ShadowEntity[];
    assignShadow: (code: string, assigneeName: string, assigneeTeam: string) => void;
    resetShadows: () => void;
}

// Initial Data based on the specification
const initialShadows: ShadowEntity[] = [
    {
        code: 'Qterw-E-63', name: '안녕 교통정보', grade: 'E',
        locationText: '본관 13F D조 사무실', floor: 13, coordinates: { x: 20, y: 20 },
        assigneeName: '박민성', assigneeTeam: 'D조', isAssigned: true, note: ''
    },
    {
        code: 'Qterw-E-2884', name: '거울 속의 낯선 얼굴', grade: 'E',
        locationText: '본관 10F 화장실', floor: 10, coordinates: { x: 80, y: 80 },
        assigneeName: null, assigneeTeam: null, isAssigned: false, note: ''
    },
    {
        code: 'Qterw-E-1002', name: '빈 회의실의 난상토론', grade: 'E',
        locationText: '본관 13F 응접실', floor: 13, coordinates: { x: 40, y: 80 },
        assigneeName: null, assigneeTeam: null, isAssigned: false, note: '자정 이후 발생'
    },
    {
        code: 'Qterw-E-7', name: '우는 아이의 낙서', grade: 'E',
        locationText: '본관 12F 엘리베이터 앞 복도', floor: 12, coordinates: { x: 80, y: 50 },
        assigneeName: null, assigneeTeam: null, isAssigned: false, note: ''
    },
    {
        code: 'Qterw-F-409', name: '깜짝 상자!', grade: 'F',
        locationText: '본관 1F 엘리베이터 우측', floor: 1, coordinates: { x: 95, y: 20 },
        assigneeName: null, assigneeTeam: null, isAssigned: false, note: '폭발 시 즉시 보안팀 호출할 것 (비용 청구 X)'
    },
    {
        code: 'Qterw-F-6879', name: '발신자 표시 제한', grade: 'F',
        locationText: '본관 14F 회의실', floor: 14, coordinates: { x: 60, y: 20 },
        assigneeName: null, assigneeTeam: null, isAssigned: false, note: ''
    },
    {
        code: 'Qterw-F-2073', name: '양자택일', grade: 'F',
        locationText: '별관 2F 격리실 205호', floor: 999, coordinates: { x: 0, y: 0 },
        assigneeName: '김솔음', assigneeTeam: 'D조', isAssigned: true, note: '야간 점검 필수'
    },
];

export const useShadowStore = create<ShadowState>()(
    persist(
        (set) => ({
            shadows: initialShadows,
            assignShadow: (code: string, assigneeName: string, assigneeTeam: string) => {
                set((state) => ({
                    shadows: state.shadows.map((shadow) =>
                        shadow.code === code
                            ? { ...shadow, isAssigned: true, assigneeName: assigneeName, assigneeTeam: assigneeTeam }
                            : shadow
                    ),
                }));
            },
            resetShadows: () => set({ shadows: initialShadows }),
        }),
        {
            name: 'daydream-shadow-storage-v3', // Version bump to force schema update
        }
    )
);
