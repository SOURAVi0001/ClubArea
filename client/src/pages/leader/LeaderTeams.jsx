import { useLeaderTeams } from '../../hooks/useLeader';

export function LeaderTeams() {
    const { data, isLoading, error } = useLeaderTeams();

    if (isLoading) return <div className="p-8 text-white">Loading teams...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { teamStats } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Overview</h1>
                    <p className="text-slate-400">Manage team structures and members.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamStats?.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-10 col-span-full">No teams formed yet.</p>
                ) : (
                    teamStats?.map((team) => (
                        <div key={team.teamName} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">{team.teamName}</h3>
                                <span className="px-3 py-1 bg-fuchsia-500/10 text-fuchsia-400 text-xs rounded-full border border-fuchsia-500/20">
                                    {team.membercount} Members
                                </span>
                            </div>
                            <div className="space-y-3">
                                {team.members?.slice(0, 5).map((member) => (
                                    <div key={member._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                                            {member.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                                {team.members?.length > 5 && (
                                    <div className="text-center pt-2 border-t border-slate-700/50">
                                        <span className="text-xs text-slate-500 italic">+ {team.members.length - 5} more members</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
