'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Button from '@/externals/components/Button'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, FloppyDiskIcon, NotePencilIcon, PencilSimpleIcon, PlusIcon, TrashSimpleIcon, UploadSimpleIcon, XIcon } from '@phosphor-icons/react'
import { useFormManager } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'
import Modal from '@/externals/components/popups/Modal'
import Form from '@/externals/components/Form'

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
              stateDataTable={[DataTable, setDataTable]}
              actions={[{ icon: <PencilSimpleIcon weight="bold" className='text-base' />, label: 'Edit' }, 'delete']}
              fmParams={fmParams}
              onClickRow={(dataRow) => {
                fmDetail.setValues(dataRow, true);
                fmDetail.setShow(true, true);
              }}
              prototypeTable={[
                {
                  title: "peraturan", keyData: (data) => {
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
                  { title: "poin", keyData: "point" },
                  { title: "sanksi", keyData: "punishment" },
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
        <Modal
          show={fmDetail.show} toHide={fmDetail.setShow}
          title={<>
            <div className='mr-auto capitalize'>detail peraturan</div>
            {/* here 2 */}
            {fmDetail.readOnly ? (<>
              <Button varian='btn-flat' className='p-1 h-auto hover:text-warning' onClick={() => fmDetail.setReadOnly(false)}>
                <NotePencilIcon weight='bold' className='text-base' />
                <div>Edit</div>
              </Button>
              <Button varian='btn-flat' className='p-1 h-auto hover:text-danger ml-1' onClick={() => DataTable.showConfirmDelete?.([fmDetail.defaultValue.current])}>
                <TrashSimpleIcon weight='bold' className='text-base' />
                <div>Hapus</div>
              </Button>
            </>) : (<>
              {fmDetail.values.id && (
                <Button varian='btn-flat' className='p-1 h-auto hover:text-danger' onClick={() => fmDetail.setReadOnly(true)}>
                  <XIcon weight='bold' className='text-base' />
                  <div>Batal</div>
                </Button>
              )}
              <Button varian='btn-flat' className='p-1 h-auto hover:text-success ml-1' onClick={() => fmDetail.formElement.current?.submit()}>
                <FloppyDiskIcon weight='bold' className='text-base' />
                <div>Simpan</div>
              </Button>
            </>)}
          </>}
        >
          <div className='px-4 pb-4'>
            <Form
              fm={fmDetail}
              fields={[
                { name: 'rule', label: 'peraturan yang dilanggar', parentProps: { className: 'lg:col-span-6' } },
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