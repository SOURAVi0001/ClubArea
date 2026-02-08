import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/utils/constants';
import { Link } from 'react-router-dom';

export function MemberDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <h1 className="text-2xl font-bold text-slate-900">Member Dashboard</h1>
      <p className="text-slate-600 mt-2">
        {user?.name && <span>{user.name}</span>}
        {user?.clubName && <span> · {user.clubName}</span>}
      </p>
      <nav className="mt-6 flex flex-wrap gap-4">
        <Link to={ROUTES.MEMBER_EVENTS} className="text-blue-600 hover:underline">Events</Link>
        <Link to={ROUTES.MEMBER_UPDATES} className="text-blue-600 hover:underline">Updates</Link>
        <Link to={ROUTES.MEMBER_TASK_STATUS} className="text-blue-600 hover:underline">Task Status</Link>
        <Link to={ROUTES.MEMBER_LEADER_CONTACT} className="text-blue-600 hover:underline">Leader Contact</Link>
        <Link to={ROUTES.MEMBER_FEEDBACK} className="text-blue-600 hover:underline">Feedback</Link>
      </nav>
    </div>
  );
}
