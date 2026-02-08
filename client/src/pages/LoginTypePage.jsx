import { Link } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { ROUTES } from '@/utils/constants';

export function LoginTypePage() {
  return (
    <Card className="w-full max-w-md p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Login as</h1>
      <div className="space-y-4">
        <Link to={ROUTES.LOGIN} className="block">
          <Button variant="primary" className="w-full">Member / User</Button>
        </Link>
        <Link to={ROUTES.ADMIN_LOGIN} className="block" aria-label="Club Admin Login">
          <Button variant="secondary" className="w-full">Club Admin / Leader</Button>
        </Link>
      </div>
    </Card>
  );
}
