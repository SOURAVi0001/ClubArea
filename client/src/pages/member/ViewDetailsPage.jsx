import { useParams } from 'react-router-dom';

export function ViewDetailsPage() {
  const { id } = useParams();
  return <div className="text-slate-900">Task details – ID: {id} (placeholder)</div>;
}
