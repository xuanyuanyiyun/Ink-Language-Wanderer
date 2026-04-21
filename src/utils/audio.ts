class AudioSystem {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    this.init();
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playNoise(duration: number) {
    this.init();
    if (!this.ctx) return;
    
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
  }

  // 攻击音效：短促方波
  public playAttack() {
    this.playTone(440, 'square', 0.1, 0.05);
  }

  // 形态切换：FM古琴风（近似三角波）
  public playSwitch() {
    this.playTone(660, 'triangle', 0.2, 0.1);
  }

  // 受击：爆破噪声
  public playDamage() {
    this.playNoise(0.2);
  }

  // 胜利/解锁：长鸣和弦
  public playSuccess() {
    this.playTone(440, 'sine', 0.5, 0.1);
    this.playTone(554.37, 'sine', 0.5, 0.1); // C#
    this.playTone(659.25, 'sine', 0.5, 0.1); // E
  }
}

export const audioSystem = new AudioSystem();
