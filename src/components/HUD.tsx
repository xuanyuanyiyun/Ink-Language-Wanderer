import React from 'react';
import { useGameStore } from '@/store/gameStore';

export default function HUD() {
  const { hp, maxHp, wenqi, maxWenqi, form, collectedWords } = useGameStore();

  const formName = {
    brush: '笔',
    ink: '墨',
    paper: '纸',
    stone: '砚',
  };

  const formColors = {
    brush: 'bg-accent text-paper border-paper shadow-[0_0_15px_rgba(192,72,81,0.4)]',
    ink: 'bg-ink text-paper border-accent-blue shadow-[0_0_15px_rgba(42,92,170,0.4)]',
    paper: 'bg-paper text-ink border-accent-gold shadow-[0_0_15px_rgba(217,164,14,0.4)]',
    stone: 'bg-accent-green text-paper border-paper shadow-[0_0_15px_rgba(80,166,132,0.4)]',
  };

  return (
    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-20">
      <div className="flex flex-col gap-4">
        {/* HP Bar */}
        <div className="flex items-center gap-3">
          <div className="bg-accent text-paper px-2 py-1 border-2 border-paper text-sm font-bold shadow-pixel drop-shadow-[0_0_8px_rgba(192,72,81,0.5)]">命</div>
          <div className="w-40 h-5 border-2 border-paper bg-paper-dark relative shadow-pixel overflow-hidden">
            <div className="absolute inset-0 bg-accent transition-all duration-300 ease-out" style={{ width: `${(hp / maxHp) * 100}%` }} />
            {/* 格栅装饰 */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgNEw0IDBaIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] mix-blend-overlay"></div>
          </div>
        </div>
        {/* Wenqi Bar */}
        <div className="flex items-center gap-3">
          <div className="bg-accent-blue text-paper px-2 py-1 border-2 border-paper text-sm font-bold shadow-pixel drop-shadow-[0_0_8px_rgba(42,92,170,0.5)]">气</div>
          <div className="w-40 h-5 border-2 border-paper bg-paper-dark relative shadow-pixel overflow-hidden">
            <div className="absolute inset-0 bg-accent-blue transition-all duration-300 ease-out" style={{ width: `${(wenqi / maxWenqi) * 100}%` }} />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgNEw0IDBaIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] mix-blend-overlay"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4">
        {/* 当前形态印章风格 */}
        <div className={`relative w-16 h-16 border-2 flex items-center justify-center rotate-3 transform transition-all duration-500 ${formColors[form]}`}>
          <span className="text-3xl font-bold">{formName[form]}</span>
          <div className="absolute -bottom-2 -right-2 text-xs bg-ink px-1 text-paper border border-paper shadow-sm">形态</div>
        </div>
        
        {/* 字魂收集槽 */}
        <div className="flex gap-2 text-ink mt-2">
          {collectedWords.slice(0, 5).map((w, i) => (
            <span key={i} className="border-2 border-accent-gold shadow-[2px_2px_0_rgba(217,164,14,1)] bg-paper w-10 h-10 flex items-center justify-center font-bold text-xl transform hover:-translate-y-1 transition-transform text-accent-gold">
              {w}
            </span>
          ))}
          {collectedWords.length > 5 && <span className="flex items-end font-bold text-accent-gold drop-shadow-[0_0_5px_rgba(217,164,14,0.8)] tracking-widest">...</span>}
        </div>
      </div>
    </div>
  );
}
