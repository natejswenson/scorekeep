import HeroSection from './src/components/HeroSection/HeroSection';
import FeatureStrip from './src/components/FeatureStrip/FeatureStrip';
import HowToScore from './src/components/HowToScore/HowToScore';
import MenuSection from './src/components/MenuSection/MenuSection';
import VolleyballSection from './src/components/VolleyballSection/VolleyballSection';
import HistorySection from './src/components/HistorySection/HistorySection';
import SettingsSection from './src/components/SettingsSection/SettingsSection';
import Footer from './src/components/Footer/Footer';

export default function App() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <HowToScore />
      <MenuSection />
      <VolleyballSection />
      <HistorySection />
      <SettingsSection />
      <Footer />
    </>
  );
}
