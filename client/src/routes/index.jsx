import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute, LeaderRoute, MemberRoute } from '@/components/auth/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { ClubListPage } from '@/pages/ClubListPage';
import { ClubDetailPage } from '@/pages/ClubDetailPage';
import { RecruitmentPage } from '@/pages/RecruitmentPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { LoginTypePage } from '@/pages/LoginTypePage';
import { UserPage } from '@/pages/UserPage';
import { ROUTES } from '@/utils/constants';
import {
  LeaderEventsPage,
  LeaderUpdatesPage,
  LeaderTeamsPage,
  LeaderMembersPage,
  LeaderChatPage,
  LeaderTaskStatusPage,
  LeaderClubSettingPage,
  LeaderFeedbackPage,
  LeaderOpeningsPage,
  LeaderManageEventsPage,
} from '@/pages/leader';
import {
  MemberDashboardPage,
  MemberEventsPage,
  MemberUpdatesPage,
  MemberFeedbackPage,
  MemberContactPage,
  MemberTaskStatusPage,
  ViewDetailsPage,
} from '@/pages/member';

const Placeholder = ({ title }) => <div className="pt-24 p-8 text-center text-white">{title}</div>;

import { UpdatesPage } from '@/pages/UpdatesPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { ContactUsPage } from '@/pages/ContactUsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* ========== Public (MainLayout: Navbar + Footer) ========== */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CLUB_LIST} element={<ClubListPage />} />
        <Route path="/club/:id" element={<ClubDetailPage />} />
        <Route path={ROUTES.RECRUITMENT} element={<RecruitmentPage />} />
        <Route path={ROUTES.UPDATES} element={<UpdatesPage />} />
        <Route path={ROUTES.GALLERY} element={<GalleryPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactUsPage />} />
        <Route path={ROUTES.TESTING_DATA} element={<Placeholder title="Testing data" />} />
      </Route>

      {/* ========== Auth (no session required) ========== */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN_TYPE} element={<LoginTypePage />} />
        <Route path={ROUTES.USER_LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      </Route>

      {/* ========== User (any logged-in) ========== */}
      <Route
        path={ROUTES.USER}
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserPage />} />
      </Route>

      {/* ========== Leader (role === 'leader', DashboardLayout + Sidebar) ========== */}
      <Route
        path={ROUTES.LEADER}
        element={
          <LeaderRoute>
            <DashboardLayout />
          </LeaderRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.LEADER_EVENTS} replace />} />
        <Route path="leader-events" element={<LeaderEventsPage />} />
        <Route path="leader-updates" element={<LeaderUpdatesPage />} />
        <Route path="leader-teams" element={<LeaderTeamsPage />} />
        <Route path="leader-members" element={<LeaderMembersPage />} />
        <Route path="leader-chat" element={<LeaderChatPage />} />
        <Route path="leader-taskstatus" element={<LeaderTaskStatusPage />} />
        <Route path="leader-clubsetting" element={<LeaderClubSettingPage />} />
        <Route path="leader-feedback" element={<LeaderFeedbackPage />} />
        <Route path="openings" element={<LeaderOpeningsPage />} />
        <Route path="manage-events" element={<LeaderManageEventsPage />} />
      </Route>

      {/* ========== Member (role === 'member', DashboardLayout + Member sidebar) ========== */}
      <Route
        path="/member"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberDashboardPage />} />
      </Route>
      <Route
        path="/member_events"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberEventsPage />} />
      </Route>
      <Route
        path="/member_updates"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberUpdatesPage />} />
      </Route>
      <Route
        path="/member_feedback"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberFeedbackPage />} />
      </Route>
      <Route
        path="/member_leader_contact"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberContactPage />} />
      </Route>
      <Route
        path="/member_Task_Status"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<MemberTaskStatusPage />} />
      </Route>
      <Route
        path="/View-Details/:id"
        element={
          <MemberRoute>
            <DashboardLayout />
          </MemberRoute>
        }
      >
        <Route index element={<ViewDetailsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
