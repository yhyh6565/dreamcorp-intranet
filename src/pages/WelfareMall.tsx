import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, ShoppingBag, ArrowLeft, Home, User, AlertTriangle, Filter } from 'lucide-react';
import SpaceShoppingMall from '@/components/SpaceShoppingMall';
import { products } from '@/data/products';
import { Separator } from '@/components/ui/separator';
import WelfareLoginModal from '@/components/welfare/WelfareLoginModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TypewriterText } from '@/components/common/TypewriterText';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const WelfareMall = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    hasWelfareMallAccess,
    welfareMallLoginId,
    loginToWelfareMall,
    welfareMallHiddenAccess,
    backButtonCount,
    incrementBackButton,
    resetBackButton,
    isPointGlitching,
    setPointGlitching,
    points,
    deductPoints
  } = useUserStore();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSpaceMall, setShowSpaceMall] = useState(false);
  const [showPixelHand, setShowPixelHand] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Initial check
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    } else if (!hasWelfareMallAccess) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn, hasWelfareMallAccess, navigate]);

  // Points logic (Sync with store + Glitch)
  useEffect(() => {
    // If glitching, it's 0 (handled by interval below), otherwise it's real points
    if (!isPointGlitching) {
      setDisplayedPoints(points);
    }
  }, [points, isPointGlitching]);

  // Glitch effect logic for ticker
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance to glitch
        setPointGlitching(true);
        setDisplayedPoints(0);
        setTimeout(() => {
          setPointGlitching(false);
          setDisplayedPoints(useUserStore.getState().points); // Revert to actual points
        }, 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [setPointGlitching]);


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

  const handleCustomBack = () => {
    if (welfareMallHiddenAccess) {
      // Count up to 5
      incrementBackButton();
    } else {
      resetBackButton();
      navigate('/dashboard');
    }
  };

  const handlePurchase = () => {
    if (!selectedProduct) return;

    if (points < selectedProduct.price) {
      alert("보유 포인트가 부족합니다.");
      return;
    }

    const confirmPurchase = window.confirm(`${selectedProduct.name}을(를) 구매하시겠습니까?\n${selectedProduct.price.toLocaleString()} 포인트가 차감됩니다.`);

    if (confirmPurchase) {
      deductPoints(selectedProduct.price);
      alert("구매가 완료되었습니다.");
      setSelectedProduct(null);
    }
  };

  // Trigger effect on 5th click
  useEffect(() => {
    if (welfareMallHiddenAccess && backButtonCount >= 5) {
      // Freeze UI is handled by overlay
      // Trigger Pixel Hand
      setShowPixelHand(true);
    }
  }, [welfareMallHiddenAccess, backButtonCount]);

  // Redirect to Space Mall after animation
  useEffect(() => {
    if (showPixelHand) {
      const timer = setTimeout(() => {
        // Auto redirect effect could go here
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPixelHand]);


  if (showSpaceMall) {
    return <SpaceShoppingMall />;
  }

  // Freeze UI overlay
  // Easter egg overlay rendered at the bottom

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200 relative">
      {/* Local Header - Minimalist */}
      <header className="h-24 sticky top-0 bg-white z-40 flex items-center justify-between px-12 border-b border-transparent transition-colors duration-300 hover:border-slate-100">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-slate-900 cursor-default">
            Dream Corp<span className="font-bold">Mall</span>
          </h1>
        </div>

        <div className="flex items-center gap-10">
          {/* User Status - Single Line Minimalism */}
          <div className="hidden md:flex items-center gap-6 text-right">
            <span className="text-sm font-medium text-slate-500 tracking-wide uppercase">
              {welfareMallHiddenAccess ? '이자헌 과장 / D조' : `${useUserStore.getState().rank} · ${useUserStore.getState().userName}`}
            </span>
            <span className={`text-base font-mono font-medium text-slate-900 transition-opacity duration-100 ${isPointGlitching ? 'opacity-50 blur-[1px]' : ''}`}>
              {displayedPoints.toLocaleString()} P
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Nav Icons */}
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-blue-600 transition-colors">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-transparent hover:text-blue-600 transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            {/* Back Button (Logic Preserved) */}
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-red-50 hover:text-red-500 transition-transform ${backButtonCount > 0 && welfareMallHiddenAccess ? 'animate-vibrate text-red-500' : ''}`}
              onClick={handleCustomBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-12 py-16 animate-fade-in">
        {/* Tab Layout - Clean Text Tabs */}
        <Tabs defaultValue="shopping" className="w-full space-y-16">
          <div className="flex justify-start border-b border-slate-100">
            <TabsList className="bg-transparent p-0 h-auto space-x-12">
              <TabsTrigger
                value="shopping"
                className="rounded-none bg-transparent px-0 py-4 text-sm font-medium tracking-widest text-slate-400 data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 bg-none"
              >
                PRODUCT / ALL
              </TabsTrigger>
              <TabsTrigger
                value="application"
                className="rounded-none bg-transparent px-0 py-4 text-sm font-medium tracking-widest text-slate-400 data-[state=active]:text-slate-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-900 bg-none"
              >
                WELFARE / SERVICES
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Shopping Tab */}
          <TabsContent value="shopping" className="space-y-12 outline-none">
            {/* Minimal Category Filter */}
            <div className="flex gap-8 justify-start">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm tracking-wide transition-colors ${selectedCategory === category ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {category === 'All' ? 'View All' : category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {/* Image Area - Clean & Spacious */}
                  <div className="aspect-[4/5] bg-slate-50 mb-6 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Minimal Badge */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1">
                        {product.category}
                      </span>
                      {product.tag && (
                        <span className="text-[10px] uppercase tracking-widest text-white bg-red-600 px-2 py-1 font-bold shadow-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Area - Typographic */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-base font-medium text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      {product.stock <= 5 && product.stock > 0 && (
                        <p className="text-[10px] text-red-500 font-mono">
                          Only {product.stock} left
                        </p>
                      )}
                      {product.stock === 0 && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          Out of Stock
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-sm text-slate-900">
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-32 text-slate-300 font-light text-3xl tracking-widest uppercase">
                Empty Collection
              </div>
            )}
          </TabsContent>

          {/* Application Tab - Premium Services */}
          <TabsContent value="application" className="space-y-16 outline-none">
            {/* Housing Card */}
            <div className="group cursor-pointer relative overflow-hidden bg-slate-50 border border-slate-100 flex flex-col md:flex-row h-[500px]">
              <div className="md:w-1/2 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <Home className="h-24 w-24 opacity-20" />
                </div>
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-4xl font-light text-slate-900 tracking-tight">Dream Stay</h2>
                  <p className="text-slate-500 mt-2">Premium Housing Service</p>
                </div>
              </div>
              <div className="md:w-1/2 p-16 flex flex-col justify-center">
                <div className="space-y-6">
                  <span className="text-blue-600 font-mono text-sm tracking-widest uppercase">Available Now</span>
                  <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                    임직원 전용 오피스텔<br />입주 신청
                  </h3>
                  <p className="text-slate-500 leading-relaxed max-w-md">
                    사옥 도보 15분 거리, 최고급 풀옵션 오피스텔.<br />
                    월 10만 원 상당의 호텔식 침구 교체 서비스와<br />웰컴 기프트 패키지를 제공합니다.
                  </p>
                  <Button className="mt-8 bg-slate-900 text-white rounded-none px-10 py-6 hover:bg-blue-600 transition-colors uppercase tracking-widest text-xs">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Health Checkup - Minimal Row */}
            <div className="border-t border-b border-slate-100 py-12 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer px-8">
              <div className="flex items-center gap-8">
                <div className="h-16 w-16 bg-slate-100 flex items-center justify-center rounded-full text-2xl">
                  🏥
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-900">2025 종합 건강검진</h3>
                  <p className="text-slate-500 mt-1">지정 대학 병원 (아산/삼성/세브란스) VIP 검진 프로그램</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-none border-slate-300 px-8 py-6 uppercase text-xs tracking-widest hover:bg-slate-900 hover:text-white transition-colors">
                Reservation
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Login Modal Preserved */}
      <WelfareLoginModal
        open={showLoginModal}
        onOpenChange={handleLoginModalClose}
        onLogin={handleLogin}
      />

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden gap-0 border-none shadow-2xl z-[60]">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-[600px]">
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>Product details and purchase option</DialogDescription>
              </DialogHeader>
              <div className="md:w-1/2 bg-slate-50 relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover mix-blend-multiply p-8" />
              </div>
              <div className="md:w-1/2 p-12 flex flex-col justify-between bg-white">
                <div>
                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 block">{selectedProduct.category}</span>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-2xl font-mono font-light text-slate-900 mb-8">{selectedProduct.price.toLocaleString()} P</p>

                  <p className="text-slate-500 leading-relaxed text-sm">
                    {selectedProduct.description}
                  </p>

                  {selectedProduct.isRestricted && (
                    <div className="mt-8 bg-red-50 p-4 border-l-2 border-red-500">
                      <h4 className="font-bold text-red-600 text-xs mb-1 uppercase tracking-wide">Warning: Restricted Item</h4>
                      <p className="text-xs text-red-500 leading-relaxed">특별 관리 품목입니다. 사용 시 주의가 요구됩니다.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                    <span className="text-slate-400">Availability</span>
                    <span className={`font-mono ${selectedProduct.stock <= 5 ? 'text-red-500 font-bold' : 'text-slate-900'}`}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-0">
                    <span className="text-slate-400">Balance after</span>
                    <span className={`font-mono ${displayedPoints - selectedProduct.price < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                      {(displayedPoints - selectedProduct.price).toLocaleString()} P
                    </span>
                  </div>
                  <Button
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white rounded-none py-6 uppercase tracking-widest text-xs transition-colors"
                    onClick={handlePurchase}
                  >
                    Purchase Item
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Easter Egg Overlay (Overlay on top of content) */}
      {showPixelHand && !showSpaceMall && (
        <div className="fixed inset-0 z-50 bg-black/10 overflow-hidden cursor-not-allowed">
          <div className="absolute bottom-0 right-10 animate-slide-up transition-transform duration-700">
            <div className="relative cursor-pointer" onClick={() => setShowSpaceMall(true)}>
              <span className="text-[150px] select-none filter sepia hue-rotate-[70deg] saturate-[600%] brightness-90">👆</span>
              <div className="absolute -top-16 right-10 bg-white border-2 border-black p-4 font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                <TypewriterText texts={[
                  "1주년 감사 할인 중! ~80%",
                  "직장이 지루한가요? >> 클릭",
                  "더 강해지고 싶나요? >> 클릭",
                  "멋진 물건을 가지고 싶나요? >> 클릭"
                ]} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelfareMall;


