'use client'

import { cn } from "@/externals/utils/frontend";
import { X } from "@phosphor-icons/react";
import { ReactNode } from "react";



type typeFloatToolbarProps = {
  show?: boolean;
  toHide: () => any;
  className?: string;
  items?: {
    onClick?: () => any;
    className?: string;
    icon?: ReactNode;
    label?: ReactNode;
  }[];
}

export default function FloatToolbar({ show, toHide, className, items }: typeFloatToolbarProps) {

  return (<>
    {(show) && (
      <div className={cn(
        'pb-8 md:pb-12 fixed z-20 bottom-0 left-[50%]',
        'translate-x-[-50%]',
        { hidden: !show }, className
      )}>
        <div className="card flex items-center p-1 gap-1 text-sm">
          <div onClick={() => toHide()}
            className="flex items-center p-2 mr-2 border rounded-md cursor-pointer"
          >
            <X className="h-5 mt-[1px]" />
            <div className="mx-1">Tutup</div>
          </div>
          {items?.map((item, indexItem) => (
            <div key={indexItem}
              className={cn(
                "p-2 flex items-center cursor-pointer",
                item?.className
              )}
              onClick={() => { if (item.onClick) item.onClick() }}
            >
              {item?.icon}
              {item?.label}
            </div>
          ))}
        </div>
      </div>
    )}
  </>)
}