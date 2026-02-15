import { Link } from '@tanstack/react-router';
import { ROUTES, CURRENT_YEAR } from '@/utils/constants';

export function Footer() {
  return (
    <footer className="bg-[#171118] border-t border-fuchsia-700/20 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="text-lg font-semibold text-fuchsia-400 mb-4">About ClubArea</h4>
          <p className="leading-relaxed text-sm">
            ClubArea is the one-stop hub for discovering, managing, and growing college
            clubs. From event promotion to AI-powered mock interviews, we help students{' '}
            <span className="text-fuchsia-300">connect, collaborate, and thrive</span>.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-fuchsia-400 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={ROUTES.CLUB_LIST} className="hover:text-fuchsia-300 transition">Explore Clubs</Link></li>
            <li><Link to={ROUTES.RECRUITMENT} className="hover:text-fuchsia-300 transition">Recruitment</Link></li>
            <li><Link to="/updates" className="hover:text-fuchsia-300 transition">Club Updates</Link></li>
            <li><Link to={ROUTES.CONTACT} className="hover:text-fuchsia-300 transition">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-fuchsia-400 mb-4">Get in Touch</h4>
          <p className="text-sm mb-4">
            123 Design St.<br />
            Creative City, CC 12345<br />
            <span className="block mt-2">
              Email: <a href="mailto:hello@clubarea.io" className="hover:text-fuchsia-300">hello@clubarea.io</a>
            </span>
            Phone: <a href="tel:+15551234567" className="hover:text-fuchsia-300">+1 (555) 123-4567</a>
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-fuchsia-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M245.66 77.52a104.25 104.25 0 0 1-29.52 8.1 51.45 51.45 0 0 0 22.55-28.4 102.52 102.52 0 0 1-32.55 12.44A51.34 51.34 0 0 0 123.8 119a145.56 145.56 0 0 1-105.68-53.62 51.34 51.34 0 0 0 15.88 68.46 50.83 50.83 0 0 1-23.3-6.44v.65A51.36 51.36 0 0 0 51 179.08a51.3 51.3 0 0 1-23.26.88 51.37 51.37 0 0 0 47.9 35.6A102.9 102.9 0 0 1 11 230.3a145.23 145.23 0 0 0 78.62 23" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-fuchsia-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M186 24H70A46 46 0 0 0 24 70v116a46 46 0 0 0 46 46h116a46 46 0 0 0 46-46V70a46 46 0 0 0-46-46Zm30 162a30 30 0 0 1-30 30H70a30 30 0 0 1-30-30V70a30 30 0 0 1 30-30h116a30 30 0 0 1 30 30Zm-58-86a50 50 0 1 0 50 50a50 50 0 0 0-50-50Zm0 84a34 34 0 1 1 34-34a34 34 0 0 1-34 34Zm42-92a14 14 0 1 1 14-14a14 14 0 0 1-14 14Z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-fuchsia-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M216 24H40A16 16 0 0 0 24 40v176a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Zm-104 160H88V112h24Zm-12-92a12 12 0 1 1 12-12a12 12 0 0 1-12 12Zm120 92h-24v-44c0-11.66-1.78-20-13.54-20c-7.4 0-12.44 5-14.44 10c-.71 1.78-1 4.25-1 6.72v47.28h-24V112h23v12h.31a25.31 25.31 0 0 1 22.69-12.48c16.58 0 29 10.84 29 34Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-fuchsia-700/20 py-6 text-center text-xs text-gray-500">
        &copy; {CURRENT_YEAR} ClubArea. All rights reserved.
      </div>
    </footer>
  );
}
