import { Route, Routes, Navigate } from 'react-router-dom';
import { SummarizerPage } from '@/features/summarizer/SummarizerPage';
import { UVAdvisorPage } from '@/features/uvAdvisor/UVAdvisorPage';
import { SmartFAQPage } from '@/features/smartFaq/SmartFAQPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SummarizerPage />} />
    <Route path="/uv-advisor" element={<UVAdvisorPage />} />
    <Route path="/smart-faq" element={<SmartFAQPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
