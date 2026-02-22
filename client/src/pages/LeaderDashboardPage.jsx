import { Outlet } from '@tanstack/react-router';

export function LeaderDashboardPage() {
  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <Outlet />
    </div>
  );
}
