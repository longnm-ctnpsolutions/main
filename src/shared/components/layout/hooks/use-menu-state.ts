"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/layout/types/sidebar-menu.type";

export function useMenuState(menuConfig: MenuItem[]) {
  const pathname = usePathname();
  
  const getDefaultOpenState = (items: MenuItem[]): Record<string, boolean> => {
    const state: Record<string, boolean> = {};
    
    const checkItem = (item: MenuItem, parentPath = ""): void => {
      const fullPath = parentPath ? `${parentPath}.${item.id}` : item.id;
      
      if (item.children) {
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