"use client";

import * as React from "react";
import { SidebarContent, SidebarMenu, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { menuConfig } from "@/layout/types/sidebar-menu.type";
import { useMenuState } from "@/layout/hooks/use-menu-state";
import { MenuItem } from "./nav-item";

export function SidebarNav() {
  const { state } = useSidebar();
  const { openState, toggleMenu } = useMenuState(menuConfig);

  return (
    <div className="flex flex-col h-full">
      <SidebarContent className="flex-1">
        {menuConfig.map((item, index) => (
          <React.Fragment key={item.id}>
            <SidebarMenu className={cn("px-2", index === 0 && "pt-2")}>
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