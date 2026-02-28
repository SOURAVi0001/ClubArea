import { useUpdatesQuery } from '@/queries/useContent';

export function UpdatesPage() {
    const { data: updates = [], isLoading, isError } = useUpdatesQuery();

    if (isLoading) return <div className="min-h-screen pt-24 text-center text-slate-300">Loading updates...</div>;
    if (isError) return <div className="min-h-screen pt-24 text-center text-red-400">Failed to load updates.</div>;

    return (
        <div className="min-h-screen pt-24 pb-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Latest Updates</h1>

                {updates.length === 0 ? (
                    <p className="text-slate-400">No updates available.</p>
                ) : (
                    <div className="space-y-6">
                        {updates.map((update: any) => (
                            <div key={update._id} className="p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-[0px] transition-all duration-300 shadow-[0_4px_16px_0_rgba(0,0,0,0.2)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 font-semibold bg-fuchsia-500/20 text-fuchsia-300 rounded-lg mb-2 text-sm shadow-sm border border-fuchsia-500/20">
                                            {update.clubName}
                                        </span>
                                        <h3 className="text-xl font-bold text-white drop-shadow-md">{update.title}</h3>
                                    </div>
                                    <span className="text-slate-300 text-sm font-medium drop-shadow-sm">
                                        {new Date(update.date || update.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-200 whitespace-pre-line leading-relaxed drop-shadow-sm">{update.content || update.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
