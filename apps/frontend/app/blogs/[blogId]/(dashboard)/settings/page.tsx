import { BlogSettingsForm } from './blog-settings-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default async function BlogDashboardSettingsPage({
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="py-8">
            <div className="border-b pb-6">
              <h1 className="text-3xl font-semibold">Settings</h1>
              <p className="text-foreground/70 mt-2">Manage your blog here</p>
            </div>
          </div>
          <div>
            <BlogSettingsForm />
          </div>
        </div>
      </div>
    </main>
  );
}
