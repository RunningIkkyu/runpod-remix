import { Outlet } from "@remix-run/react";
import { useMatches } from "@remix-run/react";
import { IoIosArrowForward } from "react-icons/io";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { LoaderFunction, redirect } from "@remix-run/node";
// import { PiCpuFill } from "react-icons/pi";
import { BsGpuCard } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";
import { BsBox } from "react-icons/bs";
import { GrTemplate, GrStorage, GrMonitor, GrHome } from "react-icons/gr";
import { json, Link, useNavigate } from "@remix-run/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Bell, CircleUser, LineChart, Menu, Package2 } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
// import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getUserFromSession } from "~/services/auth.server";

export const description = "";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  // If the user is authenticated, redirect to the dashboard
  if (!user) {
    return redirect("/login");
  }

  return json({ user });
};

function SidebarSectionTitle({ label }: { label: string }) {
  return (
    <div className="text-xs text-muted-foreground select-none font-bold px-3 py-2 uppercase">
      <hr className="my-2" />
      {label}
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  children,
  badge,
}: {
  to: string;
  icon: JSX.Element;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-3 py-4 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
    >
      {icon}
      {children}
      {badge && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

export function BreadcrumbComponent() {
  const matches = useMatches();
  const pathname = matches[matches.length - 1].pathname;
  const breadcrumbs = pathname
    .split("/") // Split by "/"
    .filter(Boolean) // Remove empty parts (e.g., for leading/trailing "/")
    .map((part, index, array) => ({
      name: part,
      href: `/${array.slice(0, index + 1).join("/")}`, // Create a full path for the breadcrumb link
    }));

  return (
    <Breadcrumb>
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem key={breadcrumb.href}>
          <BreadcrumbLink href={breadcrumb.href}>
            {breadcrumb.name}
          </BreadcrumbLink>
          <div className="pr-2">
            {index < breadcrumbs.length - 1 ? <IoIosArrowForward /> : <></>}
          </div>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}

function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <SidebarLink to="#" icon={<Package2 className="h-6 w-6" />}>
              <span className="">Utopia</span>
            </SidebarLink>
            <hr className="mt-4" />
            <SidebarSectionTitle label="manage" />
            <SidebarLink to="/console/pod" icon={<BsBox />}>
              Pods
            </SidebarLink>
            <SidebarLink to="/console/templates" icon={<GrTemplate />}>
              Templates
            </SidebarLink>
            {/*
            <SidebarLink to="#" icon={<GrStorage />}>
              Storage
            </SidebarLink>
            <SidebarLink to="#" icon={<GrMonitor className="h-4 w-4" />}>
              Monitoring
            </SidebarLink>
            <SidebarLink to="#" icon={<LineChart className="h-5 w-5" />}>
              Analytics
            </SidebarLink>
            */}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <BreadcrumbComponent />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/logout")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span>Utopia</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <SidebarLink to="/console" icon={<GrHome />}>
                Home
              </SidebarLink>
              <SidebarSectionTitle label="manage" />
              <SidebarLink to="/console/pods" icon={<BsBox />}>
                Pods
              </SidebarLink>
              <SidebarLink to="/console/templates" icon={<GrTemplate />}>
                Templates
              </SidebarLink>
              {/*
              <SidebarLink to="#" icon={<GrStorage />}>
                Storage
              </SidebarLink>
              <SidebarLink to="#" icon={<LineChart className="h-4 w-4" />}>
                Monitoring
              </SidebarLink>
               */}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
