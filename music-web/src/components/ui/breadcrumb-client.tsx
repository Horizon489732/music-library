"use client";

import { usePathname } from "next/navigation";

import { BreadcrumbPage } from "@/components/ui/breadcrumb";

const BreadcrumbClient = () => {
  const pathname = usePathname();
  return (
    <BreadcrumbPage>
      {pathname === "/user-profile" && "Home"}
      {pathname === "/user-profile/upload-song" && "Upload"}
      {pathname === "/user-profile/create-song" && "Create"}
    </BreadcrumbPage>
  );
};

export default BreadcrumbClient;
