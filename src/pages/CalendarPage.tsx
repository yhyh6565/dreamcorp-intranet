import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate, isWeekend, isToday, isHoliday, getLastFridayOfMonth, getRandomAnomaly, getRelativeDate } from '@/utils/dateUtils';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'mission' | 'company' | 'personal' | 'special';
  time?: string;
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const { userName } = useUserStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const isSoleum = userName === '김솔음';

  // Generate calendar events dynamically
  const events = useMemo(() => {
    const today = new Date();
    const generatedEvents: CalendarEvent[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 1일 - 월례 조회
    generatedEvents.push({
      id: `monthly-${year}-${month}`,
      date: new Date(year, month, 1),
      title: '[사내] 월례 조회',
      type: 'company',
      time: '09:00'
    });

    // 25일 - 급여일
    generatedEvents.push({
      id: `payday-${year}-${month}`,
      date: new Date(year, month, 25),
      title: '[경리] 급여 지급일',
      type: 'company'
    });

    // 내일 - 격리 실패 대응 미션 (랜덤 괴담)
    const tomorrow = getRelativeDate(1);
    if (tomorrow.getMonth() === month && tomorrow.getFullYear() === year) {
      const randomAnomaly = getRandomAnomaly();
      generatedEvents.push({
        id: `mission-tomorrow`,
        date: tomorrow,
        title: `[현장] 격리 실패 대응 - ${randomAnomaly.name}`,
        type: 'mission',
        time: '오전'
      });
    }

    // 오늘 기준 정기 순찰 (3일 후)
    const patrolDate = getRelativeDate(3);
    if (patrolDate.getMonth() === month && patrolDate.getFullYear() === year) {
      generatedEvents.push({
        id: `patrol-${year}-${month}`,
        date: patrolDate,
        title: '[현장] 4구역 정기 순찰',
        type: 'mission',
        time: '14:00'
      });
    }

    // 김솔음 전용 - 마지막 주 금요일 23:00
    if (isSoleum) {
      const lastFriday = getLastFridayOfMonth(currentDate);
      if (lastFriday.getMonth() === month) {
        generatedEvents.push({
          id: `soleum-special-${year}-${month}`,
          date: lastFriday,
          title: '[정기] 양자택일(Qterw-F-2073) 심야 점검',
          type: 'special',
          time: '23:00'
        });
      }
    }

    return generatedEvents;
  }, [currentDate, isSoleum]);

  // Generate calendar grid
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const grid: (Date | null)[] = [];
    
    // Empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      grid.push(null);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }

    return grid;
  }, [currentDate]);

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(e => 
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  const getEventBadgeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'mission': return 'bg-destructive text-destructive-foreground';
      case 'company': return 'bg-primary text-primary-foreground';
      case 'personal': return 'bg-secondary text-secondary-foreground';
      case 'special': return 'bg-purple-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드
          </Button>
          <h1 className="text-2xl font-bold text-foreground">근무 일정</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          오늘: {formatDate(new Date(), 'korean')}
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Week Headers */}
        <div className="grid grid-cols-7 bg-secondary/50">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div 
              key={day} 
              className={`p-3 text-center font-semibold ${
                i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-foreground'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarGrid.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const weekend = date ? isWeekend(date) : false;
            const today = date ? isToday(date) : false;
            const holiday = date ? isHoliday(date) : false;

            return (
              <div 
                key={index}
                className={`min-h-[120px] p-2 border-t border-r border-border last:border-r-0 
                  ${!date ? 'bg-secondary/20' : ''}
                  ${today ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}
                  ${weekend && !today ? 'bg-secondary/30' : ''}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      holiday || date.getDay() === 0 ? 'text-red-500' : 
                      date.getDay() === 6 ? 'text-blue-500' : 
                      weekend ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {date.getDate()}
                      {today && <span className="ml-1 text-xs text-primary">(오늘)</span>}
                      {weekend && <span className="ml-1 text-xs text-muted-foreground">휴무</span>}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 
                            ${getEventBadgeColor(event.type)}`}
                          title={event.title}
                        >
                          {event.time && <span className="font-semibold">{event.time} </span>}
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary">사내</Badge>
          <span className="text-sm text-muted-foreground">회사 행사</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-destructive">현장</Badge>
          <span className="text-sm text-muted-foreground">현장 임무</span>
        </div>
        {isSoleum && (
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600">정기</Badge>
            <span className="text-sm text-muted-foreground">특수 점검</span>
          </div>
        )}
      </div>

      {/* Special Notice for Soleum */}
      {isSoleum && (
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-400 font-horror">
            ※ 양자택일(Qterw-F-2073) 심야 점검 시 반드시 혼자 들어갈 것.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
