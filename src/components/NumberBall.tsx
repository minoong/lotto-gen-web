import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

interface NumberBallProps {
  number: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  delay?: number
  animate?: boolean
}

function getColorClass(number: number): string {
  if (number <= 10) return 'bg-[var(--color-lotto-yellow)] text-gray-900'
  if (number <= 20) return 'bg-[var(--color-lotto-blue)] text-white'
  if (number <= 30) return 'bg-[var(--color-lotto-red)] text-white'
  if (number <= 40) return 'bg-[var(--color-lotto-gray)] text-white'
  return 'bg-[var(--color-lotto-green)] text-white'
}

function getSizeClass(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-8 h-8 text-sm'
    case 'md':
      return 'w-10 h-10 text-base'
    case 'lg':
      return 'w-12 h-12 text-lg'
  }
}

export function NumberBall({
  number,
  size = 'md',
  className,
  delay = 0,
  animate = false,
}: NumberBallProps) {
  const ballRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!animate || !ballRef.current) return

    gsap.fromTo(
      ballRef.current,
      {
        scale: 0,
        rotation: -180,
        opacity: 0,
      },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        delay: delay,
        ease: 'back.out(1.7)',
      }
    )
  }, [animate, delay])

  return (
    <div
      ref={ballRef}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold shadow-md',
        getColorClass(number),
        getSizeClass(size),
        className
      )}
      style={animate ? { opacity: 0 } : undefined}
    >
      {number}
    </div>
  )
}
