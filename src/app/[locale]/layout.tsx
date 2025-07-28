
"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarProvider,
} from "@/shared/components/ui/sidebar"
import { Header } from "@/shared/components/layout/header"
import { SidebarNav } from "@/shared/components/layout/sidebar-nav"

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <main className="flex-1 overflow-auto bg-muted/40 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}


export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
