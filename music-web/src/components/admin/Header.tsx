import type { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="mb-5 flex flex-col items-start justify-between gap-5 sm:mb-10 lg:flex-row lg:items-end">
      <div>
        <h2 className="mb-2 text-4xl font-semibold">{session?.user?.name}</h2>
        <p className="text-admin-muted-foreground/70 text-base">
          Controlling the Musicccc
        </p>
      </div>
    </header>
  );
};

export default Header;
