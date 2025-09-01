'use client'

import { useContextGlobal } from '@/externals/contexts/ContextGlobal';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { cn } from '@/externals/utils/frontend';
import { BellIcon, CirclesFourIcon, UserCircleIcon } from '@phosphor-icons/react';
import Carousel from '@/externals/components/Corousel';
import { useState } from 'react';
import Modal from '@/externals/components/popups/Modal';
import Search from '@/externals/components/Search';
import IconMenu from './_partials/IconMenu';
import menuApps from '@/app/menuApps';


export default function Home() {
  // const router = useRouter();
  const { ScreenWidth } = useContextGlobal();
  const [ShowBottomSheet, setShowBottomSheet] = useState(false);


  return (
    <>
      <section className='py-6'>
        <div className="card">
          <div className="card-body">
            {/* <div className="flex items-center">
              <div className='grow'>
                <div className="text-3xl font-medium">{"Dwiki"}</div>
                <div className="mt-1 flex gap-1">
                  <span className="text-slate-500">{12878234}</span>
                  <span>|</span>
                  <span className="text-primary uppercase">{"Siswa"}</span>
                </div>
              </div>
              <div>
                <div className='bg-profile h-16'></div>
              </div>
            </div> */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 grow">
                <div className='bg-profile h-12'></div>
                <div className='grow'>
                  <div className="text-xl font-semibold mt-0.5">{"Dwiki"}</div>
                  <div className="flex gap-1 text-xs mt-0.5">
                    <span className="text-slate-500">{12878234}</span>
                    <span>|</span>
                    <span className="text-primary uppercase">{"Siswa"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="#" className='header-icon h-10 hovr:bg-slate-200 rounded-full aspect-square'>
                  <BellIcon className='text-[2rem]' />
                </Link>
                <Link href="/auth/panel/akun/1" className='header-icon h-10 hovr:bg-slate-200 rounded-full aspect-square'>
                  <UserCircleIcon className='text-[2.25rem]' />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='px-6'>
        {/* <div className='bg-gray-400 rounded-xl w-full aspect-video'></div> */}
        <Carousel items={[
          { background: "" },
          { background: "" }
        ]} />
      </section>
      <section className="py-6">
        <div className="card">
          <div className="card-body">
            <div className={cn(
              "grid gap-y-6",
              "grid-cols-3 min-[400px]:grid-cols-4 min-[480px]:grid-cols-5 min-[560px]:grid-cols-6"
            )}>
              {menuApps.map((menu, indexMenu) => {
                if (
                  (indexMenu < 3) ||
                  (indexMenu == 3 && ScreenWidth >= 400) ||
                  (indexMenu == 4 && ScreenWidth >= 480) ||
                  (indexMenu == 5 && ScreenWidth >= 560)
                ) {
                  return (<IconMenu key={indexMenu} {...menu} />);
                }
              })}
              {menuApps.map((menu, indexMenu) => {
                if (
                  (indexMenu < 2) ||
                  (indexMenu == 2 && ScreenWidth >= 400) ||
                  (indexMenu == 3 && ScreenWidth >= 480) ||
                  (indexMenu == 4 && ScreenWidth >= 560)
                ) {
                  return (<IconMenu key={indexMenu} {...menu} />);
                }
              })}
              <IconMenu
                icon={<CirclesFourIcon weight='regular' className='text-3xl sm:text-xl text-secondary' />}
                label='Lainnya' backround='bg-secondary/10'
                onClick={() => setShowBottomSheet(true)}
              />
            </div>
          </div>
        </div>
      </section>
      <Modal show={ShowBottomSheet} toHide={() => setShowBottomSheet(false)}>
        <div className='px-6 pt-4'>
          <Search className='rounded-full h-[2.75rem] px-6' />
        </div>
        <div className={cn(
          "grid gap-y-6 px-2 pt-6",
          "grid-cols-3 min-[400px]:grid-cols-4 min-[480px]:grid-cols-5 min-[560px]:grid-cols-6"
        )}>
          {menuApps.map((menu, indexMenu) => (<IconMenu key={indexMenu} {...menu} />))}
        </div>
      </Modal>
      {/* <section className="mt-16">
        <div className="card">
          <div className="card-body">
            <div className={cn(
              "grid gap-y-4",
              "grid-cols-3 min-[400px]:grid-cols-4 min-[480px]:grid-cols-5 min-[560px]:grid-cols-6"
            )}>
              {menuApps.map((menu, indexMenu) => (
                <Link key={indexMenu} href={menu.path ?? ''} className='text-center'>
                  <div className="flex">
                    <div className='m-auto'>{menu.icon}</div>
                  </div>
                  <div className='text-2xs mt-1'>{menu.label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-16">
        <div className="card">
          <div className="card-body">
            {menuApps.map((menu, indexMenu) => (
              <Link key={indexMenu} href={menu.path ?? ''}>
                <div className='w-14 inline-flex m-2'>
                  <div className='text-center m-auto'>
                    <div className="flex">
                      <div className='mx-auto'>{menu.icon}</div>
                    </div>
                    <div className='text-2xs mt-1'>{menu.label}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
      {/* <div className='fixed inset-0 z-20 flex bg-black/30 overflow-auto'>
        <div className={cn('max-w-lg w-full mx-auto mt-4 mb-16')}>
          <div className="card">
            {[...Array(100).keys()].map((res) => (
              <div key={res}>okok {res}</div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
}
