'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { editBlog } from '@/app/blogs/actions/edit-blog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(5).max(30),
  about: z.string().max(300).optional(),
});

export type EditBlogFormSchema = z.infer<typeof formSchema>;
export type EditBlogData = EditBlogFormSchema & { id: string };

export function BlogSettingsForm({
  blogId,
  name,
  about,
}: Readonly<{ blogId: string; name?: string; about?: string }>) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<EditBlogFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      about,
    },
  });

  async function onSubmit(values: EditBlogFormSchema) {
    setIsLoading(true);
    try {
      await editBlog({
        ...values,
        id: blogId,
      });
      setIsLoading(false);
      router.refresh();
    } catch (err) {
      setIsLoading(false);
      console.log('EDIT_BLOG_ERROR: Failed to edit blog', err);
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
              <FormLabel className="text-base">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-none h-10"
                  placeholder="Enter blog name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel className="text-base">About</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-28 shadow-none"
                  placeholder="Enter about blog"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end mt-8">
          <Button disabled={isLoading}>
            {isLoading && (
              <output
                className="animate-spin inline-block size-3.5 border-2 border-current border-t-transparent text-white rounded-full"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </output>
            )}
            <span>Update</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
