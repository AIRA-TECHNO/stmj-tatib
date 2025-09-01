'use client'

import { ReactNode } from "react"
import Modal from "./Modal"
import { Spinner } from "@phosphor-icons/react"
import { cn } from "@/externals/utils/frontend"


type typeConfirmProps = {
  question?: ReactNode,
  onApproved?: () => any,
  approvedLabel?: string,
  deniedLabel?: string,
  show: boolean,
  toHide: (isShow?: any) => any,
  isLoading?: boolean,
  className?: string,
}

export default function Confirm({
  question,
  onApproved,
  approvedLabel,
  deniedLabel,
  show,
  toHide,
  isLoading,
  className
}: typeConfirmProps) {
  if (!show) return null;
  return (
    <div
      data-identity="modal"
      onClick={(e) => { if (e.target == e.currentTarget) toHide(false); }}
      className='fixed inset-0 z-20 flex overflow-auto bg-black/30 pb-16 pt-2 md:pb-[8rem]'
    >
      <div className={cn('max-w-md w-full m-auto px-8', className)}>
        <div className={"card rounded-xl border bg-white/90 backdrop-blur-xs relative whitespace-normal overflow-hidden text-center"}>
          <div className="pt-10 pb-8 px-12">
            {question ?? <div className="text-lg font-medium">Apakah anda yakin ingin melakukan hal ini?</div>}
          </div>
          <div className="grid grid-cols-2 border-t border-gray-300 divide-x divide-gray-300 text-sm font-medium">
            <div className="py-4 cursor-pointer hover:bg-gray-100"
              onClick={onApproved}>
              {approvedLabel ?? 'YA'}
            </div>
            <div className="py-4 cursor-pointer text-danger hover:bg-gray-100"
              onClick={() => toHide(false)}>
              {deniedLabel ?? 'TIDAK'}
            </div>
          </div>
          {Boolean(isLoading) && (
            <div className="absolute inset-0 flex bg-white">
              <div className="m-auto flex items-center gap-1">
                <Spinner className="animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}