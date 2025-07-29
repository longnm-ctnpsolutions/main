import { User, Briefcase, Settings, Shield, Database, BarChart } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  roles?: string[];
  dividerAfter?: boolean;
}

export const menuConfig: MenuItem[] = [
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