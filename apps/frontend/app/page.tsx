import { ArrowRight, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { FaqsSection } from '@/components/faqs-section';
import { FeaturesSection } from '@/components/features-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export default async function Page() {
  return (
    <div className="min-h-screen">
      <Header>
        <div className="max-w-[1080px] mx-auto flex items-center">
          <Logo />
          <nav className="h-16 flex items-center justify-between ml-auto">
            <div className="flex gap-8 items-center font-medium">
              <div className="flex gap-6 items-center">
                <Link
                  href="/"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </span>
                </Link>
                <Link
                  href="/blog"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Blog
                  </span>
                </Link>
              </div>
            </div>
          </nav>
          <div className="ml-6">
            <Link href="/login" className="cursor-pointer">
              <Button
                size="sm"
                variant="secondary"
                className="border shadow-none cursor-pointer"
              >
                <span>Login</span>
                <span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Header>
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FaqsSection />
      </main>
      <Footer />
    </div>
  );
}
