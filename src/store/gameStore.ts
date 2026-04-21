import { create } from 'zustand';

export type GameForm = 'brush' | 'ink' | 'paper' | 'stone';
export type GameStateEnum = 'menu' | 'playing' | 'poetry-combat' | 'gameover' | 'collection';

export interface Poem {
  id: string;
  content: string; // e.g., "生当作人杰，死亦为鬼雄"
  missingPart: string; // e.g., "死亦为鬼雄"
  options: string[]; // e.g., ["死亦为鬼雄", "生亦为鬼雄", "死亦为鬼杰"]
  correctIndex: number;
  effect: 'heal' | 'summon' | 'damage' | 'terrain';
}

interface GameState {
  state: GameStateEnum;
  hp: number;
  maxHp: number;
  wenqi: number;
  maxWenqi: number;
  form: GameForm;
  collectedWords: string[];
  unlockedPoems: string[];
  currentPoemCombat: Poem | null;
  
  // Actions
  setGameState: (state: GameStateEnum) => void;
  setForm: (form: GameForm) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  consumeWenqi: (amount: number) => boolean;
  restoreWenqi: (amount: number) => void;
  collectWord: (word: string) => void;
  unlockPoem: (poemId: string) => void;
  startPoetryCombat: (poem: Poem) => void;
  endPoetryCombat: (success: boolean) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  state: 'menu',
  hp: 100,
  maxHp: 100,
  wenqi: 100,
  maxWenqi: 100,
  form: 'brush',
  collectedWords: ['天', '地', '人'],
  unlockedPoems: [],
  currentPoemCombat: null,

  setGameState: (state) => set({ state }),
  setForm: (form) => set({ form }),
  takeDamage: (amount) => set((state) => ({ 
    hp: Math.max(0, state.hp - amount),
    state: state.hp - amount <= 0 ? 'gameover' : state.state
  })),
  heal: (amount) => set((state) => ({ hp: Math.min(state.maxHp, state.hp + amount) })),
  consumeWenqi: (amount) => {
    const state = get();
    if (state.wenqi >= amount) {
      set({ wenqi: state.wenqi - amount });
      return true;
    }
    return false;
  },
  restoreWenqi: (amount) => set((state) => ({ wenqi: Math.min(state.maxWenqi, state.wenqi + amount) })),
  collectWord: (word) => set((state) => {
    if (!state.collectedWords.includes(word)) {
      return { collectedWords: [...state.collectedWords, word] };
    }
    return state;
  }),
  unlockPoem: (poemId) => set((state) => {
    if (!state.unlockedPoems.includes(poemId)) {
      return { unlockedPoems: [...state.unlockedPoems, poemId] };
    }
    return state;
  }),
  startPoetryCombat: (poem) => set({ 
    state: 'poetry-combat', 
    currentPoemCombat: poem 
  }),
  endPoetryCombat: (success) => set((state) => {
    if (!success) {
      // 受到反噬伤害
      return { 
        state: 'playing', 
        currentPoemCombat: null,
        hp: Math.max(0, state.hp - 20)
      };
    }
    return { 
      state: 'playing', 
      currentPoemCombat: null 
    };
  }),
}));
