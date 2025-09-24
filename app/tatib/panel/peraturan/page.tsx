'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, PlusIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { api, downloadFile, onSubmitNormal, useFormManager } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'
import Modal from '@/externals/components/popups/Modal'
import Form from '@/externals/components/Form'
import { toast } from 'react-toastify'
import InputFileDropZone from '@/externals/components/inputs/InputFile/InputFileDropZone'
import Button from '@/externals/components/Button'
import { usePathname } from 'next/navigation'
import menuApp from '../../menuApp'
import { checkAccess } from '@/externals/utils/general'
import Loading from '@/externals/components/Loading'

export default function Page() {
  const { ScreenWidth, UserAuthed } = useContextGlobal();
  const pathName = usePathname();
  const [DataTable, setDataTable] = useState<typeDataTable>({});
  const fmParams = useFormManager();
  const fmDetail = useFormManager();
  const fmExport = useFormManager();
  const fmImport = useFormManager();



  /**
   * Default RBAC
   */
  const featureCodes = menuApp.find((ma) => ma.href == pathName)?.featureCodes ?? [];
  const isFullAccess = checkAccess(featureCodes.filter(Boolean).map((fc) => `${fc}>=2`), UserAuthed.roles);



  /**
   * Function handler
   */
  function onExport(isMaster?: boolean) {
    fmExport.setStatusCode(202);
    api({
      url: '/tatib/api/rule-school/excel/export',
      objParams: { ...(fmParams.values), ...(fmExport.values), isMaster }
    }).then(async (res) => {
      fmExport.setStatusCode(res.status);
      if (res.status == 200) downloadFile(await res.blob(), `Peraturan Sekolah.xlsx`);
    });
  }



  /**
   * Render JSX
   */
  if (!UserAuthed?.id) return (<Loading />);
  return (
    <>
      <HeaderApp
        className='border-none'
        rightElements={[
          {
            icon: <DownloadSimpleIcon weight='bold' className='text-base mb-[1px]' />,
            label: 'export excel',
            onClick: () => fmExport.setShow(true)
          },
          {
            icon: <UploadSimpleIcon weight='bold' className='text-base mb-[1px]' />,
            label: 'import excel',
            onClick: () => fmImport.setShow(true),
            hide: !isFullAccess
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
              actions={isFullAccess ? ['delete'] : []}
              fmParams={fmParams}
              onClickRow={(dataRow) => {
                fmDetail.setValues(dataRow, true);
                fmDetail.setShow(true, true);
              }}
              prototypeTable={[
                {
                  label: "peraturan", name: (data) => {
                    if (ScreenWidth >= 640) return <span>{data.rule}</span>;
                    return (
                      <div>
                        <div className='text-base font-semibold'>{data.rule}</div>
                        <div className='text-sm font-semibold text-gray-500'>{data.point}</div>
                        <div className='mt-2 text-sm'>{data.punishment}</div>
                      </div>
                    )
                  }
                },
                { label: "poin", name: "point", hide: ScreenWidth < 640 },
                { label: "sanksi", name: "punishment", hide: ScreenWidth < 640 }
              ]}
              topElements={[
                ...(isFullAccess ? [(<div className='lg:order-2 lg:ml-auto'>
                  <div onClick={() => fmDetail.setShow(true, false, true)} className='btn btn-auto-floating'>
                    <PlusIcon weight='bold' className='text-sm' />
                    <span>peraturan baru</span>
                  </div>
                </div>)] : []),
                { filter: { show: true }, search: { show: true }, className: 'lg:order-1' }, // [&_.dropdown-filter]:right-0
              ]}
            />
          </div>
        </div>
        <Modal fm={fmDetail} noEdit={!isFullAccess} noDelete={!isFullAccess} title={<div className='mr-auto capitalize'>{fmDetail.values?.id ? 'detail' : 'tambah'} peraturan</div>}>
          <div className='px-4 pb-4'>
            <Form
              actionApi={{
                url: '/tatib/api/rule-school', afterDelete: DataTable.loadDataTable, afterSubmit: (data) => {
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
      <Modal fm={fmImport} btnClose noSubmit className='whitespace-normal max-w-xl'>
        <form className='p-4' onSubmit={(e) => onSubmitNormal(e, fmImport, {
          url: '/tatib/api/rule-school/excel/import', afterSubmit: (data) => {
            toast.success(data.message);
            fmDetail.setShow(false);
          }
        })}>
          <InputFileDropZone
            fm={fmImport} name='file' accept=".xlsx, .xls, .csv"
            className='sm:p-0 border-none sm:shadow-none'
            label={<>
              <div className='mb-1'>import peraturan sekolah</div>
              <div className='text-sm font-normal text-gray-800'>
                <span>File harus sesuai dengan format excel berikut</span>
                <a className='native-link ml-1' onClick={() => onExport(true)}>master import peraturan.xlsx</a>
              </div>
            </>}
          />
          {!!fmImport.values?.file && (<Button className='btn-lg w-full mt-6' isLoading={fmImport.statusCode == 202}>Kirim</Button>)}
        </form>
      </Modal>
      <Modal fm={fmExport} btnClose noSubmit className='whitespace-normal max-w-xl'>
        <div className='p-4'>
          <div>
            <div className='text-lg font-semibold mb-1'>export peraturan sekolah</div>
            <div className='text-sm font-normal text-gray-800'>
              Filter table yang aktif saat ini akan otomatis diterapkan.
              {/* Gunakan filter dibawah ini jika perlu penyesuaian filter lanjutan */}
              {/* Jika perlu filter data lebih lanjut, anda bisa sesuaikan dari filter tambahan dibawah ini */}
            </div>
          </div>
          <Button className='btn btn-lg w-full mt-6' onClick={() => onExport()} isLoading={fmExport.statusCode == 202}>export excel</Button>
        </div>
      </Modal>
    </>
  )
}