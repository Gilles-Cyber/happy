import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'

const COLORS = ['#ff6ec7', '#c77dff', '#7b2ff7', '#ffd166', '#5ee7ff', '#ffffff', '#b388ff']

const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null)
  const piecesRef = useRef([])

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

    function draw() {
      ctx.clearRect(0, 0, width, height)
      piecesRef.current = piecesRef.current.filter((p) => p.y < height + 20)
      for (const p of piecesRef.current) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.05
        p.rotation += p.rotSpeed
        p.opacity -= 0.0015
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
    burst(amount = 150) {
      const width = window.innerWidth
      for (let i = 0; i < amount; i++) {
        piecesRef.current.push({
          x: Math.random() * width,
          y: -20 - Math.random() * 200,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 2,
          size: Math.random() * 8 + 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.3,
          opacity: 1,
        })
      }
    },
  }))

  return <canvas ref={canvasRef} className="confetti-canvas" />
})

export default Confetti
