import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  FOB_INDEX,
  FOB_RADIUS,
  POINT_COUNT,
  SUPERSAMPLE,
  type Point,
} from './constants'

// manual rounded-rect path — CanvasRenderingContext2D.roundRect() only
// shipped in Safari 16.4 (2023), so older iPhones don't have it at all
function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function draw(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  isDark: boolean,
) {
  const scale = (window.devicePixelRatio || 1) * SUPERSAMPLE
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // thin wire running through every link up to the fob
  ctx.strokeStyle = '#75787f'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < POINT_COUNT; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.stroke()

  // ball-chain beads
  for (let i = 1; i < POINT_COUNT - 1; i++) {
    const p = points[i]
    const gradient = ctx.createRadialGradient(
      p.x - 1,
      p.y - 1,
      0.4,
      p.x,
      p.y,
      3.4,
    )
    gradient.addColorStop(0, '#e4e6ea')
    gradient.addColorStop(1, '#787c83')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // wooden fob
  const capPoint = points[POINT_COUNT - 2]
  const fob = points[FOB_INDEX]
  const angle = Math.atan2(fob.y - capPoint.y, fob.x - capPoint.x)

  ctx.save()
  ctx.translate(fob.x, fob.y)
  ctx.rotate(angle - Math.PI / 2)

  // small metal cap connecting chain to wood
  ctx.fillStyle = '#7d8087'
  ctx.beginPath()
  roundedRectPath(ctx, -3.2, -FOB_RADIUS - 4, 6.4, 7, 3)
  ctx.fill()

  // wood body (acorn-ish teardrop)
  const woodGradient = ctx.createRadialGradient(-3, -3, 2, 0, 0, FOB_RADIUS + 2)
  if (isDark) {
    woodGradient.addColorStop(0, '#9c6a3e')
    woodGradient.addColorStop(1, '#4a2e18')
  } else {
    woodGradient.addColorStop(0, '#c68a4e')
    woodGradient.addColorStop(1, '#7a4a24')
  }
  ctx.fillStyle = woodGradient
  ctx.beginPath()
  ctx.moveTo(0, -FOB_RADIUS)
  ctx.bezierCurveTo(
    FOB_RADIUS,
    -FOB_RADIUS,
    FOB_RADIUS,
    FOB_RADIUS,
    0,
    FOB_RADIUS + 3,
  )
  ctx.bezierCurveTo(
    -FOB_RADIUS,
    FOB_RADIUS,
    -FOB_RADIUS,
    -FOB_RADIUS,
    0,
    -FOB_RADIUS,
  )
  ctx.closePath()
  ctx.fill()

  // grain lines
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 0.7
  for (const gy of [-3, 0, 4]) {
    ctx.beginPath()
    ctx.moveTo(-FOB_RADIUS + 2, gy)
    ctx.quadraticCurveTo(0, gy + 2, FOB_RADIUS - 2, gy)
    ctx.stroke()
  }

  ctx.restore()
}
