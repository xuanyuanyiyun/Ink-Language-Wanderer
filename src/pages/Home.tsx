import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { audioSystem } from '@/utils/audio';

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const menus = [
    { label: '▷', action: () => { audioSystem.playConfirm(); navigate('/game'); } },
    { label: '☰', action: () => { audioSystem.playConfirm(); navigate('/collection'); } },
    { label: '◬', action: () => { audioSystem.playConfirm(); alert('...'); } },
  ];

  useEffect(() => {
    const playMusic = () => {
      audioSystem.startMenuBGM();
      window.removeEventListener('click', playMusic);
      window.removeEventListener('keydown', playMusic);
    };
    
    window.addEventListener('click', playMusic);
    window.addEventListener('keydown', playMusic);
    
    return () => {
      window.removeEventListener('click', playMusic);
      window.removeEventListener('keydown', playMusic);
      audioSystem.stopBGM();
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-4 relative overflow-hidden font-pixel">
      {/* 环境光晕 */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-paper rounded-full blur-[120px] animate-breathe"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-paper rounded-full blur-[150px] animate-breathe" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 噪点覆盖层（增加复古质感） */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="border-4 border-paper p-12 bg-ink/90 backdrop-blur-sm max-w-lg w-full relative z-10 shadow-pixel flex flex-col items-center">
        {/* 顶部印章装饰 */}
        <div className="absolute -top-6 right-12 w-12 h-12 bg-accent text-paper flex items-center justify-center border-2 border-ink shadow-pixel rotate-12 select-none">
          <span className="text-xl font-bold writing-vertical-rl">◈</span>
        </div>

        <h1 className="text-7xl text-center mb-6 tracking-[0.2em] ink-glow font-bold relative">
          <span className="absolute -inset-2 opacity-10 bg-paper blur-xl"></span>
          ▧ ▨ ▦
        </h1>
        
        <div className="text-center mb-16 text-paper-dark relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-32 h-[1px] bg-paper-dark/30"></div>
          <p className="bg-ink relative z-10 px-4 text-sm tracking-widest uppercase">∴ ∵ ∷</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-[240px]">
          {menus.map((m, idx) => (
            <button
              key={idx}
              className={`group relative text-2xl px-6 py-4 w-full border-2 transition-all duration-200 ${
                selected === idx 
                  ? 'border-paper bg-paper text-ink shadow-pixel translate-y-[-2px] font-bold' 
                  : 'border-paper-dark/50 text-paper-dark hover:border-paper hover:text-paper bg-ink'
              }`}
              onMouseEnter={() => {
                if (selected !== idx) audioSystem.playHover();
                setSelected(idx);
              }}
              onClick={m.action}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                {selected === idx && <span className="animate-pulse">▶</span>}
              </div>
              {m.label}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                {selected === idx && <span className="animate-pulse">◀</span>}
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-20 flex flex-col items-center gap-2">
          <p className="text-xs text-paper-dark animate-pulse opacity-70">( ⚿ )</p>
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-paper-dark/50 to-transparent"></div>
          <p className="text-xs text-paper-dark mt-2 font-mono">© ■ □</p>
        </div>
      </div>
    </div>
  );
}
