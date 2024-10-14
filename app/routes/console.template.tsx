import { GrAdd } from "react-icons/gr";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import CreateTemplateDialog from "~/components/console/template/create-template-dialog";

export const description = "";
// In routes/console/pods.tsx
export const handle = {
  breadcrumb: "Templates",
};

export default function Template() {
  const [openModel, setOpenModel] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="">
        <CreateTemplateDialog>
          <Button variant="default" className="gap-2">
            <GrAdd /> New Template
          </Button>
        </CreateTemplateDialog>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
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
      </div>
    </div>
  );
}
