import { Link } from '@tanstack/react-router';
import { ROUTES } from '@/utils/constants';

export function HomePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter relative overflow-hidden pb-4">
        <span className="inline-block animate-slide-in-left text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/20 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Club
        </span>
        <span className="inline-block animate-slide-in-right text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-600 drop-shadow-[0_0_20px_rgba(192,38,211,0.4)]">
          Area
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
        Discover, Join, and Lead Student Clubs. Your gateway to campus community.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>

        <Link
          to={ROUTES.CLUB_LIST}
          className="px-8 py-3 bg-transparent/20 hover:bg-transparent/40 text-white rounded-full font-semibold transition transform hover:scale-105"
        >
          Explore Clubs
        </Link>
        <Link
          to={ROUTES.RECRUITMENT}
          className="px-8 py-3 bg-transparent/10 hover:bg-transparent/20 text-white hover:border border-gray-400 rounded-full font-semibold transition transform hover:scale-105"
        >
          Join a Team
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full animate-fade-in" style={{ animationDelay: '600ms' }}>
        <FeatureCard
          icon="🚀"
          title="Stay Updated"
          desc="Never miss an event with real-time updates from all your favorite clubs."
        />
        <FeatureCard
          icon="👥"
          title="Connect"
          desc="Find like-minded peers and build your network within the campus."
        />
        <FeatureCard
          icon="🏆"
          title="Lead"
          desc="Take initiative, organize events, and develop leadership skills."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (

    <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:-translate-y-2 text-center text-white">

      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold mb-3 drop-shadow-md">{title}</h3>
      <p className="text-slate-200 leading-relaxed font-medium drop-shadow-sm">{desc}</p>
    </div>
  );
}
