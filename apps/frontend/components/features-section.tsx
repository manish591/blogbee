import { Gift, Globe, Settings } from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/constants';

export function FeaturesSection() {
  return (
    <div id="features">
      <section className="py-36 border-b px-6 bg-accent/20">
        <div className="max-w-[1080px] mx-auto">
          <div className="relative grid lg:grid-cols-2 gap-20 items-center">
            <div className="lg:order-1">
              <div className="absolute left-[-8%] top-[-10%]">
                <Image
                  src="https://res.cloudinary.com/dcugqfvvg/image/upload/v1755642724/Screenshot_2025-08-20_040019_f5dvff.png"
                  height={1080}
                  width={800}
                  alt="blog-dashboard"
                  className="rounded-md object-cover -rotate-4 border h-[350px] w-[600px] bg-background object-left"
                />
              </div>
            </div>
            <div className="space-y-8 lg:order-2">
              <div className="flex items-baseline gap-4">
                <div className="text-5xl text-primary">01</div>
                <div className="h-[1.5px] flex-1 max-w-[60%] bg-primary rounded-full"></div>
              </div>
              <div className="space-y-6">
                <h2 className="text-5xl font-semibold text-slate-900 leading-tight">
                  Multiple Blogs, <br />
                  <span>One Dashboard</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-[80%] leading-relaxed pt-6">
                  No more jumping between platforms — manage everything in one
                  clean interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-background border-b">
        <div className="border-b">
          <div className="max-w-[1080px] mx-auto py-24 flex items-center gap-12">
            <div className="flex flex-col gap-8 w-max">
              <div className="h-[1.5px] bg-primary w-full"></div>
              <div className="text-5xl text-primary">02</div>
            </div>
            <div>
              <h3 className="text-5xl font-semibold">
                Hosted on
                <br /> Our Domain
              </h3>
            </div>
          </div>
        </div>
        <div className="max-w-[1080px] mx-auto grid grid-cols-[45%_1fr]">
          <div className="space-y-4 border-l">
            <div className="space-y-3 border-b px-8 py-6">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6" />
                <div className="flex-1">
                  <span className="font-medium">Free Subdomain</span>
                  <div className="text-sm font-mono text-primary">
                    yourblog.{APP_NAME}.site
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8">
              <div className="flex items-center gap-3 text-foreground/80">
                <span className="text-sm">Coming Soon</span>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3 p-3 rounded-md border text-foreground/60">
                  <Globe className="w-5 h-5" />
                  <span className="text-foreground/80">
                    Custom Domain Setup
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border text-foreground/60">
                  <Settings className="w-5 h-5" />
                  <span className="text-foreground/80">
                    Subdirectory Hosting
                  </span>
                  <span className="text-xs text-foreground/50 ml-auto">
                    yourdomain.com/blog
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="max-h-80 border-l">
            <Image
              src="/placeholder.png"
              width={1080}
              height={320}
              alt="domain"
              className="cover w-full h-full"
            />
          </div>
        </div>
      </section>
      <section className="border-b">
        <div className="max-w-[1080px] mx-auto">
          <div className="w-full relative">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
        linear-gradient(to right, #f1f5f9 1px, transparent 1px),
        linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)
      `,
                backgroundSize: '20px 30px',
                WebkitMaskImage:
                  'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
                maskImage:
                  'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
              }}
            />
            <div className="z-6 relative flex justify-center items-center border-l py-44 border-r">
              <div className="flex items-start justify-start gap-12">
                <div className="flex flex-col gap-8 w-max mt-[16px]">
                  <div className="h-[1.5px] bg-primary w-[90%] mx-auto"></div>
                  <div className="text-5xl text-primary">03</div>
                </div>
                <div>
                  <h3 className="text-5xl font-semibold leading-[1.2]">
                    Clean. Modern.
                  </h3>
                  <h3 className="text-5xl font-semibold leading-[1.2]">
                    Lightning-Fast
                  </h3>
                  <p className="text-xl text-foreground/70 mt-8">
                    A platform that gets out of your way so you can
                  </p>
                  <p className="text-xl text-foreground/70">
                    focus on your words, not the setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="dark bg-background py-24">
        <div className="max-w-[1080px] mx-auto flex items-center gap-12">
          <div className="flex flex-col gap-8 w-max">
            <div className="h-[1.5px] bg-primary w-full"></div>
            <div className="text-5xl text-primary">04</div>
          </div>
          <div>
            <h3 className="text-5xl font-semibold text-foreground">
              SEO, Done
              <br /> For You
            </h3>
          </div>
        </div>
        <div className="max-w-[1080px] mx-auto mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div
              className="p-9 py-20 border"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #3b3b3b, #000 39.34227195945947%)',
              }}
            >
              <div className="flex flex-col gap-8">
                <div className="h-[1.5px] w-10 bg-primary"></div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Smart <br />
                  Meta Tags
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm max-w-[70%] mt-6">
                Automatically generated meta descriptions, titles, and Open
                Graph tags for every post. No manual work required.
              </p>
            </div>
            <div
              className="p-9 py-20 border"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #3b3b3b, #000 39.34227195945947%)',
              }}
            >
              <div className="flex flex-col gap-8">
                <div className="h-[1.5px] w-10 bg-primary"></div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Lightning <br />
                  Fast
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm max-w-[70%] mt-6">
                Optimized loading speeds and Core Web Vitals. Your readers stay
                engaged, search engines take notice.
              </p>
            </div>
            <div
              className="p-9 py-20 border"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, #3b3b3b, #000 39.34227195945947%)',
              }}
            >
              <div className="flex flex-col gap-8">
                <div className="h-[1.5px] w-10 bg-primary"></div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Rich <br />
                  Snippets
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed text-sm max-w-[70%] mt-6">
                Built-in schema markup for articles, authors, and publishing
                dates. Stand out in search results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
