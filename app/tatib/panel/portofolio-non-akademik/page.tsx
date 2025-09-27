'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useRef, useState } from 'react'
import { DownloadSimpleIcon, FilePdfIcon } from '@phosphor-icons/react'
import { api, downloadFile, useFormManager } from '@/externals/utils/frontend'
import Modal from '@/externals/components/popups/Modal'
import Button from '@/externals/components/Button'
import { usePathname } from 'next/navigation'
import menuApp from '../../menuApp'
import { checkAccess } from '@/externals/utils/general'
import Loading from '@/externals/components/Loading'
import Select from '@/externals/components/inputs/Select'

export default function Page() {
  const { ScreenWidth, UserAuthed } = useContextGlobal();
  const pathName = usePathname();
  const refIframePdf = useRef<HTMLIFrameElement>(null);
  const [DataTable, setDataTable] = useState<typeDataTable>({});
  const fmDetail = useFormManager();
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

  function loadRapor(dataRow: any, print?: boolean) {
    fmDetail.setStatusCode(202);
    api({
      url: `/tatib/api/portofolio-non-academic/pdf/download`,
      objParams: {
        user_ids: dataRow.id,
        class_ids: dataRow.class_id,
        semester: dataRow.semester,
        just_html: !print ? true : undefined
      }
    }).then(async (res) => {
      fmDetail.setStatusCode(res.status);
      if (res.status == 200) {
        const htmlBlob = new Blob([await res.blob()], { type: 'text/html' });
        if (!print) {
          const blobUrl = URL.createObjectURL(htmlBlob);
          if (refIframePdf.current) {
            refIframePdf.current.src = blobUrl;
            refIframePdf.current.onload = () => URL.revokeObjectURL(blobUrl);
          }
        } else {
          downloadFile(htmlBlob, 'Portofolio Non Akademik.pdf');
        }
      }
    });
  }



  /**
   * Render JSX
   */
  if (!UserAuthed?.id) return (<Loading />);
  return (
    <>
      <HeaderApp
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
          <div className='card-body py-4'>
            <Table
              url={`/auth/api/user?filters=["vdu.profile_type","=","Siswa"]&with_class=true`}
              stateDataTable={[DataTable, setDataTable]}
              fmParams={fmParams}
              onClickRow={(dataRow) => {
                if (dataRow.id) {
                  fmDetail.setValues({ ...dataRow, semester: 1 });
                  fmDetail.setShow(true, true);
                  loadRapor({ ...dataRow, semester: 1 });
                }
              }}
              prototypeTable={[
                {
                  label: "siswa", classNameTd: 'px-1', name: (data) => {
                    if (ScreenWidth >= 640) return data.name;
                    return (
                      <div className='max-w-[calc(100vw-3rem)] [&>*]:truncate'>
                        <div className='font-semibold'>{data.name}</div>
                        <div className='text-xs mt-0.5 font-medium text-gray-500'>{data.class_full_name}</div>
                      </div>
                    )
                  }
                },
                { label: "kelas", name: "class_full_name", hide: ScreenWidth < 640 },
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
      <Modal fm={fmDetail} btnClose noEdit={true} noDelete={true} title={
        <div className='font-normal text-sm flex grow'>
          <Select
            fm={fmDetail} name='semester' noLabel noSearch noUnset
            options={[{ label: 'Semester Ganjil', value: 1 }, { label: 'Semester Genap', value: 2 }]}
            onChange={(event) => loadRapor({ ...(fmDetail.values), semester: event.target.value })}
          />
          <div className='ml-auto'>
            <Button varian='btn-flat' className='rounded-md h-[1.75rem] px-2 bg-black/5 hover:bg-black/10'
              onClick={() => loadRapor({ ...(fmDetail.values), semester: 1 }, true)}>
              <FilePdfIcon weight='bold' className='text-base' />
              <div>Download</div>
            </Button>
          </div>
        </div>
      }>
        <div className='p-4'>
          {fmDetail.statusCode == 202 ? (<Loading className='h-full' />) : (<iframe ref={refIframePdf} width="100%" height="600" />)}
        </div>
      </Modal>
    </>
  )
}