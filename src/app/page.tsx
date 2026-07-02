import HeroSlider from '@/components/sections/HeroSlider';
import VacusonShowcase from '@/components/sections/VacusonShowcase';
import TrustBar from '@/components/sections/TrustBar';
import ProductTabs from '@/components/sections/ProductTabs';
import CategoryShowcase from '@/components/sections/CategoryShowcase';
import ProductShowcase3D from '@/components/sections/ProductShowcase3D';
import FeaturedSystems from '@/components/sections/FeaturedSystems';
import TrainingSection from '@/components/sections/TrainingSection';
import GeneralMedSection from '@/components/sections/GeneralMedSection';
import WorkshopSection from '@/components/sections/WorkshopSection';
import AboutSection from '@/components/sections/AboutSection';
import ClientLogosStrip from '@/components/sections/ClientLogosStrip';
import SectionBridge from '@/components/ui/SectionBridge';
import { CATALOG_LIVE } from '@/lib/utils';

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <SectionBridge from="#eef0f3" to="#070e1a" />
      <VacusonShowcase />
      <TrustBar />
      <SectionBridge from="#1a2b4a" to="#f0f2f5" />
      {/* DB-driven product grid — only shown once the catalog is live */}
      {CATALOG_LIVE && <ProductTabs />}
      <CategoryShowcase />
      <ProductShowcase3D />
      <FeaturedSystems />
      <SectionBridge from="#f7f8fa" to="#0d1929" />
      <TrainingSection />
      <GeneralMedSection />
      <WorkshopSection />
      <SectionBridge from="#0a1626" to="#ffffff" />
      <AboutSection />
      <ClientLogosStrip />
    </>
  );
}
