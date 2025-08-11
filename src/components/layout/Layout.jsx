import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./Sidebar"
import ModeToggle from "../mode-toggle"
import ProfileMenu from "../profileMenu"

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-screen">
                <div className="p-3 border-2 flex justify-between">
                    <SidebarTrigger />
                    <div className="flex gap-2">
                        <ModeToggle />
                        <ProfileMenu />
                    </div>
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}