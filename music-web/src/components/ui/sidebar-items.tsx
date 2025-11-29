"use client";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

const SidebarItems = () => {
  const pathname = usePathname();
  // Menu items.
  const items = [
    {
      title: "Home",
      url: "/user-profile",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/user-profile/upload-song",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "/user-profile/create-song",
      icon: Calendar,
    },
  ];

  return (
    <>
      {items.map((item) => {
        const isSelected = item.url === pathname;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isSelected}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
};

export default SidebarItems;
