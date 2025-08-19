import { FaqsSection } from '@/components/faqs-section';
import { FeaturesSection } from '@/components/features-section';
import { FooterSection } from '@/components/footer-section';
import { HeaderSection } from '@/components/header-section';
import { HeroSection } from '@/components/hero-section';
import { HowItWorksSection } from '@/components/how-it-works-section';

export default function Page() {
  return (
    <div className="min-h-screen">
      <HeaderSection />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqsSection />
      </main>
      <FooterSection />
    </div>
  );
}
