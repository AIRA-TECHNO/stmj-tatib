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



/**
 * Validations
 */
export const validations = {
    required: {
        error: 'Field ini harus diisi!',
    },
    email: {
        format: 'email',
        error: 'Field ini harus berupa email!',
    },
    enum: {
        error: `Field ini harus diisi dengan salah satu dari opsi yang tersedia!`,
    },
    minLength: (length: number) => ({
        minLength: length,
        error: `Field ini harus berisi minimal ${length} karakter!`,
    }),
    maxLength: (length: number) => ({
        maxLength: length,
        error: `Field ini harus berisi maksimal ${length} karakter!`,
    }),
}