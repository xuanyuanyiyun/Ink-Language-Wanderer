import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const menus = [
    { label: '开始游戏', action: () => navigate('/game') },
    { label: '诗词图鉴', action: () => navigate('/collection') },
    { label: '游戏选项', action: () => alert('尚未实装') },
  ];

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-4">
      <div className="pixel-border p-8 bg-ink max-w-md w-full relative">
        <h1 className="text-6xl text-center mb-8 tracking-widest relative">
          <span className="absolute -inset-1 opacity-20 bg-paper blur-md"></span>
          墨语行者
        </h1>
        
        <div className="text-center mb-12 text-paper-dark">
          <p>8MB 极简水墨冒险</p>
          <p className="text-xs mt-2">机制驱动 · 以文为武</p>
        </div>

        <div className="flex flex-col gap-4 items-center">
          {menus.map((m, idx) => (
            <button
              key={idx}
              className={`text-2xl px-6 py-2 border-2 transition-colors ${
                selected === idx 
                  ? 'border-paper bg-paper text-ink' 
                  : 'border-transparent text-paper hover:border-paper-dark'
              }`}
              onMouseEnter={() => setSelected(idx)}
              onClick={m.action}
            >
              {selected === idx && <span className="mr-2 animate-pulse">▶</span>}
              {m.label}
              {selected === idx && <span className="ml-2 animate-pulse">◀</span>}
            </button>
          ))}
        </div>
        
        <div className="mt-16 text-xs text-center text-paper-dark">
          © 2026 Ink Walker Studio
        </div>
      </div>
    </div>
  );
}
