import React, { useState, useEffect } from 'react';

export default function EnvelopeIntro() {
  const [isOpened, setIsOpened] = useState(false);
  const [isFlapOpened, setIsFlapOpened] = useState(false);
  const [isCardSlidOut, setIsCardSlidOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Lock main page scrolling while envelope is active and closed
  useEffect(() => {
    if (isVisible && !isCardSlidOut) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isVisible, isCardSlidOut]);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    // Step 1: Flip top flap open (0.6s duration)
    setIsFlapOpened(true);
    
    // Step 2: Slide the card out of the envelope (starts after flap is open)
    setTimeout(() => {
      setIsCardSlidOut(true);
    }, 600);

    // Step 3: Fade out and unmount the entire envelope
    setTimeout(() => {
      setIsVisible(false);
    }, 2200);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-lg z-50 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
        isCardSlidOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div 
        onClick={handleOpen}
        className="relative w-[90%] aspect-[4/3] bg-[#E8E1D5] overflow-visible cursor-pointer select-none shadow-2xl rounded-lg"
      >

        {/* 2. Top Flap (Triangular Lid) */}
        <div 
          className="absolute inset-x-0 top-0 h-[calc(50%+2px)] overflow-visible"
          style={{
            zIndex: 35, // stays on top of other flaps (20, 22)
            transformOrigin: 'top',
            transform: isFlapOpened ? 'rotateX(180deg)' : 'rotateX(0deg)',
            transition: 'transform 0.6s ease-in-out',
          }}
        >
          <svg 
            viewBox="0 0 100 50" 
            preserveAspectRatio="none" 
            className="w-full h-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]"
          >
            <polygon points="0,0 100,0 50,50" fill="#E8E1D5" stroke="#DDD4C5" strokeWidth="0.5" />
          </svg>
        </div>

        {/* 3. Left & Right Flaps (Sides) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <polygon points="0,0 0,100 50,50" fill="#DFD7CA" />
            <polygon points="100,0 100,100 50,50" fill="#DFD7CA" />
          </svg>
        </div>

        {/* 4. Bottom Flap */}
        <div 
          className="absolute inset-x-0 bottom-0 h-[calc(50%+2px)] pointer-events-none"
          style={{ zIndex: 22 }}
        >
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
            <polygon points="0,50 100,50 50,0" fill="#D7CEC0" stroke="#DDD4C5" strokeWidth="0.2" />
          </svg>
        </div>

        {/* 5. Golden Seal (Wax Seal with sello.png) */}
        <div 
          className="absolute left-55 top-55 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
          style={{
            zIndex: 40,
            opacity: isFlapOpened ? 0 : 1,
            transform: isFlapOpened ? 'translate(-50%, -50%) scale(0.8)' : 'translate(-50%, -50%) scale(1)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden active:scale-95 transition-transform duration-200 flex items-center justify-center">
            <img
              src="/sello.png"
              alt="Sello"
              className="w-full h-full object-contain"
            />
          </div>
          <span 
            className="mt-2 text-[10px] tracking-[0.3em] uppercase animate-pulse select-none"
            style={{ 
              color: "var(--primary)", 
              fontFamily: "var(--font-body)",
              fontWeight: 500
            }}
          >
            Toca para abrir
          </span>
        </div>

      </div>
    </div>
  );
}