
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { ChevronDown, ChevronRight, Briefcase, Settings, Moon, Users } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { cn } from "@/shared/lib/utils"

function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-sidebar px-4 sm:px-6">
      <SidebarTrigger />
      <div className="font-headline text-lg font-semibold text-primary">
        CAuth2
      </div>
      {children}
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="font-bold">EN</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { state, setOpen } = useSidebar()
  const pathname = usePathname();
  const [isManagementOpen, setManagementOpen] = React.useState(true)
  const [isSettingsOpen, setSettingsOpen] = React.useState(false)

  const handleMenuClick = () => {
    if (state === 'collapsed') {
      setOpen(true);
    }
  };

  const locale = pathname.split('/')[1] || 'en';

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header>
        <div />
      </Header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu className="p-2">
              <Collapsible open={isManagementOpen} onOpenChange={setManagementOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Management"
                      className={cn("w-full justify-start", state === 'collapsed' && 'justify-center')}
                      onClick={handleMenuClick}
                    >
                      <Users className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <div className={cn("flex flex-1 items-center justify-between overflow-hidden transition-all duration-500", state === 'collapsed' ? 'w-0' : 'w-full ml-3')}>
                        <span className="whitespace-nowrap">Management</span>
                        {isManagementOpen ? <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-500" /> : <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-500" />}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <Link href={`/${locale}/users`}>
                        <SidebarMenuSubButton isActive={pathname.includes('/users')}>Users</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href={`/${locale}/clients`}>
                        <SidebarMenuSubButton isActive={pathname.includes('/clients')}>Clients</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <Link href={`/${locale}/roles`}>
                        <SidebarMenuSubButton isActive={pathname.includes('/roles')}>Roles</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
              
            <div className="my-1 h-px w-full bg-sidebar-border" />

            <SidebarMenu className="p-2">
              <SidebarMenuItem>
                <Link href={`/${locale}/applications`}>
                  <SidebarMenuButton
                    tooltip="Applications"
                    className={cn("w-full justify-start", state === 'collapsed' && 'justify-center')}
                    onClick={handleMenuClick}
                    isActive={pathname.includes('/applications')}
                  >
                    <Briefcase className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <div className={cn("flex flex-1 items-center justify-between overflow-hidden transition-all duration-500", state === 'collapsed' ? 'w-0' : 'w-full ml-3')}>
                       <span className="whitespace-nowrap">Applications</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>

            <div className="my-1 h-px w-full bg-sidebar-border" />

            <SidebarMenu className="p-2">
              <Collapsible open={isSettingsOpen} onOpenChange={setSettingsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="Settings"
                      className={cn("w-full justify-start", state === 'collapsed' && 'justify-center')}
                      onClick={handleMenuClick}
                    >
                      <Settings className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <div className={cn("flex flex-1 items-center justify-between overflow-hidden transition-all duration-500", state === 'collapsed' ? 'w-0' : 'w-full ml-3')}>
                        <span className="whitespace-nowrap">Setting</span>
                        {isSettingsOpen ? <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-500" /> : <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-500" />}
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <Link href={`/${locale}/user-profile`}>
                        <SidebarMenuSubButton isActive={pathname.includes('/user-profile')}>User Profile</SidebarMenuSubButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
