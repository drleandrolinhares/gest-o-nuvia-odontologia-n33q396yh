import { useEffect, useRef, useState } from 'react'

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const { threshold = 0, root = null, rootMargin = '0px' } = options
  const ref = useRef<any>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const target = ref.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold, root, rootMargin },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [threshold, root, rootMargin])

  return { ref, isIntersecting }
}
