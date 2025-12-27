import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'

interface GenerateButtonProps {
  onClick: () => void
  isGenerating: boolean
  disabled: boolean
}

export function GenerateButton({
  onClick,
  isGenerating,
  disabled,
}: GenerateButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sparklesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    gsap.fromTo(
      containerRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleClick = () => {
    if (buttonRef.current && sparklesRef.current) {
      // Button press animation
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      })

      // Sparkle burst effect
      const sparkles = sparklesRef.current.children
      gsap.fromTo(
        sparkles,
        {
          scale: 0,
          opacity: 1,
        },
        {
          scale: 1.5,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        }
      )
    }
    onClick()
  }

  return (
    <div ref={containerRef} className="relative" style={{ opacity: 0 }}>
      {/* Sparkle effects container */}
      <div
        ref={sparklesRef}
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: '50%',
              transform: 'translate(-50%, -50%) scale(0)',
            }}
          />
        ))}
      </div>

      <Button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isGenerating || disabled}
        className="relative w-full h-14 text-lg gap-2 bg-gradient-to-r from-primary via-blue-600 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-primary/25"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            번호 생성 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            번호 추천받기
          </>
        )}
      </Button>
    </div>
  )
}
