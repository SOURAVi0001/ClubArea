import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { GoogleLogin } from '@react-oauth/google';
import { useRegisterMutation, useLoginGoogleMutation } from '@/queries/useAuth';
import { useState } from 'react';

export function SignupPage() {
  const register = useRegisterMutation();
  const loginGoogleBtn = useLoginGoogleMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [error, setError] = useState('');

  const handleGoogleSuccess = (credentialResponse: any) => {
    loginGoogleBtn.mutate({
      token: credentialResponse.credential,
      role: 'user'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    register.mutate(formData);
  };

  const apiErr = register.error as any;
  const apiError = apiErr?.response?.data?.message || (apiErr?.response?.data?.errors?.[0]?.msg);

  return (
    <Card className="w-full max-w-md px-8 py-10 bg-white/10 border border-white/20 backdrop-blur-[0px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-3xl relative overflow-hidden">
      <Link to={ROUTES.LOGIN} className="absolute left-0 top-0 p-4 rounded-br-3xl bg-white/10 hover:bg-white/20 border-b border-r border-white/20 text-slate-300 hover:text-white transition-all backdrop-blur-xl z-10">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-6 drop-shadow-md text-center">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200 ml-1">Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200 ml-1">Email</label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-200 ml-1">Confirm Password</label>
          <Input
            type="password"
            name="confirmpassword"
            placeholder="Confirm your password"
            value={formData.confirmpassword}
            onChange={handleChange}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-fuchsia-400"
          />
        </div>

        {(error || apiError) && <p className="text-red-400 text-sm font-medium text-center">{error || apiError}</p>}

        <Button type="submit" className="w-full bg-fuchsia-600/80 hover:bg-fuchsia-600 text-white border-0 shadow-lg mt-2 py-6 text-md" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#46224e] px-2 text-slate-300 rounded-full font-medium shadow-sm backdrop-blur-md">Or sign up with</span>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error('Google Signup Failed')}
          theme="filled_black"
          shape="pill"
          text="signup_with"
        />
      </div>

      <p className="mt-2 text-sm text-slate-300 text-center font-medium">
        Already have an account? <Link to={ROUTES.LOGIN} className="text-fuchsia-300 hover:text-fuchsia-200 hover:underline">Login</Link>
      </p>
    </Card>
  );
}
