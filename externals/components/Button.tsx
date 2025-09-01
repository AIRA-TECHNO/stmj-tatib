'use client'

import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { cn } from "../utils/frontend";


export type typeButtonProps = {
  isLoading?: boolean;
  isResponsive?: boolean;
  href?: string;
  varian?: 'btn' | 'btn-flat' | 'btn-outline';
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

function WrapperButton({ children, href, ...params }: typeButtonProps) {
  if (href) {
    return (<Link href={href ?? ''} {...params as any}>{children}</Link>)
  } else {
    return (<button {...params}>{children}</button>)
  }
}

export default function Button({
  className,
  children,
  isLoading,
  disabled,
  isResponsive,
  varian = 'btn',
  ...props
}: (typeButtonProps)) {
  return (
    <WrapperButton
      className={cn(varian, { 'btn-loading': isLoading }, className)}
      {...props}
      disabled={isLoading || disabled}
    >{children}</WrapperButton>
  )
}