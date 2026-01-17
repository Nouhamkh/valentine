
import React, { useState, useCallback } from 'react';
import { NO_PHRASES, ILLUSTRATIONS } from './constants';
import FloatingHearts from './components/FloatingHearts';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [noCount, setNoCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [currentIllustration, setCurrentIllustration] = useState(ILLUSTRATIONS.DEFAULT);

  const handleNoClick = () => {
    setNoCount(prev => prev + 1);
    const randomSad = ILLUSTRATIONS.SAD[Math.floor(Math.random() * ILLUSTRATIONS.SAD.length)];
    setCurrentIllustration(randomSad);
  };

  const handleYesClick = useCallback(() => {
    setIsAccepted(true);
    setCurrentIllustration(ILLUSTRATIONS.HAPPY);
    
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  // Growth logic: Slowed down to allow ~20-30 clicks before complete overlap
  const yesButtonFontSize = 18 + (noCount * 7); 
  const noButtonText = NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)];

  return (
    <div className="h-screen w-full bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />
      
      <main className="relative z-10 w-full max-w-lg h-[80vh] flex flex-col items-center text-center bg-white/40 backdrop-blur-md p-6 rounded-[3rem] shadow-2xl border border-white/60 animate-in fade-in zoom-in duration-700 overflow-hidden">
        
        {/* Illustration Container */}
        <div className="flex-shrink-0 relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center mt-4 mb-4">
          <img 
            src={currentIllustration} 
            alt="Interaction Illustration" 
            className="w-full h-full object-contain drop-shadow-xl transition-all duration-500 transform hover:scale-110"
          />
        </div>

        {!isAccepted ? (
          <div className="flex flex-col items-center justify-between h-full w-full pb-8">
            <h1 className="text-2xl md:text-4xl font-pacifico text-pink-600 mb-4 drop-shadow-sm px-4">
              Nidhal, will you be my Valentine? 🌹
            </h1>
            
            {/* The play area for buttons */}
            <div className="relative flex-grow w-full flex items-center justify-center">
              
              <div className="flex flex-row items-center justify-center gap-4 relative">
                {/* YES button: Positioned relative to grow but with absolute behavior for covering later */}
                <button
                  onClick={handleYesClick}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-3xl shadow-2xl transition-all duration-300 transform active:scale-95 z-50 whitespace-nowrap flex items-center justify-center"
                  style={{ 
                    fontSize: `${Math.min(yesButtonFontSize, 400)}px`,
                    padding: `${Math.min(yesButtonFontSize / 2, 90)}px ${Math.min(yesButtonFontSize, 180)}px`,
                    boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)',
                    // Transition to absolute later (at 10 clicks) to give "No" more space
                    position: noCount > 10 ? 'absolute' : 'relative',
                    left: noCount > 10 ? '50%' : 'auto',
                    top: noCount > 10 ? '50%' : 'auto',
                    transform: noCount > 10 ? 'translate(-50%, -50%)' : 'none',
                  }}
                >
                  Yes
                </button>

                {/* NO button: Stays side by side initially, then gets covered */}
                <button
                  onClick={handleNoClick}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all duration-200 transform active:scale-90 z-10 flex-shrink-0"
                  style={{
                    fontSize: '1rem',
                    opacity: Math.max(0.1, 1 - (noCount * 0.02)), // Fades slower
                    visibility: noCount > 40 ? 'hidden' : 'visible', // Visible for 40 clicks
                    // Shift right later to avoid early overlap
                    marginLeft: (noCount > 0 && noCount <= 10) ? '20px' : '0'
                  }}
                >
                  {noButtonText}
                </button>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full animate-in slide-in-from-bottom-10 duration-500">
            <h1 className="text-5xl md:text-7xl font-pacifico text-pink-600 mb-6 drop-shadow-lg">
              Yaaaaay! ❤️
            </h1>
            <div className="space-y-4">
              <p className="text-2xl md:text-3xl text-pink-500 font-bold animate-pulse">
                I knew you would say yes, Nidhal!
              </p>
              <p className="text-xl md:text-2xl text-pink-400 font-medium italic">
                Love, Nouha 🥰
              </p>
            </div>
            
            <button 
              onClick={() => {
                setIsAccepted(false);
                setNoCount(0);
                setCurrentIllustration(ILLUSTRATIONS.DEFAULT);
              }}
              className="mt-12 text-sm text-pink-300 hover:text-pink-500 underline cursor-pointer transition-colors"
            >
              Start over?
            </button>
          </div>
        )}
      </main>

      <footer className="mt-6 relative z-10 text-pink-300 text-[10px] font-light tracking-[0.2em] uppercase">
        Personalized for Nidhal & Nouha
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.9); } to { transform: scale(1); } }
        @keyframes slide-in-from-bottom-10 { 
          from { transform: translateY(30px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .animate-in {
          animation-fill-mode: forwards;
        }
        .fade-in { animation-name: fade-in; }
        .zoom-in { animation-name: zoom-in; }
        .slide-in-from-bottom-10 { animation-name: slide-in-from-bottom-10; }
        
        html, body {
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
          background-color: #fdf2f8;
        }
      `}</style>
    </div>
  );
};

export default App;
