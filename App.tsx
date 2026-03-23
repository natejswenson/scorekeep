import Header from './src/components/Header/Header';
import HeroSection from './src/components/HeroSection/HeroSection';
import ScoringSection from './src/components/ScoringSection/ScoringSection';
import SportsSection from './src/components/SportsSection/SportsSection';
import VolleyballSection from './src/components/VolleyballSection/VolleyballSection';
import MenuSection from './src/components/MenuSection/MenuSection';
import SettingsSection from './src/components/SettingsSection/SettingsSection';
import Footer from './src/components/Footer/Footer';

export default function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <ScoringSection />
      <SportsSection />
      <VolleyballSection />
      <MenuSection />
      <SettingsSection />
      <Footer />
    </>
  );
}
