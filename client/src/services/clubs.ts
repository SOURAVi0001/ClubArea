import { api } from './axios';

const MOCK_CLUBS = [
  { id: '1', name: 'Tech Club', description: 'Coding and tech events.', photo: null },
  { id: '2', name: 'Design Club', description: 'UI/UX and design workshops.', photo: null },
  { id: '3', name: 'Cultural Club', description: 'Cultural events and performances.', photo: null },
];

export async function fetchClubs() {
  try {
    const { data } = await api.get('/clublist');
    return Array.isArray(data) ? data : (data?.clubs ?? data?.Register ?? MOCK_CLUBS);
  } catch {
    return MOCK_CLUBS;
  }
}

export async function fetchClubById(id: string) {
  try {
    const { data } = await api.get(`/club/${id}`);
    return data?.club ?? data ?? null;
  } catch {
    const club = MOCK_CLUBS.find((c) => c.id === id) ?? null;
    return club;
  }
}
