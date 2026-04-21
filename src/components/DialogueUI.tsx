import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

const AnimatedAvatar = ({ speaker, isTyping }: { speaker?: string, isTyping: boolean }) => {
  const primary = "var(--color-paper)";
  let secondary = "var(--color-accent-blue)";
  const bg = "bg-ink/95";
  let border = "border-accent-blue";
  
  if (speaker === '惊鸿') {
    secondary = "var(--color-accent)";
    border = "border-accent";
  } else if (speaker === '师父' || speaker === '焚书') {
    secondary = "var(--color-accent-gold)";
    border = "border-accent-gold";
  } else if (speaker === '纸魄') {
    secondary = "var(--color-accent-green)";
    border = "border-accent-green";
  }

  return (
    <div className={`w-28 h-36 border-4 ${bg} ${border} relative overflow-hidden flex-shrink-0 flex flex-col items-center justify-end pb-2 shadow-pixel`}>
      {/* 噪点背景 */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--color-paper) 2px, var(--color-paper) 4px)' }}></div>
      
      {/* SVG Avatar */}
      <svg viewBox="0 0 100 100" className={`w-24 h-24 relative z-10 transition-transform ${isTyping ? 'animate-talk' : ''}`}>
        {/* 斗笠/帽子或头部外轮廓 */}
        <path d="M10,100 Q50,20 90,100 Z" fill={primary} />
        {/* 脸部 */}
        <circle cx="50" cy="45" r="18" fill={primary} />
        
        {/* 领巾/配饰特征 */}
        <path d="M32,62 L68,62 L55,90 L45,90 Z" fill={secondary} />
        
        {/* 眼睛 */}
        <rect x="40" y="40" width="6" height="4" fill="var(--color-ink)" />
        <rect x="54" y="40" width="6" height="4" fill="var(--color-ink)" />

        {/* 嘴巴 (随打字状态动画) */}
        {isTyping ? (
          <rect x="45" y="52" width="10" height="6" fill="var(--color-ink)" className="animate-pulse" />
        ) : (
          <rect x="46" y="52" width="8" height="2" fill="var(--color-ink)" />
        )}
      </svg>
    </div>
  );
};

export default function DialogueUI() {
  const { state, currentDialogue, dialogueIndex, nextDialogue } = useGameStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (state !== 'dialogue' || !currentDialogue) return;

    const fullText = currentDialogue[dialogueIndex].text;
    setDisplayedText('');
    setIsTyping(true);

    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(fullText.substring(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
      // typing sound
      if (i % 3 === 0) {
        audioSystem.playAttack(); // simulate typing sound
      }
    }, 50);

    return () => clearInterval(timer);
  }, [state, currentDialogue, dialogueIndex]);

  useEffect(() => {
    if (state !== 'dialogue') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (isTyping) {
          // show full text immediately
          setDisplayedText(currentDialogue![dialogueIndex].text);
          setIsTyping(false);
        } else {
          // next line
          audioSystem.playConfirm();
          nextDialogue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, isTyping, currentDialogue, dialogueIndex, nextDialogue]);

  if (state !== 'dialogue' || !currentDialogue) return null;

  const current = currentDialogue[dialogueIndex];
  
  let borderColor = "border-accent-blue";
  let nameBgColor = "bg-accent-blue";
  if (current.speaker === '惊鸿') { borderColor = "border-accent"; nameBgColor = "bg-accent"; }
  else if (current.speaker === '师父' || current.speaker === '焚书') { borderColor = "border-accent-gold"; nameBgColor = "bg-accent-gold"; }
  else if (current.speaker === '纸魄') { borderColor = "border-accent-green"; nameBgColor = "bg-accent-green"; }

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-[760px] z-40 flex items-end gap-4">
      {/* 2D Character Avatar */}
      {current.speaker && <AnimatedAvatar speaker={current.speaker} isTyping={isTyping} />}

      <div className="flex-1 flex flex-col items-start gap-1">
        {current.speaker && (
          <div className={`${nameBgColor} text-paper px-6 py-2 border-2 border-paper text-xl font-bold shadow-pixel tracking-widest relative`}>
            {/* 名字框装饰点 */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-paper/50"></div>
            {current.speaker}
          </div>
        )}
        <div className={`w-full bg-ink/95 backdrop-blur-md text-paper border-4 ${borderColor} p-6 shadow-pixel min-h-[140px] relative cursor-pointer group hover:border-paper transition-colors`}
             onClick={() => {
               if (isTyping) {
                 setDisplayedText(currentDialogue[dialogueIndex].text);
                 setIsTyping(false);
               } else {
                 audioSystem.playConfirm();
                 nextDialogue();
               }
             }}>
          <p className="text-2xl leading-relaxed whitespace-pre-wrap tracking-wide text-paper drop-shadow-[0_2px_2px_rgba(0,0,0,1)] font-bold">
            {displayedText}
          </p>
          
          {!isTyping && (
            <div className="absolute bottom-4 right-6 animate-pulse text-accent-gold text-sm font-mono tracking-widest group-hover:text-paper transition-colors drop-shadow-md">
              ▼ 继续
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
