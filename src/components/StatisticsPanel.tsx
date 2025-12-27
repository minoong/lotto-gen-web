import { useMemo, useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { AnimatedCard } from '@/components/AnimatedCard'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { NumberBall } from './NumberBall'
import { BarChart3 } from 'lucide-react'
import { calculateStatistics, getTopFrequent, getLeastFrequent, getColdNumbers } from '@/lib/statistics'
import type { LottoData } from '@/types/lotto'

interface StatisticsPanelProps {
  data: LottoData
}

export function StatisticsPanel({ data }: StatisticsPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null
    return calculateStatistics(data)
  }, [data])

  useGSAP(() => {
    if (!isOpen || !contentRef.current) return

    gsap.fromTo(
      '.stat-section',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      }
    )

    gsap.fromTo(
      '.stat-ball',
      { scale: 0, rotation: -90 },
      {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        delay: 0.2,
      }
    )
  }, [isOpen])

  if (!stats) return null

  const topFrequent = getTopFrequent(stats.frequencyMap, 10)
  const leastFrequent = getLeastFrequent(stats.frequencyMap, 10)
  const coldNumbers = getColdNumbers(stats.lastAppearanceMap, stats.totalDraws, 10)

  return (
    <AnimatedCard delay={0.8}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="flex items-center gap-2 text-lg text-left">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>통계 정보</span>
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent ref={contentRef} className="space-y-6 pt-4">
            <div className="stat-section p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg">
              <p className="text-sm text-muted-foreground">
                현재 데이터: <span className="font-semibold text-foreground">{stats.firstDraw}회</span> ~ <span className="font-semibold text-foreground">{stats.lastDraw}회</span> (총 {stats.totalDraws}회차)
              </p>
            </div>

            <div className="stat-section">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                가장 많이 나온 번호 TOP 10
              </h4>
              <div className="flex flex-wrap gap-2">
                {topFrequent.map(({ number, frequency }) => (
                  <div key={number} className="stat-ball flex flex-col items-center gap-1">
                    <NumberBall number={number} size="sm" />
                    <span className="text-xs text-muted-foreground">{frequency}회</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-section">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                가장 적게 나온 번호 TOP 10
              </h4>
              <div className="flex flex-wrap gap-2">
                {leastFrequent.map(({ number, frequency }) => (
                  <div key={number} className="stat-ball flex flex-col items-center gap-1">
                    <NumberBall number={number} size="sm" />
                    <span className="text-xs text-muted-foreground">{frequency}회</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-section">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                최근 10회 미출현 번호
              </h4>
              {coldNumbers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {coldNumbers.map((number) => (
                    <div key={number} className="stat-ball">
                      <NumberBall number={number} size="sm" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">없음</p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </AnimatedCard>
  )
}
