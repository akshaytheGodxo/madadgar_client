import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/ui/AppSidebar"
import { Suspense } from "react"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </Suspense>
  )
}