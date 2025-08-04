# eDaftar Surat SKRP GET

Sistem pengurusan surat digital untuk SKRP GET dengan integrasi Google Sheets.

## Ciri-ciri Utama

### 📋 Pengurusan Surat
- **Surat Masuk**: Rekod dan urus surat yang diterima
- **Surat Keluar**: Rekod dan urus surat yang dihantar
- **Muat Naik Fail**: Lampirkan fail surat (PDF, DOC, DOCX, JPG, PNG)
- **Status Tracking**: Baru, Dalam Proses, Selesai, Ditolak
- **Peranan Pengguna**: Guru Besar, GPKP, GPKHEM, GPKKO, Pembantu Tadbir, Pembantu Operasi

### 🔄 Integrasi Google Sheets
- **Auto-sync**: Segerakan data secara automatik ke Google Sheets
- **Manual Sync**: Butang untuk menyegerakan data secara manual
- **Load from Sheets**: Muat data dari Google Sheets
- **Backup & Restore**: Simpan dan pulih data dari cloud

### 🎨 Antara Muka
- **Responsive Design**: Berfungsi pada desktop dan mobile
- **Modern UI**: Antara muka yang moden dan mudah digunakan
- **Real-time Search**: Cari surat dengan pantas
- **Notifications**: Makluman untuk tindakan pengguna

## Persediaan Google Sheets

### 1. Buat Google Cloud Project
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat projek baru atau pilih projek sedia ada
3. Aktifkan Google Sheets API

### 2. Dapatkan API Key
1. Pergi ke "Credentials" dalam Google Cloud Console
2. Klik "Create Credentials" > "API Key"
3. Salin API key yang dijana

### 3. Buat Google Spreadsheet
1. Buka [Google Sheets](https://sheets.google.com/)
2. Buat spreadsheet baru
3. Salin Spreadsheet ID dari URL (selepas /d/ dan sebelum /edit)

### 4. Konfigurasi Aplikasi
1. Buka fail `script.js`
2. Cari bahagian `GOOGLE_SHEETS_CONFIG`
3. Ganti nilai berikut:
   ```javascript
   const GOOGLE_SHEETS_CONFIG = {
       apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY', // Ganti dengan API key anda
       spreadsheetId: 'YOUR_SPREADSHEET_ID', // Ganti dengan Spreadsheet ID anda
       range: 'A:Z'
   };
   ```

## Struktur Data Google Sheets

Aplikasi akan menyimpan data dalam format berikut:

| Kolum | Penerangan |
|-------|------------|
| Jenis | Masuk/Keluar |
| No. Rujukan | Nombor rujukan surat |
| Tarikh | Tarikh surat |
| Pengirim/Penerima | Nama pengirim atau penerima |
| Subjek | Subjek surat |
| Status | Baru/Dalam Proses/Selesai/Ditolak |
| Tindakan Siapa | Peranan yang bertanggungjawab |
| Fail Surat | Nama fail yang dimuat naik |
| Saiz Fail | Saiz fail dalam bytes |
| Tarikh Muat Naik | Tarikh fail dimuat naik |

## Cara Penggunaan

### 1. Tambah Surat Baru
1. Klik tab "Tambah Surat"
2. Pilih jenis surat (Masuk/Keluar)
3. Isi maklumat yang diperlukan
4. Muat naik fail surat (pilihan)
5. Klik "Simpan Surat"

### 2. Muat Naik Fail Surat
1. Dalam jadual Surat Masuk/Keluar
2. Klik butang "Muat Naik" pada baris surat
3. Pilih fail (PDF, DOC, DOCX, JPG, PNG)
4. Fail akan disimpan dan dipaparkan

### 3. Segerakan ke Google Sheets
1. Klik tab "Muat Naik Surat"
2. Aktifkan "Auto-sync ke Google Sheets" untuk sync automatik
3. Atau klik "Segerakan ke Google Sheets" untuk sync manual
4. Klik "Muat dari Google Sheets" untuk memuat data dari cloud

### 4. Tukar Peranan
1. Klik butang "Tukar Peranan" di header
2. Pilih peranan yang sesuai
3. Antara muka akan berubah mengikut kebenaran peranan

## Fail-fail Utama

- `index.html` - Antara muka utama
- `script.js` - Logik aplikasi dan integrasi Google Sheets
- `styles.css` - Styling dan reka bentuk
- `README.md` - Dokumentasi ini

## Keperluan Teknikal

- **Browser**: Chrome, Firefox, Safari, Edge (versi terkini)
- **Internet**: Untuk integrasi Google Sheets
- **Storage**: LocalStorage untuk data tempatan
- **File Upload**: Sokongan untuk fail sehingga 10MB

## Keselamatan

- Data disimpan dalam localStorage browser
- API key Google Sheets perlu dikonfigurasi dengan betul
- Fail yang dimuat naik disimpan secara tempatan
- Tiada data sensitif dihantar ke server pihak ketiga

## Sokongan

Untuk bantuan atau pertanyaan:
1. Periksa konfigurasi Google Sheets API
2. Pastikan browser menyokong JavaScript
3. Periksa sambungan internet untuk sync ke Google Sheets

## Versi

**v1.0.0** - Versi awal dengan ciri-ciri asas dan integrasi Google Sheets 