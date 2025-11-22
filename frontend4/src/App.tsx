import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/ToastProvider';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
        <Analytics />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;