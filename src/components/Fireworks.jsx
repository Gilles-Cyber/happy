import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'

const COLORS = ['#ff6ec7', '#c77dff', '#7b2ff7', '#ffd166', '#5ee7ff', '#ff9ecb', '#b388ff']

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

const Fireworks = forwardRef(function Fireworks(_, ref) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rocketsRef = useRef([])
  const textParticlesRef = useRef([])

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

    function spellText(text) {
      const off = document.createElement('canvas')
      off.width = width
      off.height = height
      const octx = off.getContext('2d')
      const fontSize = Math.min(width * 0.16, 150)
      octx.fillStyle = '#fff'
      octx.font = `bold ${fontSize}px 'Playfair Display', serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillText(text, width / 2, height * 0.42)

      const data = octx.getImageData(0, 0, width, height).data
      const step = Math.max(4, Math.floor(width / 160))
      const points = []
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4 + 3
          if (data[idx] > 128) points.push({ x, y })
        }
      }

      for (let i = points.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[points[i], points[j]] = [points[j], points[i]]
      }

      const maxPoints = 900
      const chosen = points.slice(0, maxPoints)
      const now = performance.now()

      textParticlesRef.current = chosen.map((p) => ({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        targetX: p.x,
        targetY: p.y,
        startX: 0,
        startY: 0,
        color: randomColor(),
        phase: 'forming',
        formStart: now + Math.random() * 500,
        formDuration: 900 + Math.random() * 500,
        holdUntil: 0,
        vx: 0,
        vy: 0,
        life: 1,
      }))
      textParticlesRef.current.forEach((p) => {
        p.startX = p.x
        p.startY = p.y
      })
    }

    canvas._launchRocket = launchRocket
    canvas._spellText = spellText

    function drawTextParticles(now) {
      for (const p of textParticlesRef.current) {
        if (p.phase === 'forming') {
          const t = Math.min(1, Math.max(0, (now - p.formStart) / p.formDuration))
          if (now >= p.formStart) {
            const eased = easeOutCubic(t)
            p.x = p.startX + (p.targetX - p.startX) * eased
            p.y = p.startY + (p.targetY - p.startY) * eased
          }
          if (t >= 1 && now >= p.formStart) {
            p.phase = 'holding'
            p.holdUntil = now + 1800 + Math.random() * 400
          }
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = 0.25 + 0.75 * t
          ctx.fill()
          ctx.globalAlpha = 1
        } else if (p.phase === 'holding') {
          const twinkle = 0.7 + Math.sin(now / 120 + p.targetX) * 0.3
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = twinkle
          ctx.fill()
          ctx.globalAlpha = 1
          if (now >= p.holdUntil) {
            const angle = Math.random() * Math.PI * 2
            const speed = Math.random() * 3 + 1.5
            p.vx = Math.cos(angle) * speed
            p.vy = Math.sin(angle) * speed
            p.phase = 'bursting'
          }
        } else if (p.phase === 'bursting') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = Math.max(0, p.life)
          ctx.fill()
          ctx.globalAlpha = 1
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.05
          p.life -= 0.018
        }
      }
      textParticlesRef.current = textParticlesRef.current.filter(
        (p) => p.phase !== 'bursting' || p.life > 0
      )
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const now = performance.now()

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

      if (textParticlesRef.current.length) drawTextParticles(now)

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
    spellText(text) {
      canvasRef.current._spellText?.(text)
    },
  }))

  return <canvas ref={canvasRef} className="fireworks-canvas" />
})

export default Fireworks
