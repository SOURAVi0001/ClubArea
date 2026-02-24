import { Link, useLocation } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginUserMutation, useLoginAdminMutation, useLoginGoogleMutation } from '@/queries/useAuth';
import { useState } from 'react';

export function LoginPage() {
  const location = useLocation();
  const isLeader = location.pathname === ROUTES.ADMIN_LOGIN;
  const isMember = location.pathname === ROUTES.MEMBER_LOGIN;
  const isAdminOrMember = isLeader || isMember;

  const loginUser = useLoginUserMutation();
  const loginAdmin = useLoginAdminMutation();
  const loginGoogleBtn = useLoginGoogleMutation();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleGoogleSuccess = (credentialResponse) => {
    loginGoogleBtn.mutate({
      token: credentialResponse.credential,
      role: isLeader ? 'leader' : isMember ? 'member' : 'user'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdminOrMember) {
      loginAdmin.mutate(formData);
    } else {
      loginUser.mutate(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isLoading = isAdminOrMember ? loginAdmin.isPending : loginUser.isPending;
  const error = isAdminOrMember ? loginAdmin.error : loginUser.error;

  let pageTitle = 'User Login';
  if (isLeader) pageTitle = 'Club Leader Login';
  if (isMember) pageTitle = 'Club Member Login';

  return (
    <Card className="w-full max-w-md px-8 py-10 bg-white/10 border border-white/20 backdrop-blur-[0px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl relative overflow-hidden">
      <Link to={ROUTES.LOGIN_TYPE} className="absolute left-0 top-0 p-4 rounded-br-3xl bg-white/10 hover:bg-white/20 border-b border-r border-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-xl z-10">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-6 drop-shadow-md text-center">{pageTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200 ml-1">Email</label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200 ml-1">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
        {error && <p className="text-red-400 text-sm font-medium text-center">{error.response?.data?.message || 'Login failed'}</p>}
        <Button type="submit" className="w-full bg-fuchsia-600/80 hover:bg-fuchsia-600 text-white border-0 shadow-lg mt-2 py-6 text-md" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      {!isAdminOrMember && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#46224e] px-2 text-slate-300 rounded-full font-medium shadow-sm backdrop-blur-md">Or continue with</span>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error('Google Login Failed')}
              theme="filled_black"
              shape="pill"
            />
          </div>
          <p className="mt-2 text-sm text-slate-300 text-center font-medium">
            Don&apos;t have an account? <Link to={ROUTES.SIGNUP} className="text-fuchsia-300 hover:text-fuchsia-200 hover:underline">Sign up</Link>
          </p>
        </>
      )
      }
    </Card >
  );
}
