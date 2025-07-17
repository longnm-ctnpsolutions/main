
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { UserManagement } from "@/components/user-management"
import { ChevronDown, ChevronRight, Briefcase, User, Settings, Moon, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden sm:flex z-10"
        >
          <SidebarHeader>
              <div className="flex h-14 items-center justify-between gap-4 px-4">
                  <div className="font-headline text-lg font-semibold text-primary">
                      CAuth2
                  </div>
                  <SidebarTrigger />
              </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Users" isActive>
                  <User />
                  <span className="w-full">Users</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Applications">
                  <Briefcase />
                  <span className="w-full">Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span className="w-full">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                <Button variant="ghost" size="icon" className="sm:hidden">
                    <PanelLeft />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
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
            <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6 lg:p-8">
                <UserManagement />
            </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
