import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { HomePage } from '@/pages/HomePage';
import { ClubListPage } from '@/pages/ClubListPage';
import { ClubDetailPage } from '@/pages/ClubDetailPage';
import { RecruitmentPage } from '@/pages/RecruitmentPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { LoginTypePage } from '@/pages/LoginTypePage';
import { UserPage } from '@/pages/UserPage';
import { ROUTES, ROLES } from '@/utils/constants';
import { useAuthStore } from '@/stores/useAuthStore';
import {
    LeaderDashboard,
    LeaderEvents,
    LeaderUpdates,
    LeaderTeams,
    LeaderMembers,
    LeaderChat,
    LeaderTasks,
    LeaderClubSetting,
    LeaderFeedback,
    LeaderRecruitment,
    LeaderManageEvents,
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
import { UpdatesPage } from '@/pages/UpdatesPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { ContactUsPage } from '@/pages/ContactUsPage';

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const publicLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'public',
    component: MainLayout,
});

const indexRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: '/',
    component: HomePage,
});

const clubListRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'clublist',
    component: ClubListPage,
});

const clubDetailRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'club/$id',
    component: ClubDetailPage,
});

const recruitmentRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'recruitment',
    component: RecruitmentPage,
});

const updatesRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'updates',
    component: UpdatesPage,
});

const galleryRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'gallery',
    component: GalleryPage,
});

const contactRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'ContactUs',
    component: ContactUsPage,
});

const testingDataRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'testing_data',
    component: () => <div className="pt-24 p-8 text-center text-white">Testing data</div>,
});

const authLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'auth',
    component: AuthLayout,
});

const loginTypeRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: 'login_type',
    component: LoginTypePage,
});

const userLoginRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: 'user_login',
    component: LoginPage,
});

const adminLoginRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: 'admin_login',
    component: LoginPage,
});

const signupRoute = createRoute({
    getParentRoute: () => authLayoutRoute,
    path: 'Sign_Up',
    component: SignupPage,
});

const userRoute = createRoute({
    getParentRoute: () => publicLayoutRoute,
    path: 'user',
    beforeLoad: ({ context }) => {
        const { isLoggedIn } = useAuthStore.getState();
        if (!isLoggedIn) {
            throw redirect({ to: '/login_type' });
        }
    },
    component: UserPage,
});

const leaderLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'leader',
    component: DashboardLayout,
    beforeLoad: ({ context }) => {
        const { isLoggedIn, role } = useAuthStore.getState();
        if (!isLoggedIn || role !== ROLES.LEADER) {
            throw redirect({ to: '/login_type' });
        }
    },
});

const leaderDashboardRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader',
    component: LeaderDashboard,
});

const leaderEventsRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-events',
    component: LeaderEvents,
});

const leaderUpdatesRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-updates',
    component: LeaderUpdates,
});

const leaderTeamsRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-teams',
    component: LeaderTeams,
});

const leaderMembersRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-members',
    component: LeaderMembers,
});

const leaderChatRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-chat',
    component: LeaderChat,
});

const leaderTasksRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-taskstatus',
    component: LeaderTasks,
});

const leaderClubSettingRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-clubsetting',
    component: LeaderClubSetting,
});

const leaderFeedbackRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'leader/leader-feedback',
    component: LeaderFeedback,
});

const leaderRecruitmentRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'openings',
    component: LeaderRecruitment,
});

const leaderManageEventsRoute = createRoute({
    getParentRoute: () => leaderLayoutRoute,
    path: 'manage-events',
    component: LeaderManageEvents,
});

const memberLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'member',
    component: DashboardLayout,
    beforeLoad: ({ context }) => {
        const { isLoggedIn, role } = useAuthStore.getState();
        if (!isLoggedIn || role !== ROLES.MEMBER) {
            throw redirect({ to: '/login_type' });
        }
    },
});

const memberDashboardRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member',
    component: MemberDashboardPage,
});

const memberEventsRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member_events',
    component: MemberEventsPage,
});

const memberUpdatesRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member_updates',
    component: MemberUpdatesPage,
});

const memberFeedbackRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member_feedback',
    component: MemberFeedbackPage,
});

const memberContactRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member_leader_contact',
    component: MemberContactPage,
});

const memberTaskStatusRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'member_Task_Status',
    component: MemberTaskStatusPage,
});

const viewDetailsRoute = createRoute({
    getParentRoute: () => memberLayoutRoute,
    path: 'View-Details/$id',
    component: ViewDetailsPage,
});

const routeTree = rootRoute.addChildren([
    publicLayoutRoute.addChildren([
        indexRoute,
        clubListRoute,
        clubDetailRoute,
        recruitmentRoute,
        updatesRoute,
        galleryRoute,
        contactRoute,
        testingDataRoute,
        userRoute,
    ]),
    authLayoutRoute.addChildren([
        loginTypeRoute,
        userLoginRoute,
        adminLoginRoute,
        signupRoute,
    ]),
    leaderLayoutRoute.addChildren([
        leaderDashboardRoute,
        leaderEventsRoute,
        leaderUpdatesRoute,
        leaderTeamsRoute,
        leaderMembersRoute,
        leaderChatRoute,
        leaderTasksRoute,
        leaderClubSettingRoute,
        leaderFeedbackRoute,
        leaderRecruitmentRoute,
        leaderManageEventsRoute,
    ]),
    memberLayoutRoute.addChildren([
        memberDashboardRoute,
        memberEventsRoute,
        memberUpdatesRoute,
        memberFeedbackRoute,
        memberContactRoute,
        memberTaskStatusRoute,
        viewDetailsRoute,
    ]),
]);

export const router = createRouter({ routeTree });
