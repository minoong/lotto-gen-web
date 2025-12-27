import { useQuery } from '@tanstack/react-query'
import { fetchLottoData } from '@/lib/api'
import type { LottoData } from '@/types/lotto'

export function useLottoData() {
  return useQuery<LottoData>({
    queryKey: ['lottoData'],
    queryFn: fetchLottoData,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    retry: 3,
  })
}
