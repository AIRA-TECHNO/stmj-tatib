import { CrosshairIcon, ListStarIcon, MedalIcon, NotebookIcon, TrophyIcon } from "@phosphor-icons/react";


export default [
  {
    href: '/tatib/panel/portofolio-non-akademik',
    label: 'Portofolio Siswa',
    icon: (<TrophyIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'portofolio-non-akademik' == pathNames[3],
  },
  {
    href: '/tatib/panel/pelanggaran',
    label: 'Pelanggaran',
    icon: (<CrosshairIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'pelanggaran' == pathNames[3],
  },
  {
    href: '/tatib/panel/penghargaan',
    label: 'Penghargaan',
    icon: (<MedalIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'penghargaan' == pathNames[3],
  },
  {
    label: "Master Data",
    type: 'general',
  },
  {
    href: '/tatib/panel/peraturan',
    label: 'Peraturan Sekolah',
    icon: (<NotebookIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: false,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'peraturan' == pathNames[3],
  },
  {
    href: '/tatib/panel/jenis-penghargaan',
    label: 'Jenis Penghargaan',
    icon: (<ListStarIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    isHeaderItem: false,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'jenis-penghargaan' == pathNames[3],
  },
] as typeMenuApps