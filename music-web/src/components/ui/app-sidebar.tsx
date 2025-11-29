import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarItems from "@/components/ui/sidebar-items";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import LogoutBtn from "@/components/LogoutBtn";
import { getInitials } from "@/lib/utils";
import { type Session } from "next-auth";
import Link from "next/link";

export function AppSidebar({ session }: { session?: Session | null }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mt-4 mb-12 flex items-center pl-4 text-4xl font-extrabold tracking-widest uppercase">
            <Link href="/">Music</Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarItems />
            </SidebarMenu>

            <LogoutBtn />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2 flex w-full items-center gap-5">
          <Avatar className="shadow-sm">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(session?.user?.name)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-primary text-base font-semibold">{session?.user?.name}</p>
            <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
          </div>

        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
