
// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { useTheme } from "next-themes"
// import {
//   SidebarTrigger,
// } from "@/shared/components/ui/sidebar"
// import { ChevronDown, Moon, Sun } from "lucide-react"
// import { Button } from "@/shared/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
// import Image from "next/image"

// export function Header() {
//   const { setTheme } = useTheme()

//   return (
//     <header className="flex h-[68px] shrink-0 items-center gap-4 border-b bg-sidebar px-4 sm:px-6">
//       <SidebarTrigger />
//        <div className="flex items-center gap-2">
//         <Image
//           src="/images/new-icon.png" 
//           alt="Portal Identity Logo"
//           width={40}
//           height={40}
//           className="h-10 w-10 object-contain"
//         />
//         <div className="font-headline text-xl font-semibold text-primary">
//           Portal Identity
//         </div>
//       </div>
//       <div className="ml-auto flex items-center gap-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={() => setTheme("light")}>
//               Light
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("dark")}>
//               Dark
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTheme("system")}>
//               System
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="flex items-center gap-2">
//               <span className="font-bold">EN</span>
//               <ChevronDown className="h-4 w-4 text-muted-foreground" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem>English</DropdownMenuItem>
//             <DropdownMenuItem>Spanish</DropdownMenuItem>
//             <DropdownMenuItem>French</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="rounded-full">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src="https://placehold.co/40x40" alt="User" data-ai-hint="user avatar" />
//                 <AvatarFallback>U</AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>My Account</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Settings</DropdownMenuItem>
//             <DropdownMenuItem>Support</DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>Logout</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }

"use client"
import * as React from "react"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { AppLogo } from "./app-logo"
import { ThemeSwitcher } from "./theme-switcher"
import { LanguageSwitcher } from "./language-switcher"
import { UserMenu } from "./user-menu"
import { useMenuState } from "@/shared/components/layout/hooks/header-menu-state"
import type { HeaderProps } from "@/shared/components/layout/types/header-menu.type"

export function Header({ 
  user,
  appName = "CAuth2",
  logoSrc = "/images/new-icon.png"
}: HeaderProps) {
  const { menuState, menuActions } = useMenuState(user);

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-sidebar px-4 sm:px-6">
      <SidebarTrigger />
      
      <AppLogo 
        appName={appName}
        logoSrc={logoSrc}
        href="/"
      />
      
      <div className="ml-auto flex items-center gap-4">
        <ThemeSwitcher />
        <LanguageSwitcher 
          menuState={menuState}
          menuActions={menuActions}
        />
        <UserMenu user={user} />
      </div>
    </header>
  );
}