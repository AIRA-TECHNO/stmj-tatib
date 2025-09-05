'use client'

import HeaderApp from '@/externals/layouts/HeaderApp';
import Form from '@/externals/components/Form'
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { cn, useFormManager } from '@/externals/utils/frontend';

export default function Page() {
  const params = useParams();
  const id = params?.ids?.[0];
  const router = useRouter();
  const fm = useFormManager();



  /**
   * Use effect
   */
  useEffect(() => {
    if (id) {
      fm.setValues({ id: 1, name: "Ahmad Yanto", nisn: 20222, school_name: "SMKN 1 Jenangan" });
    }
  }, [id]);



  /**
   * Render JSX
   */
  return (
    <>
      <HeaderApp />
      <section className="pt-4">
        {/* <div className="sm:max-w-2xl mx-auto"> */}
        <div className={cn(
          'grid grid-cols-7',
          // "sm:max-w-2xl mx-auto"
        )}>
          <div className="card bg-gray-100 p-2 col-span-3">
            <div className="card-header">
              <div className="card-title">Form Data Siswa</div>
            </div>
            <div className="card-body">
              <Form
                fm={fm}
                fields={[
                  { label: "nama", name: "name" },
                  { label: "NISN", name: "nisn" },
                  {
                    label: "sekolah", name: "school_id", type: "select",
                    parentProps: { className: "col-span-6" }
                  },
                  {
                    label: "kelas", name: "class_level", type: "select",
                    options: ["X", "XI", "XII"],
                    parentProps: { className: "col-span-6" }
                  },
                ]}
                onSubmit={() => {
                  router.push("/tatib/panel/portofolio");
                }}
              />
            </div>
          </div>
        </div>
        {/* </div> */}
      </section>
    </>
  );
}
