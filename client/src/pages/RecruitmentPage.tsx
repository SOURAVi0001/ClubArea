import { useRecruitmentQuery } from '@/queries/useContent';

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
            {openings.map((opening: any) => (
              <div key={opening._id} className="group p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-[0px] transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{opening.role || opening.position}</h3>
                <p className="text-fuchsia-300 text-sm mb-4 font-medium drop-shadow-sm">{opening.clubName} • {opening.teamName}</p>
                <p className="text-slate-200 mb-6 drop-shadow-sm">{opening.description || "Join our team!"}</p>
                <button className="px-5 py-2.5 bg-fuchsia-600/80 hover:bg-fuchsia-600 border border-fuchsia-500/50 text-white rounded-xl text-sm font-medium transition shadow-lg backdrop-blur-[0px] group-hover:scale-[1.02]">
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
