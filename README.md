# eDaftar Surat SKRPget

Aplikasi web untuk menguruskan daftar surat masuk dan keluar menggunakan HTML, CSS, dan JavaScript dengan integrasi Google Sheets sebagai database.

## Ciri-ciri

- 📥 **Surat Masuk**: Menguruskan surat yang diterima
- 📤 **Surat Keluar**: Menguruskan surat yang dihantar
- ➕ **Tambah Surat**: Antara muka untuk menambah surat baru
- ✏️ **Kemaskini**: Fungsi untuk mengemaskini maklumat surat
- 🗑️ **Padam**: Fungsi untuk memadamkan surat
- 📁 **Muat Naik Fail**: Sokongan untuk fail PDF, DOC, dan imej
- 📊 **Google Sheets Integration**: Penyimpanan data dalam Google Sheets
- 📱 **Responsive Design**: Sesuai untuk desktop dan mobile
- 🎨 **Tema Biru Laut**: Reka bentuk moden dengan warna biru laut

## Maklumat Surat

Setiap surat mengandungi maklumat berikut:
- **No. Rujukan**: Nombor rujukan surat
- **Tarikh Terima**: Tarikh surat diterima
- **Pengirim**: Sumber pengirim surat
- **Subjek**: Subjek atau tajuk surat
- **Status**: Status surat (Baru, Dalam Proses, Selesai, Ditolak)
- **Tindakan Siapa**: Orang yang bertanggungjawab
- **Muat Naik Surat**: Fail yang dilampirkan
- **Tindakan**: Butang kemaskini dan padam

## Struktur Fail

```
DAFTAR/
├── index.html          # Fail HTML utama
├── styles.css          # Fail CSS untuk styling
├── script.js           # Fail JavaScript untuk fungsi
└── README.md           # Dokumentasi
```

## Penggunaan

### 1. Buka Aplikasi
Buka fail `index.html` dalam pelayar web.

### 2. Navigasi
- **Surat Masuk**: Lihat dan urus surat yang diterima
- **Surat Keluar**: Lihat dan urus surat yang dihantar
- **Tambah Surat**: Tambah surat baru

### 3. Tambah Surat
1. Klik "Tambah Surat" atau butang "Tambah Surat Masuk/Keluar"
2. Isi semua maklumat yang diperlukan
3. Pilih fail untuk dimuat naik (pilihan)
4. Klik "Simpan"

### 4. Kemaskini Surat
1. Klik butang "Kemaskini" pada baris surat
2. Ubah maklumat yang diperlukan
3. Klik "Kemaskini"

### 5. Padam Surat
1. Klik butang "Padam" pada baris surat
2. Sahkan pemadaman

## Integrasi Google Sheets

### Setup Google Sheets

