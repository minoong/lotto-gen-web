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
import { History } from 'lucide-react'
import type { LottoData } from '@/types/lotto'

interface RecentDrawsProps {
  data: LottoData
}

export function RecentDraws({ data }: RecentDrawsProps) {
  const [isOpen, setIsOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  const recentDraws = useMemo(() => {
    if (!data || data.length === 0) return []
    return [...data].sort((a, b) => b.draw_no - a.draw_no).slice(0, 5)
  }, [data])

  useGSAP(() => {
    if (!isOpen || !contentRef.current) return

    gsap.fromTo(
      '.recent-draw-row',
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power3.out',
      }
    )
  }, [isOpen])

  if (recentDraws.length === 0) return null

  return (
    <AnimatedCard delay={0.6}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="py-4 cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-xl">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <span>최근 당첨번호</span>
              </div>
              <svg
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent ref={contentRef} className="space-y-2 pt-2">
            {recentDraws.map((draw) => (
              <div
                key={draw.draw_no}
                className="recent-draw-row flex items-center gap-1.5 py-2 px-2 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-lg hover:from-secondary hover:to-secondary/50 transition-colors"
              >
                <div className="shrink-0 w-14">
                  <span className="text-xs font-bold text-primary">
                    {draw.draw_no}회
                  </span>
                  <p className="text-[10px] text-muted-foreground">{draw.date.slice(0, 10)}</p>
                </div>
                <div className="flex gap-1 flex-1 justify-center min-w-0">
                  {draw.numbers.map((number, i) => (
                    <NumberBall key={i} number={number} size="sm" />
                  ))}
                </div>
                {draw.bonus && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground">+</span>
                    <NumberBall number={draw.bonus} size="sm" className="opacity-60" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </AnimatedCard>
  )
}
