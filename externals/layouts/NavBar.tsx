'use client'

import menuApps from '@/app/menuApps';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react'

export default function NavBar({ forcedShow, leftElement, centerElement }: {
  forcedShow?: boolean;
  leftElement?: ReactNode
  centerElement?: ReactNode
}) {
  const pathNames = usePathname().split('/');

  return (
    <>
      {Boolean(forcedShow) && <div className='h-[6rem]' />}
      <div
        id='top-bar-simbah'
        className={`backdrop-blur-xs max-sm:bottom-0 sm:top-0 inset-x-0 ${forcedShow ? 'fixed z-[7]' : 'fixed sm:sticky z-[1]'} sm:border-b`}
        style={{ background: `#1f4345`, color: `#fff` }}
      // 295459 143f43 1f4345 <-- recomend
      // 193836 182c25 0f3533 0c2f2d
      >
        <div className={'flex items-center sm:px-4 h-[3.5rem] sm:h-[5.5rem]'}>
          <div className={`flex items-center justify-evenly max-sm:grow sm:gap-8 overflow-auto`}>
            {menuApps.map((menuApp, indexMenuApp) => (
              (menuApp.isHeaderItem) ? <Link
                key={indexMenuApp}
                href={menuApp.href ?? ''}
                className={`sm:border-b-4 text-center ${menuApp?.checkIsActive?.(pathNames) ? 'font-bold border-secondary/80' : 'text-contras-primary/80 border-transparent hover:border-secondary/80'}`}
              >
                <div className={`sm:hidden inline-block px-2 my-1 rounded-full ${menuApp?.checkIsActive?.(pathNames) ? 'bg-white/30 ' : ''}`}>
                  <div className='-my-'>{menuApp.icon}</div>
                </div>
                <div className='text-2xs max-sm:mt-[-0.4rem] font-roboto sm:text-lg'>{menuApp.label}</div>
              </Link> : null
            ))}
          </div>
          <div className='hidden lg:flex items-center ml-auto '>
            {/* <div className='mr-4'>
              <Image src={`/public/images/logo_vokasi.webp`} className='w-[14rem]' height={200} width={200} alt='Logo Vokasi' />
            </div> */}
            <div className='mr-6 flex items-center gap-4'>
              <Image src={`/public/images/main-logo.png`} className='w-[3.25rem]' height={200} width={200} alt='Logo SMKN 1 Jenangan' />
              <div>
                <div>SMKN 1 JENANGAN</div>
                <div className='text-sm tracking-[0.25rem] text-secondary'>STMJ UNGGUL</div>
              </div>
              {/* <Image src={`/public/images/main-logo.png`} className='w-[3.25rem]' height={200} width={200} alt='Logo SMKN 1 Jenangan' /> */}
            </div>
            {/* <div className='flex items-center gap-2'>
              <Image src={`/public/images/logo-simbah.png`} className='w-[3.5rem]' height={200} width={200} alt='Logo Simbah' />
              <div>
                <div className='text-lg tracking-[.7rem]'>SIMBAH</div>
                <div className='text-sm'>Praktis Terintegrasi</div>
              </div>
            </div> */}
          </div>
        </div>
      </div >
    </>
  )
}
