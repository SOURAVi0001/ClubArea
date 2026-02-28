import { useMemberUpdates } from '../../queries/useMember';
import { format } from 'date-fns';

export function MemberUpdatesPage() {
  const { data, isLoading, error } = useMemberUpdates();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading updates...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { data: updates } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Club Updates</h1>
        <p className="text-slate-500">Stay informed about the latest news and announcements.</p>
      </div>

      <div className="space-y-6">
        {updates?.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200">
            <p className="text-slate-500 italic">No updates available at the moment.</p>
          </div>
        ) : (
          updates?.map((update: any) => (
            <div key={update._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition card-hover-effect">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-slate-800">{update.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full border ${update.type === 'public'
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                  {update.type === 'public' ? 'Public' : 'Members Only'}
                </span>
              </div>

              <p className="text-slate-600 mb-4 whitespace-pre-wrap leading-relaxed">{update.description}</p>

              <div className="flex justify-between items-end text-sm text-slate-400 border-t border-slate-100 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                    {update.posted_by?.charAt(0)}
                  </div>
                  <span>Posted by <span className="text-slate-600 font-medium">{update.posted_by}</span></span>
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
