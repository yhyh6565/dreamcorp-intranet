
export interface FloorData {
    id: string;
    name: string;
    category: 'main' | 'annex' | 'basement';
    type: string;
    description: string;
}

export interface Room {
    id: string;
    name: string;
    nameEn?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    hasDoor?: 'top' | 'bottom' | 'left' | 'right';
}

export const floors: FloorData[] = [
    { id: '15F', name: '15층', category: 'main', type: 'Office R~Z', description: 'R~Z조 사무실' },
    { id: '14F', name: '14층', category: 'main', type: 'Office K~Q', description: 'K~Q조 사무실' },
    { id: '13F', name: '13층', category: 'main', type: 'Office D~J', description: 'D~J조 사무실' },
    { id: '12F', name: '12층', category: 'main', type: 'Common', description: '카페테리아 & 회의실' },
    { id: '11F', name: '11층', category: 'main', type: 'Team C', description: 'C팀 사무실' },
    { id: '10F', name: '10층', category: 'main', type: 'Team A,B', description: 'A, B팀 사무실' },
    { id: '1F', name: '1층', category: 'main', type: 'Lobby', description: '로비 & 안내데스크' },
];

const ROOM_H = 35;
const TOP_Y = 5;
const BOT_Y = 60;
// Helper to generate X positions for a 6-column grid (approx 15% width each + gaps)
const getGridX = (colIndex: number, totalCols: number = 6) => {
    const startX = 2;
    const endX = 85; // EV is at 87
    const availableWidth = endX - startX;
    const gap = 1;
    const roomWidth = (availableWidth - (gap * (totalCols - 1))) / totalCols;
    return {
        x: startX + (roomWidth + gap) * colIndex,
        width: roomWidth
    };
};

