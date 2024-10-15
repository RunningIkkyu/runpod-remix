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

const envSchema = z.string().refine(
  (envString) => {
    if (!envString) return true;
    if (envString.trim() === "") return true;

    console.log("envString: ", envString);
    const lines = envString.split("\n");
    return lines.every((line) => /^[0-9a-zA-Z_]+=[^=]+$/.test(line.trim()));
  },
  {
    message: "Invalid env format. Each line must be KEY=VALUE format",
  }
);

const formSchema = z.object({
  templateName: z.string().min(2).max(256),
  containerImage: z.string().min(2).max(1024),
  entrypoint: z.string().default("/bin/bash"),
  startCommand: z.string().default("sleep 86400"),
  env: envSchema,
});

function parseEnvString(envString: string): Record<string, string> {
  const envMap: Record<string, string> = {};

  envString.split("\n").forEach((line) => {
    // Split each line by the first '=' character into key and value
    const [key, value] = line.split(/=(.+)/);

    if (key && value) {
      // Trim quotes from the value if it's wrapped in single or double quotes
      const unwrappedValue = value.trim().replace(/^['"](.+)['"]$/, "$1");
      envMap[key.trim()] = unwrappedValue;
    }
  });

  return envMap;
}

// Example usage:
const envString = "ENV='production'\nTIMEOUT=\"10\"\nDEBUG=true";
const envMap = parseEnvString(envString);

console.log(envMap);
// Output: { ENV: 'production', TIMEOUT: '10', DEBUG: 'true' }

export function CreatTemplateForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("create template values, ", values);
      // Prepare the request payload
      const payload = {
        name: values.templateName,
        image: values.containerImage,
        entrypoint: values.entrypoint,
        command: values.startCommand.split(/\s+/),
        envs: values.env ? parseEnvString(values.env) : {}, // Handle case where env is undefined or empty
      };

      // Send the POST request
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Handle response
      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Tempalte created successfully:", data.pod);
      } else {
        console.error(
          "Error creating template:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      // Handle any fetch errors (e.g., network issues)
      console.error("Create template failed:", error);
    }
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
                  className="w-sm md:w-md lg:w-lg"
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
                  className="w-sm md:w-md lg:w-lg"
                  placeholder="Container Image"
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
                  className="w-sm md:w-md lg:w-lg"
                  placeholder="/bin/bash"
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
                  placeholder="sleep 86400"
                  className="w-sm md:w-md lg:w-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="env"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enviornments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={"KEY=VALUE\n..."}
                  className="w-sm md:w-md lg:w-lg"
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
