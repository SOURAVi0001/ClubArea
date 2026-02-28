import { useLeaderFeedback } from '../../queries/useLeader';

export function LeaderFeedback() {
    const { data, isLoading, error } = useLeaderFeedback();

    if (isLoading) return <div className="p-8 text-white">Loading feedback...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { data: feedbackData } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Member Feedback</h1>
                <p className="text-slate-400">View and respond to feedback from your club members.</p>
            </div>

            <div className="space-y-6">
                {feedbackData?.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-10">No feedback submitted yet.</p>
                ) : (
                    feedbackData?.map((item: any) => (
                        <div key={item._id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/20">
                                        {item.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                        <p className="text-sm text-slate-400">by <span className="text-cyan-400 font-medium">{item.name}</span> <span className="text-xs text-slate-500">• {item.user_type}</span></p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500">{item.date && new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-300 pl-13 border-l-2 border-slate-700 ml-5 pl-4">{item.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
