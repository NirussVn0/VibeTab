/**
 * useSound - Simple Web Audio API sound effects
 * Generates notification tones for timer events
 */
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings.store'

const audioContext = ref<AudioContext | null>(null)

function getContext(): AudioContext {
  if (!audioContext.value) {
    audioContext.value = new AudioContext()
  }
  return audioContext.value
}

export function useSound() {
  const settingsStore = useSettingsStore()

  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!settingsStore.general.pomodoroSound) return

    const ctx = getContext()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start()
    oscillator.stop(ctx.currentTime + duration)
  }

  const playComplete = () => {
    playTone(880, 0.2)
    setTimeout(() => playTone(1046, 0.2), 200)
    setTimeout(() => playTone(1318, 0.3), 400)
  }

  const playStart = () => {
    playTone(523, 0.15)
  }

  const playPause = () => {
    playTone(392, 0.1)
  }

  return {
    playTone,
    playComplete,
    playStart,
    playPause
  }
}
