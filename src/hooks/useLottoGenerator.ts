import { useState, useCallback } from 'react'
import { generateNumbers } from '@/lib/algorithms'
import type { LottoData, GeneratedGame } from '@/types/lotto'

interface UseLottoGeneratorReturn {
  generatedGames: GeneratedGame[]
  isGenerating: boolean
  generate: (data: LottoData, gameCount: number) => void
  clear: () => void
}

export function useLottoGenerator(): UseLottoGeneratorReturn {
  const [generatedGames, setGeneratedGames] = useState<GeneratedGame[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback((data: LottoData, gameCount: number) => {
    setIsGenerating(true)

    setTimeout(() => {
      const games = generateNumbers(data, gameCount)
      setGeneratedGames(games)
      setIsGenerating(false)
    }, 100)
  }, [])

  const clear = useCallback(() => {
    setGeneratedGames([])
  }, [])

  return {
    generatedGames,
    isGenerating,
    generate,
    clear,
  }
}
