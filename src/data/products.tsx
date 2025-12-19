
export interface Product {
    id: number;
    category: '약품' | '장비' | '서비스';
    name: string;
    price: number;
    image: string;
    tag: string | null;
    description: string;
    stock: number;
    isRestricted?: boolean;
}

export const products: Product[] = [
    // 약품 (Medicine)
    {
        id: 1,
        category: '약품',
        name: '탈모약',
        price: 100,
        image: '/products/hair-growth.png',
        tag: 'BEST',
        description: '한 번만 발라도 모근이 되살아나는 기적의 발모제',
        stock: 5
    },
    {
        id: 3,
        category: '약품',
        name: '미공개 시약',
        price: 1000,
        image: '/products/secret-reagent.png',
        tag: 'NEW',
        description: '임직원만 구매 가능한 미공개 시약 (주의 : 시약의 효능은 사용자의 특성에 따라 다릅니다.)',
        stock: 2,
        isRestricted: true
    },
    {
        id: 4,
        category: '약품',
        name: '독(사막방울뱀)',
        price: 170000,
        image: '/products/snake-venom.png',
        tag: null,
        description: '치명적인 독성을 가진 사막방울뱀의 독',
        stock: 10,
        isRestricted: true
    },
    {
        id: 5,
        category: '약품',
        name: '소원권',
        price: 500000,
        image: '/products/wish-ticket.png',
        tag: null,
        description: '정확한 방식을 사용한다면 복용자의 소원을 들어주는 약물',
        stock: 0 // ? in screenshot, assuming 0 or hidden? Or 1? I'll set 0 to show sold out logic if implemented, or 1. Screenshot had "?". I'll put 1.
    },
    {
        id: 6,
        category: '약품',
        name: '재생 물약(C)',
        price: 10000,
        image: '/products/regen-potion-c.png',
        tag: null,
        description: '모든 외상적 결손을 재생',
        stock: 78
    },
    {
        id: 7,
        category: '약품',
        name: '재생 물약(D)',
        price: 5000,
        image: '/products/regen-potion-d.png',
        tag: null,
        description: '일부 외상적 결손을 재생',
        stock: 26
    },

    // 장비 (Equipment)
    {
        id: 2,
        category: '장비',
        name: '최고급 대형 가전',
        price: 500,
        image: '/products/premium-appliance.png',
        tag: null,
        description: '세탁기, 냉장고 등 대형 가전이 랜덤 포함',
        stock: 97
    },
    {
        id: 8,
        category: '장비',
        name: '소음 차단 헤드셋',
        price: 1000,
        image: '/products/noise-headset.png',
        tag: null,
        description: "산업용 소음뿐만 아니라 비가청 주파수의 '속삭임'을 효과적으로 차단",
        stock: 109
    },
    {
        id: 9,
        category: '장비',
        name: '고광량 전술 라이트',
        price: 200,
        image: '/products/tactical-light.png',
        tag: null,
        description: '육안으로 보이지 않는 혈흔이나 어둠의 잔재를 식별할 수 있는 자외선 모드 지원',
        stock: 214
    },
    {
        id: 10,
        category: '장비',
        name: '특수 격리용 알루미늄 케이스',
        price: 2000,
        image: '/products/aluminum-case.png',
        tag: 'BEST',
        description: 'D등급 이하의 오염물이나 아티팩트를 안전하게 운반 가능 (주의: 살아있는 생물체를 넣고 잠그지 마십시오.)',
        stock: 37
    },
    {
        id: 11,
        category: '장비',
        name: '비상용 신호탄 세트',
        price: 600,
        image: '/products/flare-set.png',
        tag: null,
        description: '통신이 두절된 \'균열\' 내부나 격리 구역에서 외부로 신호를 보낼 때 사용. 적색은 "구조 요청", 녹색은 "진입 금지(전원 사망)"을 의미',
        stock: 9
    },

    // 서비스 (Service)
    {
        id: 12,
        category: '서비스',
        name: '구내 식당 프리미엄 식권',
        price: 200,
        image: '/products/meal-ticket.png',
        tag: null,
        description: '줄 서지 않고 바로 입장 가능한 프리미엄 식권',
        stock: 75
    }
];
