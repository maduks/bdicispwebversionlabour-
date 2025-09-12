import type { ReactNode } from "react"
import { useIntersectionObserver } from "../../hooks/user-intersection-observer"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleUp"
  delay?: number
}

export function AnimatedSection({ children, className = "", animation = "fadeUp", delay = 0 }: AnimatedSectionProps) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  })

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-1000 ease-out"

    if (!isIntersecting) {
      switch (animation) {
        case "fadeUp":
          return `${baseClasses} opacity-0 translate-y-10`
        case "fadeIn":
          return `${baseClasses} opacity-0`
        case "slideLeft":
          return `${baseClasses} opacity-0 -translate-x-10`
        case "slideRight":
          return `${baseClasses} opacity-0 translate-x-10`
        case "scaleUp":
          return `${baseClasses} opacity-0 scale-95`
        default:
          return `${baseClasses} opacity-0 translate-y-10`
      }
    }

    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
