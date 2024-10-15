import { ActionFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import DeployPodDialog from "~/components/console/template/deploy-pod-dailog";
import { useRef, useState, useEffect } from "react";
import {
  Instance,
  listInstances,
  listTemplates,
  Template,
} from "~/services/api.server";

// Loader to fetch the instances
export const loader = async ({ request }: { request: Request }) => {
  const instances = await listInstances(request);
  const templates = await listTemplates(request);
  return json({ instances, templates });
};

export const description = "";
export const handle = {
  breadcrumb: "Deploy",
};

interface InstanceCardProps {
  hostname: string;
  status: string;
  gpuType: string;
  gpuCount: number;
  gpuMemory: number;
  gpuCudaVersion: string;
  gpuDriverVersion: string;
  publicIp: string;
}

function InstanceCard(cardProps: InstanceCardProps) {
  return (
    <Card
      key={cardProps.hostname}
      className="w-[350px] hover:bg-muted hover:cursor-pointer duration-200"
    >
      <CardHeader>
        <CardTitle className="text-left">
          <div className="flex justify-between text-sm">
            <span>{cardProps.gpuType || "No GPU"}</span>
            <span
              className={
                cardProps.gpuCount === 0
                  ? "text-red-600 text-xs"
                  : "text-green-600 text-xs"
              }
            >
              {`CARDS: `}
              {cardProps.gpuCount}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between text-sm">
            <span>{cardProps.hostname}</span>
            <span>{`${Math.floor(cardProps.gpuMemory / 1024)} GB VRAM`}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col text-xs w-full text-left text-muted-foreground">
          <div className="flex text-xs w-full justify-between text-muted-foreground">
            <span className="flex-1">{`IP: ${cardProps.publicIp}`}</span>
            <span>{`CUDA: ${cardProps.gpuCudaVersion}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PodDeploying() {
  const { instances, templates } = useLoaderData<{
    instances: Instance[];
    templates: Template[];
  }>();

  const [displayedInstances, setDisplayedInstances] = useState<Instance[]>([]);
  const previousInstancesRef = useRef<Instance[]>([]);

  // Effect to detect new instances and update displayedInstances accordingly
  useEffect(() => {
    const previousInstances = previousInstancesRef.current;

    // Find instances that are new (not in the previousInstances)
    const newInstances = instances.filter(
      (instance) =>
        !previousInstances.some(
          (prevInstance) => prevInstance.id === instance.id
        )
    );

    if (newInstances.length > 0) {
      setDisplayedInstances((prev) => [...prev, ...newInstances]);
    }

    // Update the ref with the current instances
    previousInstancesRef.current = instances;
  }, [instances]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="border rounded-lg lg:w-screen-xl max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-8 text-center">
            {/* Instance Area */}
            {displayedInstances.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {displayedInstances.map((instance) => (
                  <DeployPodDialog
                    templates={templates}
                    instanceId={instance.id}
                  >
                    <InstanceCard
                      key={instance.id}
                      hostname={instance.hostname}
                      status={instance.status}
                      gpuType={instance.gpuType}
                      gpuCount={instance.gpuCount || 0}
                      gpuMemory={instance.gpuMemory}
                      gpuCudaVersion={instance.gpuCudaVersion}
                      gpuDriverVersion={instance.gpuDriverVersion}
                      publicIp={instance.publicIp}
                    />
                  </DeployPodDialog>
                ))}
              </div>
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold">No Instances Available</p>
                <p className="text-muted-foreground">
                  It looks like there are no instances deployed yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
