import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ServiceProvider } from '@/providers/ServiceProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { AppRoutes } from './AppRoutes';

export const App = () => (
  <AuthProvider>
    <ServiceProvider>
      <BrowserRouter>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </ServiceProvider>
  </AuthProvider>
);
