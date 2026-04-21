import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PerlinNoise } from '@/utils/perlin';
import { audioSystem } from '@/utils/audio';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 240;
const TILE_SIZE = 16;

interface MemoryEntity {
  x: number;
  y: number;
  id: string;
  title: string;
  dialogue: { speaker?: string; text: string }[];
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { form, state, setGameState, takeDamage, setForm, showDialogue, collectMemory, collectedMemories } = useGameStore();
  const playerPos = useRef({ x: 160, y: 120 });
  const noise = useRef(new PerlinNoise(Math.random()));
  const keys = useRef<{ [key: string]: boolean }>({});
  const initialized = useRef(false);

  const memoryEntities = useRef<MemoryEntity[]>([
    {
      x: 200, y: 150, id: 'mem1', title: '◐',
      dialogue: [
        { speaker: '◰', text: '∴ ∵ ∷' },
        { speaker: '◱', text: '⋯' },
        { speaker: '◰', text: '∑ ∏ ∐' }
      ]
    },
    {
      x: 80, y: 80, id: 'mem2', title: '◑',
      dialogue: [
        { speaker: '◰', text: '∺ ∻ ∼ ∽' },
        { speaker: '◲', text: '≁ ≂ ≃' },
        { speaker: '◰', text: '≄ ≅ ≆' }
      ]
    }
  ]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // 开场对话
      setTimeout(() => {
        showDialogue([
          { text: '( ... )' },
          { speaker: '◱', text: '∴ ∵ ∷' },
          { speaker: '◲', text: '∸ ∹ ∺' }
        ]);
      }, 500);
    }
  }, [showDialogue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      
      // Handle game over restart
      if (state === 'gameover' && (e.key === 'r' || e.key === 'R')) {
        setGameState('playing');
        useGameStore.setState({ hp: 100 });
        return;
      }

      if (state !== 'playing') return;

      // Handle movement
      const speed = 2;
      let moved = false;
      if (!keys.current['Space']) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          moved = true;
        }
      }
      
      // 简单脚步声音效防抖（限制触发频率）
      if (moved && !keys.current['isMovingSound']) {
        keys.current['isMovingSound'] = true;
        audioSystem.playFootstep();
        setTimeout(() => { keys.current['isMovingSound'] = false; }, 200);
      }

      // Handle form switching
      if (e.code === 'Space') {
        if (keys.current['ArrowUp'] && form !== 'brush') { setForm('brush'); audioSystem.playSwitchForm('brush'); }
        if (keys.current['ArrowDown'] && form !== 'paper') { setForm('paper'); audioSystem.playSwitchForm('paper'); }
        if (keys.current['ArrowLeft'] && form !== 'ink') { setForm('ink'); audioSystem.playSwitchForm('ink'); }
        if (keys.current['ArrowRight'] && form !== 'stone') { setForm('stone'); audioSystem.playSwitchForm('stone'); }
      }

      // Mock combat trigger
      if (e.key === 'e' || e.key === 'E') {
        if (state !== 'playing') return;
        audioSystem.playAttack();
        useGameStore.getState().startPoetryCombat({
          id: '1',
          content: '◧ ◨ ◩ ◪ ◫',
          missingPart: '◪ ◫',
          options: ['◪ ◭', '◨ ◪', '◪ ◫'],
          correctIndex: 2,
          effect: 'damage'
        });
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setForm, state, setGameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Disable smoothing
    ctx.imageSmoothingEnabled = false;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      // Update logic
      if (state === 'playing') {
        const speed = 2;
        let dx = 0; let dy = 0;
        // Don't move if space is held (switching form)
        if (!keys.current['Space']) {
          if (keys.current['ArrowUp']) dy -= speed;
          if (keys.current['ArrowDown']) dy += speed;
          if (keys.current['ArrowLeft']) dx -= speed;
          if (keys.current['ArrowRight']) dx += speed;
        }

        playerPos.current.x = Math.max(8, Math.min(CANVAS_WIDTH - 8, playerPos.current.x + dx));
        playerPos.current.y = Math.max(8, Math.min(CANVAS_HEIGHT - 8, playerPos.current.y + dy));
      }

      // Draw Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Generate Map (1-bit style)
      ctx.fillStyle = '#000000';
      const perlin = noise.current;
      for (let x = 0; x < CANVAS_WIDTH; x += TILE_SIZE) {
        for (let y = 0; y < CANVAS_HEIGHT; y += TILE_SIZE) {
          const val = perlin.noise(x * 0.05, y * 0.05);
          if (val > 0.6) {
            // Draw mountains (black blocks with white dots)
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 4, y + 4, 2, 2);
            ctx.fillStyle = '#000000';
          } else if (val < 0.35) {
            // Draw water ripples (dithered)
            if ((Math.floor(x / TILE_SIZE) + Math.floor(y / TILE_SIZE) + Math.floor(time / 20)) % 3 === 0) {
              ctx.fillRect(x + 6, y + 6, 4, 2);
            }
          }
        }
      }

      // Draw Player
      const formColor = form === 'ink' ? '#000000' : form === 'paper' ? '#cccccc' : '#333333';
      ctx.fillStyle = formColor;
      ctx.fillRect(playerPos.current.x - 8, playerPos.current.y - 8, 16, 16);
      
      // Draw form character
      ctx.fillStyle = form === 'paper' ? '#000000' : '#ffffff';
      ctx.font = '10px Zpix, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const formChar = form === 'brush' ? '◧' : form === 'ink' ? '◨' : form === 'paper' ? '◩' : '◪';
      ctx.fillText(formChar, playerPos.current.x, playerPos.current.y);

      // Draw Memory Fragments
      memoryEntities.current.forEach(mem => {
        if (!collectedMemories.includes(mem.id)) {
          // Glow effect
          ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(time * 0.1) * 0.5})`;
          ctx.beginPath();
          ctx.arc(mem.x, mem.y, 10, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.fillRect(mem.x - 4, mem.y - 4, 8, 8);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('◉', mem.x, mem.y);

          // Check collision
          const dx = playerPos.current.x - mem.x;
          const dy = playerPos.current.y - mem.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 16 && state === 'playing') {
            collectMemory(mem.id);
            audioSystem.playSuccess();
            showDialogue(mem.dialogue);
          }
        }
      });

      time++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [state, form, collectedMemories, collectMemory, showDialogue]);

  return (
    <div className="relative w-full h-full bg-paper">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="w-full h-full object-contain bg-paper"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="scanline absolute inset-0 z-10 opacity-50" />
      {/* Game Over Overlay */}
      {state === 'gameover' && (
        <div className="absolute inset-0 bg-ink text-paper flex flex-col items-center justify-center z-20">
          <h2 className="text-4xl mb-4">...</h2>
          <p className="animate-pulse">[R] ↺</p>
        </div>
      )}
    </div>
  );
}
