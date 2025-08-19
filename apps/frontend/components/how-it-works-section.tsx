import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export function HowItWorksSection() {
  return (
    <section className="border-b">
      <div className="max-w-[1080px] mx-auto border-r border-l">
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="border-r"></div>
          <div className="px-8 py-24">
            <h3 className="text-5xl font-semibold">
              Start your blog
              <br /> in 10 minutes
            </h3>
            <p className="text-2xl mt-6">
              Make your first blog In 3 Simple Steps
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="pl-24 border-r">
            <div className="h-full px-12 border-t flex justify-end items-center">
              <p className="text-4xl text-right">01</p>
            </div>
          </div>
          <div className="px-8 py-8">
            <h3 className="text-3xl">Sign Up</h3>
            <p className="text-lg mt-4 leading-[1.4] text-foreground/70">
              Create your free
              <br /> account in seconds.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="pl-24 border-r">
            <div className="h-full px-12 border-t flex justify-end items-center">
              <p className="text-4xl text-right">02</p>
            </div>
          </div>
          <div className="px-8 py-8">
            <h3 className="text-3xl">Write & Organize</h3>
            <p className="text-lg mt-4 leading-[1.4] text-foreground/70">
              Add as many blogs as you like, <br /> all under one roof.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="pl-24 border-r">
            <div className="h-full px-12 border-t flex justify-end items-center">
              <p className="text-4xl text-right">03</p>
            </div>
          </div>
          <div className="px-8 py-8">
            <h3 className="text-3xl">Publish & Share</h3>
            <p className="text-lg mt-4 leading-[1.4] text-foreground/70">
              We host it for you,
              <br /> SEO-ready out of the box.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="pl-24 border-r"></div>
          <div className="px-8 py-16">
            <h3 className="text-2xl">Start creating your blog now</h3>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="h-11 px-5 text-lg">
                  Get Started{' '}
                  <span>
                    <ArrowRight strokeWidth={2} />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
