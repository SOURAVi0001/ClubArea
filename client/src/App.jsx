import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { useSessionCheck } from './hooks/useSessionCheck';

function AppContent() {
  useSessionCheck();
  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
