import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lock, User } from 'lucide-react';

const LoginGateway = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    login(id);
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50 animate-fade-in">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-primary-foreground">백</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">(주)백일몽</h1>
              <p className="text-sm text-muted-foreground">사내 인트라넷 접속 게이트웨이</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="id" className="text-sm font-medium text-foreground">
                사번 (ID)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="id"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="pl-10 h-11 bg-secondary/50 border-border"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                비밀번호 (PW)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-secondary/50 border-border"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  접속 중...
                </span>
              ) : (
                '접속하기'
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              본 시스템은 (주)백일몽 임직원 전용입니다.<br />
              무단 접근 시 법적 책임을 물을 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginGateway;
