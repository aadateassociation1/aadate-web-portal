let soundUnlocked = false;
const NOTIFICATION_SOUND_URL = "/sounds/notification-alert.mp3";

export function unlockNotificationSound() {
  soundUnlocked = true;
}

export function installNotificationSoundUnlock() {
  const unlock = () => unlockNotificationSound();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  return () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
}

export function playNotificationTone() {
  if (!soundUnlocked) return false;

  const audioFile = new Audio(NOTIFICATION_SOUND_URL);
  audioFile.volume = 1;
  const playPromise = audioFile.play();
  if (playPromise) {
    playPromise.catch(() => playGeneratedSirenTone());
    return true;
  }

  return true;
}

function playGeneratedSirenTone() {
  try {
    const AudioContextConstructor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return false;

    const audio = new AudioContextConstructor();
    const masterGain = audio.createGain();
    masterGain.gain.setValueAtTime(0.0001, audio.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.3, audio.currentTime + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 4.1);
    masterGain.connect(audio.destination);

    [0, 0.72, 1.44, 2.16, 2.88].forEach((offset) => {
      const oscillator = audio.createOscillator();
      const pulseGain = audio.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(620, audio.currentTime + offset);
      oscillator.frequency.linearRampToValueAtTime(1320, audio.currentTime + offset + 0.32);
      oscillator.frequency.linearRampToValueAtTime(620, audio.currentTime + offset + 0.64);
      pulseGain.gain.setValueAtTime(0.0001, audio.currentTime + offset);
      pulseGain.gain.exponentialRampToValueAtTime(0.75, audio.currentTime + offset + 0.04);
      pulseGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + offset + 0.68);
      oscillator.connect(pulseGain);
      pulseGain.connect(masterGain);
      oscillator.start(audio.currentTime + offset);
      oscillator.stop(audio.currentTime + offset + 0.7);
    });

    window.setTimeout(() => audio.close().catch(() => undefined), 4500);
    return true;
  } catch {
    return false;
  }
}
