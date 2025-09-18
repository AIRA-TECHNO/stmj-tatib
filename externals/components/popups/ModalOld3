'use client'

import { cn, useFormManager } from "@/externals/utils/frontend";
import { FloppyDiskIcon, NotePencilIcon, TrashSimpleIcon, XIcon } from "@phosphor-icons/react";
import { ReactNode, useEffect, useRef } from "react";
import Button from "../Button";

type typeModalProps = {
  children?: ReactNode;
  show?: boolean;
  toHide?: (isShow?: any) => any;
  justHidden?: boolean;
  className?: string;
  title?: ReactNode;
  noHeader?: boolean;
  fm?: ReturnType<typeof useFormManager>;
  noDelete?: boolean;
  noSubmit?: boolean;
  noEdit?: boolean;
}

export default function Modal({ children, show, toHide, justHidden, className, title, noHeader, fm, noDelete, noEdit, noSubmit }: typeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  if (show == undefined && fm?.show != undefined) show = fm?.show;



  /**
   * Function handler
   */
  function onHide() {
    if (!modalRef.current) return;
    isDragging.current = false;
    modalRef.current.style.transform = `translateY(100%)`;
    setTimeout(() => {
      toHide?.(false);
      fm?.setShow?.(false);
    }, 200);
  }



  /**
   * Use effect
   */
  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!isDragging.current) return;
      currentY.current = e.touches[0].clientY;
      const diffY = currentY.current - startY.current;
      if (diffY > 0 && modalRef.current) {
        modalRef.current.style.transform = `translateY(${diffY}px)`;
      }
    }

    function onTouchEnd() {
      if (!modalRef.current) return;
      const diffY = currentY.current - startY.current;
      if (diffY < 240) modalRef.current.style.transform = `translateY(0)`;
      else onHide();
      isDragging.current = false;
      startY.current = 0;
      currentY.current = 0;
    }

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    if (modalRef.current) {
      if (show) {
        modalRef.current.style.transform = `translateY(0)`;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        modalRef.current.style.transform = `translateY(100%)`;
      }
    }

    return () => { document.body.style.overflow = ''; };
  }, [show]);



  /**
   * Render JSX
   */
  if (!(show || justHidden)) return null;
  return (
    <div
      onClick={(e) => { if (e.target == e.currentTarget) onHide(); }}
      className={cn('fixed inset-0 z-20 flex bg-black/30 sm:overflow-auto sm:px-2', { hidden: !show })}
    >
      <div
        ref={modalRef}
        className={cn(
          "max-w-2xl w-full mx-auto sm:my-[2rem] max-sm:mt-[4rem] h-max",
          "transition-transform duration-200 ease-out touch-none sm:transform-[translateY(0)]!",
          "card max-sm:h-[calc(100vh-4rem)] max-sm:rounded-t-2xl max-sm:overflow-auto",
          className
        )}
      >
        <div className="sm:opacity-0 py-2 sm:py-1" onTouchStart={(e) => {
          startY.current = e.touches[0].clientY;
          currentY.current = startY.current;
          isDragging.current = true;
        }}><div className="w-[3rem] h-1 mx-auto bg-gray-400 rounded-full" /></div>
        {!noHeader && (
          <div className="flex items-center px-4 pb-4 sm:pb-2 border-b font-bold text-xl">
            <XIcon weight="bold" className="text-xl cursor-pointer mr-2" onClick={onHide} />
            {title}
            {!!fm && (fm.readOnly ? (<>
              {!noEdit && (
                <Button varian='btn-flat' className='p-1 h-auto hover:text-warning' onClick={() => fm.setReadOnly(false)}>
                  <NotePencilIcon weight='bold' className='text-base' />
                  <div>Edit</div>
                </Button>
              )}
              {!noDelete && (
                <Button varian='btn-flat' className='p-1 h-auto hover:text-danger ml-1' onClick={() => fm.setConfirmDelete([fm.values])}>
                  <TrashSimpleIcon weight='bold' className='text-base' />
                  <div>Hapus</div>
                </Button>
              )}
            </>) : (<>
              {fm.values.id && (
                <Button varian='btn-flat' className='p-1 h-auto hover:text-danger' onClick={() => fm.setReadOnly(true)}>
                  <XIcon weight='bold' className='text-base' />
                  <div>Batal</div>
                </Button>
              )}
              {!noSubmit && (
                <Button varian='btn-flat' className='p-1 h-auto hover:text-success ml-1' onClick={() => fm.btnSubmit.current?.click()}>
                  <FloppyDiskIcon weight='bold' className='text-base' />
                  <div>Simpan</div>
                </Button>
              )}
            </>))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
