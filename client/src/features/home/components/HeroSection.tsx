import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { TypingAnimation } from './TypingAnimation';
import { ROUTES } from '@/utils/constants';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24">
      <video
        src="/home/INTRODUCTION.MP4"
        className="hero-vid absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8 text-white">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Experience <span className="text-sky-300">ClubArea</span>
              </h2>
              <p className="max-w-md text-gray-200 sm:text-lg">
                Watch how our platform transforms college club management and engagement.
              </p>
            </div>
            <div className="space-y-6">
              <TypingAnimation />
              <div className="max-w-2xl space-y-4">
                <p className="text-gray-100 sm:text-lg">
                  Welcome to <span className="font-semibold text-sky-200">ClubArea</span> – your
                  centralized platform for everything related to college clubs! From event
                  announcements and recruitment drives to AI-powered mock interviews, we keep you
                  in the loop.
                </p>
                <p className="text-lg font-medium text-fuchsia-200">
                  Discover. Connect. Grow. All in one place.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <Link
                to={ROUTES.CLUB_LIST}
                className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition text-center"
              >
                Explore Clubs
              </Link>
              <Link
                to={ROUTES.RECRUITMENT}
                className="px-6 py-2 rounded-lg font-semibold text-red-600 border border-red-600 hover:bg-red-100 transition text-center"
              >
                Join Recruitment
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-7 w-7 text-white/70" />
      </div>
    </section>
  );
}
