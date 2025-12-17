import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/utils/dateUtils';

interface FloorData {
  id: string;
  name: string;
  category: 'main' | 'annex' | 'basement';
  type: string;
  description: string;
}

interface Room {
  id: string;
  name: string;
  nameEn?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  hasDoor?: 'top' | 'bottom' | 'left' | 'right';
}

interface Marker {
  id: string;
  floorId: string;
  x: number;
  y: number;
  assignee: string;
  target: string;
  status: 'stable' | 'caution' | 'danger' | 'dormant' | 'restricted';
  note?: string;
}

const floors: FloorData[] = [
  { id: '15F', name: '15층', category: 'main', type: 'Office D~', description: 'D팀~ 사무실 (1501~1510호)' },
  { id: '14F', name: '14층', category: 'main', type: 'Office D~', description: 'D팀~ 사무실 + C조 라운지' },
  { id: '13F', name: '13층', category: 'main', type: 'Office D~', description: 'D팀~ 사무실 (1301~1312호)' },
  { id: '12F', name: '12층', category: 'main', type: 'Common/Meeting', description: '공용 공간 + 회의실' },
  { id: '11F', name: '11층', category: 'main', type: 'Team C + Meeting', description: 'C팀 개인 사무실 + 회의실' },
  { id: '10F', name: '10층', category: 'main', type: 'Team A,B', description: 'A, B팀 개인 사무실' },
  { id: 'A5F', name: '별관 5층', category: 'annex', type: 'Isolation', description: '격리실 (501~510호)' },
  { id: 'A4F', name: '별관 4층', category: 'annex', type: 'Isolation', description: '격리실 (401~410호)' },
  { id: 'A3F', name: '별관 3층', category: 'annex', type: 'Isolation', description: '격리실 (301~310호)' },
  { id: 'A2F', name: '별관 2층', category: 'annex', type: 'Isolation', description: '격리실 (201~210호)' },
  { id: 'A1F', name: '별관 1층', category: 'annex', type: 'Lobby + Isolation', description: '안내데스크 + 격리실' },
  { id: 'B1', name: '지하 1층', category: 'basement', type: 'Security', description: '보안팀 상주 층' },
];

