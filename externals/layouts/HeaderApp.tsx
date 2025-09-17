'use client'

import { cn, pathToBreadcumbItems } from '@/externals/utils/frontend';
import { ArrowLeftIcon, DotsThreeOutlineVerticalIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Fragment, isValidElement, ReactNode, useRef } from 'react'
import { UrlObject } from 'url';
import Button from '../components/Button';

export default function HeaderApp({ breadcumbs, rightElements, className }: {
  breadcumbs?: typeBreadcumbProps;
  rightElements?: Array<ReactNode | {
    icon?: ReactNode;
    label?: ReactNode;
    href?: string | UrlObject;
    onClick?: (event: MouseEvent) => any;
  }> | ReactNode;
  className?: string;
}) {
  const refDropDown = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const breadcumbItems = breadcumbs?.length ? breadcumbs : pathToBreadcumbItems(pathname);
  const lastItem = breadcumbItems?.slice(-1)?.[0];
  const prevItem = breadcumbItems?.slice(-2)?.[0];

  function onClickOutSide(event: MouseEvent) {
    if (!refDropDown.current?.contains(event.target as Node)) {
      setTimeout(() => {
        if (refDropDown.current) {
          refDropDown.current.style.removeProperty('z-index');
          refDropDown.current.style.removeProperty('opacity');
        }
      }, 300);
      document.removeEventListener('click', onClickOutSide);
    }
  }

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
        <div className='ml-auto lg:ml-12'>
          {isValidElement(rightElements) ? rightElements : (<>
            <div
              className='sm:hidden header-icon-square max-sm:mr-[-.75rem]'
              onClick={() => {
                if (!(refDropDown.current && refDropDown.current.style.zIndex != 'unset')) return;
                refDropDown.current.style.opacity = '100%';
                refDropDown.current.style.zIndex = 'unset';
                document.addEventListener('click', onClickOutSide);
              }}
            ><DotsThreeOutlineVerticalIcon weight='fill' className='text-lg' /></div>
            <div ref={refDropDown} className={cn(
              `right-4 sm:flex items-center gap-2 bg-white rounded-md transition-opacity`,
              `max-sm:absolute max-sm:border max-sm:divide-y max-sm:shadow max-sm:w-[11rem] max-sm:-mt-3 max-sm:opacity-0 max-sm:z-[-1]`
            )}>
              {(rightElements as any[]).map((rightElement, indexRightElement) => (
                isValidElement(rightElement) ? <Fragment key={indexRightElement}>{rightElement}</Fragment> : (
                  <Button
                    key={indexRightElement}
                    varian={`btn-flat`}
                    className='max-sm:text-2xs max-sm:gap-2 sm:px-2 px-3 font-semibold hover:text-primary max-sm:flex max-sm:w-full max-sm:justify-start max-sm:rounded-none'
                    onClick={rightElement.onClick}
                    href={rightElement.href}
                  >{rightElement.icon} {rightElement.label}</Button>
                )
              ))}
            </div>
          </>)}
        </div>
      </div>
    </header>
  )
}
