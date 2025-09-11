'use client'

import { CaretRightIcon, CaretUpDownIcon, DotsNineIcon, HouseIcon } from '@phosphor-icons/react';
import { UserCircleIcon } from '@phosphor-icons/react/dist/ssr'

export default function TopBarSimbah() {
  return (
    <header className={`bg-primary/10 h-[2.5rem] text-sm flex items-center sm:px-4`}>
      <div className='flex items-center'>
        <div className='flex items-center'>
          <div className='h-[2rem] aspect-square rounded-full flex justify-center items-center cursor-pointer hover:bg-white/80 hover:text-secondary'>
            <HouseIcon className='text-xl mb-[1px]' weight='bold' />
          </div>
          <CaretRightIcon className='mt-[2px]' />
          <div className='mt-[2px] ml-1 tracking-widest font-medium font-roboto'>SiKAP</div>
        </div>
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <div className='h-[2rem] aspect-square rounded-full flex justify-center items-center cursor-pointer hover:bg-white/80 hover:text-secondary'>
          <DotsNineIcon className='text-2xl ml-[1px] mt-[1px]' weight='bold' />
        </div>
        <div className='flex items-center gap-1 hover:bg-white/80 rounded-full px-1 cursor-pointer'>
          <UserCircleIcon className='text-3xl mt-[2px]' />
          <div className='max-sm:hidden'>
            <div className='text-xs font-semibold leading-3 mb-[2px]'>Dwiki</div>
            <div className='text-xs leading-2'>guru@01992999</div>
          </div>
          <CaretUpDownIcon weight='bold' />
        </div>
      </div>
    </header>
  )
}
