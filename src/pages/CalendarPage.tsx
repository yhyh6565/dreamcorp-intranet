import { useState, useMemo } from 'react';
import { useUserStore } from '@/store/userStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatDate, isWeekend, isHoliday, isToday, getLastFridayOfMonth, getRandomAnomaly, getRelativeDate } from '@/utils/dateUtils';
import { generateSchedule } from '@/utils/scheduleUtils';
import { useShadowStore } from '@/store/shadowStore';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'mission' | 'company' | 'personal' | 'special';
  time?: string;
}

const CalendarPage = () => {
  const { userName } = useUserStore();
  const { shadows } = useShadowStore();
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

    // 내일 - 격리 실패 대응 미션 (랜덤 괴담) - 주말/휴일 제외
    let tomorrow = getRelativeDate(1);
    while (isWeekend(tomorrow) || isHoliday(tomorrow)) {
      tomorrow = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
    }

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

    // 오늘 기준 정기 순찰 (3일 후) - 주말/휴일 제외
    let patrolDate = getRelativeDate(3);
    while (isWeekend(patrolDate) || isHoliday(patrolDate)) {
      patrolDate = new Date(patrolDate.setDate(patrolDate.getDate() + 1));
    }
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

    // Assigned Shadow Schedules
    const myShadows = shadows.filter(s => s.assigneeName === userName);
    myShadows.forEach(shadow => {
      const schedule = generateSchedule(shadow);
      schedule.forEach(item => {
        // Only add 'upcoming' or 'future' events to the calendar (not completed ones)
        if (item.status !== 'completed' && item.date.getMonth() === month && item.date.getFullYear() === year) {
          generatedEvents.push({
            id: `shadow-${shadow.code}-${item.id}`,
            date: item.date,
            title: `[담당] ${shadow.name} - ${item.title}`,
            type: 'mission',
            time: item.timeStr.replace(' 예정', '')
          });
        }
      });
    });

    // Sort events by time
    // Helper to convert time string to comparable number (minutes)
    const getTimeValue = (timeStr?: string) => {
      if (!timeStr) return 9999; // No time -> Last
      if (timeStr.includes('오전')) return 540; // '오전' -> 09:00 (540 min)
      if (timeStr.includes('오후')) return 840; // '오후' -> 14:00 (840 min)
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
      return 9999;
    };

    return generatedEvents.sort((a, b) => getTimeValue(a.time) - getTimeValue(b.time));
  }, [currentDate, isSoleum, shadows, userName]);

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

  const getEventBadgeVariant = (type: CalendarEvent['type']): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'mission': return 'destructive';
      case 'company': return 'default';
      case 'personal': return 'secondary';
      case 'special': return 'default'; // Custom color handled via class
      default: return 'outline';
    }
  };

  const getEventBadgeClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'special': return 'bg-purple-600 hover:bg-purple-700 text-white';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-8 h-8 text-primary" />
              근무 일정표
            </h1>
            <p className="text-slate-500 mt-1">
              백일몽 주식회사 정기 일정 및 특수 임무 현황
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              {formatDate(new Date(), 'korean')}
            </span>
          </div>
        </div>

        {/* Calendar Card */}
        <Card className="shadow-lg border-none ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold font-mono">
                {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, '0')}
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Week Headers */}
            <div className="grid grid-cols-7 border-b bg-slate-50/50">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                <div
                  key={day}
                  className={cn(
                    "p-3 text-center text-sm font-semibold",
                    i === 0 ? "text-rose-500" : i === 6 ? "text-blue-500" : "text-slate-700"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px border-b">
              {calendarGrid.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const weekend = date ? isWeekend(date) : false;
                const today = date ? isToday(date) : false;
                const holiday = date ? isHoliday(date) : false;

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[140px] p-2 bg-white relative group transition-colors hover:bg-slate-50",
                      !date && "bg-slate-50/50 pointer-events-none",
                      today && "bg-blue-50/30"
                    )}
                  >
                    {date && (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn(
                            "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
                            today ? "bg-blue-600 text-white" :
                              holiday || date.getDay() === 0 ? "text-rose-500" :
                                date.getDay() === 6 ? "text-blue-500" : "text-slate-700"
                          )}>
                            {date.getDate()}
                          </span>
                          {holiday && <span className="text-[10px] text-rose-500 font-medium px-1">휴일</span>}
                        </div>

                        <div className="space-y-1.5">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="group/event"
                            >
                              <Badge
                                variant={getEventBadgeVariant(event.type)}
                                className={cn(
                                  "w-full justify-start font-normal text-[10px] px-1.5 py-0.5 h-auto truncate cursor-pointer hover:shadow-md transition-all",
                                  getEventBadgeClass(event.type)
                                )}
                              >
                                {event.time && <span className="font-mono text-[9px] mr-1 opacity-75">{event.time}</span>}
                                {event.title}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend & Footer */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg border shadow-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">사내</Badge>
              <span className="text-xs text-slate-500">전사 일정</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">현장</Badge>
              <span className="text-xs text-slate-500">현장 임무</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">정기</Badge>
              <span className="text-xs text-slate-500">특수 점검</span>
            </div>
          </div>

          {/* Special Notice for Soleum */}
          {isSoleum && (
            <div className="flex-1 w-full md:w-auto p-4 bg-slate-900 text-slate-300 rounded-lg border border-slate-800 shadow-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  보안 경고: 양자택일(Qterw-F-2073)
                  <Badge variant="outline" className="text-[10px] border-purple-500 text-purple-400">CLASS IV</Badge>
                </p>
                <p className="text-xs font-mono text-slate-400">
                  심야 점검 시 반드시 단독 진입할 것. 2인 이상 진입 시 인지 필터 오작동 위험 있음.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default CalendarPage;
