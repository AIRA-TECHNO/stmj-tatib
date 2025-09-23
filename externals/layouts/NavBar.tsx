'use client'

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({ forcedShow, menuApps }: {
  forcedShow?: boolean;
  menuApps: typeMenuApps;
}) {
  const pathNames = usePathname().split('/');

  return (
    <>
      {Boolean(forcedShow) && <div className='h-[5rem]' />}
      <div
        className={`max-sm:bottom-0 sm:top-0 inset-x-0 max-sm:border-t ${forcedShow ? 'fixed z-[7]' : 'fixed sm:sticky z-[1]'} sm:border-b sm:backdrop-blur-xs bg-white/90`}
      // style={{ background: `#1f4345`, color: `#fff` }}
      // 295459 143f43 1f4345 <-- recomend
      // 193836 182c25 0f3533 0c2f2d
      >
        <div className={'flex items-center h-[3.5rem] sm:h-[4rem] max-w-9xl mx-auto sm:px-6'}>
          <div className={`flex items-center justify-evenly max-sm:grow sm:gap-8 overflow-auto`}>
            {menuApps.map((menuApp, indexMenuApp) => (
              (menuApp.isHeaderItem) ? <Link
                key={indexMenuApp}
                href={menuApp.href ?? ''}
                className={`sm:border-b-4 sm:mt-2 text-center ${menuApp?.checkIsActive?.(pathNames) ? 'font-bold border-secondary/80 max-sm:text-primary' : 'border-transparent hover:border-secondary/80'}`}
              >
                <div className={`sm:hidden inline-block px-2 my-1 rounded-full ${menuApp?.checkIsActive?.(pathNames) ? 'bg-primary/20 ' : ''}`}>
                  <div className='-my-'>{menuApp.icon}</div>
                </div>
                <div className='text-2xs sm:text-base max-sm:mt-[-0.4rem] font-roboto'>{menuApp.label}</div>
              </Link> : null
            ))}
          </div>
          <div className='hidden lg:flex items-center ml-auto '>
            <div className='flex items-center gap-3'>
              <Image src={`/public/images/main-logo.png`} className='w-[2.75rem]' height={200} width={200} alt='Logo SMKN 1 Jenangan' />
              <div>
                <div className='font-semibold'>SMKN 1 JENANGAN</div>
                <div className='text-sm font-bold tracking-[0.25rem] text-secondary leading-3 mb-1'>STMJ UNGGUL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
