import Link from 'next/link'
import React, { MouseEvent, ReactNode } from 'react'
import { UrlObject } from 'url';

interface typeSubMenuNavProps {
  navigations: Array<{
    label: ReactNode;
    link?: string | UrlObject;
    onClick?: (event: MouseEvent) => any;
    isActive?: boolean
  }>;
  rightElement?: ReactNode
}
export default function SubMenuNav({ navigations, rightElement }: typeSubMenuNavProps) {
  return (
    <section>
      <div className="flex items-center border-b border-gray-300">
        <div className='flex items-center'>
          {navigations.map(({ label, isActive, link, onClick }, indexNav) => (
            <Link
              key={indexNav}
              href={link ?? '#'}
              onClick={(e) => {
                if (isActive) e.preventDefault();
                if (onClick) onClick(e);
              }}
            >
              <div className={(isActive) ? 'text-primary border-b-2 border-primary font-semibold' : 'font-medium'}>
                <div className={`pt-4 pb-3 px-6 min-w-[5rem] capitalize text-sm`}>
                  {label}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='ml-auto pr-6'>{rightElement}</div>
      </div>
    </section>
  )
}
