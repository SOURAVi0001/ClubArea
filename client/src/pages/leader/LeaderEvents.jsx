import { useState } from 'react';
import { useLeaderEvents, usePostEventMutation } from '../../queries/useLeader';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function LeaderEvents() {
    const { data, isLoading, error } = useLeaderEvents();
    const postMutation = usePostEventMutation();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        time: '',
        date: '',
        venue: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        postMutation.mutate(formData, {
            onSuccess: () => {
                setShowForm(false);
                setFormData({ title: '', time: '', date: '', venue: '', description: '' });
                queryClient.invalidateQueries(['leader', 'events']);
            }
        });
    };

    if (isLoading) return <div className="p-8 text-white">Loading events...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { data: events, totalCount } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Club Events</h1>
                    <p className="text-slate-400">Manage and schedule new events.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-semibold transition"
                >
                    {showForm ? 'Cancel' : '+ New Event'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-white mb-4">Schedule New Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Venue</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Time</label>
                                <input
                                    type="time"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-300 mb-1">Description</label>
                            <textarea
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none h-24"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-500 hover:to-purple-500 transition disabled:opacity-50"
                            disabled={postMutation.isPending}
                        >
                            {postMutation.isPending ? 'Scheduling...' : 'Schedule Event'}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.length === 0 ? (
                    <p className="text-slate-400 italic text-center py-10 col-span-full">No upcoming events.</p>
                ) : (
                    events?.map((event) => (
                        <div key={event._id} className="relative bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition group hover:shadow-lg hover:shadow-fuchsia-900/10">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-3xl font-bold text-white block mb-0 leading-none">
                                            {event.date && format(new Date(event.date), 'd')}
                                        </span>
                                        <span className="text-sm font-semibold text-fuchsia-400 uppercase tracking-widest">
                                            {event.date && format(new Date(event.date), 'MMM')}
                                        </span>
                                    </div>
                                    <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full flex items-center gap-1">
                                        🕒 {event.time}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-1">{event.title}</h3>

                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                    <span>📍</span>
                                    <span className="truncate">{event.venue}</span>
                                </div>

                                {event.description && (
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                        {event.description}
                                    </p>
                                )}

                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
                                    <span>Posted by {event.posted_by}</span>
                                    <button className="text-cyan-400 hover:underline">Edit Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
