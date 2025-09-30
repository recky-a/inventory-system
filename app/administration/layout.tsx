"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AdministrationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4"
              />
              <h1 className="text-base font-medium">{pathname === "/administration/dashboard" ? "Dashboard" : (pathname === "/administration/kelola-barang" ? "Kelola Barang" : 'Kelola Transaksi')}</h1>
            </div>
          </header>
          <div className="container">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  )
}
