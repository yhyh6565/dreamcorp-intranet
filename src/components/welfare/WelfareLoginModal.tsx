import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Lock } from 'lucide-react';

interface WelfareLoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLogin: (id: string, pw: string) => void;
}

const WelfareLoginModal = ({ open, onOpenChange, onLogin }: WelfareLoginModalProps) => {
    const [loginId, setLoginId] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(loginId, loginPassword);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md z-50 select-none"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-center font-serif text-xl">복지몰 보안 인증</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    <p className="text-sm text-center text-muted-foreground w-full">
                        보안을 위해 사원 정보를 다시 확인합니다.
                    </p>
                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="아이디"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="pl-10 font-mono text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="비밀번호"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="pl-10 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white">인증하기</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WelfareLoginModal;
