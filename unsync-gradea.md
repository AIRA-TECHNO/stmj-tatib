todo:
- halaman portofolio siswa: responsive content-table, response file pdf from BE, preview & download pdf at FE
- landing page
- API excel all
- RBAC BE all 




blocker:




major:
- handle dynamic order by BE
- dynamic hide/show column FE. for handling error import table shoult can show & filter created_at



minor:
- UI footer
- ornament UI left area
- handle right click row table (show shorthand action)
- adjust color success, warning, danger


















=================================================================================================================================================
note:
********************** FINAL SUMMARY *************************
- reference student class pada member_study_group dibuat fisik. dan disingkronasi ketika after delete. member yg mereferensi dari kelas tetap bisa dihapus (untuk memenuhi kebutuhan member study grup agar bisa dinamis)
- ditmabahkan kolom type (siswa, guru) pada member_study_group

***********************************************
RBAC dibuat 2 rules:
1. data keseluruhan
2. data jika terlibat
problem: wali kelas harusnya bisa melihat data nilai siswa tapi tidak bisa tambah/edit. namun bisa menambahkan nilai pada mapel yg diampu


RBAC dibuat 3x4 access:
- CRUD semua
- CRUD yg ia buat
- CRUD yg berkaitan dengan dia


- admin (CRUD semua data)
- manager (R semua data, CUD data yg ia buat)
- manager (R semua data)
- manager (CRUD data yg ia buat)
- member (R data yg berkaitan dengan dia)
- no access


List app untuk RBAC
--- app name
--- --- feature has RBAC
jika app name atau feature diklik masuk ke page list role pada masing²


student class menjadi acuan utama. member_study_group bisa clone replica dari student class. member_study_group bisa diatur role nya per spesifik fitur. 


alur: membuat student_class (wali kelas dimasukkan flat dalam satu pivot table dengan student). membuat role per spesifik fitur, role dapat diatur access pada sub fiturnya. assign student_class ke member_study_group sambil mengatur role nya.
=================================================================================================================================================