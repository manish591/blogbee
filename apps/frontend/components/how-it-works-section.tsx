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
            <p className="text-xl text-foreground/70 mt-6">
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
            <h3 className="text-[28px]">Create your account</h3>
            <p className="text-base mt-3 leading-[1.4] text-foreground/70">
              Start by signing up{' '}
              <Link href="/signup" className="underline">
                here
              </Link>
              . It only takes a few seconds.
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
            <h3 className="text-[28px]">Write & Organize</h3>
            <p className="text-base mt-4 leading-[1.4] text-foreground/70">
              Add as many blogs as you like, all under one roof.
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
            <h3 className="text-[28px]">Publish & Share</h3>
            <p className="text-base mt-4 leading-[1.4] text-foreground/70">
              We host it for you, SEO-ready out of the box.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-[35%_minmax(0,1fr)]">
          <div className="pl-24 border-r"></div>
          <div className="px-8 pt-32 pb-16">
            <h3 className="text-3xl font-medium text-primary">
              Create your blog now
            </h3>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="cursor-pointer">
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
