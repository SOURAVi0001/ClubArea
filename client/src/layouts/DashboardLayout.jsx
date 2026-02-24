import { Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/components/common/Sidebar';
import { MemberSidebar } from '@/components/common/MemberSidebar';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROLES } from '@/utils/constants';

export function DashboardLayout() {
  const role = useAuthStore((s) => s.role);
  const isLeader = role === ROLES.LEADER;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {isLeader ? <Sidebar /> : <MemberSidebar />}
      <div className="flex-1 md:ml-80 transition-all overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
