// Updated use-menu-state.tsx - Add close all functionality
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

  // Update openState when pathname changes (for navigation)
  React.useEffect(() => {
    setOpenState(getDefaultOpenState(menuConfig));
  }, [pathname, menuConfig]);

  const toggleMenu = (menuId: string) => {
    setOpenState(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  // Function to close all submenus - can be called externally
  const closeAllSubmenus = React.useCallback(() => {
    setOpenState(prev => {
      const newState = { ...prev };
      const openMenus = Object.keys(newState).filter(key => newState[key]);
      
      if (openMenus.length === 0) return prev; // No change if nothing is open
      
      // Close all submenus with smooth transition
      openMenus.forEach((key, index) => {
        setTimeout(() => {
          setOpenState(current => ({
            ...current,
            [key]: false
          }));
        }, index * 30); // 30ms stagger for smooth closing animation
      });
      
      return prev; // Return current state, individual timeouts will update
    });
  }, []);

  return { 
    openState, 
    toggleMenu, 
    closeAllSubmenus 
  };
}