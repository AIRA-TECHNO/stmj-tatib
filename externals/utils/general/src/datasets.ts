/**
 * Date
 */
export const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

export const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export function years(startYear: number, endYear: (number | null)) {
  const start = startYear;
  let end = endYear ?? (new Date()).getFullYear();
  const arrayYear: Array<number> = [];
  for (end; end > start; end--) {
    arrayYear.push(end);
  }
  return arrayYear;
}



// /**
//  * Validations
//  */
// export const validations = {
//   required: {
//     error: 'Field ini harus diisi!',
//   },
//   email: {
//     format: 'email',
//     error: 'Field ini harus berupa email!',
//   },
//   enum: {
//     error: `Field ini harus diisi dengan salah satu dari opsi yang tersedia!`,
//   },
//   minLength: (length: number) => ({
//     minLength: length,
//     error: `Field ini harus berisi minimal ${length} karakter!`,
//   }),
//   maxLength: (length: number) => ({
//     maxLength: length,
//     error: `Field ini harus berisi maksimal ${length} karakter!`,
//   }),
// }



/**
 * Status code request
 */
export const errorMessages = {
  400: "Permintaan tidak valid. Silakan periksa kembali data yang dikirim",
  401: "Anda tidak memiliki otorisasi. Silakan login terlebih dahulu",
  403: "Anda tidak memiliki hak akses untuk fitur ini",
  404: "Data yang tidak ditemukan",
  405: "Metode tidak diizinkan pada endpoint ini",
  408: "Request timeout - Silakan coba lagi",
  409: "Terjadi konflik data - Mungkin data sudah ada sebelumnya",
  422: "Terdapat input yang tidak valid - Silakan periksa kembali isian Anda",
  429: "Terlalu banyak permintaan - Silakan coba lagi nanti",
  500: "Terjadi kesalahan pada server",
  502: "Server menerima respon yang tidak valid",
  503: "Layanan tidak tersedia",
  504: "Gateway timeout - Server tidak merespons untuk sementara waktu"
};