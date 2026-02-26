import { useMemberContact } from '../../queries/useMember';

export function MemberContactPage() {
  const { data, isLoading, error } = useMemberContact();

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading contact details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { leader, Club_Name } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Leader</h1>
        <p className="text-slate-500">Contact information for {Club_Name} leadership.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transform hover:-translate-y-1 transition-all">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-[0px] flex items-center justify-center text-4xl font-bold shadow-inner border border-white/30">
              {leader?.name?.charAt(0)}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">{leader?.name}</h2>
              <p className="text-blue-100 font-medium tracking-wide opacity-90">Club Leader</p>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-[0px] border border-white/10">{Club_Name}</span>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Contact Details</h3>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                ✉️
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Email Address</p>
                <a href={`mailto:${leader?.email}`} className="text-slate-900 font-semibold hover:text-blue-600 transition-colors break-all">
                  {leader?.email}
                </a>
              </div>
            </div>

            {/* Placeholder for phone since model doesn't have it yet, but good for UI structure */}
            {/*
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                📞
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Phone Number</p>
                <a href={`tel:${leader?.phone}`} className="text-slate-900 font-semibold hover:text-purple-600 transition-colors">
                  {leader?.phone || 'Not available'}
                </a>
              </div>
            </div>
            */}
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${leader?.email}`}
                className="block w-full text-center py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm"
              >
                Send Email
              </a>
              {/* <button disabled className="block w-full text-center py-3 bg-slate-100 text-slate-400 font-medium rounded-lg cursor-not-allowed">
                Schedule Meeting (Coming Soon)
              </button> */}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">
                Have urgent issues? Reach out directly via email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
