export interface LottoResult {
  date: string
  draw_no: number
  numbers: number[]
  bonus?: number
}

export type LottoData = LottoResult[]

export interface NumberWeight {
  number: number
  weight: number
  frequencyScore: number
  recentScore: number
  coldBonus: number
}

export interface LottoStatistics {
  totalDraws: number
  firstDraw: number
  lastDraw: number
  frequencyMap: Map<number, number>
  recentFrequencyMap: Map<number, number>
  lastAppearanceMap: Map<number, number>
  pairFrequencyMap: Map<string, number>
  averageSum: number
  sumStdDev: number
}

export interface GeneratedGame {
  numbers: number[]
  sum: number
  oddCount: number
  evenCount: number
}
