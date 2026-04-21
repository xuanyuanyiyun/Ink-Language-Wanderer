import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { audioSystem } from '@/utils/audio';

export default function Collection() {
  const navigate = useNavigate();
  const { collectedWords, unlockedPoems, collectedMemories } = useGameStore();
  const [activeTab, setActiveTab] = useState<'words' | 'poems' | 'memories'>('words');

  const allPoems = [
    { id: '1', title: '《静夜思》', preview: '床前明月光...', desc: '【创作背景】李白在长安思乡之作。解锁此诗，方知游子之苦。', unlocked: unlockedPoems.includes('1') },
    { id: '2', title: '《登鹳雀楼》', preview: '白日依山尽...', desc: '【创作背景】王之涣登高望远，体现了唐人的豪迈气象。', unlocked: unlockedPoems.includes('2') },
    { id: '3', title: '《将进酒》', preview: '君不见黄河之水天上...', desc: '【创作背景】千古绝唱。传闻曾引发忘川震荡。', unlocked: unlockedPoems.includes('3') },
  ];

  const allMemories = [
    { id: 'mem1', title: '师父的教导', content: '“文明是宇宙对抗熵增的唯一方式。一撇一捺，相互支撑，方为‘人’。”\n——你隐约记得，那是你第一次握笔时的场景。', unlocked: collectedMemories.includes('mem1') },
    { id: 'mem2', title: '燃烧的禁书', content: '“若文明必伴苦难，此文明值得存否？不完美的文明，不如无文明。”\n——师父在火光中的背影，显得无比陌生。', unlocked: collectedMemories.includes('mem2') },
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
          &lt; 返回卷首
        </button>
        
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl text-center tracking-[0.3em] font-bold text-accent-gold drop-shadow-[0_0_15px_rgba(217,164,14,0.6)] relative">
            文心宝录
          </h1>
          <div className="w-64 h-[2px] bg-accent-gold/50 mt-6 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-ink border-2 border-accent-gold rotate-45 shadow-[0_0_10px_rgba(217,164,14,0.4)]"></div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 justify-center">
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'words' ? 'border-accent-gold bg-accent-gold text-ink shadow-[0_0_15px_rgba(217,164,14,0.5)] translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-accent-gold bg-ink shadow-sm hover:text-accent-gold'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('words'); }}
            onMouseEnter={() => { if(activeTab !== 'words') audioSystem.playHover(); }}
          >
            残字碑
          </button>
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'poems' ? 'border-accent-blue bg-accent-blue text-paper shadow-[0_0_15px_rgba(42,92,170,0.5)] translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-accent-blue bg-ink shadow-sm hover:text-accent-blue'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('poems'); }}
            onMouseEnter={() => { if(activeTab !== 'poems') audioSystem.playHover(); }}
          >
            诗词卷
          </button>
          <button 
            className={`px-8 py-3 border-4 font-bold tracking-widest transition-all duration-200 ${activeTab === 'memories' ? 'border-accent bg-accent text-paper shadow-[0_0_15px_rgba(192,72,81,0.5)] translate-y-[-2px]' : 'border-paper-dark text-paper hover:border-accent bg-ink shadow-sm hover:text-accent'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('memories'); }}
            onMouseEnter={() => { if(activeTab !== 'memories') audioSystem.playHover(); }}
          >
            前尘梦
          </button>
        </div>

        <div className={`border-4 p-8 bg-ink/90 backdrop-blur-md min-h-[400px] shadow-pixel relative transition-colors duration-500 ${
          activeTab === 'words' ? 'border-accent-gold shadow-[0_0_20px_rgba(217,164,14,0.2)]' : 
          activeTab === 'poems' ? 'border-accent-blue shadow-[0_0_20px_rgba(42,92,170,0.2)]' : 
          'border-accent shadow-[0_0_20px_rgba(192,72,81,0.2)]'
        }`}>
          {/* 四角装饰 */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-paper/30"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-paper/30"></div>

          {activeTab === 'words' && (
            <div className="animate-breathe" style={{ animationDuration: '6s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-accent-gold/30 pb-2">
                <h2 className="text-2xl tracking-widest font-bold text-accent-gold">已获字魂</h2>
                <span className="text-accent-gold/80 font-mono text-sm">共 {collectedWords.length} 字</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {collectedWords.map((word, i) => (
                  <div key={i} className="w-16 h-16 bg-paper text-ink flex items-center justify-center text-4xl font-bold border-2 border-transparent hover:border-accent-gold hover:text-accent-gold hover:bg-ink cursor-pointer transition-all shadow-[2px_2px_0_rgba(217,164,14,0.6)]">
                    {word}
                  </div>
                ))}
                {collectedWords.length === 0 && (
                  <p className="text-accent-gold/60 w-full text-center py-10 tracking-widest">空空如也，前路漫漫...</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'poems' && (
            <div className="animate-breathe" style={{ animationDuration: '6s' }}>
              <div className="flex justify-between items-end mb-8 border-b-2 border-accent-blue/30 pb-2">
                <h2 className="text-2xl tracking-widest font-bold text-accent-blue">诗词图鉴</h2>
                <span className="text-accent-blue/80 font-mono text-sm">已解封 {unlockedPoems.length}/{allPoems.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allPoems.map((poem) => (
                  <div 
                    key={poem.id} 
                    className={`p-6 border-2 flex flex-col gap-3 transition-all ${
                      poem.unlocked 
                        ? 'border-accent-blue bg-ink text-paper hover:bg-accent-blue/10 shadow-[0_0_10px_rgba(42,92,170,0.2)]' 
                        : 'border-paper-dark/30 text-paper-dark/50 bg-ink/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className={`text-2xl font-bold tracking-widest ${poem.unlocked ? 'text-accent-blue drop-shadow-[0_0_5px_rgba(42,92,170,0.8)]' : ''}`}>{poem.unlocked ? poem.title : '未解之谜'}</h3>
                      {poem.unlocked && <div className="w-4 h-4 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(42,92,170,0.8)] animate-pulse"></div>}
                    </div>
                    <p className={`text-lg ${poem.unlocked ? 'text-paper' : 'opacity-50'}`}>{poem.unlocked ? poem.preview : '??? ...'}</p>
                    {poem.unlocked && (
                      <div className="mt-2 pt-3 border-t border-accent-blue/30">
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
              <div className="flex justify-between items-end mb-8 border-b-2 border-accent/30 pb-2">
                <h2 className="text-2xl tracking-widest font-bold text-accent">世界记忆</h2>
                <span className="text-accent/80 font-mono text-sm">已寻回 {collectedMemories.length}/{allMemories.length}</span>
              </div>
              <div className="flex flex-col gap-8">
                {allMemories.map((mem) => (
                  <div key={mem.id} className="relative group">
                    {!mem.unlocked && (
                      <div className="absolute inset-0 bg-ink/90 backdrop-blur-sm z-10 flex items-center justify-center border-2 border-paper-dark/30">
                        <span className="text-paper-dark tracking-widest">记忆尚未寻回...</span>
                      </div>
                    )}
                    <div className={`border-l-4 pl-6 py-2 transition-colors ${mem.unlocked ? 'border-accent hover:border-accent-gold' : 'border-paper-dark'}`}>
                      <h3 className={`text-2xl mb-4 font-bold tracking-widest ${mem.unlocked ? 'text-accent drop-shadow-[0_0_5px_rgba(192,72,81,0.5)]' : 'text-paper'}`}>{mem.title}</h3>
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
