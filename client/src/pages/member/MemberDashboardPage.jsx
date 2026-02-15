import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/utils/constants';
import { Link } from '@tanstack/react-router';
import { Calendar, MessageSquare, ListTodo, User as UserIcon, ThumbsUp } from 'lucide-react';

export function MemberDashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.name}</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Member of <span className="font-semibold text-slate-700">{user?.clubName}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <DashboardCard
            to={ROUTES.MEMBER_EVENTS}
            title="Events"
            desc="View upcoming club activities and schedules."
            icon={Calendar}
            color="bg-blue-500"
          />
          <DashboardCard
            to={ROUTES.MEMBER_UPDATES}
            title="Updates"
            desc="Stay informed with the latest announcements."
            icon={MessageSquare}
            color="bg-purple-500"
          />
          <DashboardCard
            to={ROUTES.MEMBER_TASK_STATUS}
            title="My Tasks"
            desc="Track your assigned tasks and progress."
            icon={ListTodo}
            color="bg-orange-500"
          />
          <DashboardCard
            to={ROUTES.MEMBER_LEADER_CONTACT}
            title="Leader Contact"
            desc="Get in touch with your club leadership."
            icon={UserIcon}
            color="bg-indigo-500"
          />
          <DashboardCard
            to={ROUTES.MEMBER_FEEDBACK}
            title="Feedback"
            desc="Share your suggestions and thoughts."
            icon={ThumbsUp}
            color="bg-teal-500"
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ to, title, desc, icon: Icon, color }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-slate-100 group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

      <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>

      <div className="mt-4 flex items-center text-sm font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
        <span>Go to {title}</span>
        <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
