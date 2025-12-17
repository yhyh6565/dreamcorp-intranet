
import hairTonic from '@/assets/products/hair-tonic.png';
import mysteryBox from '@/assets/products/mystery-box.png';
import secretReagent from '@/assets/products/secret-reagent.png';
import regenPotion from '@/assets/products/regen-potion.png';
import snakeVenom from '@/assets/products/snake-venom.png';
import wishTicket from '@/assets/products/wish-ticket.png';

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    tag: string | null;
}

export const products: Product[] = [
    { id: 1, name: '[특가] 기적의 발모제', price: 100, image: hairTonic, tag: '특가' },
    { id: 2, name: '최고급 대형 가전 랜덤박스', price: 500, image: mysteryBox, tag: null },
    { id: 3, name: '백일몽 주식회사 미공개 시약', price: 1000, image: secretReagent, tag: null },
    { id: 4, name: '상급 재생 물약', price: 10000, image: regenPotion, tag: null },
    { id: 5, name: '[맹독] 사막방울뱀 독', price: 170000, image: snakeVenom, tag: '맹독' },
    { id: 6, name: '[전설] 소원권', price: 500000, image: wishTicket, tag: '전설' },
];
