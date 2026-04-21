import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { audioSystem } from '@/utils/audio';

export default function Home() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const menus = [
    { label: '开始游戏', action: () => { audioSystem.playConfirm(); navigate('/game'); } },
    { label: '诗词图鉴', action: () => { audioSystem.playConfirm(); navigate('/collection'); } },
    { label: '游戏选项', action: () => { audioSystem.playConfirm(); alert('尚未实装'); } },
  ];

  // 在主界面启动BGM，离开时可选择是否关闭
  useEffect(() => {
    // 为避免浏览器自动播放策略拦截，需要用户交互后再播放
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
      audioSystem.stopBGM(); // 离开主页停止主界面BGM
    };
  }, []);

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* 动态背景粒子效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-paper rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-paper rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="pixel-border p-8 bg-ink max-w-md w-full relative z-10 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
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
                  ? 'border-paper bg-paper text-ink shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                  : 'border-transparent text-paper hover:border-paper-dark'
              }`}
              onMouseEnter={() => {
                if (selected !== idx) audioSystem.playHover();
                setSelected(idx);
              }}
              onClick={m.action}
            >
              {selected === idx && <span className="mr-2 animate-pulse">▶</span>}
              {m.label}
              {selected === idx && <span className="ml-2 animate-pulse">◀</span>}
            </button>
          ))}
        </div>
        
        <div className="mt-16 text-xs text-center text-paper-dark">
          <p className="mb-2 animate-pulse">（点击或按键开启音效与音乐）</p>
          © 2026 Ink Walker Studio
        </div>
      </div>
    </div>
  );
}
