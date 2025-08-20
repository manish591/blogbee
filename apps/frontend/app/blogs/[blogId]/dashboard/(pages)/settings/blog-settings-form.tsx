'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(5).max(30),
  about: z.string().max(300).optional(),
  logo: z.url().optional(),
});

export type TAddNewBlogFormSchema = z.infer<typeof formSchema>;

export function BlogSettingsForm() {
  const form = useForm<TAddNewBlogFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      about: '',
      logo: '',
    },
  });

  function onSubmit(values: TAddNewBlogFormSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel className="text-base">Blog Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="shadow-none h-10"
                  placeholder="Blog name"
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
                <Textarea placeholder="About" {...field} />
              </FormControl>
              <FormDescription>
                Mapping custom domains is coming soon
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p className="font-semibold mb-3">Logo</p>
          <div className="flex flex-col items-center rounded-md p-2 py-4 border-dashed border-2">
            <div className="text-center">
              <p className="text-base font-medium text-gray-700 mb-1">
                Drop your Blog Logo here
              </p>
              <p className="text-sm text-gray-500">
                Recommended size 500x500px
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-8">
          <Button>Update</Button>
        </div>
      </form>
    </Form>
  );
}
