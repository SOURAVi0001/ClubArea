import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { ROUTES } from '@/utils/constants';

const navItems = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.CLUB_LIST, label: 'Clubs' },
  { to: ROUTES.RECRUITMENT, label: 'Recruitment' },
  { to: ROUTES.UPDATES, label: 'Updates' },
  { to: ROUTES.GALLERY, label: 'Gallery' },
  { to: ROUTES.CONTACT, label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
    isActive
      ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30'
      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
    isActive ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
  }`;

export function Navbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to={ROUTES.HOME} className="flex items-center space-x-2 group">
            <img src="/logo.png" alt="ClubArea" className="h-8 w-auto sm:h-9 transition-all duration-300 group-hover:scale-105" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.classList.remove('hidden'); }} />
            <span className="hidden font-semibold text-white text-lg">ClubArea</span>
          </NavLink>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                {label}
              </NavLink>
            ))}
            <div className="ml-6 pl-6 border-l border-slate-700">
              <NavLink to={ROUTES.LOGIN_TYPE}>
                <span className="relative inline-flex px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-fuchsia-500 hover:to-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 cursor-pointer">
                  Login
                </span>
              </NavLink>
            </div>
          </nav>

          <button
            type="button"
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-slate-900 z-40 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900 border-l border-slate-700 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
          <img src="/logo.png" alt="ClubArea" className="h-7 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
          <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-6 py-6 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-700 bg-slate-800">
          <NavLink to={ROUTES.LOGIN_TYPE} className="block" onClick={() => setMobileMenuOpen(false)}>
            <span className="flex w-full justify-center px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold rounded-lg">
              Login to ClubArea
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}
