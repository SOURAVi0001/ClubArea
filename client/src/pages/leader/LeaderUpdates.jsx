import { useState } from 'react';
import { useLeaderUpdates, usePostUpdateMutation } from '../../hooks/useLeader';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function LeaderUpdates() {
    const { data, isLoading, error } = useLeaderUpdates();
    const postMutation = usePostUpdateMutation();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        postType: 'club' // 'club' or 'public'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        postMutation.mutate(formData, {
            onSuccess: () => {
                setShowForm(false);
                setFormData({ title: '', content: '', postType: 'club' });
                queryClient.invalidateQueries(['leader', 'updates']);
            }
        });
    };

    if (isLoading) return <div className="p-8 text-white">Loading updates...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { data: updates, totalCount } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Club Updates</h1>
                    <p className="text-slate-400">Post announcements for your members or the public.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-semibold transition"
                >
                    {showForm ? 'Cancel' : '+ New Update'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-white mb-4">Post New Update</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Visibility</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.postType}
                                    onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                                >
                                    <option value="club">Club Members Only</option>
                                    <option value="public">Public (Everyone)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1">Content</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none h-32"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-500 hover:to-purple-500 transition disabled:opacity-50"
                            disabled={postMutation.isPending}
                        >
                            {postMutation.isPending ? 'Posting...' : 'Post Update'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {updates?.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-10">No updates posted yet.</p>
                ) : (
                    updates?.map((update) => (
                        <div key={update._id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-fuchsia-500 to-purple-600"></div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">{update.title}</h3>
                                <span className={`px-2 py-1 text-xs rounded-full border ${update.type === 'public' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                    {update.type === 'public' ? 'Public' : 'Members Only'}
                                </span>
                            </div>
                            <p className="text-slate-300 mb-4 whitespace-pre-wrap">{update.description}</p>
                            <div className="flex justify-between items-end text-sm text-slate-500 border-t border-slate-700/50 pt-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                        {update.posted_by?.charAt(0)}
                                    </span>
                                    <span>Posted by <span className="text-slate-400">{update.posted_by}</span></span>
                                </div>
                                <span>{update.date && format(new Date(update.date), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
