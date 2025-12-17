import { useState, useEffect } from 'react';

const SpaceShoppingMall = () => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Create stars
    const stars = document.getElementById('stars-container');
    if (stars) {
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'absolute rounded-full bg-white';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `blink ${Math.random() * 2 + 1}s ease-in-out infinite`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        stars.appendChild(star);
      }
    }
  }, []);

  const handleViewItems = () => {
    setShowError(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  if (showError) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center animate-glitch">
          <p className="font-retro text-2xl text-retro-lime mb-4">ERROR 404</p>
          <p className="font-retro text-retro-lime">CONNECTION TERMINATED</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-50">
      {/* Stars background */}
      <div id="stars-container" className="absolute inset-0" />
      
      {/* UFO */}
      <div className="absolute top-10 right-10 animate-rotate">
        <div className="text-6xl">🛸</div>
      </div>

      {/* Alien */}
      <div className="absolute bottom-20 left-10 animate-shake">
        <div className="text-5xl">👽</div>
      </div>

      {/* Red Planet */}
      <div className="absolute top-1/3 left-1/4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-500/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Marquee Title */}
        <div className="w-full overflow-hidden mb-12">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-4xl md:text-6xl font-horror retro-text">
              ★ 우 주 쇼 핑 몰 ★ &nbsp;&nbsp;&nbsp; ★ 우 주 쇼 핑 몰 ★ &nbsp;&nbsp;&nbsp; ★ 우 주 쇼 핑 몰 ★
            </span>
          </div>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-12 px-4">
          <p className="font-retro text-retro-lime text-lg md:text-xl mb-4">
            환영합니다, 지구인 방문자님
          </p>
          <p className="font-retro text-retro-lime text-sm opacity-70">
            우주 최고의 물건들이 당신을 기다립니다
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleViewItems}
          className="relative group px-8 py-4 border-2 border-retro-lime bg-transparent hover:bg-retro-lime/20 transition-colors"
        >
          <span className="font-retro text-retro-lime text-xl">
            {'>> 나는 물건을 본다 <<'}
          </span>
        </button>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <p className="font-retro text-retro-lime/50 text-xs">
            © 2000 SPACE SHOPPING MALL - ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      {/* Glitch lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-retro-lime/30"
            style={{
              top: `${20 + i * 20}%`,
              animation: `glitch ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
              animationDelay: `${Math.random()}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpaceShoppingMall;
