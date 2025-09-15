import { cn } from "@/externals/utils/frontend";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction, useEffect, useRef } from "react";

type typeDropdownProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  justHidden?: boolean,
  show: boolean,
  toHide: Dispatch<SetStateAction<any | ((prev: any) => void)>>,
}


export default function Dropdown({
  justHidden,
  show,
  toHide,
  children,
  className,
  ref,
  ...props
}: typeDropdownProps) {
  const refDropDown = useRef<HTMLDivElement>(null);
  const eventAdded = useRef(false);



  /**
   * Use effect
   */
  useEffect(() => {
    function onClickOutSide(event: MouseEvent) {
      if (
        !refDropDown.current?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-identity='modal']")
      ) setTimeout(() => toHide(false), 300);
    }

    if (show && !eventAdded.current) {
      document.addEventListener("click", onClickOutSide);
      eventAdded.current = true;
    }

    return () => {
      document.removeEventListener("click", onClickOutSide);
      eventAdded.current = false;
    };
  }, [show]);



  /**
   * Render JSX
   */
  if (!(show || justHidden)) return null;
  return (
    <div
      {...props}
      ref={refDropDown}
      className={cn(
        `absolute card border shadow bg-white/90 backdrop-blur-xs duration-75`,
        show ? "opacity-100 z-20" : "opacity-0 z-[-1]",
        className
      )}
    >{children}</div>
  )
}