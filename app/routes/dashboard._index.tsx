import { LoaderFunctionArgs } from "@remix-run/node";
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
  CardContent,
  CardDescription,
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
import { Input } from "~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { authenticator } from "~/services/auth.server";

export const description =
  "A products dashboard with a sidebar navigation and a main content area...";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json(user);
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
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
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
            <SidebarLink to="#" icon={<BsBox />}>
              Pods
            </SidebarLink>
            <SidebarSectionTitle label="manage" />
            <SidebarLink to="#" icon={<BsBox />}>
              Pods
            </SidebarLink>
            <SidebarLink to="#" icon={<GrTemplate />}>
              Templates
            </SidebarLink>
            <SidebarLink to="#" icon={<GrStorage />}>
              Storage
            </SidebarLink>
            <SidebarLink to="#" icon={<GrMonitor className="h-4 w-4" />}>
              Monitoring
            </SidebarLink>
            <SidebarLink to="#" icon={<LineChart className="h-5 w-5" />}>
              Analytics
            </SidebarLink>
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
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

export default function DashboardComponent() {
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
              <SidebarLink to="#" icon={<GrHome />}>
                Home
              </SidebarLink>
              <SidebarSectionTitle label="manage" />
              <SidebarLink to="#" icon={<BsBox />}>
                Pods
              </SidebarLink>
              <SidebarLink to="#" icon={<GrTemplate />}>
                Templates
              </SidebarLink>
              <SidebarLink to="#" icon={<GrStorage />}>
                Storage
              </SidebarLink>
              <SidebarLink to="#" icon={<LineChart className="h-4 w-4" />}>
                Monitoring
              </SidebarLink>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
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
                <h3 className="text-2xl font-bold tracking-tight">
                  You don't have any Pods yet.
                </h3>
                <Button variant="outline" className="mt-4">
                  Deploy a Pod
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
