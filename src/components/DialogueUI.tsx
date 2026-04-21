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

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-[640px] z-40 flex flex-col items-start gap-1">
      {current.speaker && (
        <div className="bg-ink text-paper px-6 py-2 border-2 border-paper text-xl font-bold shadow-pixel tracking-widest relative">
          {/* 名字框装饰点 */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-paper/50"></div>
          {current.speaker}
        </div>
      )}
      <div className="w-full bg-ink/95 backdrop-blur-md text-paper border-4 border-paper p-6 shadow-pixel min-h-[140px] relative cursor-pointer group hover:border-paper-dark transition-colors"
           onClick={() => {
             if (isTyping) {
               setDisplayedText(currentDialogue[dialogueIndex].text);
               setIsTyping(false);
             } else {
               audioSystem.playConfirm();
               nextDialogue();
             }
           }}>
        <p className="text-xl leading-relaxed whitespace-pre-wrap tracking-wide">{displayedText}</p>
        
        {!isTyping && (
          <div className="absolute bottom-4 right-6 animate-pulse text-paper-dark text-sm font-mono tracking-widest group-hover:text-paper transition-colors">
            ▼
          </div>
        )}
      </div>
    </div>
  );
}
