import { useEffect, useState } from 'react'

export default function usePhotoRotation(photoCount, paused) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (paused || photoCount < 2) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timer = window.setInterval(() => {
      if (!motion.matches && !document.hidden) {
        setIndex(current => (current + 1) % photoCount)
      }
    }, 4500)
    return () => window.clearInterval(timer)
  }, [paused, photoCount])

  return [index % Math.max(photoCount, 1), setIndex]
}