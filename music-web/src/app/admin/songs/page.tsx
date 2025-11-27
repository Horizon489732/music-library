import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <section className="rounded-admin-sm w-full border-1 p-7 max-md:p-5">
      <div className="flex flex-wrap-reverse items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Songs</h2>
        <Button
          className="bg-admin-primary text-admin-primary-foreground hover:bg-admin-accent hover:text-admin-accent-foreground"
          asChild
        >
          <Link href="/admin/songs/new">+ Add a New Song</Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <p>table something something</p>
      </div>
    </section>
  );
};

export default Page;
