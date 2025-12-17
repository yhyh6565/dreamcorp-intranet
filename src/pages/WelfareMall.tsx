import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ShoppingCart, Lock, User } from 'lucide-react';
import SpaceShoppingMall from '@/components/SpaceShoppingMall';

import hairTonic from '@/assets/products/hair-tonic.png';
import mysteryBox from '@/assets/products/mystery-box.png';
import secretReagent from '@/assets/products/secret-reagent.png';
import regenPotion from '@/assets/products/regen-potion.png';
import snakeVenom from '@/assets/products/snake-venom.png';
import wishTicket from '@/assets/products/wish-ticket.png';

const products = [
  { id: 1, name: '[특가] 기적의 발모제', price: 100, image: hairTonic, tag: '특가' },
  { id: 2, name: '최고급 대형 가전 랜덤박스', price: 500, image: mysteryBox, tag: null },
  { id: 3, name: '백일몽 주식회사 미공개 시약', price: 1000, image: secretReagent, tag: null },
  { id: 4, name: '상급 재생 물약', price: 10000, image: regenPotion, tag: null },
  { id: 5, name: '[맹독] 사막방울뱀 독', price: 170000, image: snakeVenom, tag: '맹독' },
  { id: 6, name: '[전설] 소원권', price: 500000, image: wishTicket, tag: '전설' },
];

const WelfareMall = () => {
  const navigate = useNavigate();
  const { 
    isLoggedIn, 
    hasWelfareMallAccess, 
    loginToWelfareMall, 
    welfareMallLoginId,
    backButtonCount,
    incrementBackButton,
    resetBackButton 
  } = useUserStore();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showSpaceMall, setShowSpaceMall] = useState(false);
  const [showPixelHand, setShowPixelHand] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (!hasWelfareMallAccess) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn, hasWelfareMallAccess, navigate]);

  const handleLoginModalClose = (open: boolean) => {
    if (!open && !hasWelfareMallAccess) {
      navigate('/dashboard');
    }
    setShowLoginModal(open);
  };

  useEffect(() => {
    // Check for space mall trigger
    if (welfareMallLoginId === 'yongj1111' && backButtonCount >= 5) {
      setShowPixelHand(true);
    }
  }, [welfareMallLoginId, backButtonCount]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginToWelfareMall(loginId, loginPassword);
    setShowLoginModal(false);
  };

  const handleBack = () => {
    if (welfareMallLoginId === 'yongj1111' && backButtonCount < 5) {
      incrementBackButton();
    } else {
      resetBackButton();
      navigate('/dashboard');
    }
  };

  const handlePixelHandClick = () => {
    setShowSpaceMall(true);
  };

  if (showSpaceMall) {
    return <SpaceShoppingMall />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">백</span>
              </div>
              <span className="text-xl font-bold text-foreground">임직원 복지몰</span>
            </div>
          </div>
          
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">인기 상품</h1>
        <p className="text-muted-foreground mb-8">백일몽 주식회사 임직원만을 위한 특별한 혜택</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="aspect-square bg-secondary/30 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.tag && (
                  <Badge 
                    className={`absolute top-3 left-3 ${
                      product.tag === '전설' ? 'bg-amber-500 text-amber-950' :
                      product.tag === '맹독' ? 'bg-destructive text-destructive-foreground' :
                      'bg-primary text-primary-foreground'
                    }`}
                  >
                    {product.tag}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-primary">{product.price.toLocaleString()} P</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={handleLoginModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">복지몰 보안 인증</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
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

      {/* Pixel Hand Easter Egg */}
      {showPixelHand && (
        <div 
          className="fixed bottom-4 right-4 z-50 animate-slide-up cursor-pointer"
          onClick={handlePixelHandClick}
        >
          <div className="relative">
            <div className="animate-shake text-6xl">👆</div>
            <div className="absolute -top-20 right-0 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 p-3 min-w-[200px] font-retro text-sm">
              <TypewriterText texts={[
                "1주년 감사 할인 중! ~80%",
                "직장이 지루한가요? >> 클릭",
                "더 강해지고 싶나요? >> 클릭",
                "멋진 물건을 가지고 싶나요? >> 클릭"
              ]} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Typewriter effect component
const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    if (charIndex < currentFullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentFullText.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        if (currentTextIndex < texts.length - 1) {
          setCurrentTextIndex(currentTextIndex + 1);
          setDisplayText('');
          setCharIndex(0);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [charIndex, currentTextIndex, texts]);

  return <span className="font-horror">{displayText}<span className="animate-blink">|</span></span>;
};

export default WelfareMall;
