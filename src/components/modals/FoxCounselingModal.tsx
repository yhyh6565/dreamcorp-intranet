import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface FoxCounselingModalProps {
  open: boolean;
  onClose: () => void;
}

const FoxCounselingModal = ({ open, onClose }: FoxCounselingModalProps) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // 시간 슬롯 (3시간 단위)
  const timeSlots = [
    { label: '09:00 - 12:00', start: 9 },
    { label: '12:00 - 15:00', start: 12 },
    { label: '15:00 - 18:00', start: 15 },
    { label: '18:00 - 21:00', start: 18 },
  ];

  // 임의의 예약 현황 (랜덤하게 일부 슬롯이 차있음)
  const getOccupiedSlots = () => {
    const occupied: Record<string, boolean> = {};
    for (let i = 0; i < 7; i++) {
      const day = format(addDays(weekStart, i), 'yyyy-MM-dd');
      timeSlots.forEach((slot, idx) => {
        // 랜덤하게 30% 확률로 예약됨
        const seed = day.charCodeAt(8) + idx;
        if (seed % 3 === 0) {
          occupied[`${day}-${slot.start}`] = true;
        }
      });
    }
    return occupied;
  };

  const occupiedSlots = getOccupiedSlots();

  const handlePrevWeek = () => setWeekStart(addDays(weekStart, -7));
  const handleNextWeek = () => setWeekStart(addDays(weekStart, 7));

  const handleSubmit = () => {
    if (!selectedSlot) {
      toast({ title: '상담 시간을 선택해주세요.', variant: 'destructive' });
      return;
    }
    toast({ title: '여우상담실 예약이 완료되었습니다.' });
    onClose();
    setSelectedSlot(null);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>여우상담실 예약</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* 주간 네비게이션 */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">
              {format(weekStart, 'yyyy년 M월 d일', { locale: ko })} - {format(addDays(weekStart, 6), 'M월 d일', { locale: ko })}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* 캘린더 그리드 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted text-muted-foreground text-sm w-24">시간</th>
                  {weekDays.map((day) => (
                    <th key={day.toISOString()} className="border border-border p-2 bg-muted text-center">
                      <div className="text-xs text-muted-foreground">{format(day, 'EEE', { locale: ko })}</div>
                      <div className="text-sm font-medium text-foreground">{format(day, 'd')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.start}>
                    <td className="border border-border p-2 text-xs text-muted-foreground text-center">
                      {slot.label}
                    </td>
                    {weekDays.map((day) => {
                      const slotKey = `${format(day, 'yyyy-MM-dd')}-${slot.start}`;
                      const isOccupied = occupiedSlots[slotKey];
                      const isSelected = selectedSlot === slotKey;
                      const isPast = day < new Date() && slot.start < new Date().getHours();

                      return (
                        <td
                          key={slotKey}
                          className={`border border-border p-2 text-center cursor-pointer transition-colors ${
                            isOccupied || isPast
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-secondary'
                          }`}
                          onClick={() => {
                            if (!isOccupied && !isPast) {
                              setSelectedSlot(slotKey);
                            }
                          }}
                        >
                          {isOccupied ? '예약됨' : isPast ? '-' : '가능'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-foreground">선택됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted border border-border rounded" />
              <span className="text-foreground">예약됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-background border border-border rounded" />
              <span className="text-foreground">가능</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSubmit}>예약</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FoxCounselingModal;
