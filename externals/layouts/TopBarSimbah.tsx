'use client'

import { CaretDownIcon, ListIcon, PowerIcon, UserCircleIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import React, { useEffect } from 'react'

export default function TopBarSimbah({ forcedShow }: { forcedShow?: boolean }) {

  useEffect(() => {
    setTimeout(() => {
      const sidebarElement = document.querySelector('#sidebar') as (HTMLElement | null);
      if (sidebarElement && forcedShow) {
        sidebarElement.style.top = '64px';
        sidebarElement.style.paddingTop = '1rem';
        document.querySelectorAll('#sidebar .sidebar-header')?.forEach((hideElement: any) => hideElement.style.display = 'none');
      } else {
        let iteration = 0;
        let timeout = setInterval(() => {
          iteration++;
          const sidebarElement = document.querySelector('#sidebar') as (HTMLElement | null);
          if (forcedShow) {
            if (sidebarElement) {
              sidebarElement.style.top = '64px';
              sidebarElement.style.paddingTop = '1rem';
            }
            document.querySelectorAll('#sidebar .sidebar-header')?.forEach((hideElement: any) => hideElement.style.display = 'none');
          }
          if (sidebarElement || (iteration >= (60 * 5))) clearInterval(timeout);
        }, 1000);
      }
    }, 0);
  }, []);

  return (
    <>
      {Boolean(forcedShow) && <div className='h-16' />}
      <div className={`bg-white/90 backdrop-blur-xs grid grid-cols-12 border-b items-center h-16 px-3 top-0 inset-x-0 z-[7] ${forcedShow ? 'fixed' : 'sticky'}`}>
        <div className='col-span-5'>
          <div className='flex items-center'>
            <div
              id='btn-toggle-sidebar'
              className='header-icon-square'
              onClick={() => ((window as any)?.gradea?.toggleSidebar?.())}
            >
              <ListIcon className='text-xl m-auto' />
            </div>
            <div className="hidden lg:flex items-center gap-2 px-2 font-medium">
              <div className={`bg-profile h-[2rem]`} style={{ backgroundImage: `URL(/public/images/main-logo.png)` }} />
              <div className="text-sm">SMKN 1 JENANGAN</div>
            </div>
          </div>
        </div>
        <div className='col-span-2'>
          {/* <div className='flex justify-center items-center gap-3 py-4 text-lg tracking-wider'> */}
          <div className='hidden min-[32rem]:flex justify-center items-center gap-2 text-lg tracking-widest font-medium'>
            <Image src={`/public/images/logo-simbah.png`} width={100} height={100} className='w-[2.5rem]' alt='' />
            <div>SIMBAH</div>
            <div>•</div>
            <div>SIKAP</div>
          </div>
        </div>
        <div className='col-span-5'>
          <div className='flex justify-end'>
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={(event) => {
                  const cardProfile = event.currentTarget.nextElementSibling as HTMLElement | null;
                  if (cardProfile) {
                    cardProfile.style.display = 'block';
                    if (!(window as any)?.gradea?.handleClickProfile) {
                      if (!(window as any)?.gradea) (window as any).gradea = {};
                      (window as any).gradea.handleClickProfile = (e: MouseEvent) => {
                        if (!cardProfile.contains(e.target as Node)) {
                          cardProfile.style.display = 'none';
                          (document as any).removeEventListIconener('click', (window as any)?.gradea?.handleClickProfile);
                        }
                      }
                    }
                    (document as any).addEventListIconener('click', (window as any)?.gradea?.handleClickProfile);
                  }
                }}
              >
                <UserCircleIcon className="text-3xl" />
                <div className="text-sm font-medium max-sm:hidden max-w-sm truncate">Dwiki I. P. M</div>
                <CaretDownIcon className='-mt-[2px]' />
              </div>
              <div
                id='topbar-card-profile'
                className="absolute z-50 bg-white border rounded-lg overflow-hidden w-xs right-0 text-center"
                style={{ display: 'none' }}
              >
                <div className="py-4">
                  <UserCircleIcon className='text-[4.5rem] mx-auto' />
                  <div className="text-lg truncate mt-1">Dwiki I. P. M</div>
                  <div className="text-xs text-gray-600 mt-1">Admin</div>
                </div>
                <div className="py-3 border-t cursor-pointer text-red-500 hover:bg-red-500 hover:text-white">
                  <div className="flex items-center justify-center gap-1">
                    <PowerIcon weight='bold' />
                    <span>Logout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
