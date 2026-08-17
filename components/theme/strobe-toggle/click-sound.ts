const CLICK_SAMPLE_RATE = 44100
const CLICK_DURATION = 0.06
const CLICK_GAP = 0.018 // seconds between the "click" and the "clack"

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i))
  }
}

// Cheap state-variable bandpass filter (Chamberlin design) run over raw
// white noise — gives the tick its narrow, "crisp" timbre instead of a
// flat hiss.
function bandpassNoise(
  length: number,
  sampleRate: number,
  freq: number,
  q: number,
): Float32Array {
  const out = new Float32Array(length)
  const f = 2 * Math.sin((Math.PI * freq) / sampleRate)
  const qInv = 1 / q
  let low = 0
  let band = 0
  let peak = 0
  for (let i = 0; i < length; i++) {
    const x = Math.random() * 2 - 1
    const high = x - low - qInv * band
    band += f * high
    low += f * band
    out[i] = band
    peak = Math.max(peak, Math.abs(band))
  }
  const norm = peak > 0 ? 1 / peak : 1
  for (let i = 0; i < length; i++) out[i] *= norm
  return out
}

// Synthesises the click as a plain 16-bit WAV so it can be played through an
// <audio> element. Web Audio needs its context unlocked by a "clean" user
// gesture, and iOS is picky about what qualifies — media elements go through
// a far more permissive unlock path.
function buildClickWavUrl(): string {
  const length = Math.floor(CLICK_SAMPLE_RATE * CLICK_DURATION)
  const bytes = new ArrayBuffer(44 + length * 2)
  const view = new DataView(bytes)

  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, CLICK_SAMPLE_RATE, true)
  view.setUint32(28, CLICK_SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, length * 2, true)

  // two independent noise sources — the "clack" is pitched a touch lower
  // and quieter, like a switch mechanism's contact followed by its settle
  const clickNoise = bandpassNoise(length, CLICK_SAMPLE_RATE, 3200, 2.2)
  const clackNoise = bandpassNoise(length, CLICK_SAMPLE_RATE, 2400, 2.2)
  const gapSamples = Math.floor(CLICK_GAP * CLICK_SAMPLE_RATE)

  for (let i = 0; i < length; i++) {
    const t = i / CLICK_SAMPLE_RATE
    const click = clickNoise[i] * Math.exp(-t * 650)

    let clack = 0
    if (i >= gapSamples) {
      const t2 = (i - gapSamples) / CLICK_SAMPLE_RATE
      clack = clackNoise[i - gapSamples] * Math.exp(-t2 * 650) * 0.8
    }

    const sample = Math.max(-1, Math.min(1, click + clack))
    view.setInt16(44 + i * 2, sample * 0x7fff, true)
  }

  return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }))
}

let clickAudio: HTMLAudioElement | null = null

function getClickAudio(): HTMLAudioElement {
  if (!clickAudio) {
    clickAudio = new Audio(buildClickWavUrl())
    clickAudio.preload = 'auto'
  }
  return clickAudio
}

// Building the element only in response to the first gesture meant that
// gesture's own play() could land before the browser had actually decoded
// the freshly-assigned blob source — the very first click played silently
// even with priming/volume fixed. Call this on mount, well before any
// gesture, so the element exists and starts decoding ahead of time.
export function preloadClickAudio() {
  getClickAudio()
}

// Playing the element once inside a user gesture is what makes iOS willing
// to replay it programmatically later, so this is called on every plausible
// gesture rather than only when the theme actually flips.
export function primeClickAudio() {
  const audio = getClickAudio()
  if (!audio.paused) return
  const restoreVolume = audio.volume
  audio.volume = 0
  void audio
    .play()
    .then(() => {
      audio.pause()
      audio.currentTime = 0
      audio.volume = restoreVolume
    })
    .catch(() => {
      audio.volume = restoreVolume
    })
}

export function playClick() {
  const audio = getClickAudio()
  // priming (above) mutes the element and restores the volume asynchronously
  // once its own play() resolves — if this fires before that microtask runs,
  // the real click would otherwise play back silently
  audio.volume = 1
  audio.currentTime = 0
  void audio.play().catch(() => {})
}
