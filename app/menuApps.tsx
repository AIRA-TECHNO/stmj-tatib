import { HouseIcon } from "@phosphor-icons/react";

const menuApps: typeMenuApps = [
  { label: 'Utama' },
  {
    href: '/tatib/panel',
    label: 'Home',
    icon: (<HouseIcon weight='regular' className='text-[22px] sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: true,
    checkIsActive: (pathNames: string[]) => [undefined, '', 'akun'].includes(pathNames[3]),
  }
];

for (const modulePath of String(process.env.NEXT_PUBLIC_APP_MODULES).split(",")) {
  try {
    const { default: menus } = require(`@/app/${modulePath}/menuApp.tsx`);
    menuApps.push(...menus);
  } catch (err) { }
}

export default menuApps