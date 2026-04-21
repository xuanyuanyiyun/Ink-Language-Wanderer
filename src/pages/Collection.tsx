import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

export default function Collection() {
  const navigate = useNavigate();
  const { collectedWords, unlockedPoems, collectedMemories } = useGameStore();
  const [activeTab, setActiveTab] = useState<'words' | 'poems' | 'memories'>('words');

  const allPoems = [
    { id: '1', title: '◰ ◱', preview: '○ △ □...', desc: '∴ ∵ ∷ ∸ ∹', unlocked: unlockedPoems.includes('1') },
    { id: '2', title: '◲ ◳', preview: '□ ■ ▨...', desc: '∺ ∻ ∼ ∽ ∾', unlocked: unlockedPoems.includes('2') },
    { id: '3', title: '▤ ▥', preview: '▩ ▨ ▧...', desc: '∿ ≀ ≁ ≂ ≃', unlocked: unlockedPoems.includes('3') },
  ];

  const allMemories = [
    { id: 'mem1', title: '◈ ◉', content: '“◧ ◨ ◩ ◪”\n——▱ ▰ ▤ ▥', unlocked: collectedMemories.includes('mem1') },
    { id: 'mem2', title: '◎ ●', content: '“◫ ◬ ◭ ◮”\n——▧ ▨ ▩ ◘', unlocked: collectedMemories.includes('mem2') },
  ];

  return (
    <div className="min-h-screen bg-ink text-paper p-8 font-pixel relative overflow-hidden">
      {/* 噪点覆盖层 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => { audioSystem.playConfirm(); navigate('/'); }}
          onMouseEnter={() => audioSystem.playHover()}
          className="absolute -top-4 -left-4 px-6 py-2 border-4 border-paper bg-ink text-paper hover:bg-paper hover:text-ink transition-colors shadow-pixel font-bold tracking-widest"
        >
          ◁ ⌂
        </button>
        
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl text-center tracking-[0.3em] font-bold ink-glow relative">
            ▦ ▧ ▨
          </h1>
          <div className="w-64 h-[2px] bg-paper/50 mt-6 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-ink border-2 border-paper rotate-45"></div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'words' ? 'border-paper bg-paper text-ink shadow-pixel translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-paper bg-ink shadow-sm'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('words'); }}
            onMouseEnter={() => { if(activeTab !== 'words') audioSystem.playHover(); }}
          >
            △
          </button>
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'poems' ? 'border-paper bg-paper text-ink shadow-pixel translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-paper bg-ink shadow-sm'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('poems'); }}
            onMouseEnter={() => { if(activeTab !== 'poems') audioSystem.playHover(); }}
          >
            ◇
          </button>
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'memories' ? 'border-paper bg-paper text-ink shadow-pixel translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-paper bg-ink shadow-sm'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('memories'); }}
            onMouseEnter={() => { if(activeTab !== 'memories') audioSystem.playHover(); }}
          >
            ○
          </button>
        </div>

        <div className="border-4 border-paper p-8 bg-ink/90 backdrop-blur-md min-h-[400px] shadow-pixel relative">
          {/* 四角装饰 */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-paper/30"></div>

          {activeTab === 'words' && (
            <div className="animate-breathe" style={{ animationDuration: '6s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-paper-dark/50 pb-2">
                <h2 className="text-2xl tracking-widest font-bold">△ □</h2>
                <span className="text-paper-dark font-mono text-sm">∑ {collectedWords.length}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {collectedWords.map((word, i) => (
                  <div key={i} className="w-16 h-16 bg-paper text-ink flex items-center justify-center text-4xl font-bold border-2 border-transparent hover:border-accent hover:text-accent cursor-pointer transition-colors shadow-pixel">
                    {word}
                  </div>
                ))}
                {collectedWords.length === 0 && (
                  <p className="text-paper-dark w-full text-center py-10 tracking-widest">. . .</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'poems' && (
            <div className="animate-breathe" style={{ animationDuration: '6s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-paper-dark/50 pb-2">
                <h2 className="text-2xl tracking-widest font-bold">◇ ◈</h2>
                <span className="text-paper-dark font-mono text-sm">⊞ {unlockedPoems.length}/{allPoems.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allPoems.map((poem) => (
                  <div 
                    key={poem.id} 
                    className={`p-6 border-2 flex flex-col gap-3 transition-colors ${
                      poem.unlocked 
                        ? 'border-paper bg-ink text-paper hover:bg-paper/5' 
                        : 'border-paper-dark/30 text-paper-dark/50 bg-ink/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold tracking-widest">{poem.unlocked ? poem.title : '???'}</h3>
                      {poem.unlocked && <div className="w-4 h-4 bg-accent/80 rounded-full"></div>}
                    </div>
                    <p className="text-lg opacity-90">{poem.unlocked ? poem.preview : '...'}</p>
                    {poem.unlocked && (
                      <div className="mt-2 pt-3 border-t border-paper-dark/30">
                        <p className="text-sm text-paper-dark leading-relaxed">{poem.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="animate-breathe" style={{ animationDuration: '6s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-paper-dark/50 pb-2">
                <h2 className="text-2xl tracking-widest font-bold">○ ◎</h2>
                <span className="text-paper-dark font-mono text-sm">⊞ {collectedMemories.length}/{allMemories.length}</span>
              </div>
              <div className="flex flex-col gap-8">
                {allMemories.map((mem) => (
                  <div key={mem.id} className="relative group">
                    {!mem.unlocked && (
                      <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm z-10 flex items-center justify-center border-2 border-paper-dark/30">
                        <span className="text-paper-dark tracking-widest">...</span>
                      </div>
                    )}
                    <div className="border-l-4 border-paper pl-6 py-2 transition-colors group-hover:border-accent">
                      <h3 className="text-2xl mb-4 font-bold tracking-widest text-paper">{mem.title}</h3>
                      <p className="text-lg whitespace-pre-wrap leading-loose text-paper-dark italic">
                        {mem.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
