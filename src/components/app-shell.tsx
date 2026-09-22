import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Bike, BookOpen, Boxes, Building2, CalendarCheck, ChevronDown, ClipboardList, FileText, Gauge, Landmark, ReceiptIndianRupee, Search, Settings, ShieldCheck, UserRound, Users, WalletCards } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { notifications, searchRecords } from "@/lib/mock-service";
import { branches } from "@/lib/masters";
import { ALL_BRANCHES, useSession } from "@/lib/branch-context";
import type { Role } from "@/lib/domain";
import { cn } from "@/lib/utils";

const items = [
  ["Dashboard", "/dashboard", Gauge], ["Customers", "/customers", Users], ["Proforma Invoices", "/proforma", FileText], ["Follow-ups", "/followups", ClipboardList], ["Bookings", "/bookings", BookOpen], ["Vehicle Inventory", "/inventory", Boxes], ["Finance", "/finance", Landmark], ["Insurance", "/insurance", ShieldCheck], ["Registration", "/registration", Bike], ["Deliveries", "/deliveries", CalendarCheck], ["Accounts", "/accounts", WalletCards], ["Reports", "/reports", ReceiptIndianRupee],
] as const;

const ownerItems = [["Masters", "/masters", Building2], ["Settings", "/settings", Settings]] as const;
const staffItems = [["Settings", "/settings", Settings]] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { state } = useSidebar();
  const session = useSession();
  const links = [...items, ...(session.isOwner ? ownerItems : staffItems)];
  return <Sidebar collapsible="icon" className="border-r border-sidebar-border/70 bg-sidebar/80 backdrop-blur-2xl">
    <SidebarHeader className="h-20 justify-center border-b border-sidebar-border/60 px-4">
      <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
        <span className="brand-gradient grid size-10 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-glow"><Bike className="size-5"/></span>
        {state === "expanded" && <span className="min-w-0"><strong className="block truncate font-display text-sm font-semibold">SRIVAARI AUTOMOBILES</strong><small className="text-xs text-muted-foreground">{session.branchName}</small></span>}
      </Link>
    </SidebarHeader>
    <SidebarContent><SidebarGroup className="px-2 py-4"><SidebarGroupContent><SidebarMenu className="gap-1">
      {links.map(([label, to, Icon]) => <SidebarMenuItem key={to}>
        <SidebarMenuButton asChild isActive={pathname === to || (to !== "/dashboard" && pathname.startsWith(to))} tooltip={label} className="h-10 rounded-xl transition-all duration-200 hover:bg-primary-soft hover:text-primary data-[active=true]:brand-gradient data-[active=true]:text-primary-foreground data-[active=true]:shadow-soft">
          <Link to={to}><Icon/><span>{label}</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>)}
    </SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent>
    <SidebarFooter className="border-t border-sidebar-border/60 p-3">
      <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-card/60">
        <Avatar className="size-9"><AvatarFallback className="bg-primary-soft text-primary">SK</AvatarFallback></Avatar>
        {state === "expanded" && <div className="min-w-0"><p className="truncate text-sm font-semibold">S. Kannan</p><p className="text-xs text-muted-foreground">{session.role}</p></div>}
      </div>
    </SidebarFooter>
  </Sidebar>;
}

function BranchSelector() {
  const session = useSession();
  if (!session.isOwner) return <span className="hidden items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3 py-2 text-sm font-semibold md:inline-flex"><Building2 className="size-4 text-primary"/>{session.branchName}</span>;
  return <Select value={session.branchId} onValueChange={session.setBranchId}>
    <SelectTrigger className="hidden w-56 md:flex"><Building2 className="mr-2 size-4 text-primary"/><SelectValue/></SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>
      {branches.map((branch) => <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>)}
    </SelectContent>
  </Select>;
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  return <CommandDialog open={open} onOpenChange={onOpenChange}>
    <CommandInput placeholder="Search customer, phone, booking, chassis, engine..."/>
    <CommandList><CommandEmpty>No showroom records found.</CommandEmpty>
      {["CUSTOMER", "BOOKING", "VEHICLE", "FINANCE", "INSURANCE", "REGISTRATION"].map((group) => <CommandGroup key={group} heading={group}>
        {searchRecords.filter((record) => record.type === group).map((record) => <CommandItem key={record.id} value={`${record.title} ${record.subtitle}`} onSelect={() => { onOpenChange(false); navigate({ to: record.href }); }}>
          <Search/><div><p className="font-semibold">{record.title}</p><p className="text-xs text-muted-foreground">{record.subtitle}</p></div>
        </CommandItem>)}
      </CommandGroup>)}
    </CommandList>
  </CommandDialog>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const session = useSession();
  return <SidebarProvider><AppSidebar/>
    <main className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-border/60 bg-background/68 px-4 backdrop-blur-2xl lg:px-8">
        <SidebarTrigger/>
        <BranchSelector/>
        <button onClick={() => setSearchOpen(true)} className="mx-auto flex h-11 w-full max-w-xl items-center gap-3 rounded-xl border border-border/80 bg-card/72 px-4 text-left text-sm text-muted-foreground shadow-xs backdrop-blur-md transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-soft">
          <Search className="size-4 text-primary"/><span className="truncate">Search customer, phone, booking, chassis, engine...</span>
          <kbd className="ml-auto hidden rounded-md border border-border bg-muted/75 px-2 py-1 text-[10px] sm:block">⌘ K</kbd>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative"><Bell/><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background"/></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border/70 bg-popover/92 p-2 shadow-float backdrop-blur-xl">
            <DropdownMenuLabel className="flex items-center justify-between">Notifications <span className="text-xs text-primary">4 new</span></DropdownMenuLabel>
            <DropdownMenuSeparator/>
            {notifications.map((item) => <DropdownMenuItem key={item.id} asChild className="items-start rounded-xl p-3"><Link to={item.href}>
              <span className={cn("mt-1 size-2 shrink-0 rounded-full", item.tone === "danger" && "bg-destructive", item.tone === "warning" && "bg-warning", item.tone === "success" && "bg-success")}/>
              <span><strong className="block text-xs">{item.title}</strong><small className="text-muted-foreground">{item.detail}</small></span>
            </Link></DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="hidden gap-2 px-2 sm:flex"><Avatar className="size-8"><AvatarFallback className="brand-gradient text-primary-foreground">SK</AvatarFallback></Avatar><ChevronDown/></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/70 bg-popover/92 shadow-float backdrop-blur-xl">
            <DropdownMenuLabel>S. Kannan · {session.role}</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Switch role (demo)</DropdownMenuLabel>
            {(["Owner", "Manager", "Sales Executive", "Accounts"] as Role[]).map((role) => <DropdownMenuItem key={role} onSelect={() => session.setRole(role)}>{session.role === role ? "✓ " : ""}{role}</DropdownMenuItem>)}
            <DropdownMenuSeparator/>
            <DropdownMenuItem><UserRound/> Profile</DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings"><Settings/> Settings</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="mx-auto max-w-[1600px] p-4 lg:p-8">{children}</div>
    </main>
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen}/>
    <Toaster richColors position="top-right"/>
  </SidebarProvider>;
}
