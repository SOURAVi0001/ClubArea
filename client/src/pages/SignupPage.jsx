import { Link } from 'react-router-dom';
import { Button, Input, Card } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { useRegisterMutation } from '@/queries/useAuth';
import { useState } from 'react';

export function SignupPage() {
  const register = useRegisterMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmpassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    register.mutate(formData);
  };

  const apiError = register.error?.response?.data?.message || (register.error?.response?.data?.errors?.[0]?.msg);

  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter your full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          placeholder="Create a password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          type="password"
          name="confirmpassword"
          value={formData.confirmpassword}
          onChange={handleChange}
          required
        />

        {(error || apiError) && <p className="text-red-500 text-sm">{error || apiError}</p>}

        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to={ROUTES.LOGIN} className="text-fuchsia-600 hover:underline">Login</Link>
      </p>
    </Card>
  );
}
