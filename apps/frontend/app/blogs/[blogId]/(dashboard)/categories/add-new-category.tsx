'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createNewTag } from '@/app/blogs/actions/create-new-category';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export type AddNewTagFormSchema = z.infer<typeof formSchema>;
export type AddNewTagSchema = AddNewTagFormSchema & {
  blogId: string;
};

export function AddNewTag({ blogId }: Readonly<{ blogId: string }>) {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddNewTagFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: undefined,
    },
  });

  async function onSubmit(values: AddNewTagFormSchema) {
    setIsLoading(true);
    try {
      const categoryData = { ...values, blogId };
      await createNewTag(categoryData);
      setOpenFormDialog(false);
      setIsLoading(false);
      console.log('ADD_NEW_TAG_SUCCESS: New category created successfully');
    } catch (err) {
      setIsLoading(false);
      console.log('ADD_NEW_TAG: Faile to create new category', err);
    }
  }

  return (
    <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-28 w-full p-0 hover:bg-transparent cursor-pointer"
        >
          <Card className="bg-transparent shadow-none border-2 border-dashed w-full h-full hover:border-neutral-400">
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col gap-2 items-center text-foreground/70">
                <Plus className="w-6 h-6" />
                New Category
              </div>
            </div>
          </Card>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Create new Tag</DialogTitle>
          <DialogDescription>Fill the form to create new Tag</DialogDescription>
          <div className="mt-6">
            <Form {...form}>
              <form
                className="grid grid-cols-1 gap-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Enter category name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Input
                        placeholder="Enter category description"
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenFormDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading}>
                    {isLoading && (
                      <output
                        className="cursor-pointer animate-spin inline-block size-3.5 border-2 border-current border-t-transparent text-white rounded-full"
                        aria-label="loading"
                      >
                        <span className="sr-only">Loading...</span>
                      </output>
                    )}
                    <span>Submit</span>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
