
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
    { id: '15F', name: '15층', category: 'main', type: 'Team A', description: 'A조 사무실 및 임원실' },
    { id: '14F', name: '14층', category: 'main', type: 'Team B, C', description: 'B, C조 사무실' },
    { id: '13F', name: '13층', category: 'main', type: 'Team D~J', description: 'D~J조 사무실' },
    { id: '12F', name: '12층', category: 'main', type: 'Team G~K', description: 'G~K조 사무실' },
    { id: '11F', name: '11층', category: 'main', type: 'Team L~Q', description: 'L~Q조 사무실' },
    { id: '10F', name: '10층', category: 'main', type: 'Team R~Z', description: 'R~Z조 사무실' },
    { id: '1F', name: '1층', category: 'main', type: 'Lobby', description: '로비 & 안내데스크' },
];

const ROOM_H = 35;
const TOP_Y = 5;
const BOT_Y = 60;

export const getFloorRooms = (floorId: string): Room[] => {
    const ev: Room = { id: 'ev', name: 'EV', x: 88, y: 35, width: 8, height: 20 };

    switch (floorId) {
        case '1F':
            return [
                { id: 'desk', name: '안내데스크', nameEn: 'Info Desk', x: 35, y: 30, width: 30, height: 40 },
                { id: 'staff_gate', name: 'Staff Only', x: 70, y: 80, width: 8, height: 10 },
                { ...ev, id: `ev${floorId}` }
            ] as Room[];

        case '10F':
            // R~Z (5 cols)
            // Top: R, T, V, X, Z
            // Bot: S, U, W, Y, WC
            const w10 = 16;
            const x10 = [2, 19, 36, 53, 70];
            return [
                { id: 'R', name: 'R', x: x10[0], y: TOP_Y, width: w10, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'T', name: 'T', x: x10[1], y: TOP_Y, width: w10, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'V', name: 'V', x: x10[2], y: TOP_Y, width: w10, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'X', name: 'X', x: x10[3], y: TOP_Y, width: w10, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'Z', name: 'Z', x: x10[4], y: TOP_Y, width: w10, height: ROOM_H, hasDoor: 'bottom' },

                { id: 'S', name: 'S', x: x10[0], y: BOT_Y, width: w10, height: ROOM_H, hasDoor: 'top' },
                { id: 'U', name: 'U', x: x10[1], y: BOT_Y, width: w10, height: ROOM_H, hasDoor: 'top' },
                { id: 'W', name: 'W', x: x10[2], y: BOT_Y, width: w10, height: ROOM_H, hasDoor: 'top' },
                { id: 'Y', name: 'Y', x: x10[3], y: BOT_Y, width: w10, height: ROOM_H, hasDoor: 'top' },
                { id: 'wc', name: '화장실', x: x10[4], y: BOT_Y, width: w10, height: ROOM_H, hasDoor: 'top' },
                { ...ev, id: 'ev10' }
            ];

        case '11F':
            const w11 = (83 - 3) / 4;
            const x11 = [2, 23, 44, 65];
            return [
                { id: 'L', name: 'L', x: x11[0], y: TOP_Y, width: w11, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'N', name: 'N', x: x11[1], y: TOP_Y, width: w11, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'P', name: 'P', x: x11[2], y: TOP_Y, width: w11, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'wc', name: '화장실', x: x11[3], y: TOP_Y, width: w11, height: ROOM_H, hasDoor: 'bottom' },

                { id: 'M', name: 'M', x: x11[0], y: BOT_Y, width: w11, height: ROOM_H, hasDoor: 'top' },
                { id: 'O', name: 'O', x: x11[1], y: BOT_Y, width: w11, height: ROOM_H, hasDoor: 'top' },
                { id: 'Q', name: 'Q', x: x11[2], y: BOT_Y, width: w11, height: ROOM_H, hasDoor: 'top' },
                { id: 'pantry', name: '탕비실', x: x11[3], y: BOT_Y, width: w11, height: ROOM_H, hasDoor: 'top' },
                { ...ev, id: 'ev11' }
            ];

        case '12F':
            const w12 = (83 - 2) / 3;
            const x12 = [2, 30, 58];
            const w12_split = (w12 - 1) / 2;
            const x12_split_1 = 58;
            const x12_split_2 = 58 + w12_split + 1;

            return [
                { id: 'G', name: 'G', x: x12[0], y: TOP_Y, width: w12, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'I', name: 'I', x: x12[1], y: TOP_Y, width: w12, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'K', name: 'K', x: x12[2], y: TOP_Y, width: w12, height: ROOM_H, hasDoor: 'bottom' },

                { id: 'H', name: 'H', x: x12[0], y: BOT_Y, width: w12, height: ROOM_H, hasDoor: 'top' },
                { id: 'J', name: 'J', x: x12[1], y: BOT_Y, width: w12, height: ROOM_H, hasDoor: 'top' },
                { id: 'wc', name: '화장실', x: x12_split_1, y: BOT_Y, width: w12_split, height: ROOM_H, hasDoor: 'top' },
                { id: 'pantry', name: '탕비실', x: x12_split_2, y: BOT_Y, width: w12_split, height: ROOM_H, hasDoor: 'top' },
                { ...ev, id: 'ev12' }
            ];

        case '13F':
            return [
                { id: 'D', name: 'D', x: 2, y: TOP_Y, width: 30, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'F', name: 'F', x: 33, y: TOP_Y, width: 37, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'store', name: '창고', x: 71, y: TOP_Y, width: 13, height: ROOM_H, hasDoor: 'bottom' },

                { id: 'E', name: 'E', x: 2, y: BOT_Y, width: 30, height: ROOM_H, hasDoor: 'top' },
                { id: 'rec', name: '응접실', x: 33, y: BOT_Y, width: 18, height: ROOM_H, hasDoor: 'top' },
                { id: 'pantry', name: '탕비실', x: 52, y: BOT_Y, width: 18, height: ROOM_H, hasDoor: 'top' },
                { id: 'wc', name: '화장실', x: 71, y: BOT_Y, width: 13, height: ROOM_H, hasDoor: 'top' },
                { ...ev, id: 'ev13' }
            ];

        case '14F':
            // Staggered custom layout
            // Top: B1(17), B3(17), C2(17), Meet(17), Store(11) -> 2, 20, 38, 56, 74
            // Bot: Store(11), B2(17), C1(17), C3(17), Meet(17) -> 2, 14, 32, 50, 68
            const w_wide = 17;
            const w_store = 11;

            return [
                // Top
                { id: 'B1', name: 'B-1', x: 2, y: TOP_Y, width: w_wide, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'B3', name: 'B-3', x: 2 + w_wide + 1, y: TOP_Y, width: w_wide, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'C2', name: 'C-2', x: 2 + (w_wide + 1) * 2, y: TOP_Y, width: w_wide, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'meet', name: '회의실', x: 2 + (w_wide + 1) * 3, y: TOP_Y, width: w_wide, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'store_top', name: '창고', x: 74, y: TOP_Y, width: w_store, height: ROOM_H, hasDoor: 'bottom' }, // 74 looks right for end

                // Bot
                { id: 'store_bot', name: '창고', x: 2, y: BOT_Y, width: w_store, height: ROOM_H, hasDoor: 'top' },
                { id: 'B2', name: 'B-2', x: 2 + w_store + 1, y: BOT_Y, width: w_wide, height: ROOM_H, hasDoor: 'top' },
                { id: 'C1', name: 'C-1', x: 2 + w_store + 1 + w_wide + 1, y: BOT_Y, width: w_wide, height: ROOM_H, hasDoor: 'top' },
                { id: 'C3', name: 'C-3', x: 2 + w_store + 1 + (w_wide + 1) * 2, y: BOT_Y, width: w_wide, height: ROOM_H, hasDoor: 'top' },
                { id: 'meet_bot', name: '회의실', x: 68, y: BOT_Y, width: 17, height: ROOM_H, hasDoor: 'top' }, // 68 to 85 is 17
                { ...ev, id: 'ev14' }
            ];

        case '15F':
            return [
                { id: 'A1', name: 'A-1', x: 2, y: TOP_Y, width: 34.5, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'store1', name: '창고', x: 37.5, y: TOP_Y, width: 12, height: ROOM_H },
                { id: 'rec', name: '응접실', x: 50.5, y: TOP_Y, width: 34.5, height: ROOM_H, hasDoor: 'bottom' },
                { id: 'A2', name: 'A-2', x: 2, y: BOT_Y, width: 34.5, height: ROOM_H, hasDoor: 'top' },
                { id: 'store2', name: '창고', x: 37.5, y: BOT_Y, width: 12, height: ROOM_H },
                { id: 'A3', name: 'A-3', x: 50.5, y: BOT_Y, width: 34.5, height: ROOM_H, hasDoor: 'top' },
                { ...ev, id: 'ev15' }
            ];

        default:
            return [];
    }
};
