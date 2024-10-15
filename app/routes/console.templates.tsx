import { GrAdd } from "react-icons/gr";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import CreateTemplateDialog from "~/components/console/template/create-template-dialog";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { listTemplates, Template } from "~/services/api.server";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { timeAgo } from "~/lib/utils";

export const description = "";
// In routes/console/pods.tsx
export const handle = {
  breadcrumb: "Templates",
};

// Loader to fetch the templates
export const loader = async ({ request }: { request: Request }) => {
  try {
    const templates = await listTemplates(request);
    return json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return json({ error: error }, { status: 500 });
  }
};

interface TemplateCardProps {
  id: number;
  name: string;
  image: string;
  entrypoint: string;
  command: string[] | null;
  updatedAt: string; // `updated_at`
  createdAt: string; // `created_at`
}

function TemplateCard(cardProps: TemplateCardProps) {
  const commandStr =
    cardProps.command == null ? "" : cardProps.command.join(" ");
  const timeStr = timeAgo(cardProps.createdAt);
  return (
    <Card key={cardProps.name} className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-left">
          <div className="flex justify-between text-sm">
            <span className="text-lg">
              {`Template: `}
              {cardProps.name}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between text-sm">
            <span>
              {`Template ID: `}
              {cardProps.id}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col text-xs text-muted-foreground text-left justify-start">
          <span>{`Image: ${cardProps.image}`}</span>
          <span className="">{`Entrypoint: ${cardProps.entrypoint}`}</span>
          <span>{`Command: ${commandStr}`}</span>

          <div className="mt-2 flex text-xs text-muted-foreground justify-between">
            <div>
              <span>{timeStr}</span>
            </div>
            <div>
              {/*
              <span
                className="text-red-500 transition-transform transform hover:scale-150"
                onClick={() => { }}
              >
                <RiDeleteBin4Fill />
              </span>
            */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TemplatePage() {
  const { templates } = useLoaderData<{ templates: Template[] }>();
  console.log("templates: ", templates);

  const [displayedTemplates, setDisplayedTemplates] = useState<Template[]>([]);
  const previousTemplatesRef = useRef<Template[]>([]);

  // Effect to detect new templates and update displayedTemplates accordingly
  useEffect(() => {
    const previousTemplates = previousTemplatesRef.current;

    // Find templates that are new (not in the previousTemplates)
    const newTemplates = templates.filter(
      (template) =>
        !previousTemplates.some(
          (prevTemplate) => prevTemplate.id === template.id
        )
    );

    if (newTemplates.length > 0) {
      setDisplayedTemplates((prev) => [...prev, ...newTemplates]);
    }

    // Update the ref with the current templates
    previousTemplatesRef.current = templates;
  }, []);
  console.log("-----> templates:", templates);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex flex-col gap-4 border rounded-lg lg:w-screen-xl max-w-screen-2xl mx-auto px-4 py-6">
        <div className="flex justify-start">
          <CreateTemplateDialog>
            <Button variant="default" className="gap-2">
              <GrAdd /> New Template
            </Button>
          </CreateTemplateDialog>
        </div>
        <div className="flex flex-col gap-8 text-center">
          {/* Instance Area */}
          {displayedTemplates.length <= 0 ? (
            <div className="flex flex-col">
              <div className="flex flex-col h-full items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  You don't have any templates yet.
                </h3>
                <Button variant="outline" className="mt-4">
                  Create a template
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {displayedTemplates.map((t) => (
                <TemplateCard
                  key={t.id}
                  id={t.id}
                  name={t.name}
                  command={t.command}
                  image={t.image}
                  entrypoint={t.entrypoint}
                  createdAt={t.createdAt}
                  updatedAt={t.updatedAt}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
