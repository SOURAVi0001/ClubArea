import { useLeaderMembers } from '../../queries/useLeader';

export function LeaderMembers() {
    const { data, isLoading, error } = useLeaderMembers();

    if (isLoading) return <div className="p-8 text-white">Loading members...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { members } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Club Members</h1>
                <p className="text-slate-400">Total members: <span className="text-fuchsia-400 font-bold">{members?.length || 0}</span></p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700 bg-slate-800">
                                <th className="py-4 px-6">Name</th>
                                <th className="py-4 px-6">Email</th>
                                <th className="py-4 px-6">Team</th>
                                <th className="py-4 px-6">Role</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {members?.map((member) => (
                                <tr key={member._id} className="border-b border-slate-800 hover:bg-slate-700/30 transition">
                                    <td className="py-4 px-6 font-medium text-white">{member.name}</td>
                                    <td className="py-4 px-6">{member.email}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-slate-700 rounded-full text-xs">
                                            {member.teamName || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 capitalize">{member.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
