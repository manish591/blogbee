'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

const formSchema = z.object({
  name: z.string().min(5).max(30),
  slug: z.string().min(5).max(30),
  logo: z.url().optional(),
});

export type TAddNewBlogFormSchema = z.infer<typeof formSchema>;

export function AddNewBlogForm() {
  const form = useForm<TAddNewBlogFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      logo: '',
    },
  });

  function onSubmit(values: TAddNewBlogFormSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="flex flex-col items-center rounded-md p-2 py-4 border-dashed border-2">
          <div className="text-center">
            <p className="text-base font-medium text-gray-700 mb-1">
              Drop your Blog Logo here
            </p>
            <p className="text-sm text-gray-500">Recommended size 500x500px</p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel>Blog Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-none"
                  placeholder="Blog name"
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
              <FormLabel>Blog Url</FormLabel>
              <FormControl>
                <div className="flex border rounded-md focus-within:ring-[3px] focus-within:border-ring focus-within:ring-ring/50">
                  <Input
                    {...field}
                    className="shadow-none border-none rounded-none focus-visible:ring-[0px]"
                    placeholder="Blog Url"
                  />
                  <div className="flex items-center px-2 h-full border border-secondary bg-secondary">
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
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button>Submit</Button>
        </div>
      </form>
    </Form>
  );
}
