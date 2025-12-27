import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { NumberBall } from './NumberBall'
import type { GeneratedGame } from '@/types/lotto'

interface GameResultProps {
  game: GeneratedGame
  index: number
  animate?: boolean
}

export function GameResult({ game, index, animate = false }: GameResultProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!animate || !rowRef.current) return

    gsap.fromTo(
      rowRef.current,
      {
        x: -20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        delay: index * 0.1,
        ease: 'power2.out',
      }
    )
  }, [animate, index])

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-2 py-2 px-3 bg-secondary/50 rounded-lg"
      style={animate ? { opacity: 0 } : undefined}
    >
      <span className="text-xs font-medium text-muted-foreground shrink-0 w-6">
        {String.fromCharCode(65 + index)}
      </span>
      <div className="flex gap-1.5 justify-center flex-1">
        {game.numbers.map((number, i) => (
          <NumberBall
            key={i}
            number={number}
            size="sm"
            animate={animate}
            delay={index * 0.1 + i * 0.08}
          />
        ))}
      </div>
    </div>
  )
}