export const getFloorRooms = (floorId: string): Room[] => {
    const ev: Room = { id: 'ev', name: 'EV', x: 88, y: 35, width: 8, height: 20 };

    switch (floorId) {
        case '1F':
            return [
                // Circular Desk in Center
                { id: 'desk', name: '안내데스크', nameEn: 'Info Desk', x: 35, y: 30, width: 30, height: 40 }, // Logic in component will render circle
                { id: 'staff_gate', name: 'Staff Only', x: 70, y: 80, width: 8, height: 10 },
                ev
            ].map(r => r.id === 'ev' ? { ...r, id: `ev${floorId}` } : r) as Room[];

        case '10F':
            // 6 Columns Grid
            // Top: A1, A2, PA, PB, B1, B2
            // Bot: A3, A4, WA, WB, B3, B4
            return [
                { i: 0, r: 'top', id: 'a1', n: 'A-1', d: 'bottom' },
                { i: 1, r: 'top', id: 'a2', n: 'A-2', d: 'bottom' },
                { i: 2, r: 'top', id: 'pa', n: '탕비실 A', d: 'bottom' },
                { i: 3, r: 'top', id: 'pb', n: '탕비실 B', d: 'bottom' },
                { i: 4, r: 'top', id: 'b1', n: 'B-1', d: 'bottom' },
                { i: 5, r: 'top', id: 'b2', n: 'B-2', d: 'bottom' },

                { i: 0, r: 'bot', id: 'a3', n: 'A-3', d: 'top' },
                { i: 1, r: 'bot', id: 'a4', n: 'A-4', d: 'top' },
                { i: 2, r: 'bot', id: 'wa', n: '화장실 A', d: 'top' },
                { i: 3, r: 'bot', id: 'wb', n: '화장실 B', d: 'top' },
                { i: 4, r: 'bot', id: 'b3', n: 'B-3', d: 'top' },
                { i: 5, r: 'bot', id: 'b4', n: 'B-4', d: 'top' },
            ].map(item => {
                const { x, width } = getGridX(item.i, 6);
                return {
                    id: item.id, name: item.n, x, width,
                    y: item.r === 'top' ? TOP_Y : BOT_Y,
                    height: ROOM_H,
                    hasDoor: item.d as any
                } as Room;
            }).concat([{ ...ev, id: 'ev10' }]);

        case '11F':
            // 5 Columns Grid structure roughly
            // Top: C1, C2, PC, M1, M2
            // Bot: C3, C4, WC, Storage
            // Let's use getGridX with 5 cols for consistency or manual?
            // Image shows roughly equal sizes.
            const grid11 = (col: number) => getGridX(col, 5);
            return [
                { ...grid11(0), y: TOP_Y, id: 'c1', name: 'C-1', hasDoor: 'bottom' },
                { ...grid11(1), y: TOP_Y, id: 'c2', name: 'C-2', hasDoor: 'bottom' },
                { ...grid11(2), y: TOP_Y, id: 'pc', name: '탕비실 C', hasDoor: 'bottom' },
                { ...grid11(3), y: TOP_Y, id: 'm1', name: '회의실 1', hasDoor: 'bottom' },
                { ...grid11(4), y: TOP_Y, id: 'm2', name: '회의실 2', hasDoor: 'bottom' },

                { ...grid11(0), y: BOT_Y, id: 'c3', name: 'C-3', hasDoor: 'top' },
                { ...grid11(1), y: BOT_Y, id: 'c4', name: 'C-4', hasDoor: 'top' },
                { ...grid11(2), y: BOT_Y, id: 'wc', name: '화장실 C', hasDoor: 'top' },
                // Storage spans last 2 cols
                {
                    x: grid11(3).x, width: grid11(3).width + grid11(4).width + 1,
                    y: BOT_Y, id: 'storage', name: '정예팀 물품보관실', hasDoor: 'top'
                },
            ].map(r => ({ ...r, height: ROOM_H }) as Room).concat([{ ...ev, id: 'ev11' }]);

        case '12F':
            // Left: Common (x=2 to 45?), Right: Meeting Rooms
            return [
                { id: 'lounge', name: '공용 공간 & 카페테리아', x: 2, y: 5, width: 40, height: 90, hasDoor: 'right' },

                { id: 'wc', name: '화장실', x: 44, y: 5, width: 13, height: 35, hasDoor: 'bottom' },
                { id: 'm1', name: '공용 회의실 1', x: 59, y: 5, width: 13, height: 35, hasDoor: 'bottom' },
                { id: 'm2', name: '공용 회의실 2', x: 74, y: 5, width: 13, height: 35, hasDoor: 'bottom' },

                { id: 'm3', name: '공용 회의실 3', x: 44, y: 60, width: 20, height: 35, hasDoor: 'top' }, // larger
                { id: 'm4', name: '공용 회의실 4', x: 66, y: 60, width: 21, height: 35, hasDoor: 'top' }, // larger
                { ...ev, id: 'ev12' }
            ];

        case '13F':
            // Top: D, F, Pantry, WC, H, J
            // Bot: E, G, Meet, WC, I, Storage
            return [
                { i: 0, r: 'top', id: 'd', n: 'D조', d: 'bottom' },
                { i: 1, r: 'top', id: 'f', n: 'F조', d: 'bottom' },
                { i: 2, r: 'top', id: 'p', n: '탕비실', d: 'bottom' },
                { i: 3, r: 'top', id: 'wc1', n: '화장실', d: 'bottom' },
                { i: 4, r: 'top', id: 'h', n: 'H조', d: 'bottom' },
                { i: 5, r: 'top', id: 'j', n: 'J조', d: 'bottom' },

                { i: 0, r: 'bot', id: 'e', n: 'E조', d: 'top' },
                { i: 1, r: 'bot', id: 'g', n: 'G조', d: 'top' },
                { i: 2, r: 'bot', id: 'm', n: '회의실', d: 'top' },
                { i: 3, r: 'bot', id: 'wc2', n: '화장실', d: 'top' },
                { i: 4, r: 'bot', id: 'i', n: 'I조', d: 'top' },
                { i: 5, r: 'bot', id: 'stor', n: '물품보관실', d: 'top' },
            ].map(item => {
                const { x, width } = getGridX(item.i);
                return {
                    id: `13_${item.id}`, name: item.n, x, width,
                    y: item.r === 'top' ? TOP_Y : BOT_Y,
                    height: ROOM_H,
                    hasDoor: item.d as any
                } as Room;
            }).concat([{ ...ev, id: 'ev13' }]);

        case '14F':
            // Top: K, M, Pantry, WC, O, Q
            // Bot: L, N, Meet, WC, P, Storage
            return [
                { i: 0, r: 'top', id: 'k', n: 'K조', d: 'bottom' },
                { i: 1, r: 'top', id: 'm', n: 'M조', d: 'bottom' },
                { i: 2, r: 'top', id: 'p', n: '탕비실', d: 'bottom' },
                { i: 3, r: 'top', id: 'wc1', n: '화장실', d: 'bottom' },
                { i: 4, r: 'top', id: 'o', n: 'O조', d: 'bottom' },
                { i: 5, r: 'top', id: 'q', n: 'Q조', d: 'bottom' },

                { i: 0, r: 'bot', id: 'l', n: 'L조', d: 'top' },
                { i: 1, r: 'bot', id: 'n', n: 'N조', d: 'top' },
                { i: 2, r: 'bot', id: 'meet', n: '회의실', d: 'top' },
                { i: 3, r: 'bot', id: 'wc2', n: '화장실', d: 'top' },
                { i: 4, r: 'bot', id: 'p_bot', n: 'P조', d: 'top' },
                { i: 5, r: 'bot', id: 'stor', n: '물품보관실', d: 'top' },
            ].map(item => {
                const { x, width } = getGridX(item.i);
                return {
                    id: `14_${item.id}`, name: item.n, x, width,
                    y: item.r === 'top' ? TOP_Y : BOT_Y,
                    height: ROOM_H,
                    hasDoor: item.d as any
                } as Room;
            }).concat([{ ...ev, id: 'ev14' }]);

        case '15F':
            // Top: R, T, V, WC, X, Z
            // Bot: S, U, W, WC, Y, Pantry
            return [
                { i: 0, r: 'top', id: 'r', n: 'R조', d: 'bottom' },
                { i: 1, r: 'top', id: 't', n: 'T조', d: 'bottom' },
                { i: 2, r: 'top', id: 'v', n: 'V조', d: 'bottom' },
                { i: 3, r: 'top', id: 'wc1', n: '화장실', d: 'bottom' },
                { i: 4, r: 'top', id: 'x', n: 'X조', d: 'bottom' },
                { i: 5, r: 'top', id: 'z', n: 'Z조', d: 'bottom' },

                { i: 0, r: 'bot', id: 's', n: 'S조', d: 'top' },
                { i: 1, r: 'bot', id: 'u', n: 'U조', d: 'top' },
                { i: 2, r: 'bot', id: 'w', n: 'W조', d: 'top' },
                { i: 3, r: 'bot', id: 'wc2', n: '화장실', d: 'top' },
                { i: 4, r: 'bot', id: 'y', n: 'Y조', d: 'top' },
                { i: 5, r: 'bot', id: 'pantry', n: '탕비실', d: 'top' },
            ].map(item => {
                const { x, width } = getGridX(item.i);
                return {
                    id: `15_${item.id}`, name: item.n, x, width,
                    y: item.r === 'top' ? TOP_Y : BOT_Y,
                    height: ROOM_H,
                    hasDoor: item.d as any
                } as Room;
            }).concat([{ ...ev, id: 'ev15' }]);

        default:
            return [];
    }
};
