import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';

export default function Collection() {
  const navigate = useNavigate();
  const { collectedWords, unlockedPoems } = useGameStore();

  const allPoems = [
    { id: '1', title: '《静夜思》', preview: '床前明月光...', unlocked: unlockedPoems.includes('1') },
    { id: '2', title: '《登鹳雀楼》', preview: '白日依山尽...', unlocked: unlockedPoems.includes('2') },
    { id: '3', title: '《将进酒》', preview: '君不见黄河之水天上来...', unlocked: unlockedPoems.includes('3') },
  ];

  return (
    <div className="min-h-screen bg-ink text-paper p-8">
      <div className="max-w-4xl mx-auto relative">
        <button 
          onClick={() => navigate('/')}
          className="absolute -top-4 -left-4 px-4 py-2 border-2 border-paper hover:bg-paper hover:text-ink transition-colors"
        >
          返回主页
        </button>
        
        <h1 className="text-4xl text-center mb-12 border-b-4 border-paper pb-4">文心宝录</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="pixel-border p-6 bg-ink">
            <h2 className="text-2xl mb-4 border-b-2 border-paper-dark pb-2">已获字魂 ({collectedWords.length})</h2>
            <div className="flex flex-wrap gap-2">
              {collectedWords.map((word, i) => (
                <div key={i} className="w-12 h-12 bg-paper text-ink flex items-center justify-center text-2xl font-bold">
                  {word}
                </div>
              ))}
              {collectedWords.length === 0 && (
                <p className="text-paper-dark">空空如也，前路漫漫...</p>
              )}
            </div>
          </section>

          <section className="pixel-border p-6 bg-ink">
            <h2 className="text-2xl mb-4 border-b-2 border-paper-dark pb-2">诗词图鉴 ({unlockedPoems.length}/{allPoems.length})</h2>
            <div className="flex flex-col gap-4">
              {allPoems.map((poem) => (
                <div 
                  key={poem.id} 
                  className={`p-4 border-2 ${poem.unlocked ? 'border-paper bg-ink text-paper' : 'border-paper-dark text-paper-dark opacity-50'}`}
                >
                  <h3 className="text-xl mb-2">{poem.unlocked ? poem.title : '未解之谜'}</h3>
                  <p className="text-sm">{poem.unlocked ? poem.preview : '??? ...'}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
