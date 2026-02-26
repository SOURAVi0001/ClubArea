import { Link } from '@tanstack/react-router';
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
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Explore Clubs</h1>
          <input
            type="text"
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent backdrop-blur-[0px] shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Link
              key={club.id}
              to={`/club/${club.id}`}
              className="group block p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-[0px] hover:scale-[1.02] transition-all duration-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] overflow-hidden relative"
            >
              {/* Subtle inner highlight for liquid effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="h-40 bg-slate-800/40 rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-white/5 relative z-10 shadow-inner">
                {club.photo ? (
                  <img src={club.photo} alt={club.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-500">🏛️</span>
                )}
              </div>
              <h2 className="relative z-10 text-xl font-bold text-white tracking-wide drop-shadow-md">{club.name}</h2>
              <p className="relative z-10 text-slate-200 mt-2 line-clamp-2 font-medium leading-relaxed drop-shadow-md">{club.description || 'No description available.'}</p>
            </Link>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-[0px] mx-auto max-w-md shadow-lg">
            <p className="text-slate-200 text-lg font-medium drop-shadow-sm">No clubs found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

