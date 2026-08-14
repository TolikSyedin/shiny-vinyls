import {
  ANCHOR_INDEX,
  ANCHOR_X,
  ANCHOR_Y,
  CONSTRAINT_ITERATIONS,
  DAMPING,
  FOB_INDEX,
  GRAVITY,
  POINT_COUNT,
  SEG_LEN_DARK,
  SEG_LEN_LIGHT,
  type Point,
} from './constants'

export function createPoints(): Point[] {
  const startLen = (SEG_LEN_DARK + SEG_LEN_LIGHT) / 2
  const points: Point[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = ANCHOR_Y + i * startLen
    points.push({ x: ANCHOR_X, y, oldX: ANCHOR_X, oldY: y })
  }
  return points
}

// Verlet integration: velocity is inferred from each point's previous
// position rather than tracked explicitly. While dragging, the fob is
// driven directly by the pointer instead of being integrated, and is held
// fixed during constraint solving.
export function stepChain(points: Point[], segLen: number, dragging: boolean) {
  const integrateEnd = dragging ? FOB_INDEX : POINT_COUNT
  for (let i = 1; i < integrateEnd; i++) {
    const p = points[i]
    const vx = (p.x - p.oldX) * DAMPING
    const vy = (p.y - p.oldY) * DAMPING
    p.oldX = p.x
    p.oldY = p.y
    p.x += vx
    p.y += vy + GRAVITY
  }

  for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
    for (let i = 0; i < POINT_COUNT - 1; i++) {
      const a = points[i]
      const b = points[i + 1]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
      const diff = (dist - segLen) / dist
      const aFixed = i === ANCHOR_INDEX
      const bFixed = dragging && i + 1 === FOB_INDEX

      if (aFixed && bFixed) continue
      if (aFixed) {
        b.x -= dx * diff
        b.y -= dy * diff
      } else if (bFixed) {
        a.x += dx * diff
        a.y += dy * diff
      } else {
        a.x += dx * diff * 0.5
        a.y += dy * diff * 0.5
        b.x -= dx * diff * 0.5
        b.y -= dy * diff * 0.5
      }
    }
    points[ANCHOR_INDEX].x = ANCHOR_X
    points[ANCHOR_INDEX].y = ANCHOR_Y
  }
}
