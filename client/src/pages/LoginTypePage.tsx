import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/utils/constants';
import { Users, ShieldCheck, ChevronRight } from 'lucide-react';

export function LoginTypePage() {
  return (
    <div className="w-full max-w-lg mb-12 animate-fade-in-up mt-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-md">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">ClubArea</span>
        </h1>
        <p className="text-slate-300 text-lg">Choose how you want to sign in</p>
      </div>

      <div className="space-y-5">
        {/* User Option */}
        <Link to={ROUTES.LOGIN} className="block group">
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white/[0.05] border border-white/10 hover:border-emerald-500/50 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="text-xl font-bold">U</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">User</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Sign in to search & apply to clubs</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Member Option */}
        <Link to={ROUTES.MEMBER_LOGIN} className="block group">
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white/[0.05] border border-white/10 hover:border-fuchsia-500/50 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-300">
                  <Users className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-300 transition-colors">Club Member</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Sign in to view and submit assigned tasks</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>

        {/* Club Leader Option */}
        <Link to={ROUTES.ADMIN_LOGIN} className="block group" aria-label="Club Leader Login">
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white/[0.05] border border-white/10 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Club Leader</h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Manage your club, events, and recruits</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
