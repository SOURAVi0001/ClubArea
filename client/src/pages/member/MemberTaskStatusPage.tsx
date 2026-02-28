import { useMemberTasks } from '../../queries/useMember';
import { format } from 'date-fns';
import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/utils/constants';

export function MemberTaskStatusPage() {
  const { data, isLoading, error } = useMemberTasks();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { data: tasks } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Tasks</h1>
        <p className="text-slate-500">Track and manage your assigned tasks.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 border-b border-slate-100 bg-slate-50">
              <th className="py-4 px-6 font-medium text-sm text-slate-400 uppercase tracking-widest">Task Title</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-400 uppercase tracking-widest">Assigned By</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-400 uppercase tracking-widest">Due Date</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-400 uppercase tracking-widest">Status</th>
              <th className="py-4 px-6 font-medium text-sm text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {tasks?.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 italic">No tasks assigned to you.</td>
              </tr>
            ) : (
              tasks?.map((task: any) => (
                <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer group">
                  <td className="py-4 px-6 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                    <Link to={ROUTES.VIEW_DETAILS?.replace(':id', task._id)} className="block w-full h-full">
                      {task.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-sm">{task.posted_by}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">
                    {task.task_completion_date && format(new Date(task.task_completion_date), 'MMM d, yyyy')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${task.task_status === 1
                      ? 'bg-green-50 text-green-600 border-green-100'
                      : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                      {task.task_status === 1 ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      to={ROUTES.VIEW_DETAILS?.replace(':id', task._id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-all"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
