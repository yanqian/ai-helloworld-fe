import { BrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ServiceProvider } from '@/providers/ServiceProvider';
import { AppRoutes } from './AppRoutes';

export const App = () => (
  <ServiceProvider>
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  </ServiceProvider>
);
