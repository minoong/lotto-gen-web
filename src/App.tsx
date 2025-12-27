import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Header } from '@/components/Header'
import { GameSelector } from '@/components/GameSelector'
import { GenerateButton } from '@/components/GenerateButton'
import { ResultList } from '@/components/ResultList'
import { RecentDraws } from '@/components/RecentDraws'
import { StatisticsPanel } from '@/components/StatisticsPanel'
import { useLottoData } from '@/hooks/useLottoData'
import { useLottoGenerator } from '@/hooks/useLottoGenerator'
import { Loader2 } from 'lucide-react'

gsap.registerPlugin(useGSAP)

const queryClient = new QueryClient()

function LottoApp() {
  const [gameCount, setGameCount] = useState(5)
  const { data: lottoData, isLoading, error } = useLottoData()
  const { generatedGames, isGenerating, generate } = useLottoGenerator()

  const handleGenerate = () => {
    if (lottoData) {
      generate(lottoData, gameCount)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/20 animate-ping" />
          </div>
          <p className="text-muted-foreground animate-pulse">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-3xl">!</span>
          </div>
          <p className="text-destructive font-medium">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10 overflow-x-hidden">
      <div className="max-w-lg mx-auto px-4 pb-12">
        <Header />
        <div className="space-y-6">
          <GameSelector
            gameCount={gameCount}
            onGameCountChange={setGameCount}
          />

          <GenerateButton
            onClick={handleGenerate}
            isGenerating={isGenerating}
            disabled={!lottoData}
          />

          <ResultList games={generatedGames} />

          {lottoData && <RecentDraws data={lottoData} />}

          {lottoData && <StatisticsPanel data={lottoData} />}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Lotto Genius - AI 기반 번호 추천</p>
          <p className="mt-1 opacity-60">당첨을 보장하지 않습니다</p>
        </footer>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LottoApp />
    </QueryClientProvider>
  )
}

export default App