1. **Buat Google Sheets baru**
   - Buka [Google Sheets](https://sheets.google.com)
   - Cipta spreadsheet baru
   - Namakan worksheet pertama sebagai "SuratMasuk"
   - Tambah worksheet kedua dan namakan sebagai "SuratKeluar"

2. **Setup Header**
   Dalam kedua-dua worksheet, tambah header berikut pada baris pertama:
   ```
   No. Rujukan | Tarikh Terima | Pengirim | Subjek | Status | Tindakan Siapa | Muat Naik Surat | Timestamp
   ```

3. **Dapatkan Spreadsheet ID**
   - Dari URL Google Sheets, salin ID (bahagian antara /d/ dan /edit)
   - Contoh: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
   - ID: `1ABC123...`

4. **Dapatkan API Key**
   - Buka [Google Cloud Console](https://console.cloud.google.com)
   - Cipta projek baru atau pilih projek sedia ada
   - Aktifkan Google Sheets API
   - Cipta API Key
   - Salin API Key

5. **Konfigurasi Aplikasi**
   - Buka fail `script.js`
   - Ganti `YOUR_GOOGLE_SHEETS_ID_HERE` dengan Spreadsheet ID
   - Ganti `YOUR_GOOGLE_SHEETS_API_KEY_HERE` dengan API Key

### Contoh Konfigurasi

```javascript
const GOOGLE_SHEETS_CONFIG = {
    spreadsheetId: '1ABC123DEF456GHI789JKL',
    apiKey: 'AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz',
    suratMasukSheet: 'SuratMasuk',
    suratKeluarSheet: 'SuratKeluar'
};
```

## Ciri-ciri Teknikal

### Frontend
- **HTML5**: Struktur semantik dan moden
- **CSS3**: Flexbox, Grid, Animasi, Responsive Design
- **JavaScript ES6+**: Async/await, Arrow functions, Template literals
- **Font Awesome**: Ikon yang cantik
- **Google Fonts**: Font Inter untuk tipografi yang baik

### Backend (Google Sheets)
- **Google Sheets API v4**: REST API untuk operasi CRUD
- **Real-time Sync**: Data disimpan secara automatik
- **Multi-user**: Boleh diakses oleh pelbagai pengguna

### Responsive Design
- **Mobile First**: Direka untuk mobile terlebih dahulu
- **Breakpoints**: 480px, 768px, 1400px
- **Flexible Layout**: Grid dan Flexbox untuk layout yang fleksibel

## Status Surat

- 🆕 **Baru**: Surat yang baru diterima
- 🔄 **Dalam Proses**: Surat sedang diproses
- ✅ **Selesai**: Surat telah selesai diproses
- ❌ **Ditolak**: Surat ditolak atau tidak diluluskan

## Format Fail yang Disokong

- **PDF**: `.pdf`
- **Microsoft Word**: `.doc`, `.docx`
- **Imej**: `.jpg`, `.jpeg`, `.png`

## Keselamatan

- **API Key Restriction**: Hadkan API Key kepada domain tertentu
- **CORS**: Pastikan Google Sheets API membenarkan akses dari domain anda
- **Input Validation**: Semua input divalidasi sebelum diproses

## Troubleshooting

### Masalah Biasa

1. **Data tidak dimuatkan**
   - Periksa konfigurasi Google Sheets
   - Pastikan API Key betul
   - Periksa console browser untuk error

2. **Tidak boleh simpan data**
   - Pastikan Google Sheets API diaktifkan
   - Periksa permission spreadsheet
   - Pastikan format data betul

3. **Aplikasi tidak berfungsi**
   - Periksa fail JavaScript untuk error
   - Pastikan semua fail dimuatkan dengan betul
   - Periksa console browser

### Debug Mode

Untuk debug, buka Developer Tools (F12) dan periksa:
- **Console**: Untuk error JavaScript
- **Network**: Untuk request API
- **Application**: Untuk localStorage dan sessionStorage

## Pembangunan Lanjutan

### Ciri-ciri yang Boleh Ditambah

- 🔍 **Carian dan Filter**: Cari surat berdasarkan kriteria
- 📊 **Dashboard**: Statistik dan laporan
- 📧 **Notifikasi**: Email notification
- 🔐 **Authentication**: Login system
- 📱 **PWA**: Progressive Web App
- 🗂️ **Kategori**: Kategori surat
- 📅 **Calendar View**: Paparan kalendar
- 📈 **Analytics**: Analisis data

### Teknologi Lanjutan

- **Vue.js/React**: Framework JavaScript
- **Node.js**: Backend server
- **MongoDB**: Database alternatif
- **Firebase**: Backend as a Service
- **Docker**: Containerization

## Sokongan

Untuk bantuan dan sokongan:
- Periksa dokumentasi ini
- Lihat komen dalam kod
- Periksa console browser untuk error
- Rujuk Google Sheets API documentation

## Lesen

Aplikasi ini adalah open source dan boleh digunakan untuk tujuan pendidikan dan komersial.

---

**Dibangunkan untuk SKRPget** 🏫 