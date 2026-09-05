import { useRef, useState } from 'react'

const BASE = import.meta.env.BASE_URL

const PHOTOS = [
  { src: `${BASE}photos/p1.jpg`, caption: 'Toujours prête à briller ✨' },
  { src: `${BASE}photos/p2.jpg`, caption: 'Ce sourire qui illumine tout' },
  { src: `${BASE}photos/p3.jpg`, caption: 'Style et bonne humeur, toujours' },
  { src: `${BASE}photos/p4.jpg`, caption: 'Rayonnante, comme d\'habitude' },
  { src: `${BASE}photos/p5.jpg`, caption: 'Douceur et naturel' },
  { src: `${BASE}photos/p6.jpg`, caption: 'Belle comme une fleur 🌸' },
]

export default function Gallery({ visible }) {
  const [openIndex, setOpenIndex] = useState(null)
  const touchStartX = useRef(null)

  function show(delta) {
    setOpenIndex((i) => (i + delta + PHOTOS.length) % PHOTOS.length)
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) > 40) show(delta > 0 ? -1 : 1)
    touchStartX.current = null
  }

  return (
    <section className={`gallery ${visible ? 'gallery--visible' : ''}`}>
      <h2 className="gallery__title">Quelques rayons de soleil</h2>
      <p className="gallery__hint">Touche une photo pour l'agrandir ✨</p>
      <div className="gallery__grid">
        {PHOTOS.map((photo, i) => (
          <figure
            className="polaroid"
            style={{
              '--delay': `${i * 0.15}s`,
              '--tilt': `${(i % 2 === 0 ? -1 : 1) * (3 + i)}deg`,
              '--float-duration': `${4 + (i % 3)}s`,
              '--float-delay': `${i * 0.4}s`,
            }}
            key={photo.src}
            onClick={() => setOpenIndex(i)}
          >
            <div className="polaroid__frame">
              <img src={photo.src} alt={`Inès ${i + 1}`} loading="lazy" />
              <span className="polaroid__shine" />
            </div>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="lightbox"
          onClick={() => setOpenIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="lightbox__close"
            onClick={(e) => {
              e.stopPropagation()
              setOpenIndex(null)
            }}
            aria-label="Fermer"
          >
            ✕
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              show(-1)
            }}
            aria-label="Photo précédente"
          >
            ‹
          </button>
          <img
            key={openIndex}
            src={PHOTOS[openIndex].src}
            alt={`Inès ${openIndex + 1}`}
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              show(1)
            }}
            aria-label="Photo suivante"
          >
            ›
          </button>
          <p className="lightbox__caption">{PHOTOS[openIndex].caption}</p>
        </div>
      )}
    </section>
  )
}
