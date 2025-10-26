import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AnalysisSection } from './components/AnalysisSection';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AnalysisSection />
      <CallToAction />
      <Footer />
    </div>
  );
}
