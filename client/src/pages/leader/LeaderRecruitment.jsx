import { useState } from 'react';
import { useLeaderOpenings, useCreateOpeningMutation } from '../../queries/useLeader';
import { leaderService } from '../../services/leader';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export function LeaderRecruitment() {
    const { data, isLoading, error } = useLeaderOpenings();
    const createMutation = useCreateOpeningMutation();
    const queryClient = useQueryClient();
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        teamName: '',
        description: '',
        requirements: '',
        maxApplicants: 10
    });

    if (isLoading) return <div className="p-8 text-white">Loading recruitment data...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { activeOpenings, closedOpenings, availableRoles, Club_Name } = data;

    const handleCloseOpening = async (id) => {
        if (confirm('Are you sure you want to close this opening?')) {
            try {
                await leaderService.closeOpening(id);
                queryClient.invalidateQueries(['leader', 'openings']);
            } catch (err) {
                alert('Failed to close opening');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createMutation.mutate(formData, {
            onSuccess: () => {
                setShowCreateForm(false);
                setFormData({ teamName: '', description: '', requirements: '', maxApplicants: 10 });
            }
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Recruitment Dashboard</h1>
                    <p className="text-slate-400">Manage openings for {Club_Name}</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-semibold transition"
                >
                    {showCreateForm ? 'Cancel' : '+ New Opening'}
                </button>
            </div>

            {showCreateForm && (
                <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-white mb-4">Create New Opening</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 mb-1">Team Name</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.teamName}
                                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                    required
                                >
                                    <option value="">Select Team</option>
                                    {availableRoles?.map((role, idx) => (
                                        <option key={idx} value={role.teamName}>{role.teamName}</option>
                                    ))}
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Max Applicants</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.maxApplicants}
                                    onChange={(e) => setFormData({ ...formData, maxApplicants: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1">Description</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none h-24"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1">Requirements</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none h-24"
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-500 hover:to-purple-500 transition disabled:opacity-50"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending ? 'Creating...' : 'Post Opening'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-green-500 pl-3">Active Openings</h2>
                    {activeOpenings?.length === 0 ? (
                        <p className="text-slate-400 italic">No active openings.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeOpenings?.map((opening) => (
                                <div key={opening._id} className="bg-slate-800/50 border border-t border-slate-700 rounded-xl p-5 hover:border-slate-600 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white">{opening.teamName}</h3>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{opening.description}</p>
                                    <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                                        <span>Applicants: <span className="text-white font-semibold">{opening.applicantCount || 0}</span></span>
                                        <span>Max: {opening.maxApplicants}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={ROUTES.LEADER_APPLICANTS.replace(':id', opening._id)}
                                            className="flex-1 text-center py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition text-sm"
                                        >
                                            View Applicants
                                        </Link>
                                        <button
                                            onClick={() => handleCloseOpening(opening._id)}
                                            className="px-3 py-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition text-sm"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-slate-500 pl-3">Closed Openings</h2>
                    {closedOpenings?.length === 0 ? (
                        <p className="text-slate-400 italic">No closed openings.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {closedOpenings?.map((opening) => (
                                <div key={opening._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 opacity-75">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-slate-300">{opening.teamName}</h3>
                                        <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">Closed</span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{opening.description}</p>
                                    <div className="text-sm text-slate-600">
                                        <span>Final Applicants: {opening.applicantCount || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
