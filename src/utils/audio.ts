class AudioSystem {
  private ctx: AudioContext | null = null;
  private bgmOsc: OscillatorType | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmInterval: number | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // 基础发声函数
  public playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1, attack: number = 0.05) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // ADSR 包络
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 扫频发声（常用于攻击/特效）
  public playSweep(startFreq: number, endFreq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 噪声生成（环境音/沙沙声/爆破）
  public playNoise(duration: number, vol: number = 0.1, type: 'white' | 'pink' = 'white') {
    this.init();
    if (!this.ctx) return;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // 简单白噪声
      data[i] = Math.random() * 2 - 1;
      // 简易粉红噪声过滤（如果需要可以进一步处理）
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // 使用带通滤波器模拟风声或水声
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = type === 'pink' ? 400 : 1000;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  // === 角色与UI音效 ===

  // 移动：轻微脚步声
  public playFootstep() {
    this.playNoise(0.05, 0.02, 'pink');
  }

  // 攻击音效：短促方波/扫频
  public playAttack() {
    this.playSweep(800, 200, 'square', 0.15, 0.05);
  }

  // UI光标移动
  public playHover() {
    this.playTone(880, 'sine', 0.05, 0.02, 0.01);
  }

  // UI确认：毛笔落纸声
  public playConfirm() {
    this.playSweep(400, 100, 'triangle', 0.1, 0.1);
  }

  // 形态切换：四种不同音色
  public playSwitchForm(form: 'brush'|'ink'|'paper'|'stone') {
    switch(form) {
      case 'brush': this.playSweep(600, 800, 'square', 0.1, 0.05); break; // 清脆
      case 'ink': this.playSweep(300, 200, 'sine', 0.2, 0.08); break;     // 流动
      case 'paper': this.playNoise(0.15, 0.05, 'white'); break;           // 摩擦
      case 'stone': this.playTone(150, 'triangle', 0.3, 0.1); break;      // 沉稳
    }
  }

  // 受击：爆破噪声
  public playDamage() {
    this.playNoise(0.2, 0.2);
  }

  // 诗词填对：上行和弦 (Do-Mi-Sol)
  public playPoemCorrect() {
    this.playTone(523.25, 'sine', 0.3, 0.05); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.3, 0.05), 100); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.05), 200); // G5
  }

  // 诗词填错：不和谐音程
  public playPoemWrong() {
    this.playTone(261.63, 'sawtooth', 0.3, 0.1); // C4
    this.playTone(277.18, 'square', 0.3, 0.1); // C#4
  }

  // 记忆收集/胜利：长鸣和弦
  public playSuccess() {
    this.playTone(440, 'triangle', 1.0, 0.1);
    this.playTone(554.37, 'sine', 1.0, 0.1); // C#
    this.playTone(659.25, 'sine', 1.0, 0.1); // E
  }

  // === 程序化 BGM (五声音阶 宫商角徵羽: C D E G A) ===
  
  public startMenuBGM() {
    this.init();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    
    // C大调五声: C4(261.6), D4(293.6), E4(329.6), G4(392.0), A4(440.0)
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    
    let beat = 0;
    this.bgmInterval = window.setInterval(() => {
      if (!this.isBgmPlaying) return;
      
      // A段：空灵引子，随机五声音阶
      if (beat % 4 === 0) {
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        this.playTone(note, 'triangle', 0.8, 0.03, 0.2); // 模拟古琴拨弦
      }
      
      // B段背景铺底（每16拍一声低吟）
      if (beat % 16 === 0) {
        this.playTone(130.81, 'sine', 2.0, 0.05, 0.5); // C3
      }
      
      beat++;
    }, 250); // 120 BPM (半拍)
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioSystem = new AudioSystem();
