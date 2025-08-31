import { notFound } from 'next/navigation';
import { Footer } from '@/app/s/[subdomain]/components/footer';
import { Header } from '@/app/s/[subdomain]/components/header';

export default async function BlogRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}>) {
  const subdomain = (await params).subdomain;

  if (!subdomain) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header subdomain={subdomain} />
      <main>{children}</main>
      <div className="mt-auto">
        <Footer subdomain={subdomain} />
      </div>
    </div>
  );
}
