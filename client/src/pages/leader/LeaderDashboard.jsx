import { useLeaderDashboard } from '../../hooks/useLeader'; // Import the hook
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

// Since the dashboard endpoint mainly returns user info, we can use it to verify session and show welcome message.
// We can also fetch other stats here if needed, but for now let's focus on navigation.

export function LeaderDashboard() {
    const { data, isLoading, error } = useLeaderDashboard();

    if (isLoading) return <div className="p-8 text-white">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-red-500">Error loading dashboard: {error.message}</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Welcome, {data?.Leader_Name}</h1>
            <p className="text-slate-400 mb-8">Manage your club: <span className="text-fuchsia-400 font-semibold">{data?.Club_Name}</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Recruitment"
                    desc="Manage openings and applicants."
                    link={ROUTES.LEADER_RECRUITMENT}
                    icon="👥"
                />
                <DashboardCard
                    title="Updates"
                    desc="Post announcements for members or public."
                    link={ROUTES.LEADER_UPDATES}
                    icon="📢"
                />
                <DashboardCard
                    title="Events"
                    desc="Schedule and manage club events."
                    link={ROUTES.LEADER_EVENTS}
                    icon="🗓️"
                />
                <DashboardCard
                    title="Tasks"
                    desc="Assign and track tasks for members."
                    link={ROUTES.LEADER_TASKS}
                    icon="✅"
                />
                <DashboardCard
                    title="Teams"
                    desc="View team structures and member distribution."
                    link={ROUTES.LEADER_TEAMS}
                    icon="🧩"
                />
                <DashboardCard
                    title="Feedback"
                    desc="View feedback from members."
                    link={ROUTES.LEADER_FEEDBACK}
                    icon="💬"
                />
            </div>
        </div>
    );
}

function DashboardCard({ title, desc, link, icon }) {
    return (
        <Link to={link} className="block p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-750 hover:border-fuchsia-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                <span className="text-fuchsia-400 group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
        </Link>
    );
}
