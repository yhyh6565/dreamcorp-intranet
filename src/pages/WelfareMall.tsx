import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, ShoppingBag, ArrowLeft } from 'lucide-react';
import SpaceShoppingMall from '@/components/SpaceShoppingMall';
import Layout from '@/components/Layout';
import { products } from '@/data/products';
import { Separator } from '@/components/ui/separator';
import WelfareLoginModal from '@/components/welfare/WelfareLoginModal';

const WelfareMall = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    hasWelfareMallAccess,
    loginToWelfareMall,
    welfareMallHiddenAccess,
    backButtonCount,
    incrementBackButton,
    resetBackButton
  } = useUserStore();

  const [showLoginModal, setShowLoginModal] = useState(false);
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

  const handleLogin = (id: string, pw: string) => {
    loginToWelfareMall(id, pw);
    setShowLoginModal(false);
  };

  useEffect(() => {
    // Check for space mall trigger using the hidden access flag
    if (welfareMallHiddenAccess && backButtonCount >= 5) {
      setShowPixelHand(true);
    }
  }, [welfareMallHiddenAccess, backButtonCount]);

  const handleCustomBack = () => {
    if (welfareMallHiddenAccess) {
      // If "trapped" in hidden mode, back button increments count instead of navigating
      if (backButtonCount < 5) {
        incrementBackButton();
        return;
      }
    }
    // Normal behavior
    resetBackButton();
    navigate('/dashboard');
  };

  const handlePixelHandClick = () => {
    setShowSpaceMall(true);
  };

  if (showSpaceMall) {
    return <SpaceShoppingMall />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={handleCustomBack} className="text-slate-500 hover:text-slate-900 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                뒤로가기
              </Button>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-900">
              <ShoppingBag className="h-8 w-8 text-primary" />
              임직원 복지몰
            </h1>
            <p className="text-slate-500 mt-2 text-lg">백일몽 주식회사 임직원만을 위한 시크릿 특가 혜택</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" /> 검색
            </Button>
            <Button onClick={() => { }} className="gap-2">
              <ShoppingCart className="h-4 w-4" /> 장바구니 (0)
            </Button>
          </div>
        </div>

        <Separator />

        {/* Filters & Sort (Mock) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button variant="secondary" size="sm" className="rounded-full px-4">전체</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground">건강/의료</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground">생활용품</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground">전자기기</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-muted-foreground">특수장비</Button>
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <Filter className="h-3 w-3" /> 정렬
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {product.tag && (
                  <Badge
                    className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold shadow-sm ${product.tag === '전설' ? 'bg-amber-500 text-amber-950 border-amber-400' :
                      product.tag === '맹독' ? 'bg-destructive text-destructive-foreground border-destructive' :
                        'bg-primary text-primary-foreground border-primary'
                      }`}
                  >
                    {product.tag}
                  </Badge>
                )}

                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-5">
                <h3 className="font-medium text-slate-900 mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">임직원 전용 특별 공급 상품입니다.</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold text-slate-900">{product.price.toLocaleString()} <span className="text-sm font-normal text-slate-500">P</span></p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Login Modal (Extracted) */}
      <WelfareLoginModal
        open={showLoginModal}
        onOpenChange={handleLoginModalClose}
        onLogin={handleLogin}
      />

      {/* Pixel Hand Easter Egg */}
      {showPixelHand && (
        <div
          className="fixed bottom-4 right-4 z-[100] animate-slide-up cursor-pointer"
          onClick={handlePixelHandClick}
        >
          <div className="relative">
            <div className="animate-shake text-6xl">👆</div>
            <div className="absolute -top-20 right-0 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 p-3 min-w-[200px] font-retro text-sm z-50 shadow-xl">
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
    </Layout>
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
