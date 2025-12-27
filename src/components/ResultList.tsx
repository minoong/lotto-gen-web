import { useRef, useCallback, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { toPng } from 'html-to-image'
import { AnimatedCard } from '@/components/AnimatedCard'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameResult } from './GameResult'
import { Download, Trophy } from 'lucide-react'
import type { GeneratedGame } from '@/types/lotto'

interface ResultListProps {
  games: GeneratedGame[]
}

export function ResultList({ games }: ResultListProps) {
  const resultRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const animationKey = useMemo(() => {
    return games.length > 0 ? games.map((g) => g.numbers.join(',')).join('|') : ''
  }, [games])

  useGSAP(() => {
    if (!games.length || !containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    )

    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: -20, scale: 0 },
        { rotate: 0, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.2 }
      )
    }
  }, [animationKey])

  const handleSaveImage = useCallback(async () => {
    if (!resultRef.current) return

    try {
      const dataUrl = await toPng(resultRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = `lotto-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to save image:', error)
    }
  }, [])

  if (games.length === 0) {
    return null
  }

  return (
    <div ref={containerRef} style={{ opacity: 0 }}>
      <AnimatedCard className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div ref={iconRef} className="text-yellow-500">
                <Trophy className="w-5 h-5" />
              </div>
              추천 번호
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveImage}
              className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">저장</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div ref={resultRef} className="space-y-1.5 p-2 bg-white rounded-lg">
            {games.map((game, index) => (
              <GameResult
                key={`${animationKey}-${index}`}
                game={game}
                index={index}
                animate={true}
              />
            ))}
          </div>
          <div className="text-[11px] text-muted-foreground space-y-1 px-1">
            <p className="font-medium text-foreground/70">분석 기반</p>
            <ul className="space-y-0.5 list-disc list-inside marker:text-primary/50">
              <li>출현 빈도 분석 (25%)</li>
              <li>최근 트렌드 + 미출현 보정 (30%)</li>
              <li>번호 간격 패턴 (15%)</li>
              <li>구간 균형 분포 (20%)</li>
              <li>동반 출현 분석 (10%)</li>
            </ul>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
