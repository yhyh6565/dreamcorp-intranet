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
  { id: '15F', name: '15층', category: 'main', type: 'Elite Type', description: '정예팀 A조 - 프라이빗 오피스' },
  { id: '14F', name: '14층', category: 'main', type: 'Elite Type', description: '정예팀 B조 - 고급 라운지' },
  { id: '13F', name: '13층', category: 'main', type: 'Elite Type', description: '정예팀 C조 - 개별 룸' },
  { id: '12F', name: '12층', category: 'main', type: 'General Type', description: '일반팀 D~G조' },
  { id: '11F', name: '11층', category: 'main', type: 'General Type', description: '일반팀 H~K조 (D조 사무실 포함)' },
  { id: '10F', name: '10층', category: 'main', type: 'General Type', description: '마무리팀 X~Z조' },
  { id: '5F', name: '별관 5층', category: 'annex', type: 'Research', description: '연구 구역 A' },
  { id: '4F', name: '별관 4층', category: 'annex', type: 'Research', description: '연구 구역 B' },
  { id: '3F', name: '별관 3층', category: 'annex', type: 'Isolation', description: '격리 구역' },
  { id: '2F', name: '별관 2층', category: 'annex', type: 'Storage', description: '자료 보관실' },
  { id: '1F', name: '별관 1층', category: 'annex', type: 'Lobby', description: '별관 로비' },
  { id: 'B1', name: '지하 1층', category: 'basement', type: 'Storage', description: '비품/장비실' },
];

const FloorMap = () => {
  const navigate = useNavigate();
  const { userName, team, rank } = useUserStore();
  const [selectedFloor, setSelectedFloor] = useState<FloorData>(floors[4]); // 11F default
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const isSoleum = userName === '김솔음';

  const getMarkers = (): Marker[] => {
    const baseMarkers: Marker[] = [
      {
        id: 'marker-1',
        floorId: '11F',
        x: 65,
        y: 45,
        assignee: '박민성 주임 (D조)',
        target: '안녕 교통정보 (Qterw-E-63)',
        status: 'caution',
        note: '서류 더미에 파묻힘'
      },
      {
        id: 'marker-4',
        floorId: '14F',
        x: 50,
        y: 30,
        assignee: '강■■ 팀장 (C조)',
        target: 'Qterw-S-01 [데이터 말소]',
        status: 'restricted',
        note: '보안 레벨 5 이상'
      },
      {
        id: 'marker-5',
        floorId: 'B1',
        x: 25,
        y: 70,
        assignee: '한■■ 대리 (F조)',
        target: '식별 불가 (The Thing)',
        status: 'dormant'
      },
      {
        id: 'marker-6',
        floorId: '15F',
        x: 75,
        y: 35,
        assignee: '조■■ 주임 (H조)',
        target: 'Qterw-?-??? (쳐다보지 마시오)',
        status: 'dormant'
      },
    ];

    // 김솔음 전용 마커
    if (isSoleum) {
      baseMarkers.push({
        id: 'marker-2',
        floorId: '3F',
        x: 40,
        y: 55,
        assignee: '김솔음 주임 (D조)',
        target: '양자택일 (Qterw-F-2073)',
        status: 'stable',
        note: '월 1회 점검 필요 (클릭하여 일정 확인)'
      });
    }

    // 동적 유저 마커
    baseMarkers.push({
      id: 'marker-3',
      floorId: '3F',
      x: 60,
      y: 55,
      assignee: `${userName} ${rank} (${team})`,
      target: isSoleum ? '양자택일 (Qterw-F-2073)' : '속삭이는 벽 (Qterw-D-104)',
      status: 'stable',
      note: '정기 점검 예정'
    });

    return baseMarkers;
  };

  const markers = getMarkers();
  const currentFloorMarkers = markers.filter(m => m.floorId === selectedFloor.id);

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
      case 'caution': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      case 'dormant': return 'bg-blue-500';
      case 'restricted': return 'bg-purple-500';
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

  const getCategoryColor = (category: FloorData['category']) => {
    switch (category) {
      case 'main': return 'border-primary';
      case 'annex': return 'border-yellow-500';
      case 'basement': return 'border-red-500';
      default: return 'border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Navigation - Vertical Dial (20%) */}
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

        <div className="flex-1 overflow-hidden relative">
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
            <span className="text-muted-foreground">본관 (15F~10F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-yellow-500"></div>
            <span className="text-muted-foreground">별관 (5F~1F)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-l-4 border-red-500"></div>
            <span className="text-muted-foreground">지하 (B1)</span>
          </div>
        </div>
      </div>

      {/* Right Content - Floor Plan Viewer (80%) */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{selectedFloor.name}</h1>
          <p className="text-muted-foreground">{selectedFloor.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            마지막 점검: {formatDate(new Date())}
          </p>
        </div>

        {/* Floor Plan */}
        <div className="relative bg-secondary/20 rounded-xl border border-border aspect-video overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Floor Layout Mockup */}
          <div className="absolute inset-8 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-muted-foreground/30 font-horror">{selectedFloor.id}</p>
              <p className="text-sm text-muted-foreground mt-2">{selectedFloor.type}</p>
            </div>
          </div>

          {/* Markers */}
          {currentFloorMarkers.map((marker) => (
            <Tooltip key={marker.id}>
              <TooltipTrigger asChild>
                <button
                  className={`absolute w-6 h-6 rounded-full ${getStatusColor(marker.status)} 
                    animate-pulse cursor-pointer hover:scale-125 transition-transform
                    flex items-center justify-center`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredMarker(marker.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => {
                    if (marker.id === 'marker-2') {
                      navigate('/calendar');
                    }
                  }}
                >
                  <span className="text-xs font-bold text-white">!</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{marker.assignee}</p>
                  <p className="text-sm text-muted-foreground">관리 대상: {marker.target}</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(marker.status)}`}></span>
                    <span className="text-xs">{getStatusText(marker.status)}</span>
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
          {['stable', 'caution', 'danger', 'dormant', 'restricted'].map((status) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(status as Marker['status'])}`}></span>
              <span className="text-muted-foreground">{getStatusText(status as Marker['status'])}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorMap;
