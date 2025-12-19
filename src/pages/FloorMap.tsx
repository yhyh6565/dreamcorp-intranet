import { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { ChevronUp, ChevronDown, Map as MapIcon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import Layout from '@/components/Layout';
import { floors, getFloorRooms, FloorData } from '@/data/floorData';
import { Marker } from '@/data/markerData';
import { cn } from '@/lib/utils';
import FloorRoom from '@/components/floor-map/FloorRoom';
import FloorMarker from '@/components/floor-map/FloorMarker';
import { useShadowStore } from '@/store/shadowStore';

// Helper for mapping grades
const mapGradeToStatus = (grade: string): Marker['status'] => {
  switch (grade) {
    case 'A': return 'stable';
    case 'B': return 'stable';
    case 'C': return 'caution';
    case 'D': return 'danger';
    case 'E': return 'danger';
    case 'F': return 'restricted';
    default: return 'dormant';
  }
};

const FloorMap = () => {
  const { userName } = useUserStore();
  const { shadows } = useShadowStore();

  const [selectedFloor, setSelectedFloor] = useState<FloorData>(floors[5]); // 10F default
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Helper to parse floor ID
  const getFloorNumber = (floorId: string): number => {
    if (floorId.startsWith('B')) return -parseInt(floorId.replace('B', ''));
    return parseInt(floorId.replace('F', ''));
  };

  const currentFloorNum = getFloorNumber(selectedFloor.id);

  const currentFloorMarkers = shadows
    .filter(s => s.floor === currentFloorNum && s.isAssigned)
    .map(s => ({
      id: s.code,
      floorId: selectedFloor.id,
      x: s.coordinates.x,
      y: s.coordinates.y,
      status: mapGradeToStatus(s.grade),
      assignee: s.assigneeName,
      team: s.assigneeTeam,
      type: 'person',
      target: s.name,
      note: s.note,
      location: s.locationText,
    } as Marker));

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
      case 'stable': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'caution': return 'bg-amber-500 shadow-amber-500/50';
      case 'danger': return 'bg-rose-500 shadow-rose-500/50';
      case 'dormant': return 'bg-slate-500 shadow-slate-500/50';
      case 'restricted': return 'bg-red-600 shadow-red-600/50';
      default: return 'bg-slate-500 shadow-slate-500/50';
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


  return (
    <Layout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">

        {/* Left Navigation - Floor Selector */}
        <div className={cn(
          "flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
          isSidebarOpen ? "w-full md:w-64 opacity-100" : "w-0 opacity-0"
        )}>
          <Card className="w-full h-full border-none shadow-lg flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapIcon className="h-5 w-5" />
                시설 안내도
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                백일몽 주식회사 시설 현황
              </CardDescription>
            </CardHeader>
            <div className="p-2 border-b border-border bg-slate-50 flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={() => handleFloorScroll('up')} disabled={floors.findIndex(f => f.id === selectedFloor.id) === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <span className="text-xs font-semibold text-muted-foreground">층 선택</span>
              <Button variant="ghost" size="sm" onClick={() => handleFloorScroll('down')} disabled={floors.findIndex(f => f.id === selectedFloor.id) === floors.length - 1}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-2 bg-slate-50 space-y-1">
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor)}
                  className={cn(
                    "w-full text-left p-3 rounded-md transition-all border-l-4 text-sm relative overflow-hidden group",
                    selectedFloor.id === floor.id
                      ? "bg-white shadow-sm border-primary"
                      : "border-transparent hover:bg-slate-200/50"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn("font-bold", selectedFloor.id === floor.id ? "text-primary" : "text-slate-700")}>
                      {floor.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-5 px-1 bg-transparent border-slate-300">
                      {floor.id}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate pr-4">{floor.type}</div>

                  {/* Category Indicator Dot */}
                  <div className={cn(
                    "absolute top-2 right-2 w-1.5 h-1.5 rounded-full",
                    floor.category === 'main' ? "bg-blue-400" :
                      floor.category === 'annex' ? "bg-amber-400" : "bg-red-400"
                  )} />
                </button>
              ))}
            </CardContent>
            <div className="p-4 bg-white border-t border-border text-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div> <span className="text-slate-500">본관 (Main)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Content - Floor Plan Viewer */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 border-none shadow-lg flex flex-col overflow-hidden bg-slate-900 group">

            {/* Map Header */}
            <div className="p-6 bg-slate-900 border-b border-slate-800 z-10 shrink-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "사이드바 접기" : "사이드바 펼치기"}
                  >
                    {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                  </Button>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      {selectedFloor.name}
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700">
                        {selectedFloor.type}
                      </Badge>
                    </h2>
                    <p className="text-slate-400 mt-1">{selectedFloor.description}</p>
                  </div>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Last Update</p>
                  <p className="text-sm font-mono text-emerald-500">{formatDate(new Date())}</p>
                </div>
              </div>
            </div>

            {/* Map Interaction Area */}
            <div className="flex-1 relative overflow-auto flex items-center justify-center bg-[#0f172a] select-none p-4 md:p-12 touch-pan-x touch-pan-y">

              {/* Blueprint Grid */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `
                    linear-gradient(hsl(215 100% 50% / 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(215 100% 50% / 0.1) 1px, transparent 1px)
                  `,
                backgroundSize: '40px 40px',
                minHeight: '100%',
                minWidth: '100%'
              }}></div>

              {/* The Map Container */}
              <div className="relative w-full aspect-video border-2 border-slate-700/50 bg-slate-900/50 shadow-2xl rounded-sm" style={{ containerType: 'inline-size' }}>

                {/* Outer Wall */}
                <div className="absolute inset-[2%] border border-slate-600">

                  {/* Corridor (Visual) */}
                  {selectedFloor.id !== '1F' && selectedFloor.id !== 'A1F' && (
                    <div className="absolute top-[40%] left-0 right-0 h-[15%] bg-slate-800/30 border-y border-slate-800/50" />
                  )}

                  {/* Rooms */}
                  {currentRooms.map((room) => (
                    <FloorRoom key={room.id} room={room} />
                  ))}

                  {/* Markers */}
                  {currentFloorMarkers.map((marker) => (
                    <FloorMarker
                      key={marker.id}
                      marker={marker}
                      onMouseEnter={setHoveredMarker}
                      onMouseLeave={() => setHoveredMarker(null)}
                    />
                  ))}

                  {/* Active Tooltip Overlay */}
                  {hoveredMarker && (() => {
                    const activeMarker = currentFloorMarkers.find(m => m.id === hoveredMarker);
                    if (!activeMarker) return null;

                    const isTop = activeMarker.y < 40; // Increased threshold to safe zone
                    const statusColor = getStatusColor(activeMarker.status);

                    return (
                      <div
                        className="absolute z-50 pointer-events-none"
                        style={{
                          left: `${activeMarker.x}%`,
                          top: `${activeMarker.y}%`,
                          // Use transform to center horizontally and offset vertically
                          // Since we position at the marker center, we need to move out
                        }}
                      >
                        <div className={cn(
                          "absolute left-1/2 -translate-x-1/2 w-max",
                          isTop ? "top-[1.5cqw] pt-2" : "bottom-[1.5cqw] pb-2"
                        )}>
                          <div className="bg-slate-900 border border-slate-700 text-slate-200 p-3 rounded shadow-xl flex flex-col items-center relative animate-fade-in-up">
                            <div className="space-y-1 text-center">
                              <p className="font-bold text-white text-sm whitespace-nowrap">
                                {activeMarker.assignee}
                                {activeMarker.team && <span className="font-normal text-slate-300 ml-1">({activeMarker.team})</span>}
                              </p>
                              <p className="text-xs text-slate-400 whitespace-nowrap">Target: {activeMarker.target}</p>
                              {activeMarker.location && <p className="text-[10px] text-slate-500">{activeMarker.location}</p>}
                              <div className="flex flex-col gap-1 items-center mt-2">
                                <Badge variant="outline" className={cn("text-[10px] border-none px-1.5", statusColor.split(' ')[0], "text-white")}>
                                  {getStatusText(activeMarker.status)}
                                </Badge>
                                {activeMarker.note && (
                                  <span className="text-[10px] text-amber-400 italic max-w-[150px] whitespace-normal break-words leading-tight">
                                    "{activeMarker.note}"
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Arrow - Smart Position */}
                            <div className={cn(
                              "absolute w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-slate-700 left-1/2 -translate-x-1/2",
                              isTop
                                ? "-top-[6px] border-b-[6px] border-t-0" // Point Up (triangle points up, sitting on top of box)
                                : "-bottom-[6px] border-t-[6px] border-b-0" // Point Down
                            )} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Compass */}
              <div className="absolute bottom-8 right-8 pointer-events-none opacity-50 z-10">
                <div className="w-12 h-12 border-2 border-slate-600 rounded-full flex items-center justify-center relative bg-slate-900/80">
                  <div className="absolute -top-1 font-bold text-xs text-blue-500">N</div>
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[12px] border-l-transparent border-r-transparent border-b-red-500 -translate-y-1" />
                  <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[12px] border-l-transparent border-r-transparent border-t-slate-500 translate-y-1 absolute" />
                </div>
              </div>
            </div>

            {/* Legend Footer */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 flex flex-wrap gap-4 text-xs justify-center md:justify-start">
              {['stable', 'caution', 'danger', 'dormant', 'restricted'].map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", getStatusColor(status as any).split(' ')[0])} />
                  <span className="text-slate-400 capitalize">{getStatusText(status as any)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FloorMap;