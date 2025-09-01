import { CrosshairIcon, ListStarIcon, MedalIcon, NotebookIcon, TrophyIcon } from "@phosphor-icons/react";


export default [
  {
    href: '/tatib/panel/portofolio',
    label: 'Portofolio Non Akademik',
    icon: (<TrophyIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'portofolio' == pathNames[3],
  },
  {
    href: '/tatib/panel/pelanggaran',
    label: 'Pelanggaran Siswa',
    icon: (<CrosshairIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'pelanggaran' == pathNames[3],
  },
  {
    href: '/tatib/panel/penghargaan',
    label: 'Penghargaan Siswa',
    icon: (<MedalIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
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
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'peraturan' == pathNames[3],
  },
  {
    href: '/tatib/panel/jenis-penghargaan',
    label: 'Jenis Penghargaan',
    icon: (<ListStarIcon weight='regular' className='text-3xl sm:text-xl' />),
    backroundColor: 'bg-sky-500/10',
    isSidebarItem: true,
    type: 'general',
    checkIsActive: (pathNames: string[]) => 'jenis-penghargaan' == pathNames[3],
  },
] as typeMenuApps