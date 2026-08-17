// Displayed scale, mirroring a Technics SL-1200/1210's ±8% pitch control.
// Scroll fraction 0 (top of page) maps to MIN on the left, fraction 1 (bottom)
// to MAX on the right, so the knob travels left-to-right as the page scrolls.
export const MIN = -8
export const MAX = 8

// Major ticks are labelled squares; minor ticks are the thin marks between.
export const MAJOR_STEP = 2
export const MINOR_STEP = 1

// How close the scroll fraction must be to dead-centre (0.5) before the LED
// lights up, as a fraction of the full 0..1 range.
export const CENTER_LED_THRESHOLD = 0.015

// -8..+8 in MINOR_STEP increments, left to right
export const TICKS: number[] = []
for (let value = MIN; value <= MAX; value += MINOR_STEP) {
  TICKS.push(value)
}
