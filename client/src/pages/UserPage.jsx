import { useUserDataQuery, useUserApplicationsQuery } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/useAuthStore';
import { Link } from 'react-router-dom';

export function UserPage() {
  const { user } = useAuthStore();
  const { data: dashboardData, isLoading: isDashboardLoading } = useUserDataQuery();
  const { data: applications, isLoading: isAppsLoading } = useUserApplicationsQuery();

  if (isDashboardLoading || isAppsLoading) {
    return <div className="min-h-screen pt-24 text-center text-slate-300">Loading dashboard...</div>;
  }

  // dashboardData contains: { opening (not applied), openingsApplied, email, username }
  const openingsNotApplied = dashboardData?.opening || [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {dashboardData?.username || user?.name}</h1>
            <p className="text-slate-400 mt-1">{dashboardData?.email || user?.email}</p>
          </div>

        </div>

        {/* Applications Status Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-fuchsia-400 mb-6">Your Applications</h2>
          {applications && applications.length > 0 ? (
            <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="p-4 text-slate-300 font-semibold">Club</th>
                      <th className="p-4 text-slate-300 font-semibold">Role</th>
                      <th className="p-4 text-slate-300 font-semibold">Team</th>
                      <th className="p-4 text-slate-300 font-semibold">Status</th>
                      <th className="p-4 text-slate-300 font-semibold">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-700/30 transition">
                        <td className="p-4 text-white">{app.clubName}</td>
                        <td className="p-4 text-slate-300">{app.role}</td>
                        <td className="p-4 text-slate-300">{app.teamName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${app.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                              app.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                            }`}>
                            {app.status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-sm">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic">You haven't applied to any clubs yet.</p>
          )}
        </section>

        {/* Available Openings Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Open Recruitment Positions</h2>
          {openingsNotApplied.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {openingsNotApplied.map((opening) => (
                <div key={opening._id} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-fuchsia-500/50 transition">
                  <h3 className="text-xl font-bold text-white mb-2">{opening.role || opening.position || 'Recruitment'}</h3>
                  <p className="text-fuchsia-400 text-sm mb-4">{opening.clubName} • {opening.teamName}</p>
                  <p className="text-slate-300 mb-6 text-sm line-clamp-3">{opening.description || opening.motivation || "Join the team and make an impact!"}</p>
                  <button className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-sm font-medium transition w-full">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No new relevant openings available right now.</p>
          )}
        </section>
      </div>
    </div>
  );
}
