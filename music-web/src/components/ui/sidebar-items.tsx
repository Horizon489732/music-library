"use client";
import { usePathname } from "next/navigation";
import { Music, Home, Upload } from "lucide-react";
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
      title: "Upload",
      url: "/user-profile/upload-song",
      icon: Upload,
    },
    {
      title: "Create",
      url: "/user-profile/create-song",
      icon: Music,
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
