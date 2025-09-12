import Link from 'next/link'
import React, { MouseEvent, ReactNode } from 'react'
import { UrlObject } from 'url';
import { cn } from '../utils/frontend';

interface typeSubMenuNavProps {
  navigations: Array<{
    label: ReactNode;
    link?: string | UrlObject;
    onClick?: (event: MouseEvent) => any;
    isActive?: boolean
  }>;
  rightElement?: ReactNode;
  className?: string;
}
export default function SubMenuNav({ navigations, rightElement, className }: typeSubMenuNavProps) {
  return (
    <section className={cn(`max-sm:border-b max-sm:sticky top-[-2px] pb-[1px] max-sm:pt-2 `, className)}>
      <div className="flex items-center">
        <div className='inline-flex items-center sm:rounded-lg sm:p-[.2rem] sm:bg-gray-200'>
          {navigations.map(({ label, isActive, link, onClick }, indexNav) => (
            <Link
              key={indexNav}
              href={link ?? '#'}
              onClick={(e) => {
                if (isActive) e.preventDefault();
                if (onClick) onClick(e);
              }}
            >
              <div className={`py-3 sm:py-2 px-6 min-w-[5rem] capitalize ${(isActive) ? 'sm:rounded-lg text-primary bg-white max-sm:border-b-2 border-primary font-bold' : ''}`}>
                <div className={`pt-0.5 max-sm:text-sm`}>{label}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className='ml-auto pr-6'>{rightElement}</div>
      </div>
    </section>
  )
}
