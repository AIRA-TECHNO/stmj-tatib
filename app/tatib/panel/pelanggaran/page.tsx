'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Button from '@/externals/components/Button'
import Table, { typeDataTable, typePrototypeTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { useFormManager } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'
import Modal from '@/externals/components/popups/Modal'
import Form from '@/externals/components/Form'
import { formatIndoDate } from '@/externals/utils/general'
import { toast } from 'react-toastify'

export default function Page() {
  const { ScreenWidth } = useContextGlobal();
  const [DataTable, setDataTable] = useState<typeDataTable>({});
  const fmParams = useFormManager();
  const fmDetail = useFormManager();


  /**
   * Render JSX
   */
  return (
    <>
      <HeaderApp
        className='border-none'
        rightElements={[
          {
            icon: <DownloadSimpleIcon weight='bold' className='text-base mb-[1px]' />,
            label: 'Export Excel',
          },
        ]}
      />
      <SubMenuNav
        className='sm:pt-[4rem] sm:w-[20rem]'
        navigations={[
          { label: 'pelanggaran', isActive: true },
          { label: 'peraturan', link: '/tatib/panel/peraturan' }
        ]}
      />
      <section className="sm:mt-2">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-full xl:col-span-8">
            <div className="card">
              <div className='card-body sm:py-4'>
                <Table
                  url='/tatib/api/student-violation'
                  stateDataTable={[DataTable, setDataTable]}
                  actions={['delete']}
                  fmParams={fmParams}
                  onClickRow={(dataRow) => {
                    fmDetail.setValues(dataRow, true);
                    fmDetail.setShow(true, true);
                  }}
                  prototypeTable={[
                    {
                      label: "nama", name: (data) => {
                        if (ScreenWidth >= 640) return data.name;
                        return (
                          <div>
                            <div className='text-base font-semibold'>{data.name}</div>
                            <div className='text-sm font-semibold text-gray-500'>{data.nisn}</div>
                            <div className='mt-2 text-sm'>{data.class_full_name}</div>
                          </div>
                        )
                      }
                    },
                    ...(ScreenWidth >= 640 ? [
                      { label: "kelas", name: "class_full_name" },
                      { label: "pelanggaran", name: (data) => (<>{data?.rule} <span className='text-danger text-xs font-semibold'>{`(-${data?.point})`}</span></>) },
                      { label: "tanggal", name: (data) => formatIndoDate(data.date) },
                    ] : []) as typePrototypeTable[]
                  ]}
                  leftElement={<div>
                    <Button onClick={() => fmDetail.setShow(true, false, true)} className='btn-sm btn-auto-floating'>
                      <PlusIcon weight='bold' className='text-sm' />
                      <span>pelanggaran baru</span>
                    </Button>
                  </div>}
                />
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-span-4">
            <div className="card overflow-auto">
              <div className="card-header">
                <div className="card-title">Chart Siswa Dengan Jumlah pelanggaran/Leaderboard</div>
              </div>
              <div className="card-body">
                <div className='h-[20rem] bg-gray-200'></div>
              </div>
              <div className="card-footer"></div>
            </div>
          </div>
        </div>
        <Modal fm={fmDetail} title={<div className='mr-auto capitalize'>detail pelanggaran</div>}>
          <div className='px-4 pb-4'>
            <Form
              actionApi={{
                url: '/tatib/api/student-violation', afterSubmit: (data) => {
                  toast.success(data.message);
                  DataTable.loadDataTable?.();
                  fmDetail.setValues(data?.data, true);
                  fmDetail.setReadOnly(true);
                }
              }}
              fm={fmDetail}
              fields={[
                {
                  name: 'student_x_user_id', label: 'siswa', type: 'select',
                  optionFromApi: {
                    url: '/tatib/api/user',
                    render: (data) => (data.map((op) => ({ label: op.name, value: op.id })))
                  },
                  parentProps: { className: 'lg:col-span-6' }
                },
                {
                  name: 'rule_school_id', label: 'peraturan yang dilanggar', type: 'select',
                  optionFromApi: {
                    url: '/tatib/api/rule-school',
                    render: (data) => (data.map((op) => ({ label: op.rule, value: op.id })))
                  },
                  parentProps: { className: 'lg:col-span-6' }
                },
                { name: 'date', label: 'tanggal', type: 'date' },
                { name: 'note', label: 'catatan', type: 'textarea' },
              ]}
              noFooter
            />
          </div>
        </Modal>
      </section>
    </>
  )
}