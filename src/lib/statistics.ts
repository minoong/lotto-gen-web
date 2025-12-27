import type { LottoData, LottoStatistics } from '@/types/lotto'

export function calculateStatistics(data: LottoData): LottoStatistics {
  const sortedData = [...data].sort((a, b) => a.draw_no - b.draw_no)
  const totalDraws = sortedData.length

  const frequencyMap = new Map<number, number>()
  const lastAppearanceMap = new Map<number, number>()
  const pairFrequencyMap = new Map<string, number>()

  for (let i = 1; i <= 45; i++) {
    frequencyMap.set(i, 0)
  }

  const sums: number[] = []

  sortedData.forEach((draw, index) => {
    const sum = draw.numbers.reduce((a, b) => a + b, 0)
    sums.push(sum)

    draw.numbers.forEach((num) => {
      frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1)
      lastAppearanceMap.set(num, index + 1)
    })

    for (let i = 0; i < draw.numbers.length - 1; i++) {
      for (let j = i + 1; j < draw.numbers.length; j++) {
        const pairKey = `${Math.min(draw.numbers[i], draw.numbers[j])}-${Math.max(draw.numbers[i], draw.numbers[j])}`
        pairFrequencyMap.set(pairKey, (pairFrequencyMap.get(pairKey) || 0) + 1)
      }
    }
  })

  const recentFrequencyMap = new Map<number, number>()
  for (let i = 1; i <= 45; i++) {
    recentFrequencyMap.set(i, 0)
  }

  const recent10 = sortedData.slice(-10)
  recent10.forEach((draw) => {
    draw.numbers.forEach((num) => {
      recentFrequencyMap.set(num, (recentFrequencyMap.get(num) || 0) + 1)
    })
  })

  const averageSum = sums.reduce((a, b) => a + b, 0) / sums.length
  const variance =
    sums.reduce((acc, sum) => acc + Math.pow(sum - averageSum, 2), 0) /
    sums.length
  const sumStdDev = Math.sqrt(variance)

  return {
    totalDraws,
    firstDraw: sortedData[0]?.draw_no || 0,
    lastDraw: sortedData[totalDraws - 1]?.draw_no || 0,
    frequencyMap,
    recentFrequencyMap,
    lastAppearanceMap,
    pairFrequencyMap,
    averageSum,
    sumStdDev,
  }
}

export function getTopFrequent(
  frequencyMap: Map<number, number>,
  count: number
): Array<{ number: number; frequency: number }> {
  return Array.from(frequencyMap.entries())
    .map(([number, frequency]) => ({ number, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, count)
}

export function getLeastFrequent(
  frequencyMap: Map<number, number>,
  count: number
): Array<{ number: number; frequency: number }> {
  return Array.from(frequencyMap.entries())
    .map(([number, frequency]) => ({ number, frequency }))
    .sort((a, b) => a.frequency - b.frequency)
    .slice(0, count)
}

export function getColdNumbers(
  lastAppearanceMap: Map<number, number>,
  totalDraws: number,
  threshold: number = 10
): number[] {
  return Array.from(lastAppearanceMap.entries())
    .filter(([, lastDraw]) => totalDraws - lastDraw >= threshold)
    .map(([number]) => number)
    .sort((a, b) => a - b)
}
