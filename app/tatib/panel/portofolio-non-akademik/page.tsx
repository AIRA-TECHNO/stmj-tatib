'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useState } from 'react'
import { DownloadSimpleIcon, PlusIcon } from '@phosphor-icons/react'
import { api, downloadFile, useFormManager } from '@/externals/utils/frontend'
import Modal from '@/externals/components/popups/Modal'
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
      url: '/tatib/api/portofolio-non-akademik/pdf/export',
      objParams: { ...(fmParams.values), ...(fmExport.values), isMaster }
    }).then(async (res) => {
      fmExport.setStatusCode(res.status);
      if (res.status == 200) downloadFile(await res.blob(), `portofolio non akademik siswa.xlsx`);
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
            label: 'export pdf',
            onClick: () => fmExport.setShow(true)
          },
        ]}
      />
      <section className="sm:mt-[5rem] max-w-7xl">
        <div className="card">
          <div className='card-body sm:py-4'>
            <Table
              url={`/auth/api/user?filters=["vdu.profile_type","=","Siswa"]&with_class=true`}
              stateDataTable={[DataTable, setDataTable]}
              fmParams={fmParams}
              prototypeTable={[
                {
                  label: "siswa", name: (data) => {
                    if (ScreenWidth >= 640) return data.name;
                    return (
                      <div className='flex'>
                        <div className='grow'>
                          <div className='text-base font-semibold'>{data.name}</div>
                          <div className='text-sm font-semibold text-gray-500'>{data.class_full_name}</div>
                        </div>
                        <div className='btn rounded-full aspect-square'>
                          <DownloadSimpleIcon />
                        </div>
                      </div>
                    )
                  }
                },
                { label: "kelas", name: "class_full_name", hide: ScreenWidth < 640 },
                {
                  label: "action",
                  name: () => {
                    return 'Download PDF'
                  },
                  hide: ScreenWidth < 640
                },
              ]}
              topElements={[{ search: { show: true } }]}
            />
          </div>
        </div>
      </section>
      <Modal fm={fmExport} btnClose noSubmit className='whitespace-normal max-w-xl'>
        <div className='p-4'>
          <div>
            <div className='text-lg font-semibold mb-1'>export portofolio non akademik siswa</div>
          </div>
          <div>
            {/* Form filter disisni */}
          </div>
          <Button className='btn btn-lg w-full mt-6' onClick={() => onExport()} isLoading={fmExport.statusCode == 202}>export pdf</Button>
        </div>
      </Modal>
    </>
  )
}