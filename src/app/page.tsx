import HeroSlider from '@/components/sections/HeroSlider';
import SplineSection from '@/components/sections/SplineSection';
import TrustBar from '@/components/sections/TrustBar';
import ProductTabs from '@/components/sections/ProductTabs';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import ProductShowcase3D from '@/components/sections/ProductShowcase3D';
import FeaturedSystems from '@/components/sections/FeaturedSystems';
import TrainingSection from '@/components/sections/TrainingSection';
import GeneralMedSection from '@/components/sections/GeneralMedSection';
import WorkshopSection from '@/components/sections/WorkshopSection';
import SupplierLogoStrip from '@/components/sections/SupplierLogoStrip';
import AboutSection from '@/components/sections/AboutSection';
import ClientLogosStrip from '@/components/sections/ClientLogosStrip';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <SplineSection />
      <TrustBar />
      <ProductTabs />
      <CategoryShowcase />
      <ProductShowcase3D />
      <FeaturedSystems />
      <TrainingSection />
      <GeneralMedSection />
      <WorkshopSection />
      <SupplierLogoStrip />
      <AboutSection />
      <ClientLogosStrip />
    </>
  );
}
