import { useParams, Link } from 'react-router-dom';
import { useClubDetailQuery } from '@/hooks';
import { useClubsStore } from '@/stores/useClubsStore';
import { useEffect } from 'react';
import { ROUTES } from '@/utils/constants';

export function ClubDetailPage() {
  const { id } = useParams();
  const { data: club, isLoading, isError } = useClubDetailQuery(id);
  const { selectClub } = useClubsStore();

  useEffect(() => {
    if (id) selectClub(id);
  }, [id, selectClub]);

  if (isLoading) return <div className="min-h-screen pt-24 px-6 text-center text-slate-300">Loading...</div>;
  if (isError || !club) return <div className="min-h-screen pt-24 px-6 text-center text-red-400">Club not found.</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to={ROUTES.CLUB_LIST} className="text-fuchsia-400 hover:underline mb-6 inline-block">← Back to clubs</Link>
        {club.photo && <img src={club.photo} alt="" className="w-full h-64 object-cover rounded-xl mb-6" />}
        <h1 className="text-3xl font-bold text-white">{club.name}</h1>
        <p className="text-slate-300 mt-4">{club.description}</p>
      </div>
    </div>
  );
}
