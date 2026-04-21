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
    <div className="min-h-screen bg-ink text-paper p-8">
      <div className="max-w-4xl mx-auto relative">
        <button 
          onClick={() => { audioSystem.playConfirm(); navigate('/'); }}
          onMouseEnter={() => audioSystem.playHover()}
          className="absolute -top-4 -left-4 px-4 py-2 border-2 border-paper hover:bg-paper hover:text-ink transition-colors"
        >
          &lt; 返回主页
        </button>
        
        <h1 className="text-4xl text-center mb-8 border-b-4 border-paper pb-4">文心宝录</h1>

        <div className="flex gap-4 mb-8 justify-center">
          <button 
            className={`px-6 py-2 border-2 transition-colors ${activeTab === 'words' ? 'border-paper bg-paper text-ink' : 'border-paper text-paper'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('words'); }}
            onMouseEnter={() => { if(activeTab !== 'words') audioSystem.playHover(); }}
          >
            字魂
          </button>
          <button 
            className={`px-6 py-2 border-2 transition-colors ${activeTab === 'poems' ? 'border-paper bg-paper text-ink' : 'border-paper text-paper'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('poems'); }}
            onMouseEnter={() => { if(activeTab !== 'poems') audioSystem.playHover(); }}
          >
            诗词
          </button>
          <button 
            className={`px-6 py-2 border-2 transition-colors ${activeTab === 'memories' ? 'border-paper bg-paper text-ink' : 'border-paper text-paper'}`}
            onClick={() => { audioSystem.playConfirm(); setActiveTab('memories'); }}
            onMouseEnter={() => { if(activeTab !== 'memories') audioSystem.playHover(); }}
          >
            记忆
          </button>
        </div>

        <div className="pixel-border p-6 bg-ink min-h-[400px]">
          {activeTab === 'words' && (
            <div>
              <h2 className="text-2xl mb-4 border-b-2 border-paper-dark pb-2">已获字魂 ({collectedWords.length})</h2>
              <div className="flex flex-wrap gap-4">
                {collectedWords.map((word, i) => (
                  <div key={i} className="w-16 h-16 bg-paper text-ink flex items-center justify-center text-4xl font-bold">
                    {word}
                  </div>
                ))}
                {collectedWords.length === 0 && (
                  <p className="text-paper-dark w-full text-center py-10">空空如也，前路漫漫...</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'poems' && (
            <div>
              <h2 className="text-2xl mb-4 border-b-2 border-paper-dark pb-2">诗词图鉴 ({unlockedPoems.length}/{allPoems.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPoems.map((poem) => (
                  <div 
                    key={poem.id} 
                    className={`p-4 border-2 flex flex-col gap-2 ${poem.unlocked ? 'border-paper bg-ink text-paper' : 'border-paper-dark text-paper-dark opacity-50'}`}
                  >
                    <h3 className="text-xl font-bold">{poem.unlocked ? poem.title : '未解之谜'}</h3>
                    <p className="text-sm">{poem.unlocked ? poem.preview : '??? ...'}</p>
                    {poem.unlocked && <p className="text-xs mt-2 text-paper-dark whitespace-pre-wrap">{poem.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div>
              <h2 className="text-2xl mb-4 border-b-2 border-paper-dark pb-2">世界记忆 ({collectedMemories.length}/{allMemories.length})</h2>
              <div className="flex flex-col gap-6">
                {allMemories.map((mem) => (
                  <div key={mem.id} className="relative">
                    {!mem.unlocked && (
                      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm z-10 flex items-center justify-center border-2 border-paper-dark">
                        <span className="text-paper-dark">记忆尚未寻回</span>
                      </div>
                    )}
                    <div className="border-l-4 border-paper pl-4 py-2">
                      <h3 className="text-xl mb-2 font-bold">{mem.title}</h3>
                      <p className="whitespace-pre-wrap leading-relaxed text-paper-dark">{mem.content}</p>
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
