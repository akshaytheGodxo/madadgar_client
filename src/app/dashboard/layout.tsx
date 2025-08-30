import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar"
import { AppSidebar } from "@/components/ui/AppSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}