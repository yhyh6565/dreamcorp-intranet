import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Ban } from 'lucide-react';

interface IdentityVerificationFailedModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const IdentityVerificationFailedModal = ({ open, onOpenChange }: IdentityVerificationFailedModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-red-900/50 bg-slate-950 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500 font-bold">
                        <Ban className="h-5 w-5" />
                        신원 확인 불가
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 text-sm text-red-200 leading-relaxed animate-pulse">
                        <p className="font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            치명적 오류: 사용자 데이터 손상
                        </p>
                        <p>시스템이 귀하의 고유 식별 코드를 해독할 수 없습니다.</p>
                    </div>

                    <div className="space-y-2 text-center py-4">
                        <p className="text-4xl font-black tracking-[1em] text-slate-800 select-none">
                            ■■■
                        </p>
                        <p className="text-sm text-red-500 font-bold mt-4">
                            신원을 증명할 수 없어 권한이 거부되었습니다.
                        </p>
                    </div>

                    <Button
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                        onClick={() => onOpenChange(false)}
                    >
                        확인
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default IdentityVerificationFailedModal;
