import { Route, Routes, Navigate } from 'react-router-dom';
import { SummarizerPage } from '@/features/summarizer/SummarizerPage';
import { UVAdvisorPage } from '@/features/uvAdvisor/UVAdvisorPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SummarizerPage />} />
    <Route path="/uv-advisor" element={<UVAdvisorPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
