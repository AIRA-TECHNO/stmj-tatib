'use client'

import { cn, pathToBreadcumbItems } from '@/externals/utils/frontend';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react'

export default function HeaderApp({ breadcumbs, rightElement, className }: {
  breadcumbs?: typeBreadcumbProps;
  rightElement?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const breadcumbItems = breadcumbs?.length ? breadcumbs : pathToBreadcumbItems(pathname);
  const lastItem = breadcumbItems?.slice(-1)?.[0];
  const prevItem = breadcumbItems?.slice(-2)?.[0];
  return (
    <header className={cn('max-sm:border-b max-sm:bg-white/90 max-sm:sticky top-0 z-[5] max-sm:backdrop-blur-xs', className)}>
      <div className='relative'>
        <Image
          src={`/public/images/top-hero.webp`}
          alt=''
          height={80000}
          width={20000}
          className='absolute z-[-1] right-[1rem] w-[500px] xl:w-[700px] max-lg:hidden'
        />
      </div>
      <div className={"grid sm:flex grid-cols-3 items-center text-nowrap px-4 sm:px-6 pt-2 pb-1 sm:pt-4 sm:pb-2"}>
        <div className='col-span-2 grid grid-cols-2 sm:flex items-center gap-2'>
          {Boolean(prevItem) && (
            <Link href={prevItem?.url} className={(!breadcumbs && (breadcumbItems?.length ?? 0) <= 2) ? 'sm:hidden' : ''}>
              <div className='header-icon-square max-sm:ml-[-.5rem]'>
                <ArrowLeftIcon className='text-2xl' />
              </div>
            </Link>
          )}
          <div className='capitalize font-roboto sm:ml-1'>
            <div className="hidden sm:flex items-center">
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
            <div className={'capitalize font-bold text-xl sm:text-3xl tracking-wide max-sm:text-center'}>{lastItem?.label ?? 'home'}</div>
          </div>
        </div>
        <div className='ml-auto lg:ml-12 flex items-center gap-2 max-sm:mr-[-1rem]'>{rightElement}</div>
      </div>
    </header>
  )
}
