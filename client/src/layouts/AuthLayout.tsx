import { Outlet } from '@tanstack/react-router';
import { GlassBackground } from '@/components/common/GlassBackground';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <GlassBackground />
      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
