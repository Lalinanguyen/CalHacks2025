import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ProductPage } from './components/ProductPage';
import { AnalysisResultsPage } from './components/AnalysisResultsPage';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname === '/product' || location.pathname === '/analysis';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/analysis" element={<AnalysisResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideFooter && <Footer />}
      <ChatBot />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
