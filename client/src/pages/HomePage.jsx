import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

export function HomePage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-6 animate-fade-in-up">
        ClubArea
      </h1>
      <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mb-12 animate-fade-in-up delay-100">
        Discover, Join, and Lead Student Clubs. Your gateway to campus community.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
        <Link
          to={ROUTES.CLUB_LIST}
          className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full font-semibold transition transform hover:scale-105"
        >
          Explore Clubs
        </Link>
        <Link
          to={ROUTES.RECRUITMENT}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-full font-semibold transition transform hover:scale-105"
        >
          Join a Team
        </Link>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
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
    <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl hover:bg-slate-800/50 transition duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
