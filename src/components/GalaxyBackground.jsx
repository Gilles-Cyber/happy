import { useEffect, useRef } from 'react'

export default function GalaxyBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, stars, shootingStars, frameId

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    function makeStars() {
      const count = Math.floor((width * height) / 6000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function makeShootingStar() {
      const startX = Math.random() * width
      const startY = Math.random() * height * 0.5
      return {
        x: startX,
        y: startY,
        len: Math.random() * 80 + 60,
        speed: Math.random() * 8 + 8,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        life: 1,
      }
    }

    shootingStars = []

    function spawnShootingStar() {
      if (Math.random() < 0.015) shootingStars.push(makeShootingStar())
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      const grad = ctx.createRadialGradient(
        width * 0.5, height * 0.3, 0,
        width * 0.5, height * 0.3, Math.max(width, height) * 0.9
      )
      grad.addColorStop(0, '#2a1a52')
      grad.addColorStop(0.5, '#160a35')
      grad.addColorStop(1, '#08041a')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      for (const s of stars) {
        s.phase += s.twinkleSpeed
        const alpha = s.baseAlpha + Math.sin(s.phase) * 0.3
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 210, 255, ${Math.max(0, alpha)})`
        ctx.fill()
      }

      spawnShootingStar()
      shootingStars = shootingStars.filter((sh) => sh.life > 0)
      for (const sh of shootingStars) {
        const dx = Math.cos(sh.angle) * sh.len
        const dy = Math.sin(sh.angle) * sh.len
        const gradient = ctx.createLinearGradient(sh.x, sh.y, sh.x - dx, sh.y - dy)
        gradient.addColorStop(0, `rgba(255,255,255,${sh.life})`)
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(sh.x, sh.y)
        ctx.lineTo(sh.x - dx, sh.y - dy)
        ctx.stroke()
        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        sh.life -= 0.02
      }

      frameId = requestAnimationFrame(draw)
    }

    resize()
    makeStars()
    draw()

    window.addEventListener('resize', () => {
      resize()
      makeStars()
    })

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="galaxy-canvas" />
}
