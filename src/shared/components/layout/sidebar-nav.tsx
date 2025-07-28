
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
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/shared/components/ui/sidebar"
import { ChevronDown, ChevronRight, Briefcase, Settings, Users } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export function SidebarNav() {
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
  )
}
