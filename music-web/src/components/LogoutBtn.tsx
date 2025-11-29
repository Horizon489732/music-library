"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loggingOut } from "@/lib/actions/auth";

import { toast } from "sonner";


const LogoutBtn = () => {

const router = useRouter();

  const handleLogout = async () => {
    try {
      await loggingOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (e) {
      console.log(e);
      toast.error("Failed to log out");
    }
  };

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}

export default LogoutBtn