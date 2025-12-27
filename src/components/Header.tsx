import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function Header() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)
  const sparklesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    // Floating orbs animation
    gsap.to('.orb', {
      y: -30,
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.4,
        from: 'random',
      },
    })

    // Sparkles animation
    gsap.to('.sparkle', {
      scale: 1.5,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      repeat: -1,
      stagger: {
        each: 0.3,
        from: 'random',
        repeat: -1,
      },
    })

    // Initial load animation
    tl.fromTo(
      orbsRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    )
      .fromTo(
        titleRef.current,
        { y: 60, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
        '-=0.7'
      )
      .fromTo(
        sparklesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.5'
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )

    // Title continuous glow pulse
    gsap.to(titleRef.current, {
      textShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  return (
    <header ref={containerRef} className="relative py-16 overflow-hidden">
      {/* Animated background orbs */}
      <div
        ref={orbsRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="orb absolute w-32 h-32 rounded-full bg-linear-to-br from-yellow-400/30 to-orange-500/20 blur-3xl -top-8 -left-8" />
        <div className="orb absolute w-40 h-40 rounded-full bg-linear-to-br from-blue-400/30 to-cyan-500/20 blur-3xl top-4 right-0" />
        <div className="orb absolute w-28 h-28 rounded-full bg-linear-to-br from-red-400/30 to-pink-500/20 blur-3xl bottom-4 left-1/4" />
        <div className="orb absolute w-36 h-36 rounded-full bg-linear-to-br from-green-400/30 to-emerald-500/20 blur-3xl -bottom-8 right-1/4" />
        <div className="orb absolute w-24 h-24 rounded-full bg-linear-to-br from-purple-400/40 to-indigo-500/30 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Sparkles */}
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="sparkle absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 13) % 70}%`,
              boxShadow: '0 0 6px 2px rgba(255,255,255,0.8)',
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <h1
          ref={titleRef}
          className="text-5xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd93d 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'gradient-flow 4s ease infinite',
            textShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
          }}
        >
          Lotto Genius
        </h1>
        <p ref={subtitleRef} className="mt-3 text-red-500 font-medium">
          AI 기반 로또 번호 추천 서비스
        </p>
      </div>

      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </header>
  )
}
