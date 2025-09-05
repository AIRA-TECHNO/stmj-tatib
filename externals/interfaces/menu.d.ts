import { ReactNode } from "react";


declare global {
  type typeMenuApps = Array<{
    href?: string;
    label?: string;
    icon?: ReactNode;
    backroundColor?: string;
    isHeaderItem?: boolean;
    isSidebarItem?: boolean;
    type?: 'general' | 'personal';
    checkIsActive?: (pathNames: string[]) => boolean;
    others?: any;
  }>;
}
export { };