import React from 'react'

export default function PortofolioNonAcademic({ students }: {
  students: {
    name: string;
    parent_name: string;
    nisn: string;
    nis: string;
    user_id: string;
    address: string;
    rt: string;
    rw: string;
    hamlet: string;
    village: string;
    subdistrict: string;
    city: string;
    expertise_name: string;
    expertise_short_name: string;
    class_roman_level: string;
    class_alphabet: string;
    school_year: number;
    semester: number;
    start_date_semester_1: number;
    end_date_semester_1: number;
    start_date_semester_2: number;
    end_date_semester_2: number;
    attendance: {
      id: number;
      student_x_user_id: string;
      school_year: string;
      semester: string;
      sick_count: number;
      permission_count: number;
      alpha_count: number;
      created_at: any;
      updated_at: any;
    };
    violations: any[];
    achievements: any[];
  }[]
}) {
  const student = {
    name: 'ABDILLAH FATHIN AL FAHRI',
    nis: '',
    nisn: '',
    expertise_name: 'Rekayasa Perangkat Lunak',
    expertise_short_name: 'RPL',
    class_roman_level: 'X',
    class_alphabet: 'A',
    parent_name: '',
    address: '',
    semester: 1,
    school_year: 2025
  };
  return (
    <>
      <style>{`
        html {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        * {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
        }

        @page {
          size: A5;
          margin: 0.5cm;
        }

        table {
          text-indent: 0;
          border-color: inherit;
          border-collapse: collapse;
          border-color: #000;
          -fs-table-paginate: paginate;
          border-spacing: 0;
          width: 100%;
          font-family: sans-serif;
        }

        tr {
          page-break-inside: avoid;
        }

        .list>tbody>tr>td {
          padding: 0.2em 0;
        }

        .table>thead>tr>th {
          background-color: #E5E4E2;
        }

        .table>thead>tr>th,
        .table>tbody>tr>td {
          padding: 0.25em;
        }

      `}</style>
      <table>
        <thead>
          <tr>
            <td>
              <div style={{
                borderBottom: '1px solid #000',
                paddingBottom: '1em',
                marginBottom: '1.5em'
              }}>
                <table>
                  <tbody>
                    <tr>
                      <th style={{ textAlign: 'left' }}>
                        <div style={{ marginTop: '1em', fontSize: '14px' }}>PORTFOLIO NON <br />AKADEMIK SISWA</div>
                      </th>
                      <th style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-block', textAlign: 'center' }}>
                          <img src="/public/images/main-logo.png" alt="Logo SMKN 1 Jenagnan" style={{ width: '4em' }} />
                          <div style={{ marginTop: '0.5em' }}>SMK NEGERI 1 JENANGAN</div>
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          {students.map((student, indexStudent) => (
            <tr key={indexStudent} style={{ pageBreakAfter: 'always' }}>
              <td>
                <div style={{ marginTop: '1.5em' }}>
                  <table className='list'>
                    <tbody>
                      <tr>
                        <td>Nama</td>
                        <td>: {student.name}</td>
                      </tr>
                      <tr>
                        <td>Prodi</td>
                        <td>: {student.expertise_name}</td>
                      </tr>
                      <tr>
                        <td>Kelas</td>
                        <td>: {student.class_roman_level} {student.expertise_short_name} {student.class_alphabet}</td>
                      </tr>
                      <tr>
                        <td>Semester</td>
                        <td>: {student.semester == 2 ? 'Genap' : 'Ganjil'} {student.school_year}</td>
                      </tr>
                      <tr>
                        <td>Nama Orang Tua</td>
                        <td>: {student.parent_name}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>: {student.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1.5em' }}>
                  <div style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>A. Presensi</div>
                  <table border={1} className='table'>
                    <thead>
                      <tr>
                        <th>Sakit (S)</th>
                        <th>Ijin (I)</th>
                        <th>Tanpa Keterangan (A)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{student.attendance?.sick_count ?? 0}</td>
                        <td>{student.attendance?.permission_count ?? 0}</td>
                        <td>{student.attendance?.alpha_count ?? 0}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1.5em' }}>
                  <div style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>B. Pelanggaran</div>
                  <table border={1} className='table'>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Pelanggaran</th>
                        <th>Skor</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.violations?.length ? (
                        student.violations?.map((v, indexV) => (
                          <tr key={indexV}>
                            <td>{indexV + 1}</td>
                            <td>{v.rule}</td>
                            <td>{v.point}</td>
                            <td>{v.note}</td>
                          </tr>
                        ))) : (
                        <tr>
                          <td colSpan={4}>
                            <div style={{ textAlign: 'center' }}>Tidak ada catatan</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1.5em' }}>
                  <div style={{ marginBottom: '0.5em', fontWeight: 'bold' }}>C. Penghargaan</div>
                  <table border={1} className='table'>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Penghargaan</th>
                        <th>Skor</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.achievements.length ? (
                        student.achievements?.map((a, indexA) => (
                          <tr key={indexA}>
                            <td>{indexA + 1}</td>
                            <td>{a.achievement}</td>
                            <td>{a.point}</td>
                            <td>{a.note}</td>
                          </tr>
                        ))) : (
                        <tr>
                          <td colSpan={4}>
                            <div style={{ textAlign: 'center' }}>Tidak ada catatan</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ paddingTop: '2em', pageBreakInside: 'avoid' }}>
                  <div>Ponorogo, ............</div>
                  <div>Wali Kelas</div>
                  <div style={{ marginTop: 60 }}>..............................</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
