import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/ToastProvider';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;