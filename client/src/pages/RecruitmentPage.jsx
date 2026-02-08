import { useRecruitmentQuery } from '@/hooks/useContent';

export function RecruitmentPage() {
  const { data: openings = [], isLoading, isError } = useRecruitmentQuery();

  if (isLoading) return <div className="min-h-screen pt-24 text-center text-slate-300">Loading openings...</div>;
  if (isError) return <div className="min-h-screen pt-24 text-center text-red-400">Failed to load openings.</div>;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Recruitment Opportunities</h1>

        {openings.length === 0 ? (
          <p className="text-slate-400">No current openings.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {openings.map((opening) => (
              <div key={opening._id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-2">{opening.role || opening.position}</h3>
                <p className="text-fuchsia-400 text-sm mb-4">{opening.clubName} • {opening.teamName}</p>
                <p className="text-slate-300 mb-6">{opening.description || "Join our team!"}</p>
                <button className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-medium transition">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
