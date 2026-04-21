import React from 'react';
import { useGameStore } from '@/store/gameStore';

export default function HUD() {
  const { hp, maxHp, wenqi, maxWenqi, form, collectedWords } = useGameStore();

  const formName = {
    brush: '笔形态',
    ink: '墨形态',
    paper: '纸形态',
    stone: '砚形态',
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-ink text-paper px-1 py-0.5 border border-paper text-sm">HP</span>
          <div className="w-32 h-4 border-2 border-ink bg-paper-dark flex">
            <div className="h-full bg-ink" style={{ width: `${(hp / maxHp) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-ink text-paper px-1 py-0.5 border border-paper text-sm">文气</span>
          <div className="w-32 h-4 border-2 border-ink bg-paper-dark flex">
            <div className="h-full bg-ink" style={{ width: `${(wenqi / maxWenqi) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="pixel-border-invert bg-ink text-paper px-4 py-2 text-xl font-bold flex items-center gap-2">
          <span className="animate-pulse">当前形态:</span>
          <span className="text-2xl">{formName[form]}</span>
        </div>
        <div className="flex gap-1 text-ink">
          {collectedWords.slice(0, 5).map((w, i) => (
            <span key={i} className="pixel-border bg-paper w-8 h-8 flex items-center justify-center font-bold">
              {w}
            </span>
          ))}
          {collectedWords.length > 5 && <span className="flex items-end">...</span>}
        </div>
      </div>
    </div>
  );
}
