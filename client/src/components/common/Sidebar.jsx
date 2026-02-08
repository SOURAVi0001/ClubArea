import { NavLink } from 'react-router-dom';
import { Menu, X, Calendar, MessageSquare, Users, Image, MessageCircle, ListTodo, UserPlus, ThumbsUp, Settings } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROUTES } from '@/utils/constants';

const sidebarLinks = [
  { to: ROUTES.LEADER_EVENTS, icon: Calendar, label: 'Events' },
  { to: ROUTES.LEADER_UPDATES, icon: MessageSquare, label: 'Updates' },
  { to: ROUTES.LEADER_TEAMS, icon: Users, label: 'Teams' },
  { to: ROUTES.LEADER_MANAGE_EVENTS, icon: Image, label: 'Event Gallery' },
  { to: ROUTES.LEADER_MEMBERS, icon: Users, label: 'Members' },
  { to: ROUTES.LEADER_CHAT, icon: MessageCircle, label: 'Chat' },
  { to: ROUTES.LEADER_TASK_STATUS, icon: ListTodo, label: 'Task Status' },
  { to: ROUTES.LEADER_OPENINGS, icon: UserPlus, label: 'Recruitment' },
  { to: ROUTES.LEADER_FEEDBACK, icon: ThumbsUp, label: 'Feedback' },
  { to: ROUTES.LEADER_CLUB_SETTING, icon: Settings, label: 'Club Settings' },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 py-3 px-4 my-1 mx-2 rounded-lg font-medium transition-all duration-200 ${
    isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
  }`;

export function Sidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const leaderName = user?.name ?? 'Leader';
  const clubName = user?.clubName ?? 'Club';

  return (
    <>
      <button
        type="button"
        className="fixed top-4 right-4 z-[60] p-3 rounded-lg bg-white border border-gray-200 shadow-lg md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>
      <div
        className={`fixed inset-0 z-[45] bg-black/50 md:hidden transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed top-0 left-0 w-80 h-screen bg-white border-r border-gray-200 shadow-xl z-[50] overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-slate-300 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{leaderName ?? 'Leader'}</h1>
              <p className="text-sm text-gray-600 truncate">Admin ({clubName ?? 'Club'})</p>
            </div>
          </div>
          <nav className="space-y-2">
            {sidebarLinks.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={linkClass} onClick={() => setMobileMenuOpen(false)}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
