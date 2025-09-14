'use client'

import HeaderApp from '@/externals/layouts/HeaderApp'
import Button from '@/externals/components/Button'
import Table, { typeDataTable } from '@/externals/components/Table'
import { useContextGlobal } from '@/externals/contexts/ContextGlobal'
import { useEffect, useState } from 'react'
import { DownloadSimpleIcon, FloppyDiskIcon, NotePencilIcon, PencilSimpleIcon, PlusIcon, TrashSimpleIcon, XIcon } from '@phosphor-icons/react'
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
   * Use effect
   */
  useEffect(() => {
    setDataTable({
      data: [
        { id: 1, name: "Yuda Ismail", nisn: 20222, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 2, name: "Yudi Akbar", nisn: 20223, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 3, name: "Yanti Rahayu", nisn: 20224, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 4, name: "Rizky Maulana", nisn: 20225, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 5, name: "Siti Nurhaliza", nisn: 20226, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 6, name: "Dwi Ananda", nisn: 20227, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 7, name: "Agus Prasetyo", nisn: 20228, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 8, name: "Intan Permata", nisn: 20229, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 9, name: "Fajar Nugroho", nisn: 20230, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 10, name: "Nia Ramadhani", nisn: 20231, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 11, name: "Andi Setiawan", nisn: 20232, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 12, name: "Lia Marlina", nisn: 20233, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 13, name: "Bayu Saputra", nisn: 20234, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 14, name: "Salsa Amelia", nisn: 20235, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 15, name: "Rian Hidayat", nisn: 20236, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 16, name: "Wulan Sari", nisn: 20237, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 17, name: "Teguh Ariyanto", nisn: 20238, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 18, name: "Maya Fitriani", nisn: 20239, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 19, name: "Ilham Fauzi", nisn: 20240, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
        { id: 20, name: "Nadya Ayu", nisn: 20241, class_full_name: "XI RPL A 2024", note: 'lorem', point: -10, rule: 'Membolos' },
      ],
    });
  }, []);



  /**
   * Render JSX
   */
  return (
    <>
      <HeaderApp
        className='border-none'
        rightElement={[
          <div className='flex' key="1">
            <Button varian={`btn-flat`} className='max-sm:text-2xs font-semibold hover:text-primary'>
              <DownloadSimpleIcon weight='bold' className='text-base mb-[1px]' />
              <span>Export</span>
              <span className='max-sm:hidden'>Excel</span>
            </Button>
          </div>,
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
        <Modal
          show={fmDetail.show} toHide={fmDetail.setShow}
          title={<>
            <div>Detail Siswa</div>
            {fmDetail.readOnly ? (<>
              <Button varian='btn-flat' className='p-1 h-auto hover:text-warning ml-auto' onClick={() => fmDetail.setReadOnly(false)}>
                <NotePencilIcon weight='bold' className='text-base' />
                <div>Edit</div>
              </Button>
              <Button varian='btn-flat' className='p-1 h-auto hover:text-danger ml-1' onClick={() => DataTable.showConfirmDelete?.([fmDetail.defaultValue.current])}>
                <TrashSimpleIcon weight='bold' className='text-base' />
                <div>Hapus</div>
              </Button>
            </>) : (<>
              <Button varian='btn-flat' className='p-1 h-auto hover:text-danger ml-auto' onClick={() => fmDetail.setReadOnly(true)}>
                <XIcon weight='bold' className='text-base' />
                <div>Batal</div>
              </Button>
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
                { name: 'name', label: 'siswa', parentProps: { className: 'lg:col-span-6' } },
                { name: 'rule', label: 'peraturan yang dilanggar', parentProps: { className: 'lg:col-span-6' } },
                { name: 'note', label: 'catatan', type: 'textarea' },
              ]}
              noSubmit
            // footerElement={fmDetail.readOnly ? undefined : <Button varian='btn-flat' className='bg-gray-100' onClick={() => {
            //   fmDetail.setReadOnly(true);
            //   fmDetail.setValues(fmDetail.defaultValue.current);
            // }}>Batal</Button>}
            />
          </div>
        </Modal>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-full xl:col-span-8">
            <div className="card">
              <div className='card-body sm:py-4'>
                <Table
                  stateDataTable={[DataTable, setDataTable]}
                  actions={[{ icon: <PencilSimpleIcon weight="bold" className='text-base' />, label: 'Edit' }, 'delete']}
                  fmParams={fmParams}
                  onClickRow={(dataRow) => {
                    fmDetail.defaultValue.current = dataRow;
                    fmDetail.setValues(dataRow);
                    fmDetail.setShow(true);
                    fmDetail.setReadOnly(true);
                  }}
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
                      { title: "kelas", keyData: "class_full_name" },
                      { title: "pelanggaran", keyData: "rule" },
                      { title: "poin pelanggaran", keyData: "point" },
                    ] : [])
                  ]}
                  leftElement={<div>
                    <Button href='/tatib/panel/portofolio/form' className='btn-sm btn-auto-floating'>
                      <PlusIcon weight='bold' className='text-sm' />
                      <span>Tambah Data</span>
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
      </section>
    </>
  )
}