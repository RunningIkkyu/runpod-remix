import { BsGpuCard } from "react-icons/bs";
import { Slider } from "~/components/ui/slider";
import { PiHardDrivesFill } from "react-icons/pi";
import { BsCpu } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
      <SelectTrigger className="w-[180px]">
        <div className="flex flex-inline items-center gap-2">
          <PiHardDrivesFill />
          <SelectValue placeholder={`Network Volume`} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="any">
            <div className="flex items-center gap-2">Network Volume</div>
          </SelectItem>
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
      <div className="flex flex-col">
        <div className="border rounded-lg lg:w-screen-xl max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-8 text-center">
            {/*First line*/}
            <div className="flex gap-4">
              <SelectCPUOrGPu />
              <SelectNetworkVolumn />
            </div>

            {/*Second line Choose Gpu memory*/}
            <div className="">
              <Slider defaultValue={[33]} max={100} step={1} />
            </div>

            {/* Instance Area*/}
            <div className="grid grid-cols-3 gap-4">
              <InstanceCard
                gpuType="NVIDIA GeForce RTX 4090"
                maxGpu={8}
                gpuCount={1}
                gpuMem={16}
                cpuCount={2}
                cpuMem={8}
                availabeInstances={17}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
