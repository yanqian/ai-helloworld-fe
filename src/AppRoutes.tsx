import { Route, Routes } from 'react-router-dom';
import { SummarizerPage } from '@/features/summarizer/SummarizerPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SummarizerPage />} />
  </Routes>
);
