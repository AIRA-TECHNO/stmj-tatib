'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Button from '@/externals/components/Button'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, PencilSimpleIcon, PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useFormManager } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'
import Modal from '@/externals/components/popups/Modal'
import Form from '@/externals/components/Form'
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
          {
            icon: <UploadSimpleIcon weight='bold' className='text-base mb-[1px]' />,
            label: 'Import Excel',
          },
        ]}
      />
      <SubMenuNav navigations={[
        { label: 'pelanggaran', link: '/tatib/panel/pelanggaran' },
        { label: 'peraturan', link: '/tatib/panel/peraturan', isActive: true }
      ]} />
      <section className="sm:mt-2 max-w-7xl">
        <div className="card">
          <div className='card-body sm:py-4'>
            <Table
              url='/tatib/api/rule-school'
              stateDataTable={[DataTable, setDataTable]}
              actions={['delete']}
              fmParams={fmParams}
              onClickRow={(dataRow) => {
                fmDetail.setValues(dataRow, true);
                fmDetail.setShow(true, true);
              }}
              prototypeTable={[
                {
                  label: "peraturan", name: (data) => {
                    if (ScreenWidth >= 640) return data.rule;
                    return (
                      <div>
                        <div className='text-base font-semibold'>{data.rule}</div>
                        <div className='text-sm font-semibold text-gray-500'>{data.point}</div>
                        <div className='mt-2 text-sm'>{data.punishment}</div>
                      </div>
                    )
                  }
                },
                ...(ScreenWidth >= 640 ? [
                  { label: "poin", name: "point" },
                  { label: "sanksi", name: "punishment" },
                ] : [])
              ]}
              leftElement={<div>
                <Button onClick={() => fmDetail.setShow(true, false, true)} className='btn-sm btn-auto-floating'>
                  <PlusIcon weight='bold' className='text-sm' />
                  <span>peraturan baru</span>
                </Button>
              </div>}
            />
          </div>
        </div>
        <Modal fm={fmDetail} title={<div className='mr-auto capitalize'>detail peraturan</div>}>
          <div className='px-4 pb-4'>
            <Form
              actionApi={{
                url: '/tatib/api/rule-school', afterSubmit: (data) => {
                  toast.success(data.message);
                  DataTable.loadDataTable?.();
                  fmDetail.setValues(data?.data, true);
                  fmDetail.setReadOnly(true);
                }
              }}
              fm={fmDetail}
              fields={[
                { label: 'peraturan', name: 'rule', parentProps: { className: 'lg:col-span-6' } },
                { label: "poin", name: "point", type: 'number', parentProps: { className: 'lg:col-span-6' } },
                { label: "sanksi", name: "punishment", type: 'textarea' },
              ]}
              noFooter
            />
          </div>
        </Modal>
      </section>
    </>
  )
}