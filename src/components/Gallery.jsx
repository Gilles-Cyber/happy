const PHOTOS = [
  { src: '/photos/p1.jpg', caption: 'Toujours prête à briller ✨' },
  { src: '/photos/p2.jpg', caption: 'Ce sourire qui illumine tout' },
  { src: '/photos/p3.jpg', caption: 'Style et bonne humeur, toujours' },
  { src: '/photos/p4.jpg', caption: 'Rayonnante, comme d\'habitude' },
  { src: '/photos/p5.jpg', caption: 'Douceur et naturel' },
  { src: '/photos/p6.jpg', caption: 'Belle comme une fleur 🌸' },
]

export default function Gallery({ visible }) {
  return (
    <section className={`gallery ${visible ? 'gallery--visible' : ''}`}>
      <h2 className="gallery__title">Quelques rayons de soleil</h2>
      <div className="gallery__grid">
        {PHOTOS.map((photo, i) => (
          <figure
            className="polaroid"
            style={{ '--delay': `${i * 0.15}s`, '--tilt': `${(i % 2 === 0 ? -1 : 1) * (3 + i)}deg` }}
            key={photo.src}
          >
            <img src={photo.src} alt={`Inès ${i + 1}`} loading="lazy" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
