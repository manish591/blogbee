import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroMarquee } from '@/components/web/hero-marquee';

export function HeroSection() {
  return (
    <section id="hero" className="px-4 border-b divide-y">
      <div className="max-w-[1100px] mx-auto flex items-center border-l border-r justify-between">
        <div className="px-6 sm:px-8 py-8 sm:py-12">
          <h1 className="text-4xl sm:text-6xl max-w-2xl leading-[1.2] font-bold">
            Manage Your Blogs All At One Place
          </h1>
        </div>
      </div>
      <div>
        <div className="max-w-[1100px] mx-auto flex items-center border-l border-r justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-[40%_minmax(0,1fr)]">
            <div className="select-none h-96 bg-secondary/40">
              <HeroMarquee />
            </div>
            <div className="flex border-0 sm:border-l">
              <div className="mt-auto mb-auto px-6 py-4 sm:py-0 sm:px-24">
                <p className="text-lg sm:text-xl max-w-[90%] leading-[1.5]">
                  Run all your blogs from one place — create, organize, and
                  publish with ease, without the hassle of switching accounts.
                </p>
                <div className="mt-6 sm:mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="cursor-pointer">
                      Get Started{' '}
                      <span>
                        <ArrowRight strokeWidth={2} />
                      </span>
                    </Button>
                  </Link>
                </div>
                <div className="mt-4 sm:mt-6 text-sm sm:text-base">
                  or{' '}
                  <Link href="#features" className="underline">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
