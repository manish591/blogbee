'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/constants';
import { createNewBlog } from '../actions/create-new-blog';

const formSchema = z.object({
  name: z.string().min(5).max(30),
  slug: z.string().min(5).max(30),
  logo: z.union([z.undefined(), z.url()]).optional(),
});

export type AddNewBlogSchema = z.infer<typeof formSchema>;

export function AddNewBlogForm({
  openFormDialog,
}: Readonly<{
  openFormDialog: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AddNewBlogSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: undefined,
    },
  });

  async function onSubmit(values: AddNewBlogSchema) {
    setIsLoading(true);
    try {
      await createNewBlog(values);
      setIsLoading(false);
      openFormDialog(false);
      console.log('CREATE_NEW_BLOG_SUCCESS: Create the blog successfully');
    } catch (err) {
      console.log('CREATE_NEW_BLOG_ERROR: Failed to create new blog', err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-none"
                  placeholder="Enter blog name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex border rounded-md focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50">
                  <Input
                    {...field}
                    className="shadow-none border-none rounded-none focus-visible:ring-[0px]"
                    placeholder="Enter blog slug"
                  />
                  <div className="flex items-center px-2 h-full border border-secondary bg-secondary tracking-wider">
                    .{APP_NAME}.site
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Mapping custom domains is coming soon
              </FormDescription>
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
              openFormDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} className="cursor-pointer">
            {isLoading && (
              <output
                className="animate-spin inline-block size-3.5 border-2 border-current border-t-transparent text-white rounded-full"
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
  );
}
