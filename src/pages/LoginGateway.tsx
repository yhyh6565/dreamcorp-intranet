import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const LoginGateway = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'id' | 'password'>('id');
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setStep('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    login(id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F9FA] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent opacity-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[10%] left-[-5%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <Card className="w-full max-w-[480px] shadow-2xl border-white/20 bg-white/80 backdrop-blur-xl animate-scale-in transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <CardContent className="p-12 flex flex-col items-center">
          {/* Logo Section */}
          <div className="mb-12 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-primary mb-6 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform duration-300">
              <span className="text-3xl font-bold text-white mb-1">백</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Welcome to Dream Corp.</h1>
            <p className="text-slate-500 font-light tracking-wide text-sm uppercase">Employee Access Terminal</p>
          </div>

          {/* Input Section */}
          <div className="w-full relative h-[140px]">
            {/* Step 1: ID Input */}
            <form
              onSubmit={handleNext}
              className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${step === 'id' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-full pointer-events-none'
                }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Identity Code</label>
                  <Input
                    type="text"
                    placeholder="Enter your name or ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="h-14 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 text-lg px-4 rounded-xl transition-all"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                  disabled={!id}
                >
                  Next
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>

            {/* Step 2: Password Input */}
            <form
              onSubmit={handleLogin}
              className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out ${step === 'password' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-full pointer-events-none'
                }`}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Key</label>
                    <button
                      type="button"
                      onClick={() => setStep('id')}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Change ID
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 text-lg px-4 rounded-xl transition-all"
                    autoFocus={step === 'password'}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'Access System'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              AUTHORIZED PERSONNEL ONLY • SECURE CONNECTION
            </p>
            <p className="text-[10px] text-slate-300 mt-1 font-light">
              System v4.0.2 • Dream Corp Intranet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Copyright */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-slate-400 text-xs font-medium">© 2024 Baekilmong Corp. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginGateway;
