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
        audioSystem.playHover();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < currentPoemCombat.options.length - 1 ? prev + 1 : 0));
        audioSystem.playHover();
      } else if (e.key === 'Enter' || e.key === ' ') {
        const isCorrect = selectedIndex === currentPoemCombat.correctIndex;
        if (isCorrect) {
          audioSystem.playPoemCorrect();
        } else {
          audioSystem.playPoemWrong();
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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-ink/95 backdrop-blur-md text-paper border-4 border-paper p-6 z-30 shadow-pixel">
      {/* 角落装饰 */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-paper"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-paper"></div>

      <div className="mb-6 text-2xl border-b-2 border-paper-dark/50 pb-4 flex items-center justify-center tracking-widest">
        <span>{prefix}</span>
        <span className="inline-block border-b-4 border-paper w-32 text-center mx-3 text-paper relative">
          <span className="animate-pulse absolute bottom-1 left-1/2 -translate-x-1/2">？</span>
        </span>
        <span>{suffix}</span>
      </div>
      <div className="flex flex-col gap-3">
        {currentPoemCombat.options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`px-6 py-3 flex items-center gap-4 cursor-pointer transition-all duration-200 border-2 ${
              idx === selectedIndex 
                ? 'bg-paper text-ink font-bold border-paper scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'bg-ink text-paper border-transparent hover:border-paper-dark hover:bg-ink-light'
            }`}
            onMouseEnter={() => {
              if(selectedIndex !== idx) audioSystem.playHover();
              setSelectedIndex(idx);
            }}
            onClick={() => {
              const isCorrect = idx === currentPoemCombat.correctIndex;
              if (isCorrect) {
                audioSystem.playPoemCorrect();
              } else {
                audioSystem.playPoemWrong();
                audioSystem.playDamage();
              }
              endPoetryCombat(isCorrect);
            }}
          >
            <span className="opacity-50 font-mono">{idx + 1}.</span>
            <span className="tracking-widest text-lg">{opt}</span>
            {idx === selectedIndex && <span className="ml-auto animate-pulse">◀</span>}
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs text-paper-dark text-center animate-pulse tracking-widest font-mono">
        [↑↓] ◧ / [Space|Enter] ◨
      </div>
    </div>
  );
}
