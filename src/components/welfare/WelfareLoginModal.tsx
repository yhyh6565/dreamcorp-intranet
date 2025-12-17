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
                className="sm:max-w-md"
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">복지몰 보안 인증</DialogTitle>
                    {/* We rely on onOpenChange but preventing outside/escape forces explicit action via X button or login */}
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <p className="text-sm text-center text-muted-foreground">
                        복지몰 접근을 위해 보안 코드를 입력해주세요.
                    </p>
                    <div className="space-y-2">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="아이디"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="비밀번호"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">인증하기</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WelfareLoginModal;
