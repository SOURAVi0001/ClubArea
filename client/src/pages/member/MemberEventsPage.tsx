import { useMemberEvents } from '../../queries/useMember';
import { format } from 'date-fns';

export function MemberEventsPage() {
  const { data, isLoading, error } = useMemberEvents();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading events...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { data: events } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upcoming Events</h1>
        <p className="text-slate-500">Don't miss out on these exciting activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200 col-span-full">
            <p className="text-slate-500 italic">No events scheduled at the moment.</p>
          </div>
        ) : (
          events?.map((event: any) => (
            <div key={event._id} className="relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition card-hover-effect">
              <div className={`absolute top-0 w-full h-1 ${new Date(event.date) < new Date() ? 'bg-slate-300' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}></div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-center bg-slate-50 rounded-lg p-2 border border-slate-100 min-w-[60px]">
                    <span className="block text-2xl font-bold text-slate-800 leading-none">
                      {event.date && format(new Date(event.date), 'd')}
                    </span>
                    <span className="block text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                      {event.date && format(new Date(event.date), 'MMM')}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center gap-1">
                    🕒 {event.time}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{event.title}</h3>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <span>📍</span>
                  <span className="truncate">{event.venue}</span>
                </div>

                {event.description && (
                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                  <span>Posted by <span className="font-medium text-slate-600">{event.posted_by}</span></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
