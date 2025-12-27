import axios from 'axios'
import type { LottoData } from '@/types/lotto'

const API_URL = 'https://smok95.github.io/lotto/results/all.json'

const axiosInstance = axios.create({
  timeout: 10000,
})

export async function fetchLottoData(): Promise<LottoData> {
  const response = await axiosInstance.get<LottoData>(API_URL)
  return response.data
}
