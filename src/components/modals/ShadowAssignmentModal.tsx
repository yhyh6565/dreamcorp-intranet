import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/userStore';
import { AlertTriangle } from 'lucide-react';

interface ShadowAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shadowName: string;
    shadowCode: string;
    onConfirm: () => void;
}

const ShadowAssignmentModal = ({ open, onOpenChange, shadowName, shadowCode, onConfirm }: ShadowAssignmentModalProps) => {
    const { userName } = useUserStore();
    const [inputName, setInputName] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (inputName !== userName) {
            setError('본인 확인에 실패했습니다. (이름 불일치)');
            return;
        }

        // Success
        onConfirm();
        onOpenChange(false);

        // Reset state
        setInputName('');
        setIsAgreed(false);
        setError('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-red-900/50 bg-slate-950 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500 font-bold">
                        <AlertTriangle className="h-5 w-5" />
                        담당자 등록 확인
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-md p-4 text-sm text-red-200 leading-relaxed">
                        <p className="font-bold mb-2">⚠ 본 절차는 되돌릴 수 없습니다.</p>
                        <p>귀하는 지금 <span className="font-bold text-white">[{shadowName}] ({shadowCode})</span>의 단독 관리 책임을 지게 됩니다.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">확인을 위해 귀하의 이름을 입력하십시오.</label>
                        <Input
                            value={inputName}
                            onChange={(e) => {
                                setInputName(e.target.value);
                                setError('');
                            }}
                            placeholder={userName || "로그인이 필요합니다"}
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 font-mono"
                        />
                        {error && <p className="text-xs text-red-500 font-bold animate-pulse">{error}</p>}
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="agreement"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-red-600 focus:ring-red-600"
                        />
                        <label htmlFor="agreement" className="text-sm text-slate-400 cursor-pointer select-none">
                            본 업무 중 발생하는 신체적 훼손 및 정신적 오염에 대해 회사의 면책에 동의합니다.
                        </label>
                    </div>

                    <Button
                        className={`w-full font-bold transition-all duration-300 ${inputName === userName && isAgreed
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed hover:bg-slate-800'
                            }`}
                        disabled={!(inputName === userName && isAgreed)}
                        onClick={handleConfirm}
                    >
                        등록 확정 (Danger)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShadowAssignmentModal;
