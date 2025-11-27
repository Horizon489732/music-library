import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <Button
        className="bg-admin-primary text-admin-primary-foreground hover:bg-admin-accent hover:text-admin-accent-foreground mb-10 w-fit text-xs font-medium"
        asChild
      >
        <Link href="/admin/songs">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <p>Form</p>
      </section>
    </>
  );
};

export default Page;
