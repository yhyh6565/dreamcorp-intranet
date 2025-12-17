import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StorageRentalModalProps {
  open: boolean;
  onClose: () => void;
}

const StorageRentalModal = ({ open, onClose }: StorageRentalModalProps) => {
  const [storageNumber, setStorageNumber] = useState('');
  const [items, setItems] = useState('');
  const [reason, setReason] = useState('');

  // 창고 목록 (일부는 이미 사용 중)
  const storages = [
    { id: 'A-01', occupied: false },
    { id: 'A-02', occupied: true, occupant: '박■■ 주임' },
    { id: 'A-03', occupied: false },
    { id: 'B-01', occupied: true, occupant: '이■■ 대리' },
    { id: 'B-02', occupied: false },
    { id: 'B-03', occupied: true, occupant: '김■■ 사원' },
    { id: 'C-01', occupied: false },
    { id: 'C-02', occupied: false },
    { id: 'C-03', occupied: true, occupant: '최■■ 주임' },
  ];

  const handleSubmit = () => {
    if (!storageNumber || !items || !reason) {
      toast({ title: '모든 항목을 입력해주세요.', variant: 'destructive' });
      return;
    }
    toast({ title: '대여창고 신청이 완료되었습니다.' });
    onClose();
    setStorageNumber('');
    setItems('');
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>대여창고 신청</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="storage-number">창고번호</Label>
            <Select value={storageNumber} onValueChange={setStorageNumber}>
              <SelectTrigger>
                <SelectValue placeholder="창고를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {storages.map((storage) => (
                  <SelectItem
                    key={storage.id}
                    value={storage.id}
                    disabled={storage.occupied}
                  >
                    {storage.id} {storage.occupied ? `(사용 중 - ${storage.occupant})` : '(사용 가능)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage-items">보관 품목</Label>
            <Input
              id="storage-items"
              placeholder="보관할 품목을 입력하세요"
              value={items}
              onChange={(e) => setItems(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage-reason">사유</Label>
            <Textarea
              id="storage-reason"
              placeholder="대여 사유를 입력하세요"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>취소</Button>
          <Button onClick={handleSubmit}>신청</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StorageRentalModal;
