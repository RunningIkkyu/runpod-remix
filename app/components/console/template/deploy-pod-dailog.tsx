import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Template } from "~/services/api.server";

const formSchema = z.object({
  template: z.string().min(1).max(256),
});

export function DeployPodForm({
  instanceId,
  templates,
}: {
  instanceId: number;
  templates: Template[];
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const templateId = parseInt(values.template, 10);
    fetch("/api/pods/from_template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId: templateId,
        instanceId: instanceId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("Pod created successfully:", data.pod);
        } else {
          console.error("Error creating pod:", data.error);
        }
      });
  }

  // 3. Define UI
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pt-4 w-screen-sm"
      >
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem key={field.name}>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-screen-sm">
                    <SelectTrigger>
                      <SelectValue
                        className="w-screen-sm"
                        placeholder="Select a template"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Deploy</Button>
      </form>
    </Form>
  );
}

export default function DeployPodDialog({
  templates,
  instanceId,
  children,
}: {
  templates: Template[];
  instanceId: number;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Deploy a New Pod`}</DialogTitle>
        </DialogHeader>
        <div className=" w-3/4 md:w-2/3">
          <DeployPodForm templates={templates} instanceId={instanceId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
