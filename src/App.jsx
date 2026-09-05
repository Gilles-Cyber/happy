import { useEffect, useRef, useState } from 'react'
import GalaxyBackground from './components/GalaxyBackground'
import Fireworks from './components/Fireworks'
import Confetti from './components/Confetti'
import Gallery from './components/Gallery'
import './App.css'

const POEM = [
  'Il y a des amies qu\'on croise,',
  'et il y a la tienne — celle qui reste.',
  'Celle dont le rire allume une pièce,',
  'dont la seule présence rend tout plus léger.',
  '',
  'Ce soir, les étoiles se sont donné le mot :',
  'une année de plus, une lumière de plus,',
  'dans un ciel qui n\'attendait que toi.',
  '',
  'Je te souhaite d\'aussi belles surprises',
  'que celles que tu offres sans compter,',
  'autant de fous rires que de nuits',
  'passées à refaire le monde à deux.',
  '',
  'Joyeux anniversaire, ma bestie.',
  'Que cette nouvelle année t\'apporte',
  'tout ce que tu mérites — et encore plus.',
]

export default function App() {
  const [opened, setOpened] = useState(false)
  const [showPoem, setShowPoem] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const fireworksRef = useRef(null)
  const confettiRef = useRef(null)

  function handleOpen() {
    setOpened(true)
    confettiRef.current?.burst(220)
    fireworksRef.current?.burst(6)
    setTimeout(() => setShowPoem(true), 900)
    setTimeout(() => setShowGallery(true), 900 + POEM.length * 260 + 600)
  }

  useEffect(() => {
    if (!opened) return
    const interval = setInterval(() => {
      fireworksRef.current?.launch()
    }, 1800)
    return () => clearInterval(interval)
  }, [opened])

  return (
    <div className="app">
      <GalaxyBackground />
      <Fireworks ref={fireworksRef} />
      <Confetti ref={confettiRef} />

      {!opened && (
        <div className="envelope-screen">
          <p className="envelope-screen__hint">Pssst, Inès...</p>
          <button className="gift-button" onClick={handleOpen} aria-label="Ouvrir la surprise">
            <span className="gift-button__emoji">🎁</span>
          </button>
          <p className="envelope-screen__cta">Une surprise t'attend — clique sur le cadeau</p>
        </div>
      )}

      {opened && (
        <main className="content">
          <h1 className="hero-title">
            <span className="hero-title__line">Joyeux</span>
            <span className="hero-title__line hero-title__line--accent">Anniversaire</span>
            <span className="hero-title__line hero-title__line--name">Inès ✨</span>
          </h1>

          {showPoem && (
            <section className="poem">
              {POEM.map((line, i) => (
                <p
                  key={i}
                  className={line === '' ? 'poem__spacer' : 'poem__line'}
                  style={{ animationDelay: `${i * 0.26}s` }}
                >
                  {line}
                </p>
              ))}
            </section>
          )}

          <Gallery visible={showGallery} />

          {showGallery && (
            <footer className="closing">
              <p>Avec tout mon amour, pour la meilleure des best. 💜</p>
            </footer>
          )}
        </main>
      )}
    </div>
  )
}
