// Simple audio synthesizer for UI sound effects
// This avoids loading external assets and feels snappy

let audioCtx: AudioContext | null = null;

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

type SoundType = 'click' | 'nav' | 'success' | 'alert' | 'error';

export const playSfx = (type: SoundType) => {
    try {
        const ctx = initAudio();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'click':
                // High pitch short blip
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.1);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'nav':
                // Soft swoosh/pop
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.linearRampToValueAtTime(400, now + 0.05);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;

            case 'success':
                // Ascending chime
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.setValueAtTime(554, now + 0.1); // C#
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;

            case 'alert':
                // Warning buzz
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
                
            case 'error':
                 // Low thud
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(100, now);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;
        }
    } catch (e) {
        // Audio might be blocked by browser policy until interaction
        console.error("Audio playback failed", e);
    }
};