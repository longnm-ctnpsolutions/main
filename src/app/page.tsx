
"use client"

import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
} from "@/components/ui/sidebar"
import { UserManagement } from "@/components/user-management"
import { ChevronDown, ChevronRight, Briefcase, Settings, Moon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/components/ui/sidebar"

function PageContent() {
  const { state, setOpen } = useSidebar()
  const [isManagementOpen, setManagementOpen] = React.useState(true)
  const [isSettingsOpen, setSettingsOpen] = React.useState(false)

  const handleMenuClick = () => {
    if (state === 'collapsed') {
      setOpen(true);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger />
        <div className="font-headline text-lg font-semibold text-primary">
          AuthAdminLite
        </div>
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
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <Collapsible open={isManagementOpen} onOpenChange={setManagementOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip="Management" 
                      className={state === 'collapsed' ? 'justify-center' : ''}
                      onClick={handleMenuClick}
                    >
                      <Users className="h-4 w-4" strokeWidth={1.5} />
                      <span className={state === 'collapsed' ? 'hidden' : ''}>Management</span>
                      {state !== 'collapsed' && (isManagementOpen ? <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-500" /> : <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-500" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton isActive>Users</SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton>Clients</SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton>Roles</SidebarMenuSubButton>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Applications" 
                  className={state === 'collapsed' ? 'justify-center' : ''}
                  onClick={handleMenuClick}
                >
                  <Briefcase className="h-4 w-4" strokeWidth={1.5} />
                  <span className={state === 'collapsed' ? 'hidden' : ''}>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible open={isSettingsOpen} onOpenChange={setSettingsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip="Settings" 
                      className={state === 'collapsed' ? 'justify-center' : ''}
                      onClick={handleMenuClick}
                    >
                      <Settings className="h-4 w-4" strokeWidth={1.5} />
                      <span className={state === 'collapsed' ? 'hidden' : ''}>Setting</span>
                      {state !== 'collapsed' && (isSettingsOpen ? <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-500" /> : <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-500" />)}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton>User Profile</SidebarMenuSubButton>
                    </SidebarMenuItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6 lg:p-8">
          <UserManagement />
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SidebarProvider>
      <PageContent />
    </SidebarProvider>
  )
}
