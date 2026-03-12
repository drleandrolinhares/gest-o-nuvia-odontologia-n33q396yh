import { useEffect, useRef, useState } from 'react'

export interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(options: IntersectionObserverOptions = {}) {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = true } = options
  const ref = useRef<any>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  // Use a stringified version of threshold to avoid unstable array reference in dependencies
  const thresholdString = Array.isArray(threshold) ? threshold.join(',') : threshold

  useEffect(() => {
    const target = ref.current
    if (!target) return

    // If it's already intersecting and we should freeze, do nothing and let the observer stay disconnected.
    // This prevents infinite layout-shifting loops when an animation moves the element out of the threshold.
    if (freezeOnceVisible && isIntersecting) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
        } else if (!freezeOnceVisible) {
          setIsIntersecting(false)
        }
      },
      { threshold, root, rootMargin },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [thresholdString, root, rootMargin, freezeOnceVisible, isIntersecting])

  return { ref, isIntersecting }
}
