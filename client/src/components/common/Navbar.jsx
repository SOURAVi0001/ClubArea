import { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, Palette } from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';
import { ROUTES } from '@/utils/constants';
import { PreferencesModal } from './PreferencesModal';
import GlassButton from '@/components/common/GlassButton';

const navItems = [
  { to: ROUTES.HOME, label: 'Home' },
  { to: ROUTES.CLUB_LIST, label: 'Clubs' },
  { to: ROUTES.RECRUITMENT, label: 'Recruitment' },
  { to: ROUTES.UPDATES, label: 'Updates' },
  { to: ROUTES.GALLERY, label: 'Gallery' },
  { to: ROUTES.CONTACT, label: 'Contact' },
];
/* 👇 add in same file (outside component OR inside return with <style>) */
const glassNavStyles =
  `.glass-nav {
  position: relative;
  border-radius: 999px;
  overflow: hidden;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 0; /* create stacking context */
}

/* 🔥 keep border BELOW text */
.glass-nav::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;

  background: conic-gradient(
    from var(--angle-1, -75deg),
    transparent 0deg,
    rgba(255,255,255,0.85) 120deg,
    transparent 240deg
  );

  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);

  mask-composite: exclude;
  -webkit-mask-composite: xor;

  opacity: 0;
  pointer-events: none;
  z-index: 0; /* ✅ behind text */
}

/* 🔥 make text always on top */
.glass-nav > * {
  position: relative;
  z-index: 1;
}

.glass-nav:hover::before {
  opacity: 1;
  animation: nav-liquid-rotate 2.5s linear infinite;
}

@keyframes nav-liquid-rotate {
  to {
    --angle-1: 285deg;
  }
}  `;

const commonLinkClass = "glass-nav px-4 py-2 text-sm font-medium rounded-3xl transition-all duration-400";
const activeLinkClass = "bg-transparent/10 text-white border border-gray-400 rounded-3xl";
const inactiveLinkClass = "text-slate-500 hover:text-gray-400 hover:bg-transparent/25 ";

const commonMobileLinkClass = "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200";
const activeMobileLinkClass = "bg-fuchsia-500/20 text-gray-400";
const inactiveMobileLinkClass = "text-slate-300 hover:text-white hover:bg-slate-800";

export function Navbar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const preferencesRef = useRef(null);

  return (
    <>
      <style>{glassNavStyles}</style>
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 group">
              <div className="hidden sm:flex font-black text-2xl tracking-tighter">
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  Club
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-600 drop-shadow-[0_0_12px_rgba(192,38,211,0.6)]">
                  Area
                </span>
              </div>            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  activeProps={{ className: `${commonLinkClass} ${activeLinkClass}` }}
                  inactiveProps={{ className: `${commonLinkClass} ${inactiveLinkClass}` }}
                >
                  <span>{label}</span>
                </Link>
              ))}
              <div className="ml-4 pl-4 border-l border-white/10 flex items-center space-x-4">
                <div className="relative" ref={preferencesRef}>
                    <button
                        onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                        className={`p-2.5 rounded-xl border border-white/20 transition-all focus:outline-none flex items-center justify-center
                          ${isPreferencesOpen 
                              ? 'bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                              : 'bg-white/5 hover:bg-white/10 backdrop-blur-md'
                          }
                        `}
                        aria-label="Background Preferences"
                        title="Change Appearance"
                    >
                        <Palette className={`w-5 h-5 transition-colors ${isPreferencesOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`} />
                    </button>
                    {isPreferencesOpen && (
                        <div className="absolute right-0 top-full mt-2 w-max">
                            <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
                        </div>
                    )}
                </div>
                <Link to={ROUTES.LOGIN_TYPE}>
                  <GlassButton>Login</GlassButton>
                </Link>
              </div>
            </nav>

            <div className="flex items-center lg:hidden gap-2">
              <div className="relative" ref={preferencesRef}>
                  <button
                      onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                      className={`p-2 rounded-xl border border-white/20 transition-all focus:outline-none flex items-center justify-center
                          ${isPreferencesOpen 
                              ? 'bg-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' 
                              : 'bg-white/5 hover:bg-white/10 backdrop-blur-md'
                          }
                      `}
                      aria-label="Background Preferences"
                  >
                      <Palette className={`w-5 h-5 transition-colors ${isPreferencesOpen ? 'text-white' : 'text-slate-300'}`} />
                  </button>
                  {isPreferencesOpen && (
                      <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-sm">
                          <PreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} />
                      </div>
                  )}
              </div>
              <button
                type="button"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 rounded-xl border border-white/20 transition-colors backdrop-blur-md"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
          className={`lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900/60 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <img src="/logo.png" alt="ClubArea" className="h-7 w-auto" onError={(e) => { e.target.style.display = 'none'; }} />
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="px-6 py-6 space-y-1">
            {navItems.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                activeProps={{ className: `${commonMobileLinkClass} ${activeMobileLinkClass}` }}
                inactiveProps={{ className: `${commonMobileLinkClass} ${inactiveMobileLinkClass}` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-white/10 bg-white/5">
            <Link to={ROUTES.LOGIN_TYPE} className="flex justify-center" onClick={() => setMobileMenuOpen(false)}>
              <GlassButton>Login to ClubArea</GlassButton>
            </Link>
          </div>
        </div>
      </header>

    </>
  );
}
