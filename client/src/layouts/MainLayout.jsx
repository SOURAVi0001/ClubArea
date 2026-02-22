import { Outlet } from '@tanstack/react-router';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
