import StudioHero from '@/components/sections/StudioHero';
import TrustBar from '@/components/sections/TrustBar';
import ProductTabs from '@/components/sections/ProductTabs';
import BrandShowcase from '@/components/sections/BrandShowcase';
import FeaturedSystems from '@/components/sections/FeaturedSystems';
import TrainingSection from '@/components/sections/TrainingSection';
import GeneralMedSection from '@/components/sections/GeneralMedSection';
import WorkshopSection from '@/components/sections/WorkshopSection';
import AboutSection from '@/components/sections/AboutSection';
import ClientLogosStrip from '@/components/sections/ClientLogosStrip';
import { CATALOG_LIVE } from '@/lib/utils';

export default function HomePage() {
  return (
    <>
      <StudioHero />
      <TrustBar />
      {/* DB-driven product grid — only shown once the catalog is live */}
      {CATALOG_LIVE && <ProductTabs />}
      <BrandShowcase />
      <FeaturedSystems />
      <TrainingSection />
      <GeneralMedSection />
      <WorkshopSection />
      <AboutSection />
      <ClientLogosStrip />
    </>
  );
}
