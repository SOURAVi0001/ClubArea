import { Link, useLocation } from '@tanstack/react-router';
import { Button, Input, Card } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { useLoginUserMutation, useLoginAdminMutation } from '@/queries/useAuth';
import { useState } from 'react';

export function LoginPage() {
  const location = useLocation();
  const isAdmin = location.pathname === ROUTES.ADMIN_LOGIN;

  const loginUser = useLoginUserMutation();
  const loginAdmin = useLoginAdminMutation();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdmin) {
      loginAdmin.mutate(formData);
    } else {
      loginUser.mutate(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isLoading = isAdmin ? loginAdmin.isPending : loginUser.isPending;
  const error = isAdmin ? loginAdmin.error : loginUser.error;

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{isAdmin ? 'Admin/Leader Login' : 'User Login'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-sm">{error.response?.data?.message || 'Login failed'}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      {!isAdmin && (
        <p className="mt-4 text-sm text-slate-600">
          Don&apos;t have an account? <Link to={ROUTES.SIGNUP} className="text-fuchsia-600 hover:underline">Sign up</Link>
        </p>
      )}
    </Card>
  );
}
