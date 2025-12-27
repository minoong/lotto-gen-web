import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      {
        y: 16,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: delay,
        ease: 'power2.out',
      }
    )
  }, [delay])

  return (
    <Card
      ref={cardRef}
      className={cn(
        'transition-shadow duration-300 hover:shadow-lg',
        className
      )}
      style={{ opacity: 0 }}
    >
      {children}
    </Card>
  )
}
