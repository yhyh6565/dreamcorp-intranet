export interface Marker {
    id: string;
    floorId: string;
    x: number;
    y: number;
    assignee: string;
    target: string;
    status: 'stable' | 'caution' | 'danger' | 'dormant' | 'restricted';
    note?: string;
    team?: string;       // 담당자 소속 조
    location?: string;   // 위치 텍스트
}

export const markers: Marker[] = [
    // Marker 1: 본관 13층 D조 사무실
    {
        id: 'marker-1',
        floorId: '13F',
        x: 12,
        y: 25,
        assignee: '박민성 주임 (D조)',
        target: '안녕 교통정보 (Qterw-E-63)',
        status: 'caution',
        note: '서류 더미에 파묻힘'
    },
    // Marker 4: 본관 11F C-1 사무실 (moved from 14F)
    {
        id: 'marker-4',
        floorId: '11F',
        x: 10,
        y: 20,
        assignee: '강■■ 팀장 (C조)',
        target: 'Qterw-S-01 [데이터 말소]',
        status: 'restricted',
        note: '보안 레벨 5 이상'
    },
    // Marker 6: 본관 13F H조 사무실 (moved from 15F)
    {
        id: 'marker-6',
        floorId: '13F',
        x: 65,
        y: 22,
        assignee: '조■■ 주임 (H조)',
        target: 'Qterw-?-??? (쳐다보지 마시오)',
        status: 'dormant'
    },
];
