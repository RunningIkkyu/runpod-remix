import { LoaderFunctionArgs } from "@remix-run/node";
import { PiCpuFill } from "react-icons/pi";
import { BsGpuCard } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";
import { BsBox } from "react-icons/bs";
import {
  GrTemplate,
  GrStorage,
  GrMonitor,
  GrHome,
  GrAdd,
} from "react-icons/gr";
import { json, Link, useNavigate } from "@remix-run/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Bell,
  CircleUser,
  LineChart,
  Menu,
  Package2,
  Search,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const description = "";

function SelectCPUOrGPu() {
  return (
    <Select defaultValue="gpu">
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="gpu">
            <div className="flex items-center gap-2">
              <BsGpuCard />
              GPU
            </div>
          </SelectItem>
          <SelectItem value="cpu">
            <div className="flex items-center gap-2 text-muted-foreground">
              <BsCpu />
              CPU
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SelectNetworkVolumn() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={`Select Network Volume`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="baidu-bj">
            <div className="flex items-center gap-2">Baidu Beijing</div>
          </SelectItem>
          <SelectItem value="Volcengine-bj">
            <div className="flex items-center gap-2">Volcengine Beijing</div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface InstanceCardPros {
  gpuType: string;
  gpuCount: number;
  gpuMem: number;
  maxGpu: number;
  cpuMem: number;
  cpuCount: number;
  availabeInstances: number;
}

function InstanceCard(cardProps: InstanceCardPros) {
  return (
    <Card
      key={cardProps.gpuType}
      className="w-[350px] hover:bg-muted hover:cursor-pointer duration-200"
    >
      <CardHeader>
        <CardTitle className="text-left">
          <div className="flex justify-between text-sm">
            <span className="text-left">{cardProps.gpuType}</span>
            <span className="text-right text-green-600 text-xs">
              {cardProps.availabeInstances} {`Available`}{" "}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between text-sm">
            <span className="text-left">
              {cardProps.gpuMem} {`GB VRAM`}{" "}
            </span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <div className="flex text-xs w-full justify-between text-muted-foreground">
          <span className="text-left">
            {cardProps.cpuMem} {`GB RAM`}{" "}
          </span>
          <span className="text-right ">
            {cardProps.cpuCount} {`x CPU`}{" "}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function Pod() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Pods</h1>
        <Button variant="outline" className="gap-2">
          <GrAdd /> Deploy
        </Button>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col">
          <div className="flex flex-col items-center gap-1 text-center">
            <SelectCPUOrGPu />
            <SelectNetworkVolumn />

            <InstanceCard
              gpuType="NVIDIA GeForce RTX 4090"
              maxGpu={8}
              gpuCount={1}
              gpuMem={16}
              cpuCount={2}
              cpuMem={8}
              availabeInstances={17}
            />
            <h3 className="text-2xl font-bold tracking-tight">
              You don't have any Pods yet.
            </h3>
            <Button variant="outline" className="mt-4">
              Deploy a Pod
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
