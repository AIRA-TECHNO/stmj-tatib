'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Button from '@/externals/components/Button'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useEffect, useState } from 'react'
import Select from '@/externals/components/inputs/Select'
import { DownloadSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { cn } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'

export default function Page() {
  const { ScreenWidth } = useContextGlobal();
  const [DataTables, setDataTables] = useState<typeDataTable>({});
  const [SelectedRows, setSelectedRows] = useState<any>([]);



  /**
   * Use effect
   */
  useEffect(() => {
    setDataTables({
      data: [
        { id: 1, name: "Yuda Ismail", nisn: 20222, school_name: "SMKN 1 Solo" },
        { id: 2, name: "Yudi Akbar", nisn: 20223, school_name: "SMKN 1 Sambit" },
        { id: 3, name: "Yanti Rahayu", nisn: 20224, school_name: "SMKN 1 Jenangan" },
        { id: 4, name: "Rizky Maulana", nisn: 20225, school_name: "SMKN 2 Madiun" },
        { id: 5, name: "Siti Nurhaliza", nisn: 20226, school_name: "SMKN 1 Ponorogo" },
        { id: 6, name: "Dwi Ananda", nisn: 20227, school_name: "SMKN 3 Magetan" },
        { id: 7, name: "Agus Prasetyo", nisn: 20228, school_name: "SMKN 1 Balong" },
        { id: 8, name: "Intan Permata", nisn: 20229, school_name: "SMKN 1 Slahung" },
        { id: 9, name: "Fajar Nugroho", nisn: 20230, school_name: "SMKN 1 Kauman" },
        { id: 10, name: "Nia Ramadhani", nisn: 20231, school_name: "SMKN 1 Bungkal" },
        { id: 11, name: "Andi Setiawan", nisn: 20232, school_name: "SMKN 2 Ponorogo" },
        { id: 12, name: "Lia Marlina", nisn: 20233, school_name: "SMKN 1 Jetis" },
        { id: 13, name: "Bayu Saputra", nisn: 20234, school_name: "SMKN 1 Badegan" },
        { id: 14, name: "Salsa Amelia", nisn: 20235, school_name: "SMKN 1 Ngadirojo" },
        { id: 15, name: "Rian Hidayat", nisn: 20236, school_name: "SMKN 1 Sooko" },
        { id: 16, name: "Wulan Sari", nisn: 20237, school_name: "SMKN 1 Pulung" },
        { id: 17, name: "Teguh Ariyanto", nisn: 20238, school_name: "SMKN 2 Sambit" },
        { id: 18, name: "Maya Fitriani", nisn: 20239, school_name: "SMKN 1 Mlarak" },
        { id: 19, name: "Ilham Fauzi", nisn: 20240, school_name: "SMKN 1 Siman" },
        { id: 20, name: "Nadya Ayu", nisn: 20241, school_name: "SMKN 1 Sawoo" },
      ],
      paginate: { per_page: 5 }
    });
  }, []);



  /**
   * Render JSX
   */
  return (
    <>
      <HeaderApp
        className='sm:mt-2'
        rightElement={[
          <div className='flex' key="1">
            <Button varian={`btn-flat`} className='max-sm:text-xs font-semibold hover:text-primary'>
              <DownloadSimpleIcon weight='bold' className='text-base mb-[1px]' />
              <span>Export</span>
              <span className='max-sm:hidden'>Excel</span>
            </Button>
          </div>,
        ]}
      />
      <SubMenuNav navigations={[
        { label: 'Pelanggaran', isActive: true }, { label: 'Peraturan' }
      ]} />
      <section className="sm:pt-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-full xl:col-span-8">
            <div className="card border">
              <div className='card-body sm:py-6'>
                <Table
                  stateSelectedRows={[SelectedRows, setSelectedRows]}
                  // showAdvanceSearch={true}
                  actions={() => (["edit", "delete"])}
                  noNumber
                  prototypeTable={[
                    {
                      title: "nama", keyData: (data) => {
                        if (ScreenWidth >= 640) return data.name;
                        return (
                          <div className='py-1'>
                            <div className='text-base font-semibold'>{data.name}</div>
                            <div className='text-sm font-semibold text-gray-500'>{data.nisn}</div>
                            <div className='mt-2 text-sm'>{data.school_name}</div>
                          </div>
                        )
                      }
                    },
                    ...(ScreenWidth >= 640 ? [
                      { title: "NISN", keyData: "nisn" },
                      {
                        title: "sekolah",
                        keyData: "school_name",
                        advanceFilter: { name: '' }
                      },
                    ] : [])
                  ]}
                  stateDataTable={[DataTables, setDataTables]}
                  // noAdvanceFilter={true}
                  // noSearch
                  leftElement={<div>
                    <Button href='/tatib/panel/portofolio/form' className='btn-auto-floating'>
                      <PlusIcon weight='bold' className='text-sm' />
                      <span>Tambah Data</span>
                    </Button>
                    <div className={cn('card border mt-2 text-xs font-semibold p-0.5 opacity-0 transition-all ease-out duration-200 w-0', { 'opacity-100 w-auto': SelectedRows?.length })}>
                      <div className='flex items-center'>
                        <div className='text-sm pl-3 pr-2'>{SelectedRows.length} item terpilih : </div>
                        <div className='flex items-center'>
                          <div
                            className='flex items-center gap-1 py-1.5 px-4 rounded-md text-red-600 cursor-pointer hover:bg-red-500 hover:text-white'
                            onClick={() => setSelectedRows([])}
                          >
                            <TrashIcon weight="bold" />
                            <span>Hapus</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                  rightElement={<div className='sm:flex items-center gap-2 text-sm [&_.input-form]:h-10 [&_.input-form]:border-primary/70'>
                    <div className='min-w-[10rem] '>
                      <Select
                        noLabel={true}
                        placeholder="Filter Tahun Ajaran"
                        options={["2021-2022", "2022-2023"]}
                      />
                    </div>
                  </div>}
                />
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-span-4">
            <div className="card border">
              <div className="card-header">
                <div className="card-title">Chart Siswa Dengan Jumlah pelanggaran/Leaderboard</div>
                {/* <div className="card-title">Chart Peraturan Dengan Jumlah pelanggaran</div> */} {/* <-- ini ditaruh pada menu peraturan */}
              </div>
              <div className="card-body">
                <div>okok</div>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}