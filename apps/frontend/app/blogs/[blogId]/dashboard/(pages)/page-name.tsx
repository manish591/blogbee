'use client';

import { usePathname } from 'next/navigation';

export function PageName() {
  const pathname = usePathname();
  const name = pathname.split('/').at(-1);
  return <p className="capitalize">{name}</p>;
}
