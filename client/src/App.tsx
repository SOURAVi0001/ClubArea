import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { useSessionCheck } from './hooks/useSessionCheck';
import { GlassyOverlay } from './components/common/GlassyOverlay';

function App() {
  const { isLoading } = useSessionCheck();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <GlassyOverlay>
      <RouterProvider router={router} />
    </GlassyOverlay>
  );
}

export default App;
