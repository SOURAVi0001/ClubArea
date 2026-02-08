import { Link } from 'react-router-dom';
import { useClubsQuery } from '@/hooks';
import { useClubsStore } from '@/stores/useClubsStore';

export function ClubListPage() {
  const { data: clubs = [], isLoading, isError } = useClubsQuery();
  const { searchQuery, setSearchQuery } = useClubsStore();

  const filteredClubs = clubs.filter(club =>
    club.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="min-h-screen pt-24 px-6 text-center text-slate-300">Loading clubs...</div>;
  if (isError) return <div className="min-h-screen pt-24 px-6 text-center text-red-400">Failed to load clubs.</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Explore Clubs</h1>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-fuchsia-500"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Link
              key={club.id}
              to={`/club/${club.id}`}
              className="block p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-fuchsia-500/50 transition"
            >
              <div className="h-40 bg-slate-700/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {club.photo ? (
                  <img src={club.photo} alt={club.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🏛️</span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">{club.name}</h2>
              <p className="text-slate-400 mt-2 line-clamp-2">{club.description || 'No description available.'}</p>
            </Link>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <p className="text-center text-slate-500 mt-12">No clubs found matching "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
}

