/**
 * Route paths matching the Express backend (route/*.js).
 * Use these for NavLink/Link and redirects so React stays in sync with backend API routes.
 */
export const ROUTES = {
  // Public
  HOME: '/',
  CLUB_LIST: '/clublist',
  CLUB_DETAIL: '/club/:id',
  RECRUITMENT: '/recruitment',
  UPDATES: '/updates',
  GALLERY: '/gallery',
  CONTACT: '/ContactUs',
  TESTING_DATA: '/testing_data',

  // Auth (no session required)
  LOGIN_TYPE: '/login_type',
  USER_LOGIN: '/user_login',
  ADMIN_LOGIN: '/admin_login',
  MEMBER_LOGIN: '/member_login',
  SIGNUP: '/Sign_Up',
  VALIDATE: '/VALIDATE',

  // Legacy / convenience aliases
  LOGIN: '/user_login',
  LEADER_LOGIN: '/admin_login',

  // User (any logged-in user)
  USER: '/user',

  // Leader (role === 'leader')
  LEADER: '/leader',
  LEADER_EVENTS: '/leader/leader-events',
  LEADER_POST_EVENT: '/leader/post-event',
  LEADER_UPDATES: '/leader/leader-updates',
  LEADER_POST_UPDATE: '/leader/post-updates',
  LEADER_TEAMS: '/leader/leader-teams',
  LEADER_MEMBERS: '/leader/leader-members',
  LEADER_CHAT: '/leader/leader-chat',
  LEADER_TASKS: '/leader/leader-taskstatus',
  LEADER_CREATE_TASK: '/leader-Create-Task',
  LEADER_CLUB_SETTING: '/leader/leader-clubsetting',
  LEADER_FEEDBACK: '/leader/leader-feedback',

  // Recruitment & Openings
  LEADER_RECRUITMENT: '/leader/openings', // Dashboard for recruitment
  LEADER_CREATE_OPENING: '/leader/create-opening',
  LEADER_APPLICANTS: '/leader/opening/:id/applicants',
  LEADER_REVIEW_APPLICATION: '/leader/applicant/:id/review',

  // Member (role === 'member')
  MEMBER: '/member',
  MEMBER_EVENTS: '/member_events',
  MEMBER_UPDATES: '/member_updates',
  MEMBER_FEEDBACK: '/member_feedback',
  MEMBER_LEADER_CONTACT: '/member_leader_contact',
  MEMBER_TASK_STATUS: '/member_Task_Status',
  VIEW_DETAILS: '/View-Details/:id',
};

export const CURRENT_YEAR = new Date().getFullYear();

/** Roles from backend (req.session.user.role) */
export const ROLES = {
  LEADER: 'leader',
  MEMBER: 'member',
};
