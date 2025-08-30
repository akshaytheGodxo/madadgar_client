"use client"

import { CirclePlus, Home, Speech, Settings, Gamepad2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { getDocs, query, collection, where } from "firebase/firestore"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const items = [
  { title: "Home", id: "home", icon: Home },
  { title: "Virtual Drills", id: "drills", icon: Speech },
  { title: "Mini Games", id: "games", icon: Gamepad2 },
  { title: "Connect", id: "connect", icon: CirclePlus },
  { title: "Settings", id: "settings", icon: Settings },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const authDetails = auth.currentUser
  const [isIndividual, setIsIndividual] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!authDetails?.email) return

        const q = query(collection(db, "users"), where("email", "==", authDetails.email))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          setIsIndividual(userData.type === "individual") // 👈 check the type
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchDetails()
  }, [authDetails])

  return (
    <Sidebar className="bg-white border-r border-gray-200 text-gray-800">
      <SidebarContent>
        <div className="px-4 py-5 text-xl font-bold tracking-wide border-b border-gray-200">
          <span className="text-green-600">Madad</span>gaar
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.id
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Button
                        onClick={() => router.push(`/dashboard?tab=${item.id}`)}
                        className={cn(
                          "flex items-start justify-start gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                          isActive
                            ? "bg-green-100 text-green-700"
                            : "hover:bg-gray-100 hover:text-green-600"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {isIndividual ? (
        <div className="items-center justify-center p-4">
          <Button
            onClick={() => router.push(`/dashboard?tab=choose_org`)}
            className="bg-green-500 w-full h-12 rounded-lg cursor-pointer text-white"
          >
            Choose Organization
          </Button>
        </div>
      ) : <div className="items-center justify-center p-4">
        <Button onClick={() => router.push("/dashboard?tab=pending")} className="bg-green-500 w-full h-12 rounded-lg cursor-pointer text-white">
          Pending Requests
          </Button></div>}

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-sm font-medium text-gray-700">{authDetails?.email}</p>
        <p className="text-xs text-gray-500">Logged in</p>
      </div>
    </Sidebar>
  )
}
