import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface AnnexVisitModalProps {
  open: boolean;
  onClose: () => void;
}

const AnnexVisitModal = ({ open, onClose }: AnnexVisitModalProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!date || !time || !reason) {
      toast({ title: '모든 항목을 입력해주세요.', variant: 'destructive' });
      return;
    }
    toast({ title: '별관 방문 신청이 완료되었습니다.' });
    onClose();
    setDate('');
    setTime('');
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>별관 방문 신청</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="visit-date">방문 일자</Label>
            <Input
              id="visit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit-time">방문 시간</Label>
            <Input
              id="visit-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visit-reason">방문 사유</Label>
            <Textarea
              id="visit-reason"
              placeholder="방문 사유를 입력하세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-row gap-2 sm:justify-end w-full">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">취소</Button>
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none">신청</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnnexVisitModal;
