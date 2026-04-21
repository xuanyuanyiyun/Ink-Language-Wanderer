import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

export default function PoetryCombatUI() {
  const { state, currentPoemCombat, endPoetryCombat } = useGameStore();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (state !== 'poetry-combat' || !currentPoemCombat) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : currentPoemCombat.options.length - 1));
        audioSystem.playSwitch();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < currentPoemCombat.options.length - 1 ? prev + 1 : 0));
        audioSystem.playSwitch();
      } else if (e.key === 'Enter' || e.key === ' ') {
        const isCorrect = selectedIndex === currentPoemCombat.correctIndex;
        if (isCorrect) {
          audioSystem.playSuccess();
        } else {
          audioSystem.playDamage();
        }
        endPoetryCombat(isCorrect);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, currentPoemCombat, selectedIndex, endPoetryCombat]);

  if (state !== 'poetry-combat' || !currentPoemCombat) return null;

  const [prefix, suffix] = currentPoemCombat.content.split(currentPoemCombat.missingPart);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px] bg-ink text-paper border-2 border-paper p-4 z-30 shadow-[4px_4px_0_rgba(255,255,255,0.5)]">
      <div className="mb-4 text-xl border-b-2 border-paper pb-2 flex items-center justify-center">
        <span>{prefix}</span>
        <span className="inline-block border-b-2 border-paper w-24 text-center mx-2 text-paper-dark relative">
          <span className="animate-pulse">______</span>
        </span>
        <span>{suffix}</span>
      </div>
      <div className="flex flex-col gap-2">
        {currentPoemCombat.options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`px-4 py-2 flex items-center gap-2 cursor-pointer transition-colors ${
              idx === selectedIndex ? 'bg-paper text-ink font-bold' : 'bg-ink text-paper hover:bg-ink-light'
            }`}
            onClick={() => setSelectedIndex(idx)}
          >
            <span>{idx + 1}.</span>
            <span>{opt}</span>
            {idx === selectedIndex && <span className="ml-auto animate-pulse">←</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-paper-dark text-center animate-pulse">
        ↑↓ 选择，空格/回车 确认
      </div>
    </div>
  );
}
