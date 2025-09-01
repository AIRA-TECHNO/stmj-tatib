'use client'

import { cn, pathToBreadcumbItems } from '@/externals/utils/frontend';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react'

export type typeRightElements = Array<ReactNode>

export default function HeaderApp({ breadcumbs, rightElements }: {
  breadcumbs?: typeBreadcumbProps;
  rightElements?: typeRightElements;
}) {
  const pathname = usePathname();
  const breadcumbItems = breadcumbs?.length ? breadcumbs : pathToBreadcumbItems(pathname);
  const lastItem = breadcumbItems?.slice(-1)?.[0];
  const prevItem = breadcumbItems?.slice(-2)?.[0];
  return (
    <header className={cn(
      "grid grid-cols-3 items-center text-nowrap",
      "px-4 sm:px-6 pt-3 pb-2 sm:pt-4 sm:pb-2 max-sm:border-b sticky top-0 z-5 max-sm:bg-white/90 backdrop-blur-xs"
    )}>
      <div className='col-span-2 grid grid-cols-2 sm:flex items-center gap-2'>
        {Boolean(prevItem) && (
          <Link href={prevItem?.url} className={(!breadcumbs && (breadcumbItems?.length ?? 0) <= 2) ? 'sm:hidden' : ''}>
            <div className='header-icon-square max-sm:ml-[-.5rem]'>
              <ArrowLeftIcon className='text-2xl' />
            </div>
          </Link>
        )}
        <div className='capitalize font-roboto sm:ml-1'>
          <div className="hidden sm:flex items-center text-sm mb-1">
            {breadcumbItems?.map((breadcumbItem, indexBreadcumbItem) => (
              <div key={indexBreadcumbItem}>
                {((indexBreadcumbItem + 1) < breadcumbItems.length) ? (
                  <>
                    <Link href={breadcumbItem.url}>{breadcumbItem?.label}</Link>
                    <span className='mx-1'>/</span>
                  </>
                ) : (
                  <div>{breadcumbItem?.label}</div>
                )}
              </div>
            ))}
          </div>
          <div className={'capitalize font-bold text-xl sm:text-[22px] tracking-wide max-sm:text-center'}>{lastItem?.label ?? 'home'}</div>
        </div>
      </div>
      <div className='ml-auto flex items-center gap-2 max-sm:mr-[-1rem]'>{rightElements}</div>
    </header >
  )
}
