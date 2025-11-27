import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Button
          className="mb-10 w-fit text-xs font-medium bg-admin-primary text-admin-primary-foreground hover:bg-admin-accent hover:text-admin-accent-foreground"
          asChild
        >
          <Link href="/admin/songs">Go Back</Link>
        </Button>

        <section>
          
        </section>
    </>
  );
};

export default Page;
