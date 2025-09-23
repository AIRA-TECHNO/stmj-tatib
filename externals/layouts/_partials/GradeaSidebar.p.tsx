'use client'

import React, { useEffect, useRef, useState } from 'react'
import { CaretUpDownIcon, ClipboardTextIcon, DatabaseIcon, GearIcon, GraduationCapIcon, MagnifyingGlassIcon, SidebarSimpleIcon, SquaresFourIcon } from '@phosphor-icons/react';
import { cn, useFormManager } from '@/externals/utils/frontend';
import Link from 'next/link';
import Search from '@/externals/components/Search';
// import RadioSwitch from '@/externals/components/inputs/RadioSwitch';
import { usePathname } from 'next/navigation';
import '@/externals/styles/src/panel_headerless.css'
import Dropdown from '@/externals/components/popups/Dropdown';
import Image from 'next/image';



export default function GradeaSidebar({ sidebarItems, hideOnCollapse }: {
  sidebarItems: typeMenuApps;
  hideOnCollapse?: boolean;
}) {
  const pathName = usePathname();
  const splitedPathNames = pathName.split('/');
  const refSearchMenu = useRef<any>(null);
  const [IsShowSidebar, setIsShowSidebar] = useState(false);
  const [IsShowSubApp, setIsShowSubApp] = useState(false);
  const [IsShowSearchMenu, setIsShowSearchMenu] = useState(false);
  const [IsShowProfile, setIsShowProfile] = useState(false);
  const fm = useFormManager();



  /**
   * Use effect
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cacheIsSidebarShow = localStorage.getItem('isSidebarShow');
      if (cacheIsSidebarShow && !['false', '0', 'undefined', 'null'].includes(cacheIsSidebarShow)) setIsShowSidebar(true);

      if (!(window as any).gradea) (window as any).gradea = {};
      if (!(window as any).gradea?.toggleSidebar) {
        (window as any).gradea.toggleSidebar = (forcedValue?: boolean) => {
          setIsShowSidebar((prev) => {
            if (prev == forcedValue) return prev;
            const newValue = forcedValue ?? !prev;
            if (newValue) {
              localStorage.setItem('isSidebarShow', 'true');
            } else {
              localStorage.removeItem('isSidebarShow');
            }
            return newValue;
          });
        }
      }
    }
    return () => { delete (window as any).gradea?.toggleSidebar; }
  }, []);

  useEffect(() => {
    fm.setValue('search', '')
    setIsShowSearchMenu(false)
  }, [pathName])




  /**
   * Render JSX
   */
  return (
    <>
      {!hideOnCollapse && (<div className={cn('max-sm:hidden w-[4rem] transition-all duration-300 ease-in-out', { 'xl:w-[17rem]': IsShowSidebar })} />)}
      <div className={cn('inset-0 bg-black/20 z-[7]', { 'fixed': IsShowSidebar && hideOnCollapse, 'max-xl:fixed': IsShowSidebar })} onClick={() => (window as any).gradea.toggleSidebar()} />
      <aside id='sidebar' className={cn(
        "fixed inset-y-0 z-10 bg-primary text-contras-primary",
        "transition-all duration-300 ease-in-out w-[4rem]",
        IsShowSidebar ? 'sidebar-active' : `[&:not(:hover)_.sidebar-search-menu]:text-transparent fixed ${hideOnCollapse ? '-ml-[4rem]' : 'sidebar-active-on-hover'}`
      )}>
        <div className='h-full mx-[2px] flex flex-col'>
          <div className='sidebar-header'>
            <div className='flex p-2'>
              <div
                className='w-[2.5rem] aspect-square flex rounded-md cursor-pointer hover:bg-white/10 mr-auto'
                onClick={() => (window as any).gradea.toggleSidebar()}
              >
                <SidebarSimpleIcon className='text-xl m-auto' />
              </div>
              <div
                className={'flex rounded-lg sidebar-config-icon'}
                onClick={() => {
                  setIsShowSearchMenu(true);
                  refSearchMenu.current?.focus?.();
                }}
              ><MagnifyingGlassIcon className='text-xl m-auto' /></div>
              <div>
                <div className={'flex rounded-lg sidebar-config-icon'} onClick={() => setIsShowSubApp(true)}>
                  <SquaresFourIcon className='text-xl m-auto' />
                </div>
                <Dropdown show={IsShowSubApp} toHide={setIsShowSubApp} className='text-black bg-white w-[15rem] right-2'>
                  <div className="grid grid-cols-3 gap-2 px-2 pt-2 pb-4 text-center">
                    <a href='https://datainduk.smkn1jenpo.sch.id' className="rounded-xl py-2 flex hover:bg-blue-500/10 text-blue-500">
                      <div className='m-auto'>
                        <DatabaseIcon className='text-2xl mx-auto' />
                        <div className="text-2xs mt-1">Data Induk</div>
                      </div>
                    </a>
                    <a href='https://rapor.smkn1jenpo.sch.id' className="rounded-xl py-2 flex hover:bg-primary/10 text-primary">
                      <div className='m-auto'>
                        <GraduationCapIcon className='text-2xl mx-auto' />
                        <div className="text-2xs mt-1">E-Rapot</div>
                      </div>
                    </a>
                    <div className="rounded-xl py-2 flex bg-green-500/10 text-green-500">
                      <div className='m-auto'>
                        <ClipboardTextIcon className='text-2xl mx-auto' />
                        <div className="text-2xs mt-1">SiJurnal</div>
                      </div>
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>

            <div>
              <div className={"pt-2 pb-4 flex items-center gap-3 sidebar-brand-section"}>
                <div className={`sidebar-brand-logo`} style={{ backgroundImage: `URL(/public/images/main-logo.png)` }} />
                <div className="sidebar-hide-on-collapse">
                  <div className="text-base tracking-[0.075em]">SMKN 1 JENANGAN</div>
                  <div className="font-light text-2xs mt-1">SEKOLAH PUSAT KEUNGGULAN</div>
                </div>
              </div>
              {/* <div className='px-2.5 pb-2'>
                <RadioSwitch
                  className='capitalize bg-white/10 text-white h-[2.25rem] text-xs tracking-wider font-medium'
                  options={["personal", "general"]}
                  name='type_menu'
                  fm={fm}
                  isSmall={!IsShowSidebar}
                />
              </div> */}
              <div className={cn(
                `px-2.5 [&>div>div]:ml-[-1.9rem] sidebar-search-menu transition-[height] duration-300 opacity-0 h-0`,
                IsShowSearchMenu ? 'opacity-100 h-12' : 'w-0 -ml-[100%]'
              )}>
                <Search
                  ref={refSearchMenu}
                  className='bg-white/20 border-none'
                  placeholder={'Cari menu...'}
                  delay={0}
                  onFocus={() => { if (!IsShowSidebar) { (window as any)?.gradea?.toggleSidebar?.(true) } }}
                  onSubmit={(keyword, field) => {
                    if (!IsShowSidebar) field?.focus();
                    fm.setValue('search', keyword.toLowerCase())
                  }}
                  onBlur={(event) => { if (!event.target.value) setIsShowSearchMenu(false) }}
                />
              </div>
            </div>
          </div>


          <div className='text-contras-primary/80 overflow-auto scrollbar-mini grow'>
            {sidebarItems?.map((sidebarItem, indexSidebarItem) => {
              if (
                !sidebarItem
                || (!String(sidebarItem?.label).toLowerCase().includes(fm.values?.search ?? '') && sidebarItem.href)
                // || (sidebarItem?.type && sidebarItem?.type != fm.values?.type_menu)
              ) return null;
              const isActive = sidebarItem.checkIsActive?.(splitedPathNames);
              if (!sidebarItem.href) {
                return (
                  <div key={indexSidebarItem} className={`mx-5 ${indexSidebarItem ? 'pt-6 h-[2.5rem]' : 'pt-2 h-[1.5rem]'}`}>
                    <div className='text-xs text-white/50 font-bold sidebar-hide-on-collapse'>{sidebarItem.label}</div>
                  </div>
                )
              }
              return (
                <div key={indexSidebarItem} className={`rounded-xl mx-2 pt-2`}>
                  <Link
                    href={sidebarItem?.href ?? ''}
                    className={cn(
                      'flex items-center rounded-md cursor-pointer capitalize duration-200 h-[2.25rem] text-sm sidebar-link',
                      { 'sidebar-link-active': isActive },
                    )}
                  >
                    <div className='w-[2.5rem] flex items-center justify-center'>{sidebarItem?.icon || '-'}</div>
                    <div className="capitalize duration-300 transition-[width] sidebar-hide-on-collapse">{sidebarItem?.label ?? ''}</div>
                  </Link>
                </div>
              )
            })}
          </div>


          <div className='pt-2'>
            <div className='flex items-center gap-2 rounded-lg py-4 mx-2 duration-300 transition-all sidebar-user'>
              <div className='bg-profile border border-black/20 h-[2.5rem]'></div>
              <div className="grow sidebar-hide-on-collapse">
                <div className="flex items-center">
                  <div className='pt-1'>
                    <div className='text-sm mb-0.5'>Ahmad Nasir</div>
                    <div className='text-2xs font-extralight'>91201399249329</div>
                  </div>
                  <div className='ml-auto relative'>
                    <div
                      className={`rounded-md h-[1.75rem] aspect-square flex cursor-pointer hover:bg-black/20 ${IsShowProfile ? 'bg-black/20' : ''}`}
                      onClick={() => setIsShowProfile(true)}
                    >
                      <CaretUpDownIcon weight='bold' className='m-auto' />
                    </div>
                    <Dropdown show={IsShowProfile} toHide={setIsShowProfile} className='right-[-.75rem] bottom-[calc(100%+2rem)] text-black w-[15.75rem]'>
                      <div className='py-2 divide-y'>
                        {[...Array(4)].map((res, index) => (
                          <div
                            key={index}
                            className='flex items-center gap-2 pl-4 pr-2 py-2 cursor-pointer hover:bg-slate-300/50'
                            onClick={(event) => {
                              if (!event.currentTarget.querySelector('a')?.contains(event.target as Node)) {
                                if (confirm('Ganit ke akun X')) window.location.reload();
                              }
                            }}
                          >
                            <div className='bg-profile h-[3rem]'></div>
                            <div className='pt-1'>
                              <div className='text-sm font-medium mb-0.5'>Ahmad Nasir</div>
                              <div className='text-xs font-light'>91201399249329</div>
                            </div>
                            <div className='ml-auto'>
                              <Link
                                href={`/auth/panel/akun/${index}`}
                                className='flex hover:bg-primary/20 hover:text-primary rounded-md h-[2rem] aspect-square'
                                onClick={() => setIsShowProfile(false)}
                              >
                                <GearIcon className='text-lg m-auto' />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
            <div className='pt-4 pb-6 flex items-center justify-center gap-2'>
              <Image src="/public/images/logo-simbah.png" alt='' height={40} width={35} />
              <div className='sidebar-hide-on-collapse -mr-[6.5rem]'>
                <div className='text-sm tracking-widest'>
                  <span>SiJurnal</span>
                  <span className='text-3xs ml-1'>V1.0</span>
                </div>
                <div className='text-3xs'>All Reserved SIMBAH</div>
              </div>
            </div>
          </div>
        </div >
      </aside>
    </>
  )
}