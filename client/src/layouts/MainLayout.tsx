import { Outlet } from '@tanstack/react-router';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GlassBackground } from '@/components/common/GlassBackground';

export function MainLayout() {
  return (
    <>
      <Navbar />
      <GlassBackground />
      <main className="relative z-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
