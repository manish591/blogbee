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

export default function BlogGeneralSettingsPage() {
  return (
    <div className="py-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>General</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div>
          <h1 className="text-3xl font-semibold">General</h1>
          <p className="text-foreground/70 mt-2">
            Learn more about your new dashboard and get started
          </p>
        </div>
      </div>
    </div>
  );
}
