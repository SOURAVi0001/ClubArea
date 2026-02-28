import { useQuery } from '@tanstack/react-query';
import { fetchClubs, fetchClubById } from '../services/clubs';

export const CLUB_KEYS = {
  all: ['clubs'],
  detail: (id: string) => ['clubs', id],
};

export function useClubsQuery() {
  return useQuery({
    queryKey: CLUB_KEYS.all,
    queryFn: fetchClubs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useClubDetailQuery(id: string) {
  return useQuery({
    queryKey: CLUB_KEYS.detail(id),
    queryFn: () => fetchClubById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
