import { BlogSettingsForm } from './blog-settings-form';

export default function BlogDashboardSettingsPage() {
  return (
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
  );
}
