import { useParams, Link } from 'react-router-dom';
import { useMemberTaskDetails } from '../../queries/useMember';
import { format } from 'date-fns';
import { ROUTES } from '@/utils/constants';

export function ViewDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useMemberTaskDetails(id);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading task details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { task } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <Link to={ROUTES.MEMBER_TASK_STATUS} className="text-slate-500 text-sm hover:text-slate-700 hover:underline mb-8 block transition-all font-medium">← Back to Tasks</Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{task.title}</h1>
            <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${task.task_status === 1
                ? 'bg-green-50 text-green-600 border-green-100'
                : 'bg-orange-50 text-orange-600 border-orange-100'
              }`}>
              {task.task_status === 1 ? 'Completed' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Assigned By:</span>
              <span>{task.posted_by}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Due Date:</span>
              <span>{task.task_completion_date && format(new Date(task.task_completion_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Assigned On:</span>
              <span>{format(new Date(task.task_assign_date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed min-h-[100px]">{task.description}</p>
        </div>

        {/* Placeholder for future task actions like "Mark as Complete" if member can do that */}
        {/*
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-4">
           {task.task_status === 0 && (
             <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md">
               Mark as Complete
             </button>
           )}
        </div>
        */}
      </div>
    </div>
  );
}
