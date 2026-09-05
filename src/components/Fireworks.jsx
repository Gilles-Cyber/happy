import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'

const COLORS = ['#ff6ec7', '#c77dff', '#7b2ff7', '#ffd166', '#5ee7ff', '#ff9ecb', '#b388ff']

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

const Fireworks = forwardRef(function Fireworks(_, ref) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rocketsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, frameId

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function explode(x, y, color) {
      const count = 60 + Math.floor(Math.random() * 30)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2
        const speed = Math.random() * 4 + 2
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.012 + 0.01,
          color,
          size: Math.random() * 2.5 + 1.5,
        })
      }
    }

    function launchRocket(targetX) {
      const startX = targetX ?? Math.random() * width
      rocketsRef.current.push({
        x: startX,
        y: height,
        targetY: height * (0.15 + Math.random() * 0.35),
        vy: -(Math.random() * 4 + 8),
        color: randomColor(),
      })
    }

    canvas._launchRocket = launchRocket

    function draw() {
      ctx.clearRect(0, 0, width, height)

      rocketsRef.current = rocketsRef.current.filter((r) => r.y > r.targetY)
      for (const r of rocketsRef.current) {
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = r.color
        ctx.fill()
        r.y += r.vy
        if (r.y <= r.targetY) explode(r.x, r.y, r.color)
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)
      for (const p of particlesRef.current) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fill()
        ctx.globalAlpha = 1
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.045
        p.vx *= 0.99
        p.life -= p.decay
      }

      frameId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    launch(x) {
      canvasRef.current._launchRocket?.(x)
    },
    burst(count = 5) {
      for (let i = 0; i < count; i++) {
        setTimeout(() => canvasRef.current._launchRocket?.(), i * 220)
      }
    },
  }))

  return <canvas ref={canvasRef} className="fireworks-canvas" />
})

export default Fireworks
