import { Home, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { FaqsSection } from '@/components/faqs-section';
import { FeaturesSection } from '@/components/features-section';
import { FooterSection } from '@/components/footer';
import { Header, Logo, Navbar } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { Button } from '@/components/ui/button';
import { HowItWorksSection } from '@/components/how-it-works-section';

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header>
        <Navbar className="max-w-[1080px] mx-auto">
          <Logo />
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
            <Link href="/login" className="cursor-pointer">
              <Button
                size="sm"
                variant="secondary"
                className="border shadow-none cursor-pointer text-[0.8rem] h-7"
              >
                <span>Login</span>
                <span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </Link>
            <Link href="/login" className="cursor-pointer hidden">
              <Button
                size="sm"
                variant="default"
                className="border shadow-none cursor-pointer text-[0.8rem] h-7"
              >
                <span>Dashboard</span>
                <span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Button>
            </Link>
          </div>
        </Navbar>
      </Header>
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
