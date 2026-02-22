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
                        {updates.map((update) => (
                            <div key={update._id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-fuchsia-500/20 text-fuchsia-300 rounded-md mb-2">
                                            {update.clubName}
                                        </span>
                                        <h3 className="text-xl font-bold text-white">{update.title}</h3>
                                    </div>
                                    <span className="text-slate-500 text-sm">
                                        {new Date(update.date || update.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-300 whitespace-pre-line">{update.content || update.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
