import React, { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

export default function PoetryCombatUI() {
  const { state, currentPoemCombat, endPoetryCombat } = useGameStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [resultState, setResultState] = useState<'none' | 'correct' | 'wrong'>('none');

  const handleSelection = useCallback((idx: number) => {
    if (resultState !== 'none') return;
    
    const isCorrect = idx === currentPoemCombat!.correctIndex;
    if (isCorrect) {
      audioSystem.playPoemCorrect();
      setResultState('correct');
    } else {
      audioSystem.playPoemWrong();
      audioSystem.playDamage();
      setResultState('wrong');
    }
    
    // 延迟关闭以展示反馈动画
    setTimeout(() => {
      setResultState('none');
      endPoetryCombat(isCorrect);
    }, 800);
  }, [currentPoemCombat, resultState, endPoetryCombat]);

  useEffect(() => {
    if (state !== 'poetry-combat' || !currentPoemCombat || resultState !== 'none') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : currentPoemCombat.options.length - 1));
        audioSystem.playHover();
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev < currentPoemCombat.options.length - 1 ? prev + 1 : 0));
        audioSystem.playHover();
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleSelection(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, currentPoemCombat, selectedIndex, resultState, handleSelection]);

  if (state !== 'poetry-combat' || !currentPoemCombat) return null;

  const [prefix, suffix] = currentPoemCombat.content.split(currentPoemCombat.missingPart);

  let containerBorder = "border-accent shadow-accent-glow";
  if (resultState === 'correct') containerBorder = "border-accent-green shadow-[0_0_30px_rgba(80,166,132,0.6)]";
  if (resultState === 'wrong') containerBorder = "border-accent shadow-[0_0_30px_rgba(192,72,81,0.8)] animate-pulse";

  return (
    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] bg-ink/95 backdrop-blur-md text-paper border-4 p-6 z-30 transition-all duration-300 ${containerBorder}`}>
      {/* 角落装饰 */}
      <div className={`absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 ${resultState === 'correct' ? 'border-accent-green' : 'border-accent'}`}></div>
      <div className={`absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 ${resultState === 'correct' ? 'border-accent-green' : 'border-accent'}`}></div>

      <div className="mb-6 text-2xl border-b-2 border-paper-dark/50 pb-4 flex items-center justify-center tracking-widest text-accent-gold drop-shadow-md">
        <span>{prefix}</span>
        <span className={`inline-block border-b-4 w-32 text-center mx-3 relative transition-colors duration-300 ${
          resultState === 'correct' ? 'border-accent-green text-accent-green' : 
          resultState === 'wrong' ? 'border-accent text-accent' : 'border-accent-gold'
        }`}>
          {resultState === 'none' ? (
            <span className="animate-pulse absolute bottom-1 left-1/2 -translate-x-1/2 text-accent">？</span>
          ) : (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-bold whitespace-nowrap">
              {currentPoemCombat.options[selectedIndex]}
            </span>
          )}
        </span>
        <span>{suffix}</span>
      </div>
      <div className="flex flex-col gap-3">
        {currentPoemCombat.options.map((opt, idx) => {
          let itemStyle = "bg-ink text-paper border-transparent hover:border-paper-dark hover:bg-ink-light";
          let numStyle = "opacity-50";
          let icon = null;

          if (idx === selectedIndex) {
            if (resultState === 'none') {
              itemStyle = "bg-paper text-ink font-bold border-accent scale-[1.02] shadow-[0_0_15px_rgba(192,72,81,0.3)]";
              numStyle = "text-accent";
              icon = <span className="ml-auto animate-pulse text-accent">◀</span>;
            } else if (resultState === 'correct') {
              itemStyle = "bg-accent-green text-paper font-bold border-paper scale-[1.05] shadow-[0_0_20px_rgba(80,166,132,0.6)]";
              numStyle = "text-paper opacity-80";
              icon = <span className="ml-auto text-paper">✔</span>;
            } else if (resultState === 'wrong') {
              itemStyle = "bg-accent text-paper font-bold border-paper scale-[0.98] shadow-inner";
              numStyle = "text-paper opacity-80";
              icon = <span className="ml-auto text-paper">✖</span>;
            }
          }

          return (
            <div 
              key={idx} 
              className={`px-6 py-3 flex items-center gap-4 transition-all duration-300 border-2 ${itemStyle} ${resultState !== 'none' ? 'pointer-events-none' : 'cursor-pointer'}`}
              onMouseEnter={() => {
                if(resultState === 'none' && selectedIndex !== idx) audioSystem.playHover();
                if(resultState === 'none') setSelectedIndex(idx);
              }}
              onClick={() => handleSelection(idx)}
            >
              <span className={`font-mono ${numStyle}`}>{idx + 1}.</span>
              <span className="tracking-widest text-lg">{opt}</span>
              {icon}
            </div>
          );
        })}
      </div>
      <div className={`mt-6 text-xs text-center tracking-widest font-mono transition-opacity ${resultState !== 'none' ? 'opacity-0' : 'opacity-100 text-paper-dark animate-pulse'}`}>
        ↑↓ 选择选项，空格/回车/点击 确认填写
      </div>
    </div>
  );
}
