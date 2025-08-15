import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section>
      <div className="max-w-[1080px] mx-auto flex items-center border-l border-r justify-between">
        <div className="px-8 py-12">
          <h1 className="text-6xl max-w-2xl leading-[1.2] font-semibold">
            Manage Your Blogs All At One Place
          </h1>
        </div>
      </div>
      <div className="border-t border-b">
        <div className="max-w-[1080px] mx-auto flex items-center border-l border-r justify-between">
          <div className="grid grid-cols-[45%_minmax(0,1fr)]">
            <div className="h-96">
              <div className="bg-muted/40 h-full"></div>
            </div>
            <div className="flex border-l">
              <div className="mt-auto mb-auto px-16">
                <p className="text-xl leading-[1.5]">
                  Run all your blogs from one place — create, organize, and
                  publish with ease, without the hassle of switching accounts.
                </p>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button size="lg" className="h-12 px-8 text-base">
                      Get Started
                      <ChevronRight />
                    </Button>
                  </Link>
                </div>
                <div className="mt-6">
                  or{' '}
                  <Link href="#" className="underline">
                    View examples
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
