'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { api, downloadFile, useFormManager } from '@/externals/utils/frontend'
import SubMenuNav from '@/externals/components/SubMenuNav'
import Modal from '@/externals/components/popups/Modal'
import Form from '@/externals/components/Form'
import { toast } from 'react-toastify'
import Button from '@/externals/components/Button'
import { usePathname } from 'next/navigation'
import menuApp from '../../menuApp'
import { checkAccess, formatIndoDate } from '@/externals/utils/general'
import Loading from '@/externals/components/Loading'

export default function Page() {
  const { ScreenWidth, UserAuthed } = useContextGlobal();
  const pathName = usePathname();
  const [DataTable, setDataTable] = useState<typeDataTable>({});
  const fmParams = useFormManager();
  const fmDetail = useFormManager();
  const fmExport = useFormManager();



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
      url: '/tatib/api/student-violation/excel/export',
      objParams: { ...(fmParams.values), ...(fmExport.values), isMaster }
    }).then(async (res) => {
      fmExport.setStatusCode(res.status);
      if (res.status == 200) downloadFile(await res.blob(), `Pelanggaran Siswa.xlsx`);
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
        ]}
      />
      <SubMenuNav navigations={[
        { label: 'pelanggaran', link: '/tatib/panel/pelanggaran', isActive: true },
        { label: 'peraturan', link: '/tatib/panel/peraturan' }
      ]} />
      <section className="sm:mt-2 max-w-7xl">
        <div className="card">
          <div className='card-body sm:py-4'>
            <Table
              url='/tatib/api/student-violation'
              stateDataTable={[DataTable, setDataTable]}
              actions={isFullAccess ? ['delete'] : []}
              fmParams={fmParams}
              onClickRow={(dataRow) => {
                fmDetail.setValues(dataRow, true);
                fmDetail.setShow(true, true);
              }}
              prototypeTable={[
                {
                  label: "siswa", name: (data) => {
                    if (ScreenWidth >= 640) return data.name;
                    return (
                      <div>
                        <div className='text-base font-semibold'>{data.name}</div>
                        <div className='text-sm font-semibold text-gray-500'>{data.class_full_name}</div>
                        <div className='mt-2 text-sm'>{data.rule} <span className='text-danger text-xs font-semibold'>{`(-${data?.point})`}</span></div>
                        <div className='mt-2 text-sm'>{formatIndoDate(data.date)}</div>
                      </div>
                    )
                  }
                },
                { label: "kelas", name: "class_full_name", hide: ScreenWidth < 640 },
                { label: "pelanggaran", name: (data) => (<>{data?.rule} <span className='text-danger text-xs font-semibold'>{`(-${data?.point})`}</span></>), hide: ScreenWidth < 640 },
                { label: "tanggal", name: (data) => formatIndoDate(data.date), hide: ScreenWidth < 640 }
              ]}
              topElements={[
                ...(isFullAccess ? [(<div className='lg:order-2 lg:ml-auto'>
                  <div onClick={() => fmDetail.setShow(true, false, true)} className='btn btn-auto-floating'>
                    <PlusIcon weight='bold' className='text-sm' />
                    <span>pelanggaran baru</span>
                  </div>
                </div>)] : []),
                { filter: { show: true }, search: { show: true }, className: 'lg:order-1' },
              ]}
            />
          </div>
        </div>
        <Modal fm={fmDetail} noEdit={!isFullAccess} noDelete={!isFullAccess} title={<div className='mr-auto capitalize'>{fmDetail.values?.id ? 'detail' : 'tambah'} pelanggaran siswa</div>}>
          <div className='px-4 pb-4'>
            <Form
              actionApi={{
                url: '/tatib/api/student-violation', afterDelete: DataTable.loadDataTable, afterSubmit: (data) => {
                  toast.success(data.message);
                  DataTable.loadDataTable?.();
                  fmDetail.setValues(data?.data, true);
                  fmDetail.setReadOnly(true);
                }
              }}
              fm={fmDetail}
              fields={[
                {
                  label: 'siswa', name: 'student_x_user_id', type: 'select',
                  optionFromApi: { url: '/auth/api/user', render: (options) => (options || []).map((opt) => ({ label: opt.name ?? '', value: opt.id ?? '' })) },
                },
                {
                  label: 'peraturan yang dilanggar', name: 'rule_school_id', type: 'select',
                  optionFromApi: { url: '/tatib/api/rule-school', render: (options) => (options || []).map((opt) => ({ label: opt.rule ?? '', value: opt.id ?? '' })) },
                  parentProps: { className: 'lg:col-span-7' }
                },
                { label: "tanggal", name: "date", type: 'date', parentProps: { className: 'lg:col-span-5' } },
                { label: "keterangan", name: "note", type: 'textarea' },
              ]}
              noFooter
            />
          </div>
        </Modal>
      </section>
      <Modal fm={fmExport} btnClose noSubmit className='whitespace-normal max-w-xl'>
        <div className='p-4'>
          <div>
            <div className='text-lg font-semibold mb-1'>export pelanggaran siswa</div>
            <div className='text-sm font-normal text-gray-800'>
              Filter table yang aktif saat ini akan otomatis diterapkan.
            </div>
          </div>
          <Button className='btn btn-lg w-full mt-6' onClick={() => onExport()} isLoading={fmExport.statusCode == 202}>export excel</Button>
        </div>
      </Modal>
    </>
  )
}