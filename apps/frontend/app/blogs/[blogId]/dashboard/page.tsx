import {
  BarChart3,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  LayoutDashboard,
  LayoutGrid,
  List,
  ListFilter,
  NotepadText,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Settings2,
  Slash,
  Tags,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function BlogOverviewPage() {
  return (
    <div className="py-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-4 mx-auto py-8">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-semibold">Overview</h1>
          <p className="text-foreground/70 mt-2">
            Learn more about your new dashboard and get started
          </p>
        </div>
      </div>
      <div className="max-w-4xl px-4 mx-auto">
        <h2 className="text-lg font-medium text-foreground mb-4">
          Quick links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Write an article
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share your thoughts with the community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6 hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Create a series
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Categorize your articles in one page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6 hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Create a page
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create & manage static pages for your blog.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="p-6 hover:shadow-sm transition-shadow cursor-pointer">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Invite team member
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Invite members and start collaborating!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="max-w-4xl px-4 mx-auto mt-8">
        <h2 className="text-lg font-medium text-foreground mb-6">
          Recent articles
        </h2>
      </div>
    </div>
  );
}