// 층별 룸 레이아웃 정의
const getFloorRooms = (floorId: string): Room[] => {
  switch (floorId) {
    // 10층: A, B팀 개인 사무실 (많은 개인실)
    case '10F':
      return [
        { id: '1001', name: 'A팀-1', x: 2, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1002', name: 'A팀-2', x: 14, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1003', name: 'A팀-3', x: 26, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1004', name: 'A팀-4', x: 38, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1005', name: 'B팀-1', x: 50, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1006', name: 'B팀-2', x: 62, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1007', name: 'B팀-3', x: 74, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1008', name: 'A팀-5', x: 2, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1009', name: 'A팀-6', x: 14, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1010', name: 'B팀-4', x: 26, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1011', name: 'B팀-5', x: 38, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1012', name: 'B팀-6', x: 50, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'pantry10', name: '탕비실', nameEn: 'Pantry', x: 62, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'wc10', name: '화장실', nameEn: 'WC', x: 74, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'ev10', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    // 11층: C팀 개인 사무실 + 회의실
    case '11F':
      return [
        { id: '1101', name: 'C팀-1', x: 2, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1102', name: 'C팀-2', x: 14, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1103', name: 'C팀-3', x: 26, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1104', name: 'C팀-4', x: 38, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1105', name: 'C팀-5', x: 50, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: 'meet11a', name: '회의실A', nameEn: 'Meeting A', x: 62, y: 5, width: 23, height: 18, hasDoor: 'bottom' },
        { id: '1106', name: 'C팀-6', x: 2, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1107', name: 'C팀-7', x: 14, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1108', name: 'C팀-8', x: 26, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'meet11b', name: '회의실B', nameEn: 'Meeting B', x: 38, y: 60, width: 23, height: 18, hasDoor: 'top' },
        { id: 'pantry11', name: '탕비실', nameEn: 'Pantry', x: 62, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'wc11', name: '화장실', nameEn: 'WC', x: 74, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'ev11', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    // 12층: 공용 공간 + 회의실
    case '12F':
      return [
        { id: 'lounge', name: '공용 라운지', nameEn: 'Lounge', x: 2, y: 5, width: 40, height: 35, hasDoor: 'right' },
        { id: 'cafe', name: '카페테리아', nameEn: 'Cafeteria', x: 2, y: 45, width: 40, height: 33, hasDoor: 'right' },
        { id: 'meet12a', name: '회의실1', nameEn: 'Meeting 1', x: 45, y: 5, width: 20, height: 18, hasDoor: 'bottom' },
        { id: 'meet12b', name: '회의실2', nameEn: 'Meeting 2', x: 66, y: 5, width: 20, height: 18, hasDoor: 'bottom' },
        { id: 'meet12c', name: '회의실3', nameEn: 'Meeting 3', x: 45, y: 60, width: 20, height: 18, hasDoor: 'top' },
        { id: 'meet12d', name: '회의실4', nameEn: 'Meeting 4', x: 66, y: 60, width: 20, height: 18, hasDoor: 'top' },
        { id: 'ev12', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    // 13-15층: D팀~ 사무실
    case '13F':
      return [
        { id: '1301', name: 'D조-1', x: 2, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1302', name: 'D조-2', x: 14, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1303', name: 'E조-1', x: 26, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1304', name: 'E조-2', x: 38, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1305', name: 'F조-1', x: 50, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1306', name: 'F조-2', x: 62, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1307', name: 'G조', x: 74, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1308', name: 'D조-3', x: 2, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1309', name: 'D조-4', x: 14, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1310', name: 'E조-3', x: 26, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1311', name: 'F조-3', x: 38, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'pantry13', name: '탕비실', nameEn: 'Pantry', x: 50, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'wc13', name: '화장실', nameEn: 'WC', x: 62, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'storage13', name: '창고', nameEn: 'Storage', x: 74, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'ev13', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    case '14F':
      return [
        { id: '1401', name: 'H조-1', x: 2, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1402', name: 'H조-2', x: 14, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1403', name: 'I조-1', x: 26, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1404', name: 'I조-2', x: 38, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: 'clounge', name: 'C조 라운지', nameEn: 'C Lounge', x: 50, y: 5, width: 35, height: 18, hasDoor: 'bottom' },
        { id: '1405', name: 'J조-1', x: 2, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1406', name: 'J조-2', x: 14, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1407', name: 'K조', x: 26, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1408', name: 'L조', x: 38, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'pantry14', name: '탕비실', nameEn: 'Pantry', x: 50, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'wc14', name: '화장실', nameEn: 'WC', x: 62, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'storage14', name: '창고', nameEn: 'Storage', x: 74, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'ev14', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    case '15F':
      return [
        { id: '1501', name: 'M조', x: 2, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1502', name: 'N조', x: 14, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1503', name: 'O조', x: 26, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1504', name: 'P조', x: 38, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1505', name: 'Q조', x: 50, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1506', name: 'R조', x: 62, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1507', name: 'S조', x: 74, y: 5, width: 11, height: 18, hasDoor: 'bottom' },
        { id: '1508', name: 'T조', x: 2, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1509', name: 'U조', x: 14, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: '1510', name: 'V조', x: 26, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'pantry15', name: '탕비실', nameEn: 'Pantry', x: 38, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'wc15', name: '화장실', nameEn: 'WC', x: 50, y: 60, width: 11, height: 18, hasDoor: 'top' },
        { id: 'meet15', name: '회의실', nameEn: 'Meeting', x: 62, y: 60, width: 23, height: 18, hasDoor: 'top' },
        { id: 'ev15', name: 'EV', x: 87, y: 35, width: 10, height: 20 },
      ];
    // 별관 1층: 안내데스크 + 격리실
    case 'A1F':
      return [
        { id: 'desk', name: '안내데스크', nameEn: 'Info Desk', x: 2, y: 5, width: 45, height: 73, hasDoor: 'right' },
        { id: '101', name: '격리실 101', nameEn: 'Isolation', x: 50, y: 5, width: 18, height: 22, hasDoor: 'left' },
        { id: '102', name: '격리실 102', nameEn: 'Isolation', x: 70, y: 5, width: 18, height: 22, hasDoor: 'left' },
        { id: '103', name: '격리실 103', nameEn: 'Isolation', x: 50, y: 30, width: 18, height: 22, hasDoor: 'left' },
        { id: '104', name: '격리실 104', nameEn: 'Isolation', x: 70, y: 30, width: 18, height: 22, hasDoor: 'left' },
        { id: '105', name: '격리실 105', nameEn: 'Isolation', x: 50, y: 56, width: 18, height: 22, hasDoor: 'left' },
        { id: '106', name: '격리실 106', nameEn: 'Isolation', x: 70, y: 56, width: 18, height: 22, hasDoor: 'left' },
        { id: 'evA1', name: 'EV', x: 90, y: 35, width: 8, height: 20 },
      ];
    // 별관 2-5층: 전부 격리실
    case 'A2F':
    case 'A3F':
    case 'A4F':
    case 'A5F':
      const floorNum = floorId.charAt(1);
      return [
        { id: `${floorNum}01`, name: `격리실 ${floorNum}01`, nameEn: 'Isolation', x: 2, y: 5, width: 18, height: 22, hasDoor: 'bottom' },
        { id: `${floorNum}02`, name: `격리실 ${floorNum}02`, nameEn: 'Isolation', x: 22, y: 5, width: 18, height: 22, hasDoor: 'bottom' },
        { id: `${floorNum}03`, name: `격리실 ${floorNum}03`, nameEn: 'Isolation', x: 42, y: 5, width: 18, height: 22, hasDoor: 'bottom' },
        { id: `${floorNum}04`, name: `격리실 ${floorNum}04`, nameEn: 'Isolation', x: 62, y: 5, width: 18, height: 22, hasDoor: 'bottom' },
        { id: `${floorNum}05`, name: `격리실 ${floorNum}05`, nameEn: 'Isolation', x: 82, y: 5, width: 16, height: 22, hasDoor: 'bottom' },
        { id: `${floorNum}06`, name: `격리실 ${floorNum}06`, nameEn: 'Isolation', x: 2, y: 56, width: 18, height: 22, hasDoor: 'top' },
        { id: `${floorNum}07`, name: `격리실 ${floorNum}07`, nameEn: 'Isolation', x: 22, y: 56, width: 18, height: 22, hasDoor: 'top' },
        { id: `${floorNum}08`, name: `격리실 ${floorNum}08`, nameEn: 'Isolation', x: 42, y: 56, width: 18, height: 22, hasDoor: 'top' },
        { id: `${floorNum}09`, name: `격리실 ${floorNum}09`, nameEn: 'Isolation', x: 62, y: 56, width: 18, height: 22, hasDoor: 'top' },
        { id: `${floorNum}10`, name: `격리실 ${floorNum}10`, nameEn: 'Isolation', x: 82, y: 56, width: 16, height: 22, hasDoor: 'top' },
        { id: `evA${floorNum}`, name: 'EV', x: 90, y: 32, width: 8, height: 20 },
      ];
    // 지하 1층: 보안팀
    case 'B1':
      return [
        { id: 'deskB1', name: '안내데스크', nameEn: 'Security Desk', x: 2, y: 5, width: 30, height: 35, hasDoor: 'right' },
        { id: 'secOffice1', name: '보안팀 사무실1', nameEn: 'Security Office', x: 35, y: 5, width: 25, height: 35, hasDoor: 'bottom' },
        { id: 'secOffice2', name: '보안팀 사무실2', nameEn: 'Security Office', x: 62, y: 5, width: 25, height: 35, hasDoor: 'bottom' },
        { id: 'monitor', name: '모니터링실', nameEn: 'Monitoring', x: 2, y: 45, width: 30, height: 33, hasDoor: 'right' },
        { id: 'storage', name: '비품 창고', nameEn: 'Storage', x: 35, y: 45, width: 25, height: 33, hasDoor: 'top' },
        { id: 'armory', name: '장비실', nameEn: 'Armory', x: 62, y: 45, width: 25, height: 33, hasDoor: 'top' },
        { id: 'evB1', name: 'EV', x: 89, y: 35, width: 9, height: 20 },
      ];
    default:
      return [];
  }
};

const FloorMap = () => {
  const navigate = useNavigate();
  const { userName, team, rank } = useUserStore();
  const [selectedFloor, setSelectedFloor] = useState<FloorData>(floors[5]); // 10F default
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const isSoleum = userName === '김솔음';

  const getMarkers = (): Marker[] => {
    const baseMarkers: Marker[] = [
      // Marker 1: 본관 11층 D조 사무실
      {
        id: 'marker-1',
        floorId: '11F',
        x: 8,
        y: 75,
        assignee: '박민성 주임 (D조)',
        target: '안녕 교통정보 (Qterw-E-63)',
        status: 'caution',
        note: '서류 더미에 파묻힘'
      },
      // Marker 4: 본관 14F C조 라운지 앞
      {
        id: 'marker-4',
        floorId: '14F',
        x: 67,
        y: 16,
        assignee: '강■■ 팀장 (C조)',
        target: 'Qterw-S-01 [데이터 말소]',
        status: 'restricted',
        note: '보안 레벨 5 이상'
      },
      // Marker 5: 지하 1F 비품 창고 구석
      {
        id: 'marker-5',
        floorId: 'B1',
        x: 48,
        y: 62,
        assignee: '한■■ 대리 (F조)',
        target: '식별 불가 (The Thing)',
        status: 'dormant'
      },
      // Marker 6: 본관 15F 1504호
      {
        id: 'marker-6',
        floorId: '15F',
        x: 44,
        y: 16,
        assignee: '조■■ 주임 (H조)',
        target: 'Qterw-?-??? (쳐다보지 마시오)',
        status: 'dormant'
      },
    ];

    // Marker 2: 김솔음 전용 (별관 3층 302호)
    if (isSoleum) {
      baseMarkers.push({
        id: 'marker-2',
        floorId: 'A3F',
        x: 30,
        y: 16,
        assignee: '김솔음 주임 (D조)',
        target: '양자택일 (Qterw-F-2073)',
        status: 'stable',
        note: '월 1회 점검 필요 (클릭하여 일정 확인)'
      });
    }

    // Marker 3: 동적 유저 마커 (별관 3F 302호)
    baseMarkers.push({
      id: 'marker-3',
      floorId: 'A3F',
      x: 50,
      y: 16,
      assignee: `${userName} ${rank} (${team})`,
      target: isSoleum ? '양자택일 (Qterw-F-2073)' : '속삭이는 벽 (Qterw-D-104)',
      status: 'stable',
      note: '정기 점검 예정'
    });

    return baseMarkers;
  };

  const markers = getMarkers();
  const currentFloorMarkers = markers.filter(m => m.floorId === selectedFloor.id);
  const currentRooms = getFloorRooms(selectedFloor.id);

  const handleFloorScroll = (direction: 'up' | 'down') => {
    const currentIndex = floors.findIndex(f => f.id === selectedFloor.id);
    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(floors.length - 1, currentIndex + 1);
    setSelectedFloor(floors[newIndex]);
  };

  const getStatusColor = (status: Marker['status']) => {
    switch (status) {
      case 'stable': return 'bg-green-500';
      case 'caution': return 'bg-orange-500';
      case 'danger': return 'bg-red-500';
      case 'dormant': return 'bg-gray-500';
      case 'restricted': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Marker['status']) => {
    switch (status) {
      case 'stable': return '안정';
      case 'caution': return '주의';
      case 'danger': return '위험';
      case 'dormant': return '동면 중';
      case 'restricted': return '접근 금지';
      default: return '알 수 없음';
    }
  };

  const getStatusTextColor = (status: Marker['status']) => {
    switch (status) {
      case 'stable': return 'text-green-500';
      case 'caution': return 'text-orange-500';
      case 'danger': return 'text-red-500';
      case 'dormant': return 'text-gray-500';
      case 'restricted': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getCategoryColor = (category: FloorData['category']) => {
    switch (category) {
      case 'main': return 'border-primary';
      case 'annex': return 'border-yellow-500';
      case 'basement': return 'border-red-500';
      default: return 'border-border';
    }
  };

  const getDoorPosition = (room: Room) => {
    const doorSize = 8;
    switch (room.hasDoor) {
      case 'top':
        return { left: `${room.x + room.width / 2 - 2}%`, top: `${room.y}%`, width: `${doorSize}%`, height: '2px' };
      case 'bottom':
        return { left: `${room.x + room.width / 2 - 2}%`, top: `${room.y + room.height}%`, width: `${doorSize}%`, height: '2px' };
      case 'left':
        return { left: `${room.x}%`, top: `${room.y + room.height / 2 - 3}%`, width: '2px', height: `${doorSize}%` };
      case 'right':
        return { left: `${room.x + room.width}%`, top: `${room.y + room.height / 2 - 3}%`, width: '2px', height: `${doorSize}%` };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Navigation - Vertical Dial */}
      <div className="w-1/5 min-w-[200px] bg-card border-r border-border p-4 flex flex-col">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6 justify-start"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          대시보드
        </Button>

        <h2 className="text-lg font-bold text-foreground mb-4">층 선택</h2>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleFloorScroll('up')}
          className="mb-2"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1">
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => setSelectedFloor(floor)}
                className={`w-full text-left p-3 rounded-lg transition-all border-l-4 ${
                  selectedFloor.id === floor.id 
                    ? `bg-primary/20 ${getCategoryColor(floor.category)}` 
                    : `bg-secondary/30 border-transparent hover:bg-secondary/50`
                }`}
              >
                <div className="text-sm font-medium text-foreground">{floor.name}</div>
                <div className="text-xs text-muted-foreground">{floor.type}</div>
              </button>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleFloorScroll('down')}
          className="mt-2"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Category Legend */}
        <div className="mt-6 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-primary"></div>
            <span className="text-muted-foreground">본관 (10F~15F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-yellow-500"></div>
            <span className="text-muted-foreground">별관 (1F~5F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-red-500"></div>
            <span className="text-muted-foreground">지하 (B1)</span>
          </div>
        </div>
      </div>

      {/* Right Content - Floor Plan Viewer */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{selectedFloor.name}</h1>
          <p className="text-muted-foreground">{selectedFloor.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            마지막 점검: {formatDate(new Date())}
          </p>
        </div>

        {/* Floor Plan */}
        <div className="relative bg-[#0a1628] rounded-xl border-2 border-primary/40 aspect-video overflow-hidden">
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `
              linear-gradient(hsl(200 80% 50% / 0.2) 1px, transparent 1px),
              linear-gradient(90deg, hsl(200 80% 50% / 0.2) 1px, transparent 1px),
              linear-gradient(hsl(200 80% 50% / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(200 80% 50% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
          }} />

          {/* Building Outer Wall */}
          <div className="absolute inset-[3%] border-2 border-primary/60">
            {/* Floor Label */}
            <div className="absolute -top-3 left-4 bg-[#0a1628] px-2 text-xs font-bold text-primary">
              {selectedFloor.id} - {selectedFloor.type}
            </div>

            {/* Main Corridor */}
            <div className="absolute top-[40%] left-0 right-0 h-[15%] bg-primary/5 border-y border-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-primary/50 tracking-[0.3em]">CORRIDOR</span>
              </div>
            </div>

            {/* Dynamic Rooms */}
            {currentRooms.map((room) => (
              <div
                key={room.id}
                className="absolute border border-primary/40 bg-primary/5 flex items-center justify-center"
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                  width: `${room.width}%`,
                  height: `${room.height}%`,
                }}
              >
                <div className="text-center px-1">
                  <p className="text-[9px] text-primary/80 font-medium truncate">{room.name}</p>
                  {room.nameEn && (
                    <p className="text-[7px] text-primary/40">{room.nameEn}</p>
                  )}
                </div>
                {/* Door */}
                {room.hasDoor && (
                  <div 
                    className="absolute bg-yellow-500/80"
                    style={getDoorPosition(room) || undefined}
                  />
                )}
              </div>
            ))}

            {/* Compass */}
            <div className="absolute bottom-2 right-2 w-8 h-8 border border-primary/40 rounded-full flex items-center justify-center bg-[#0a1628]">
              <span className="text-[8px] font-bold text-primary">N</span>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-b-[6px] border-l-transparent border-r-transparent border-b-primary/60"></div>
            </div>

            {/* Scale */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <div className="w-12 h-0.5 bg-primary/50"></div>
              <span className="text-[8px] text-primary/60">10m</span>
            </div>
          </div>

          {/* Markers */}
          {currentFloorMarkers.map((marker) => (
            <Tooltip key={marker.id}>
              <TooltipTrigger asChild>
                <button
                  className={`absolute w-6 h-6 rounded-full ${getStatusColor(marker.status)} 
                    animate-pulse cursor-pointer hover:scale-125 transition-transform
                    flex items-center justify-center shadow-lg border-2 border-white/50 z-10`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredMarker(marker.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => {
                    if (marker.id === 'marker-2') {
                      navigate('/calendar');
                    }
                  }}
                >
                  <span className="text-[10px] font-bold text-white drop-shadow">!</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs bg-card border-border">
                <div className="space-y-2 p-1">
                  <p className="font-semibold text-foreground">담당자: {marker.assignee}</p>
                  <p className="text-sm text-muted-foreground">관리 대상: {marker.target}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(marker.status)}`}></span>
                    <span className={`text-xs font-medium ${getStatusTextColor(marker.status)}`}>
                      {getStatusText(marker.status)}
                    </span>
                  </div>
                  {marker.note && (
                    <p className="text-xs text-muted-foreground italic">{marker.note}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Status Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {(['stable', 'caution', 'danger', 'dormant', 'restricted'] as const).map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
              <span className={getStatusTextColor(status)}>{getStatusText(status)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorMap;