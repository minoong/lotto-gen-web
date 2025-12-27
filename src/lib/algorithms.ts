import type {
  LottoData,
  LottoStatistics,
  NumberWeight,
  GeneratedGame,
} from '@/types/lotto'
import { calculateStatistics } from './statistics'

const WEIGHTS = {
  FREQUENCY: 0.25,
  RECENT_TREND: 0.3,
  GAP_PATTERN: 0.15,
  COMBINATION_BALANCE: 0.2,
  PAIR_ANALYSIS: 0.1,
}

const MIN_SUM = 100
const MAX_SUM = 175
const COLD_BONUS_MAX = 20

function calculateFrequencyScore(
  number: number,
  stats: LottoStatistics
): number {
  const frequency = stats.frequencyMap.get(number) || 0
  return (frequency / stats.totalDraws) * 100
}

function calculateRecentScore(
  number: number,
  stats: LottoStatistics,
  data: LottoData
): { recentScore: number; coldBonus: number } {
  const recent10Count = stats.recentFrequencyMap.get(number) || 0
  const recent10Score = (recent10Count / 10) * 100

  const sortedData = [...data].sort((a, b) => b.draw_no - a.draw_no)
  const recent30 = sortedData.slice(0, 30)
  let recent30Count = 0
  recent30.forEach((draw) => {
    if (draw.numbers.includes(number)) {
      recent30Count++
    }
  })
  const recent30Score = (recent30Count / 30) * 100

  const recentScore = recent10Score * 0.6 + recent30Score * 0.4

  const lastAppearance = stats.lastAppearanceMap.get(number) || 0
  const drawsSinceAppearance = stats.totalDraws - lastAppearance
  const coldBonus =
    drawsSinceAppearance > 10
      ? Math.min(COLD_BONUS_MAX, (drawsSinceAppearance - 10) * 1)
      : 0

  return { recentScore, coldBonus }
}

function calculateGapPatternScore(
  number: number,
  selectedNumbers: number[]
): number {
  if (selectedNumbers.length === 0) return 50

  const gaps = selectedNumbers.map((n) => Math.abs(number - n))
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length

  const optimalGap = 10
  const gapScore = Math.max(0, 100 - Math.abs(avgGap - optimalGap) * 5)

  return gapScore
}

function calculateBalanceScore(
  number: number,
  selectedNumbers: number[]
): number {
  const allNumbers = [...selectedNumbers, number]

  const groups = [0, 0, 0, 0, 0]
  allNumbers.forEach((n) => {
    if (n <= 10) groups[0]++
    else if (n <= 20) groups[1]++
    else if (n <= 30) groups[2]++
    else if (n <= 40) groups[3]++
    else groups[4]++
  })

  const avg = allNumbers.length / 5
  const variance =
    groups.reduce((sum, g) => sum + Math.pow(g - avg, 2), 0) / 5
  const balanceScore = Math.max(0, 100 - variance * 20)

  return balanceScore
}

function calculatePairScore(
  number: number,
  selectedNumbers: number[],
  stats: LottoStatistics
): number {
  if (selectedNumbers.length === 0) return 50

  let totalPairScore = 0
  selectedNumbers.forEach((selected) => {
    const pairKey = `${Math.min(number, selected)}-${Math.max(number, selected)}`
    const pairFrequency = stats.pairFrequencyMap.get(pairKey) || 0
    totalPairScore += pairFrequency
  })

  const avgPairFreq = stats.totalDraws * 0.01
  const normalizedScore = Math.min(
    100,
    (totalPairScore / selectedNumbers.length / avgPairFreq) * 50
  )

  return normalizedScore
}

function calculateNumberWeights(
  data: LottoData,
  stats: LottoStatistics,
  selectedNumbers: number[] = []
): NumberWeight[] {
  const weights: NumberWeight[] = []

  for (let i = 1; i <= 45; i++) {
    if (selectedNumbers.includes(i)) continue

    const frequencyScore = calculateFrequencyScore(i, stats)
    const { recentScore, coldBonus } = calculateRecentScore(i, stats, data)
    const gapScore = calculateGapPatternScore(i, selectedNumbers)
    const balanceScore = calculateBalanceScore(i, selectedNumbers)
    const pairScore = calculatePairScore(i, selectedNumbers, stats)

    const weight =
      frequencyScore * WEIGHTS.FREQUENCY +
      (recentScore + coldBonus) * WEIGHTS.RECENT_TREND +
      gapScore * WEIGHTS.GAP_PATTERN +
      balanceScore * WEIGHTS.COMBINATION_BALANCE +
      pairScore * WEIGHTS.PAIR_ANALYSIS

    weights.push({
      number: i,
      weight,
      frequencyScore,
      recentScore,
      coldBonus,
    })
  }

  return weights
}

function weightedRandomSelect(weights: NumberWeight[]): number {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0)

  if (totalWeight <= 0) {
    return weights[Math.floor(Math.random() * weights.length)].number
  }

  let random = Math.random() * totalWeight
  for (const w of weights) {
    random -= w.weight
    if (random <= 0) {
      return w.number
    }
  }
  return weights[weights.length - 1].number
}

function validateGame(numbers: number[]): boolean {
  const sum = numbers.reduce((a, b) => a + b, 0)
  if (sum < MIN_SUM || sum > MAX_SUM) return false

  const oddCount = numbers.filter((n) => n % 2 === 1).length
  if (oddCount === 0 || oddCount === 6) return false

  const sorted = [...numbers].sort((a, b) => a - b)
  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i + 1] === sorted[i] + 1 && sorted[i + 2] === sorted[i] + 2) {
      return false
    }
  }

  const lowCount = numbers.filter((n) => n <= 22).length
  if (lowCount === 0 || lowCount === 6) return false

  const groups = [0, 0, 0, 0, 0]
  numbers.forEach((n) => {
    if (n <= 10) groups[0]++
    else if (n <= 20) groups[1]++
    else if (n <= 30) groups[2]++
    else if (n <= 40) groups[3]++
    else groups[4]++
  })
  const emptyGroups = groups.filter((g) => g === 0).length
  if (emptyGroups > 2) return false

  return true
}

function generateSingleGame(
  data: LottoData,
  stats: LottoStatistics
): GeneratedGame {
  const maxAttempts = 100
  let attempts = 0

  while (attempts < maxAttempts) {
    const selectedNumbers: number[] = []

    for (let i = 0; i < 6; i++) {
      const weights = calculateNumberWeights(data, stats, selectedNumbers)
      const selected = weightedRandomSelect(weights)
      selectedNumbers.push(selected)
    }

    selectedNumbers.sort((a, b) => a - b)

    if (validateGame(selectedNumbers)) {
      const sum = selectedNumbers.reduce((a, b) => a + b, 0)
      const oddCount = selectedNumbers.filter((n) => n % 2 === 1).length

      return {
        numbers: selectedNumbers,
        sum,
        oddCount,
        evenCount: 6 - oddCount,
      }
    }

    attempts++
  }

  const fallbackNumbers: number[] = []
  while (fallbackNumbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!fallbackNumbers.includes(num)) {
      fallbackNumbers.push(num)
    }
  }
  fallbackNumbers.sort((a, b) => a - b)
  const sum = fallbackNumbers.reduce((a, b) => a + b, 0)
  const oddCount = fallbackNumbers.filter((n) => n % 2 === 1).length

  return {
    numbers: fallbackNumbers,
    sum,
    oddCount,
    evenCount: 6 - oddCount,
  }
}

export function generateNumbers(
  data: LottoData,
  gameCount: number
): GeneratedGame[] {
  const stats = calculateStatistics(data)
  const results: GeneratedGame[] = []
  const usedCombinations = new Set<string>()

  for (let i = 0; i < gameCount; i++) {
    let game: GeneratedGame
    let combinationKey: string
    let duplicateAttempts = 0

    do {
      game = generateSingleGame(data, stats)
      combinationKey = game.numbers.join(',')
      duplicateAttempts++
    } while (usedCombinations.has(combinationKey) && duplicateAttempts < 10)

    usedCombinations.add(combinationKey)
    results.push(game)
  }

  return results
}

export { calculateStatistics }
