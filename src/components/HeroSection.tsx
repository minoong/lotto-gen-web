import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { NumberBall } from './NumberBall'

// Generate random shooting stars
const generateShootingStars = () => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: -100 + Math.random() * 30,
    startY: Math.random() * 60,
    delay: Math.random() * 1.5,
    duration: 0.8 + Math.random() * 0.6,
    size: 1 + Math.random() * 2,
    tailLength: 80 + Math.random() * 120,
  }))
}

const FLOATING_BALLS = [
  { num: 7, x: '8%', y: '25%', size: 'lg' as const, speed: 0.3, angle: -30, fromX: -200, fromY: -300 },
  { num: 21, x: '88%', y: '18%', size: 'md' as const, speed: 0.5, angle: 25, fromX: 300, fromY: -400 },
  { num: 33, x: '12%', y: '72%', size: 'md' as const, speed: 0.4, angle: -20, fromX: -350, fromY: 200 },
  { num: 42, x: '82%', y: '68%', size: 'lg' as const, speed: 0.35, angle: 35, fromX: 400, fromY: 300 },
  { num: 13, x: '50%', y: '82%', size: 'sm' as const, speed: 0.6, angle: 0, fromX: 0, fromY: 500 },
  { num: 1, x: '22%', y: '48%', size: 'sm' as const, speed: 0.45, angle: -45, fromX: -300, fromY: -200 },
  { num: 45, x: '75%', y: '42%', size: 'sm' as const, speed: 0.55, angle: 40, fromX: 350, fromY: -250 },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ballRefs = useRef<(HTMLDivElement | null)[]>([])
  const shootingStarsRef = useRef<HTMLDivElement>(null)
  const [shootingStars] = useState(generateShootingStars)

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const container = containerRef.current
      if (!container) return

      const containerHeight = container.offsetHeight

      if (scrollY < containerHeight) {
        const progress = Math.min(scrollY / containerHeight, 1)

        ballRefs.current.forEach((ball, i) => {
          if (ball) {
            const speed = FLOATING_BALLS[i].speed
            const angle = FLOATING_BALLS[i].angle
            const yOffset = scrollY * speed
            const xOffset = scrollY * speed * Math.tan(angle * Math.PI / 180) * 0.3
            ball.style.transform = `translate(-50%, -50%) translate(${xOffset}px, ${yOffset}px)`
            ball.style.opacity = String(Math.max(0.95 - progress * 0.9, 0))
          }
        })

        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${-scrollY * 0.4}px) scale(${1 - progress * 0.1})`
          contentRef.current.style.opacity = String(Math.max(1 - progress * 1.8, 0))
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initial meteor-like entrance animations
  useGSAP(() => {
    const balls = ballRefs.current.filter(Boolean)

    // Shooting stars animation (one-time on page load)
    const stars = shootingStarsRef.current?.querySelectorAll('.shooting-star')
    if (stars) {
      stars.forEach((star, i) => {
        const data = shootingStars[i]
        gsap.fromTo(star,
          {
            x: '0%',
            y: '0%',
            opacity: 0,
            scale: 0.5,
          },
          {
            x: '250vw',
            y: '150vh',
            opacity: 0,
            scale: 1,
            duration: data.duration,
            delay: data.delay,
            ease: 'power1.in',
            onStart: () => {
              gsap.to(star, { opacity: 1, duration: 0.1 })
            },
            onComplete: () => {
              gsap.set(star, { display: 'none' })
            }
          }
        )
      })
    }

    // Title entrance
    const tl = gsap.timeline()

    tl.fromTo(titleRef.current,
      { y: 60, opacity: 0, scale: 0.8, filter: 'blur(20px)' },
      { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    )

    // Meteor entrance for each ball
    balls.forEach((ball, i) => {
      const data = FLOATING_BALLS[i]
      const trail = ball?.querySelector('.meteor-trail')

      gsap.set(ball, {
        x: data.fromX,
        y: data.fromY,
        scale: 0.3,
        opacity: 0,
        rotation: data.angle
      })

      gsap.to(ball, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.5 + i * 0.1,
        delay: 0.3 + i * 0.08,
        ease: 'power4.out',
        onStart: () => {
          if (trail) {
            gsap.fromTo(trail,
              { opacity: 1, scaleX: 3 },
              { opacity: 0, scaleX: 0, duration: 1, ease: 'power2.out' }
            )
          }
        }
      })

      // Continuous subtle floating
      const ballInner = ball?.querySelector('.ball-inner')
      if (ballInner) {
        gsap.to(ballInner, {
          y: 'random(-12, 12)',
          x: 'random(-8, 8)',
          rotation: 'random(-5, 5)',
          duration: 3 + i * 0.4,
          delay: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }

      // Pulsing glow
      const ballGlow = ball?.querySelector('.ball-glow')
      if (ballGlow) {
        gsap.to(ballGlow, {
          scale: 1.3,
          opacity: 0.8,
          duration: 1.5 + i * 0.2,
          delay: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }
    })

    // Title glow animation
    gsap.to(titleRef.current, {
      textShadow: '0 0 80px rgba(99, 102, 241, 1), 0 0 150px rgba(168, 85, 247, 0.6), 0 0 200px rgba(236, 72, 153, 0.3)',
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-[90vh] min-h-[650px] flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />

        {/* Star field effect */}
        <div className="stars absolute inset-0" />
      </div>

      {/* Shooting stars (one-time animation) */}
      <div ref={shootingStarsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="shooting-star absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              opacity: 0,
            }}
          >
            {/* Star head */}
            <div
              className="absolute rounded-full bg-white"
              style={{
                width: `${star.size * 3}px`,
                height: `${star.size * 3}px`,
                boxShadow: `
                  0 0 ${star.size * 4}px ${star.size * 2}px rgba(255, 255, 255, 0.9),
                  0 0 ${star.size * 8}px ${star.size * 4}px rgba(167, 139, 250, 0.6),
                  0 0 ${star.size * 12}px ${star.size * 6}px rgba(139, 92, 246, 0.4)
                `,
              }}
            />
            {/* Star tail */}
            <div
              className="absolute top-1/2 right-full -translate-y-1/2"
              style={{
                width: `${star.tailLength}px`,
                height: `${star.size * 1.5}px`,
                background: `linear-gradient(90deg,
                  transparent 0%,
                  rgba(167, 139, 250, 0.1) 20%,
                  rgba(139, 92, 246, 0.4) 60%,
                  rgba(255, 255, 255, 0.8) 100%
                )`,
                filter: 'blur(1px)',
                transform: 'translateY(-50%) rotate(-35deg)',
                transformOrigin: 'right center',
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating meteor balls */}
      {FLOATING_BALLS.map((ball, i) => (
        <div
          key={i}
          ref={(el) => { ballRefs.current[i] = el }}
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: ball.x,
            top: ball.y,
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            zIndex: ball.size === 'lg' ? 3 : ball.size === 'md' ? 2 : 1,
          }}
        >
          {/* Meteor trail */}
          <div
            className="meteor-trail absolute top-1/2 right-full -translate-y-1/2"
            style={{
              width: ball.size === 'lg' ? '120px' : ball.size === 'md' ? '80px' : '60px',
              height: ball.size === 'lg' ? '4px' : '3px',
              background: `linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.8) 50%, rgba(168, 85, 247, 1) 100%)`,
              filter: 'blur(2px)',
              transformOrigin: 'right center',
              opacity: 0,
            }}
          />

          <div className="ball-inner relative">
            {/* Multi-layer glow */}
            <div
              className="ball-glow absolute rounded-full"
              style={{
                width: ball.size === 'lg' ? '80px' : ball.size === 'md' ? '60px' : '40px',
                height: ball.size === 'lg' ? '80px' : ball.size === 'md' ? '60px' : '40px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(168, 85, 247, 0.3) 40%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: ball.size === 'lg' ? '60px' : ball.size === 'md' ? '45px' : '30px',
                height: ball.size === 'lg' ? '60px' : ball.size === 'md' ? '45px' : '30px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                animationDuration: '2s',
              }}
            />

            {/* The ball */}
            <div className="relative z-10">
              <NumberBall number={ball.num} size={ball.size} />
            </div>

            {/* Ring effect */}
            <div
              className="absolute rounded-full border border-white/20"
              style={{
                width: ball.size === 'lg' ? '70px' : ball.size === 'md' ? '55px' : '38px',
                height: ball.size === 'lg' ? '70px' : ball.size === 'md' ? '55px' : '38px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'ring-pulse 2s ease-out infinite',
              }}
            />
          </div>
        </div>
      ))}

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 will-change-transform"
      >
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 20%, #c084fc 40%, #f472b6 60%, #fb923c 80%, #fbbf24 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'gradient-flow 4s ease infinite',
            textShadow: '0 0 60px rgba(99, 102, 241, 0.8)',
            opacity: 0,
          }}
        >
          Lotto Genius
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-lg sm:text-xl text-indigo-700/80 font-medium tracking-wide"
          style={{ opacity: 0 }}
        >
          AI 기반 로또 번호 추천 서비스
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-indigo-300/60 tracking-widest uppercase">Scroll</span>
          <svg
            className="w-5 h-5 text-indigo-300/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes ring-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.5; }
        }

        .stars {
          background-image:
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.2), transparent),
            radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 370px 50px, rgba(255,255,255,0.4), transparent),
            radial-gradient(2px 2px at 450px 180px, rgba(255,255,255,0.2), transparent);
          background-size: 500px 200px;
          animation: stars-move 60s linear infinite;
        }

        @keyframes stars-move {
          from { background-position: 0 0; }
          to { background-position: 500px 200px; }
        }
      `}</style>
    </section>
  )
}
