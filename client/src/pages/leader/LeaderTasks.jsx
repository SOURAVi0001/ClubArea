import { useState } from 'react';
import { useLeaderTasks, useCreateTaskMutation } from '../../hooks/useLeader';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function LeaderTasks() {
    const { data, isLoading, error } = useLeaderTasks();
    const createTaskMutation = useCreateTaskMutation();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        task_completion_date: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        createTaskMutation.mutate(formData, {
            onSuccess: () => {
                setShowForm(false);
                setFormData({ title: '', description: '', assigned_to: '', task_completion_date: '' });
                queryClient.invalidateQueries(['leader', 'tasks']);
            }
        });
    };

    if (isLoading) return <div className="p-8 text-white">Loading tasks...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

    const { data: tasks, members } = data; // Wait, data structure from controller is data: data (tasks), and create_task GET returns members

    // We need members list for the form. But `useLeaderTasks` calls `getTasks` which calls `taskstatus` controller.
    // The `taskstatus` controller only returns tasks.
    // The `create_task` GET controller returns members.
    // I should probably start by fetching tasks, and if user clicks "New Task", I fetch members (or fetch them in parallel).
    // Actually, I can use `useLeaderMembers` hook I created earlier for members list.

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <TaskDashboardcontent
                tasks={data.data}
                showForm={showForm}
                setShowForm={setShowForm}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                createTaskMutation={createTaskMutation}
            />
        </div>
    );
}

import { useLeaderMembers } from '../../hooks/useLeader';

function TaskDashboardcontent({ tasks, showForm, setShowForm, formData, setFormData, handleSubmit, createTaskMutation }) {
    const { data: membersData } = useLeaderMembers();
    const members = membersData?.members || [];

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Tasks</h1>
                    <p className="text-slate-400">Assign and track progress.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-semibold transition"
                >
                    {showForm ? 'Cancel' : '+ New Task'}
                </button>
            </div>

            {showForm && (
                <div className="mb-8 p-6 bg-slate-800 rounded-xl border border-slate-700 animate-fade-in-up">
                    <h2 className="text-xl font-semibold text-white mb-4">Assign New Task</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Assign To</label>
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                    required
                                >
                                    <option value="">Select Member</option>
                                    {members.map((member) => (
                                        <option key={member._id} value={member.name}>{member.name} ({member.teamName || 'General'})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-fuchsia-500 outline-none"
                                    value={formData.task_completion_date}
                                    onChange={(e) => setFormData({ ...formData, task_completion_date: e.target.value })}
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
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold rounded-lg hover:from-fuchsia-500 hover:to-purple-500 transition disabled:opacity-50"
                            disabled={createTaskMutation.isPending}
                        >
                            {createTaskMutation.isPending ? 'Assigning...' : 'Assign Task'}
                        </button>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-700">
                            <th className="py-3 px-4">Task</th>
                            <th className="py-3 px-4">Assigned To</th>
                            <th className="py-3 px-4">Due Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Assigned By</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        {tasks?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-slate-500 italic">No tasks assigned.</td>
                            </tr>
                        ) : (
                            tasks?.map((task) => (
                                <tr key={task._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                    <td className="py-3 px-4 font-semibold text-white">{task.title}</td>
                                    <td className="py-3 px-4">{task.assigned_to}</td>
                                    <td className="py-3 px-4">{task.task_completion_date && format(new Date(task.task_completion_date), 'MMM d, yyyy')}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs rounded-full border ${task.task_status === 1 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                            }`}>
                                            {task.task_status === 1 ? 'Completed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-500">{task.posted_by}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
