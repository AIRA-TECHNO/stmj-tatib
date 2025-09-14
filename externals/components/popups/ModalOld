'use client'

import { cn } from "@/externals/utils/frontend";
import { ReactNode, useEffect, useState } from "react";

type typeModalProps = {
  children?: ReactNode,
  show?: boolean,
  toHide: (isShow?: any) => any,
  justHidden?: boolean,
  className?: string,
}

export default function Modal({ children, show, toHide, justHidden, className }: typeModalProps) {
  const [IsDragging, setIsDragging] = useState(false);
  const [StartY, setStartY] = useState(0);
  const [TranslateY, setTranslateY] = useState<any>("100%");



  /**
   * Function handler
   */
  function onHide() {
    setIsDragging(false);
    setTranslateY("100%");
    setTimeout(() => toHide(false), 200);
  }



  /**
   * Use effect
   */
  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!IsDragging || StartY === null) return;
      const currentY = e.touches[0].clientY;
      const diffY = currentY - StartY;
      if (diffY > 0) setTranslateY(`${diffY}px`);
    };

    function onTouchEnd() {
      if (parseInt(TranslateY) < 120) {
        if (TranslateY != "100%") setTranslateY(0);
      } else {
        onHide();
      }
      setIsDragging(false);
      setStartY(0);
    };

    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [StartY, TranslateY]);


  useEffect(() => {
    if (show) {
      setTranslateY(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsDragging(false);
      setTranslateY("100%");
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [show])



  /**
   * Render JSX
   */
  if (!(show || justHidden)) return null;
  return (
    <div
      data-identity="modal"
      onClick={(e) => { if (e.target == e.currentTarget) onHide(); }}
      className={cn('fixed inset-0 z-20 flex bg-black/30 sm:overflow-auto', { hidden: !show })}
    >
      <div
        className={cn(
          "max-w-lg w-full mx-auto my-[2rem] max-sm:mt-[4rem] h-max",
          "transition-transform duration-200 ease-out touch-none",
          className
        )}
        style={{ transform: `translateY(${TranslateY})` }}
      >

        <div
          className="h-[2.25rem] pt-2 bg-white rounded-t-[2.25rem] sm:hidden"
          onTouchStart={(e) => {
            setStartY(e.touches[0].clientY);
            setIsDragging(true);
          }}
        >
          <div className="w-[6rem] h-2 mx-auto bg-black/30 rounded-full" />
        </div>

        <div className="card max-sm:h-[calc(100vh-6rem)] max-sm:overflow-auto max-sm:border-t">
          {children}
        </div>

      </div>
    </div>
  );
}
