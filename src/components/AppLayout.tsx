import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [fullName, setFullName] = useState("Harrisom");
  const [email, setEmail] = useState("harrisom@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nickname = "lyricartifact";
  const notifications = [
    { id: "n1", title: "Incident #123 created", time: "5m ago" },
    { id: "n2", title: "Policy update published", time: "1h ago" },
    { id: "n3", title: "Training module assigned", time: "3h ago" },
  ];
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center">
              <SidebarTrigger className="h-8 w-8" />
              <div className="ml-4">
                <h1 className="text-lg font-semibold">CareConnect</h1>
                <p className="text-xs text-muted-foreground">By Provider Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-md hover:bg-muted transition-colors" aria-label="Notifications">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 10V7a4 4 0 0 0-8 0v3a6 6 0 0 1-2 4h12a6 6 0 0 1-2-4"/><path d="M6 18a2 2 0 0 0 4 0"/></svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-0">
                  <div className="p-4 border-b font-semibold">Notifications</div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground border rounded-md p-4">You have no notifications right now.</div>
                  </div>
                  <div className="p-3 border-t text-center text-sm">
                    <Link to="/notifications/view" className="text-blue-600 hover:underline">View Notifications</Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                    <span className="text-sm font-medium">{fullName}</span>
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium leading-none">{fullName}</div>
                        <div className="text-xs text-muted-foreground">@{nickname}</div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Photos</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}