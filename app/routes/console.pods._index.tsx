import { GrAdd } from "react-icons/gr";
import { Link, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Instance, listPods } from "~/services/api.server";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { FaStop } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Pod } from "./api.pods";
import { timeAgo } from "~/lib/utils";

export const description = "";

// In routes/console/pods.tsx
export const handle = {
  breadcrumb: "Pods",
};

// Loader to fetch the templates
export const loader = async ({ request }: { request: Request }) => {
  return listPods(request);
};

interface PodCardProps {
  id: number;
  instanceId: number;
  image: string;
  status: string;
  cmd: string[];
  entrypoint: string;
  createdAt: string;
  containerId?: string;
  onClick: (podID: number) => Promise<void>;
}

function PodCard(cardProps: PodCardProps) {
  const imageStrings = cardProps.image.split("/");
  const imageSuffix = imageStrings[imageStrings.length - 1];

  const timeStr = timeAgo(cardProps.createdAt);

  return (
    <Card
      key={cardProps.id}
      className="w-[350px] hover:bg-muted hover:cursor-pointer duration-200"
    >
      <CardHeader>
        <CardTitle className="text-left">
          <div className="flex justify-between text-sm">
            <span>{imageSuffix}</span>
            <span
              className={
                cardProps.status === "running"
                  ? "text-green-600 text-xs"
                  : "text-red-600 text-xs"
              }
            >
              {cardProps.status}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between text-xs">
            <span>
              {`POD ID: `}
              {`${cardProps.id}`}
            </span>
            <span className="text-xs">
              {`Instance ID: `}
              {`${cardProps.instanceId}`}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col text-xs w-full text-left text-muted-foreground">
          <div className="flex text-xs w-full justify-between text-muted-foreground">
            <span className="flex-1">{cardProps.entrypoint}</span>
          </div>
          <div className="flex text-xs w-full justify-between text-muted-foreground">
            <span>{timeStr}</span>
            <div className="flex gap-2">
              {/*
              <span className="transition-transform transform hover:scale-150">
                <FaPlay />
              </span>
              <span className="transition-transform transform hover:scale-150">
                <FaStop />
              </span>
              */}
              <span
                className="text-red-500 transition-transform transform hover:scale-150"
                onClick={() => {
                  cardProps.onClick(cardProps.id);
                }}
              >
                <RiDeleteBin4Fill />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PodPage() {
  const pods = useLoaderData<Pod[]>();

  const [displayedPods, setDisplayedPods] = useState<Pod[]>([]);
  const previousPodsRef = useRef<Pod[]>([]);

  async function onDelete(podID: number) {
    // Remove from displayedPods
    setDisplayedPods((prev) => prev.filter((pod) => pod.id !== podID));

    // remove from backend
    fetch(`/api/pods`, {
      method: "DELETE",
      body: JSON.stringify({ podID }),
    });
  }

  useEffect(() => {
    const previousPods = previousPodsRef.current;

    const newPods = pods.filter(
      (pod) => !previousPods.some((prevPod) => prevPod.id === pod.id)
    );

    if (newPods.length > 0) {
      setDisplayedPods((prev) => [...prev, ...newPods]);
    }

    previousPodsRef.current = pods;
  }, [pods]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Pods</h1>
        <Link to="/console/pods/deploy">
          <Button variant="outline" className="gap-2">
            <GrAdd /> Deploy
          </Button>
        </Link>
      </div>
      {/* Show pods or empty state */}
      {displayedPods.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {displayedPods.map((pod) => (
            <PodCard
              onClick={onDelete}
              key={pod.id}
              id={pod.id}
              instanceId={pod.instanceId}
              image={pod.image}
              status={pod.status}
              cmd={pod.cmd}
              entrypoint={pod.entrypoint}
              createdAt={pod.createdAt}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col">
            <div className="flex flex-col h-full items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You don't have any Pods yet.
              </h3>
              <Link to="/console/pods/deploy">
                <Button variant="outline" className="mt-4">
                  Deploy a Pod
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
