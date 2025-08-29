import { Pencil } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';

export default async function BlogDashboardOverviewPage({
  params,
}: Readonly<{
  params: Promise<{ blogId: string }>;
}>) {
  const blogId = (await params).blogId;

  return (
    <main className="py-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/blogs/${blogId}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="pt-8 pb-4">
            <div className="pb-6">
              <h1 className="text-3xl font-semibold">Overview</h1>
              <p className="text-foreground/70 mt-2">
                Learn more about your new dashboard and get started
              </p>
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">
                Quick links
              </h2>
              <Link
                href={`/blogs/${blogId}/posts`}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <Card className="p-6 cursor-pointer shadow-none hover:border-neutral-400">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Pencil className="w-4 h-4 text-foreground/70" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Write a post
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Share your thoughts with the community.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
