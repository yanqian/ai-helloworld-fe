import { Route, Routes, Navigate } from 'react-router-dom';
import { SummarizerPage } from '@/features/summarizer/SummarizerPage';
import { UVAdvisorPage } from '@/features/uvAdvisor/UVAdvisorPage';
import { SmartFAQPage } from '@/features/smartFaq/SmartFAQPage';
import { AuthPage } from '@/features/auth/AuthPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <SummarizerPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/uv-advisor"
      element={
        <ProtectedRoute>
          <UVAdvisorPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/smart-faq"
      element={
        <ProtectedRoute>
          <SmartFAQPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
