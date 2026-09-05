export default function MusicToggle({ muted, onToggle }) {
  return (
    <button
      className="music-toggle"
      onClick={onToggle}
      aria-label={muted ? 'Activer le son' : 'Couper le son'}
    >
      {muted ? '🔇' : '🎵'}
    </button>
  )
}
