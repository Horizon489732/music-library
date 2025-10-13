'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';
import Logo from '@icons/logo.svg';

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src={Logo} alt="logo" width={48} height={48} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
          <Link
            href="/library"
            className={cn(
              'cursor-pointer text-base capitalize',
              pathname === '/library' ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Library
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
