import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  templateName: z.string().min(2).max(256),
  containerImage: z.string().min(2).max(1024),
  imageTag: z.string().min(2).max(512),
  entrypoint: z.string(),
  startCommand: z.string(),
});

export function CreatTemplateForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // 3. Define UI
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pt-4 w-full"
      >
        <FormField
          control={form.control}
          name="templateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input
                  className="w-sm"
                  placeholder="Template Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="containerImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Container Image</FormLabel>
              <FormControl>
                <Input
                  className="w-sm"
                  placeholder="Template Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entrypoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entrypoint</FormLabel>
              <FormControl>
                <Input
                  className="w-sm"
                  placeholder="Template Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startCommand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Command</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Start Command"
                  className="resize-none w-sm "
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default function CreateTemplateDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Create a New Template`}</DialogTitle>
        </DialogHeader>
        <div className=" w-3/4 md:w-2/3">
          <CreatTemplateForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
