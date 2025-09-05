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
import InputCheck from '@/externals/components/inputs/InputCheck'

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
        { id: 1, rule: 'Membolos', point: 10 },
        { id: 2, rule: 'Berkelahi', point: 10 },
        { id: 3, rule: 'Membolos', point: 10 },
        { id: 4, rule: 'Membolos', point: 10 },
        { id: 5, rule: 'Membolos', point: 10 },
        { id: 6, rule: 'Membolos', point: 10 },
        { id: 7, rule: 'Membolos', point: 10 },
        { id: 8, rule: 'Membolos', point: 10 },
        { id: 9, rule: 'Membolos', point: 10 },
        { id: 10, rule: 'Membolos', point: 10 },
        { id: 11, rule: 'Membolos', point: 10 },
        { id: 12, rule: 'Membolos', point: 10 },
        { id: 13, rule: 'Membolos', point: 10 },
        { id: 14, rule: 'Membolos', point: 10 },
        { id: 15, rule: 'Membolos', point: 10 },
        { id: 16, rule: 'Membolos', point: 10 },
        { id: 17, rule: 'Membolos', point: 10 },
        { id: 18, rule: 'Membolos', point: 10 },
        { id: 19, rule: 'Membolos', point: 10 },
        { id: 20, rule: 'Membolos', point: 10 },
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
        rightElements={[
          <div className='flex' key="1">
            <Button varian={`btn-flat`} className='max-sm:text-xs font-semibold hover:text-primary'>
              <DownloadSimpleIcon weight='bold' className='text-base mb-[1px]' />
              <span>Export</span>
              <span className='max-sm:hidden'>Excel</span>
            </Button>
          </div>,
        ]}
      />
      <SubMenuNav navigations={[{ label: 'pelanggaran', link: '/tatib/panel/pelanggaran' }, { label: 'peraturan', isActive: true }]} />
      <section className="sm:pt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-full xl:col-span-8">
            <div className="card border">
              <div className='card-body sm:py-6'>
                <div className='flex sm:justify-end items-center sm:mb-4 max-sm:mt-4'>
                  <div className='min-w-[10rem] mr-2 text-sm'>
                    <InputCheck label="tampilkan peraturan nonaktif" />
                  </div>
                </div>
                <Table
                  stateSelectedRows={[SelectedRows, setSelectedRows]}
                  // showAdvanceSearch={true}
                  actions={() => (["edit", "delete"])}
                  noNumber
                  stateDataTable={[DataTables, setDataTables]}
                  // noAdvanceFilter={true}
                  // noSearch
                  leftElement={<div>
                    <Button href='/tatib/panel/portofolio/form' className='btn-sm btn-auto-floating'>
                      <PlusIcon weight='bold' className='text-sm' />
                      <span>Tambah Data</span>
                    </Button>
                    <div className='flex mt-2 text-xs font-semibold'>
                      <div className={`card border p-0.5 opacity-0 transition-all ease-out duration-200 w-0 ${SelectedRows?.length ? 'opacity-100 w-auto' : 'max-sm:hidden'}`}>
                        <div className='flex items-center'>
                          <div className='text-sm pl-3 pr-2'>{SelectedRows.length} item terpilih : </div>
                          <div className='flex items-center'>
                            <div
                              className='flex items-center gap-1 py-1.5 px-4 rounded-md text-red-600 cursor-pointer bg-red-100 hover:bg-red-500 hover:text-white'
                              onClick={() => setSelectedRows([])}
                            >
                              <TrashIcon weight="bold" />
                              <span>Hapus</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                  prototypeTable={[
                    {
                      title: "nama", keyData: (data) => {
                        if (ScreenWidth >= 640) return data.rule;
                        return (
                          <div className='py-1'>
                            <div className='text-base font-semibold'>{data.rule}</div>
                            <div className='text-sm font-semibold text-gray-500'>{data.point}</div>
                          </div>
                        )
                      }
                    },
                    ...(ScreenWidth >= 640 ? [
                      { title: "point", keyData: "point" },
                    ] : [])
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-span-4">
            <div className="card border overflow-auto">
              <div className="card-header">
                <div className="card-title">Chart Peraturan Dengan Jumlah pelanggaran</div>
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