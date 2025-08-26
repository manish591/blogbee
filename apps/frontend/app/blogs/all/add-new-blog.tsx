'use client';

import { DialogTitle } from '@radix-ui/react-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddNewBlogForm } from '@/app/blogs/all/add-new-blog-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AddNewBlog() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
          <Plus className="h-4 w-4" />
          <span>Add New Blog</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[450px]">
        <DialogTitle className="sr-only">Add new blog form</DialogTitle>
        <DialogHeader>
          <h3 className="text-2xl font-semibold">Add new blog</h3>
          <p className="text-muted-foreground text-balance">
            Enter details to create new blog
          </p>
        </DialogHeader>
        <div className="mt-4">
          <AddNewBlogForm openFormDialog={setOpenDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
