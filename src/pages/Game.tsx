import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import GameCanvas from '@/components/GameCanvas';
import HUD from '@/components/HUD';
import PoetryCombatUI from '@/components/PoetryCombatUI';
import DialogueUI from '@/components/DialogueUI';
import { audioSystem } from '@/utils/audio';

export default function Game() {
  const { state, setGameState } = useGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Start playing on mount
    if (state === 'menu' || state === 'collection') {
      setGameState('playing');
    }
  }, [state, setGameState]);

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 text-paper text-sm">
        <button onClick={() => { audioSystem.playConfirm(); navigate('/'); }} className="hover:text-paper-dark border-b border-transparent hover:border-paper-dark">
          &lt; ⌂
        </button>
        <div className="flex gap-4">
          <span>[↑↓←→] ◧</span>
          <span>[Space + ↑↓←→] ◨</span>
          <span>[E] ◩</span>
        </div>
      </div>
      <div className="relative w-full max-w-4xl aspect-[4/3] border-4 border-paper bg-paper shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden">
        <HUD />
        <GameCanvas />
        <PoetryCombatUI />
        <DialogueUI />
      </div>
    </div>
  );
}
