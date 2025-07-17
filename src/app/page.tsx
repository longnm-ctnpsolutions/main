
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
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Briefcase, User, Settings } from "lucide-react"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden sm:flex z-30"
        >
          <SidebarHeader>
             <div className="flex items-center gap-2 p-2">
                <SidebarTrigger />
                <div className="font-headline text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">
                    CAuth2
                </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Management">
                      <User />
                      <span className="w-full">Management</span>
                      <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuItem>
                      <SidebarMenuSubButton isActive>
                        Users
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                      <SidebarMenuItem>
                      <SidebarMenuSubButton>
                        Clients
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                      <SidebarMenuItem>
                      <SidebarMenuSubButton>
                        Roles
                      </SidebarMenuSubButton>
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
                        <SidebarMenuSubButton>
                          User Profile
                        </SidebarMenuSubButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:hidden">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                 <div className="font-headline text-lg font-semibold text-primary">
                    CAuth2
                </div>
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
