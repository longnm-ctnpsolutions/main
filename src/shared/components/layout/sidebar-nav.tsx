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
import { ChevronDown, ChevronRight, User, Briefcase, Settings, Shield, Database, BarChart } from "lucide-react"
import { cn } from "@/shared/lib/utils"

// Types
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  roles?: string[];
  dividerAfter?: boolean;
}

// Menu Configuration
const menuConfig: MenuItem[] = [
  {
    id: "identity",
    label: "Identity Manager",
    icon: User,
    dividerAfter: true,
    children: [
      { id: "users", label: "Users", icon: User, href: "/users" },
      { id: "clients", label: "Clients", icon: User, href: "/clients" },
      { id: "roles", label: "Roles", icon: Shield, href: "/roles" },
    ]
  },
  {
    id: "applications",
    label: "Applications",
    icon: Briefcase,
    href: "/applications",
    dividerAfter: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    dividerAfter: true,
    children: [
      { id: "reports", label: "Reports", icon: BarChart, href: "/analytics/reports" },
      { id: "dashboard", label: "Dashboard", icon: Database, href: "/analytics/dashboard" },
      { 
        id: "advanced", 
        label: "Advanced Analytics", 
        icon: BarChart, 
        children: [
          { id: "trends", label: "Trends", icon: BarChart, href: "/analytics/advanced/trends" },
          { id: "predictions", label: "Predictions", icon: BarChart, href: "/analytics/advanced/predictions" },
        ]
      },
    ]
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    dividerAfter: true,
    children: [
      { id: "profile", label: "User Profile", icon: User, href: "/user-profile" },
      { id: "system", label: "System Settings", icon: Settings, href: "/system-settings" },
    ]
  },
];

// Custom Hook for menu state management
function useMenuState(menuConfig: MenuItem[]) {
  const pathname = usePathname();
  
  const getDefaultOpenState = (items: MenuItem[]): Record<string, boolean> => {
    const state: Record<string, boolean> = {};
    
    const checkItem = (item: MenuItem, parentPath = ""): void => {
      const fullPath = parentPath ? `${parentPath}.${item.id}` : item.id;
      
      if (item.children) {
        // Check if any child or descendant matches current path
        const hasActiveChild = checkHasActiveChild(item.children);
        state[fullPath] = hasActiveChild;
        
        item.children.forEach(child => checkItem(child, fullPath));
      }
    };
    
    const checkHasActiveChild = (children: MenuItem[]): boolean => {
      return children.some(child => {
        if (child.href && pathname.includes(child.href)) return true;
        if (child.children) return checkHasActiveChild(child.children);
        return false;
      });
    };
    
    items.forEach(item => checkItem(item));
    return state;
  };

  const [openState, setOpenState] = React.useState<Record<string, boolean>>(() => 
    getDefaultOpenState(menuConfig)
  );

  const toggleMenu = (menuId: string) => {
    setOpenState(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return { openState, toggleMenu };
}

// Recursive Menu Item Component
interface MenuItemProps {
  item: MenuItem;
  level?: number;
  parentPath?: string;
  openState: Record<string, boolean>;
  toggleMenu: (menuId: string) => void;
}

function MenuItem({ item, level = 0, parentPath = "", openState, toggleMenu }: MenuItemProps) {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  
  const fullPath = parentPath ? `${parentPath}.${item.id}` : item.id;
  const isOpen = openState[fullPath] || false;
  const isActive = item.href ? pathname.includes(item.href) : false;
  
  const handleMenuClick = () => {
    if (state === 'collapsed') {
      setOpen(true);
    }
  };

  if (!item.children) {
    const Component = level === 0 ? SidebarMenuButton : SidebarMenuSubButton;
    const href = item.href ? `/${locale}${item.href}` : '#';
    
    return (
      <SidebarMenuItem>
        <Link href={href}>
          <Component
            tooltip={item.label}
            isActive={isActive}
            className={cn(
              "w-full flex items-center",
              state === 'collapsed' && "justify-center",
              level > 0 && "ml-4"
            )}
            onClick={handleMenuClick}
          >
            {level === 0 && (
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            )}
            {state !== 'collapsed' && (
              <span className="flex-1 overflow-hidden whitespace-nowrap ml-2">
                {item.label}
              </span>
            )}
          </Component>
        </Link>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleMenu(fullPath)}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            className={cn(
              "w-full flex items-center",
              state === 'collapsed' && "justify-center"
            )}
            onClick={handleMenuClick}
          >
            <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {state !== 'collapsed' && (
              <div className="flex-1 overflow-hidden whitespace-nowrap flex items-center justify-between ml-2">
                <span>{item.label}</span>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </div>
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
      </SidebarMenuItem>
      <CollapsibleContent>
        <SidebarMenuSub>
          {item.children.map(child => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              parentPath={fullPath}
              openState={openState}
              toggleMenu={toggleMenu}
            />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Main Sidebar Component
export function SidebarNav() {
  const { state } = useSidebar();
  const { openState, toggleMenu } = useMenuState(menuConfig);

  return (
    <div className="flex flex-col h-full">
      <SidebarContent className="flex-1">
        {menuConfig.map((item, index) => (
          <React.Fragment key={item.id}>
            <SidebarMenu className={cn("px-2", index === 0 && state === 'collapsed' && "pt-2")}>
              <MenuItem
                item={item}
                openState={openState}
                toggleMenu={toggleMenu}
              />
            </SidebarMenu>
            {item.dividerAfter && (
              <div className="h-px bg-sidebar-border" />
            )}
          </React.Fragment>
        ))}
      </SidebarContent>
      {state !== 'collapsed' && (
        <div className="p-4 transition-all duration-500">
          <div className="text-xs text-muted-foreground transition-all duration-500">
            <div>Copyright © 2025</div>
            <div>CTNP Solutions.</div>
          </div>
        </div>
      )}
    </div>
  );
}