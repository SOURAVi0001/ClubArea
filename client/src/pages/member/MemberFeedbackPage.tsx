import { useState } from 'react';
import { useMemberFeedback, useSubmitFeedbackMutation } from '../../queries/useMember';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function MemberFeedbackPage() {
  const { data, isLoading, error } = useMemberFeedback();
  const submitMutation = useSubmitFeedbackMutation();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ title: '', description: '' });
        queryClient.invalidateQueries({ queryKey: ['member', 'feedback'] });
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading feedback...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error.message}</div>;

  const { data: previousFeedback } = data;

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Member Feedback</h1>
        <p className="text-slate-500">Share your thoughts and suggestions with leadership.</p>
      </div>

      <Card className="border-slate-200 shadow-sm animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">Submit New Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-600">Title</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Brief summary of your feedback"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-600">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Detailed description..."
                className="h-32 resize-none"
              />
            </div>
            <Button
              type="submit"
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4 border-l-4 border-slate-400 pl-3">Previous Feedback</h2>
        <div className="space-y-4">
          {previousFeedback?.length === 0 ? (
            <p className="text-slate-500 italic">No previous feedback submitted.</p>
          ) : (
            previousFeedback?.map((item: any) => (
              <Card key={item._id} className="border-slate-200 hover:shadow-md transition card-hover-effect">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">{item.date && format(new Date(item.date), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed border-l-2 border-slate-100 pl-4">{item.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
