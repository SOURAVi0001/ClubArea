import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: any;
    isLoggedIn?: boolean;
    errors?: any[];
    oldInput?: any;
    applied?: any;
    applicationData?: any;
  }
}
