export type Point = { x: number; y: number; oldX: number; oldY: number }

export const SEGMENTS = 6
export const SEG_LEN_DARK = 11
export const SEG_LEN_LIGHT = 15
export const SEG_LEN_EASE = 0.06
export const FOB_RADIUS = 9
export const GRAVITY = 0.5
export const DAMPING = 0.993
export const CONSTRAINT_ITERATIONS = 6
export const PULL_THRESHOLD = 30
export const MAX_REACH_X = 36
export const GRAB_RADIUS = 20

export const POINT_COUNT = SEGMENTS + 2 // anchor + links + fob
export const ANCHOR_INDEX = 0
export const FOB_INDEX = POINT_COUNT - 1

// must clear the longest resting length (light theme) plus threshold + slack,
// otherwise the drag ceiling sits above where the chain already hangs at rest
export const MAX_REACH_Y =
  SEG_LEN_LIGHT * (POINT_COUNT - 1) + PULL_THRESHOLD + 40

export const CANVAS_WIDTH = 140
export const CANVAS_HEIGHT = 220
export const ANCHOR_Y = 4
export const ANCHOR_X = CANVAS_WIDTH / 2

// extra internal resolution beyond the display's own DPR, so the tiny beads
// and fob get properly anti-aliased instead of looking chunky next to the SVG
export const SUPERSAMPLE = 2

export const WRAPPER_SIZE = 64
export const ICON_SIZE = 48
export const ICON_VIEWBOX = 24
export const ICON_RING_Y = 16.5 // viewBox units — where the mounting ring sits

// lines the chain's anchor up with the icon's ring, minus a couple px so the
// wire visually continues straight out of the ring with no dead gap
export const CHAIN_TOP =
  (WRAPPER_SIZE - ICON_SIZE) / 2 + (ICON_RING_Y / ICON_VIEWBOX) * ICON_SIZE - 2
