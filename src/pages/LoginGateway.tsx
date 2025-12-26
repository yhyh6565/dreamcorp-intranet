import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const LoginGateway = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, loginAsGuest } = useUserStore();

  useEffect(() => {
    logout();
  }, [logout]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    login(id);
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    loginAsGuest();
    navigate('/dashboard', { replace: true });
  };

  return (

    <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FA] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Main Card - Widened & Compact Height */}
      <Card className="w-full max-w-[700px] shadow-2xl border-white/20 bg-white/80 backdrop-blur-xl animate-scale-in transition-all duration-500 mx-4">
        <CardContent className="p-6 md:p-8 flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-6 flex flex-col items-center animate-fade-in">
            <div className="w-14 h-14 bg-primary mb-4 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
              <img
                src="/pic/logo_cloud.png"
                alt="Dream Corp Logo"
                className="w-8 h-8 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1 break-keep text-center">백일몽 주식회사에 오신 것을 환영합니다</h1>
            <p className="text-slate-500 font-light tracking-wide text-xs uppercase">임직원 전용 인트라넷</p>
          </div>

          {/* Form Section - Compact */}
          <form onSubmit={handleLogin} className="w-full md:max-w-[360px] mx-auto space-y-4">
            <div className="space-y-3">
              {/* ID Input */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">아이디</label>
                <Input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="h-10 md:h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 text-sm md:text-base px-3 rounded-lg transition-all placeholder:text-sm"
                  autoFocus
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">비밀번호</label>
                <Input
                  type="password"
                  placeholder="당신은 누구신가요?"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 md:h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 text-sm md:text-base px-3 rounded-lg transition-all placeholder:text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                className="w-full h-10 md:h-11 text-sm md:text-base font-medium rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                disabled={isLoading || !id || !password}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    시스템 접속 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </Button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-slate-400 font-light">또는</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <Button
                type="button"
                onClick={handleGuestLogin}
                variant="outline"
                className="w-full h-10 md:h-11 text-slate-600 font-medium rounded-lg border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm md:text-base"
              >
                게스트로 체험하기
              </Button>
            </div>
          </form>

          {/* Footer inside Card for compactness */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-300 font-light tracking-tight">
              관계자 외 접속 금지 • 보안 연결 • v4.0.2
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Copyright - Absolute bottom */}
      <div className="absolute bottom-4 text-center w-full px-4">
        <p className="text-slate-400 text-[10px] font-medium break-keep opacity-50 leading-relaxed">
          Copyright © 2025 All rights reserved. <span className="hidden md:inline">|</span> <br className="md:hidden" />
          본 페이지는 비공식 팬 페이지로, '괴담에 떨어져도 출근을 해야 하는구나' IP 및 제반 권리는 원작자에게 귀속됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginGateway;
