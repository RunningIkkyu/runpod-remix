import { GrAdd } from "react-icons/gr";
import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";

export const description = "";

// In routes/console/pods.tsx
export const handle = {
  breadcrumb: "Pods",
};

export default function Pod() {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Pods</h1>
        <Link to="/console/deploy">
          <Button variant="outline" className="gap-2">
            <GrAdd /> Deploy
          </Button>
        </Link>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col">
          <div className="flex flex-col h-full items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You don't have any Pods yet.
            </h3>
            <Link to="/console/deploy">
              <Button variant="outline" className="mt-4">
                Deploy a Pod
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
