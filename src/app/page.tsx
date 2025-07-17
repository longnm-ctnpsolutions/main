
"use client"

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
import { ChevronDown, ChevronRight, Briefcase, User, Settings, Moon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
            <div className="font-headline text-lg font-semibold text-primary">
              CAuth2
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
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
          <main className="p-4 sm:px-6 sm:py-0">
            <UserManagement />
          </main>
        </div>
        <Sidebar
          collapsible="icon"
          className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col border-r bg-background sm:flex"
        >
          <SidebarContent className="p-2 mt-14">
            <SidebarMenu>
              <Collapsible defaultOpen={true}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Management">
                      <Users />
                      <span className="w-full">Management</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
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
                <SidebarMenuButton tooltip="Applications">
                  <Briefcase />
                  <span>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Setting">
                      <Settings />
                      <span className="w-full">Setting</span>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
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
      </div>
    </SidebarProvider>
  );
}
