import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Slider } from '@/components/ui/slider'
import { AnimatedCard } from '@/components/AnimatedCard'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins } from 'lucide-react'

interface GameSelectorProps {
  gameCount: number
  onGameCountChange: (count: number) => void
}

export function GameSelector({
  gameCount,
  onGameCountChange,
}: GameSelectorProps) {
  const [displayAmount, setDisplayAmount] = useState(gameCount * 1000)
  const [displayCount, setDisplayCount] = useState(gameCount)
  const amountRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef({ amount: gameCount * 1000, count: gameCount })
  const iconRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotate: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      })
    }
  }, [])

  useEffect(() => {
    const targetAmount = gameCount * 1000

    gsap.to(counterRef.current, {
      amount: targetAmount,
      count: gameCount,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayAmount(Math.round(counterRef.current.amount))
        setDisplayCount(Math.round(counterRef.current.count))
      },
    })

    if (amountRef.current) {
      gsap.fromTo(
        amountRef.current,
        { scale: 1.15, color: '#3b82f6' },
        { scale: 1, color: 'var(--color-primary)', duration: 0.3, ease: 'back.out(2)' }
      )
    }
  }, [gameCount])

  const formatAmount = (value: number) => {
    return value.toLocaleString('ko-KR')
  }

  return (
    <AnimatedCard delay={0.2}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div ref={iconRef} className="text-primary">
            <Coins className="w-5 h-5" />
          </div>
          <span>구매 금액 선택</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Slider
          value={gameCount}
          min={1}
          max={50}
          step={1}
          onChange={onGameCountChange}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>1,000원</span>
          <span>50,000원</span>
        </div>
        <div className="text-center py-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg">
          <span
            ref={amountRef}
            className="inline-block text-3xl font-black text-primary tabular-nums"
          >
            {formatAmount(displayAmount)}원
          </span>
          <p className="text-muted-foreground mt-1">
            <span className="font-semibold text-foreground">{displayCount}</span> 게임
          </p>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
