
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
import { ChevronDown, ChevronRight, Briefcase, User, Settings } from "lucide-react"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="flex flex-1">
          <Sidebar
            variant="sidebar"
            collapsible="icon"
            className="hidden sm:flex z-10"
          >
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <div className="font-headline text-lg font-semibold text-primary group-data-[collapsible=icon]:hidden">
                        CAuth2
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
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
                      <SidebarMenuButton tooltip="Settings">
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
          <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6 lg:p-8">
              <UserManagement />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
