import HeroSlider from '@/components/sections/HeroSlider';
import SplineSection from '@/components/sections/SplineSection';
import TrustBar from '@/components/sections/TrustBar';
import ProductTabs from '@/components/sections/ProductTabs';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import FeaturedSystems from '@/components/sections/FeaturedSystems';
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
      <FeaturedSystems />
      <SupplierLogoStrip />
      <AboutSection />
      <ClientLogosStrip />
    </>
  );
}
