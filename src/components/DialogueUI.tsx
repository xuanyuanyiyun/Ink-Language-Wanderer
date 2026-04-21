import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

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
      // 偶尔发出打字音效
      if (i % 3 === 0) {
        audioSystem.playAttack(); // 使用短促音效模拟打字声
      }
    }, 50);

    return () => clearInterval(timer);
  }, [state, currentDialogue, dialogueIndex]);

  useEffect(() => {
    if (state !== 'dialogue') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (isTyping) {
          // 如果正在打字，直接显示全句
          setDisplayedText(currentDialogue![dialogueIndex].text);
          setIsTyping(false);
        } else {
          // 否则进入下一句
          audioSystem.playSwitch();
          nextDialogue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, isTyping, currentDialogue, dialogueIndex, nextDialogue]);

  if (state !== 'dialogue' || !currentDialogue) return null;

  const current = currentDialogue[dialogueIndex];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[600px] z-40 flex flex-col items-start gap-2">
      {current.speaker && (
        <div className="bg-ink text-paper px-4 py-1 border-2 border-paper text-lg font-bold shadow-[4px_4px_0_rgba(255,255,255,0.5)]">
          {current.speaker}
        </div>
      )}
      <div className="w-full bg-ink text-paper border-2 border-paper p-4 shadow-[4px_4px_0_rgba(255,255,255,0.5)] min-h-[100px] relative cursor-pointer"
           onClick={() => {
             if (isTyping) {
               setDisplayedText(currentDialogue[dialogueIndex].text);
               setIsTyping(false);
             } else {
               audioSystem.playSwitch();
               nextDialogue();
             }
           }}>
        <p className="text-lg leading-relaxed whitespace-pre-wrap">{displayedText}</p>
        
        {!isTyping && (
          <div className="absolute bottom-2 right-4 animate-pulse text-paper-dark text-sm">
            [空格/点击] 继续
          </div>
        )}
      </div>
    </div>
  );
}
