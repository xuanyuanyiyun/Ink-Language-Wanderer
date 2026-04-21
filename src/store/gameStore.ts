import { create } from 'zustand';

export type GameForm = 'brush' | 'ink' | 'paper' | 'stone';
export type GameStateEnum = 'menu' | 'playing' | 'poetry-combat' | 'gameover' | 'collection' | 'dialogue';

export interface Poem {
  id: string;
  content: string; // e.g., "生当作人杰，死亦为鬼雄"
  missingPart: string; // e.g., "死亦为鬼雄"
  options: string[]; // e.g., ["死亦为鬼雄", "生亦为鬼雄", "死亦为鬼杰"]
  correctIndex: number;
  effect: 'heal' | 'summon' | 'damage' | 'terrain';
}

export interface Dialogue {
  speaker?: string;
  text: string;
}

export interface MemoryFragment {
  id: string;
  title: string;
  content: string;
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
  collectedMemories: string[]; // 收集的记忆碎片ID
  currentPoemCombat: Poem | null;
  currentDialogue: Dialogue[] | null;
  dialogueIndex: number;
  
  // Actions
  setGameState: (state: GameStateEnum) => void;
  setForm: (form: GameForm) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  consumeWenqi: (amount: number) => boolean;
  restoreWenqi: (amount: number) => void;
  collectWord: (word: string) => void;
  unlockPoem: (poemId: string) => void;
  collectMemory: (memoryId: string) => void;
  startPoetryCombat: (poem: Poem) => void;
  endPoetryCombat: (success: boolean) => void;
  showDialogue: (dialogues: Dialogue[]) => void;
  nextDialogue: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  state: 'menu',
  hp: 100,
  maxHp: 100,
  wenqi: 100,
  maxWenqi: 100,
  form: 'brush',
  collectedWords: ['△', '○', '□'],
  unlockedPoems: [],
  collectedMemories: [],
  currentPoemCombat: null,
  currentDialogue: null,
  dialogueIndex: 0,

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
  collectMemory: (memoryId) => set((state) => {
    if (!state.collectedMemories.includes(memoryId)) {
      return { collectedMemories: [...state.collectedMemories, memoryId] };
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
  showDialogue: (dialogues) => set({
    state: 'dialogue',
    currentDialogue: dialogues,
    dialogueIndex: 0,
  }),
  nextDialogue: () => set((state) => {
    if (!state.currentDialogue) return state;
    
    if (state.dialogueIndex < state.currentDialogue.length - 1) {
      return { dialogueIndex: state.dialogueIndex + 1 };
    } else {
      // 结束对话，返回游玩状态
      return { 
        state: 'playing',
        currentDialogue: null,
        dialogueIndex: 0
      };
    }
  }),
}));
