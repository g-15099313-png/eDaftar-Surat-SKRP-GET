# Panduan Setup Google Sheets API

Panduan lengkap untuk mengkonfigurasi Google Sheets API untuk aplikasi eDaftar Surat SKRPget.

## Langkah 1: Buat Google Sheets

### 1.1 Buka Google Sheets
- Pergi ke [Google Sheets](https://sheets.google.com)
- Log masuk dengan akaun Google anda

### 1.2 Cipta Spreadsheet Baru
- Klik "Blank" untuk cipta spreadsheet baru
- Namakan spreadsheet sebagai "eDaftar Surat SKRPget"

### 1.3 Setup Worksheets
1. **Worksheet Pertama (SuratMasuk)**
   - Klik pada tab "Sheet1" dan namakan semula sebagai "SuratMasuk"
   - Tambah header pada baris pertama:
   ```
   A1: No. Rujukan
   B1: Tarikh Terima
   C1: Pengirim
   D1: Subjek
   E1: Status
   F1: Tindakan Siapa
   G1: Muat Naik Surat
   H1: Timestamp
   ```

2. **Worksheet Kedua (SuratKeluar)**
   - Klik ikon "+" untuk tambah worksheet baru
   - Namakan sebagai "SuratKeluar"
   - Tambah header yang sama seperti SuratMasuk

### 1.4 Dapatkan Spreadsheet ID
- Dari URL browser, salin ID spreadsheet
- Format URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Contoh: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
- ID: `1ABC123DEF456GHI789JKL`

## Langkah 2: Setup Google Cloud Console

### 2.1 Buka Google Cloud Console
- Pergi ke [Google Cloud Console](https://console.cloud.google.com)
- Log masuk dengan akaun Google yang sama

### 2.2 Cipta Projek Baru
1. Klik dropdown projek di bahagian atas
2. Klik "New Project"
3. Namakan projek sebagai "eDaftar Surat API"
4. Klik "Create"

### 2.3 Aktifkan Google Sheets API
1. Dalam menu sidebar, pilih "APIs & Services" > "Library"
2. Cari "Google Sheets API"
3. Klik pada "Google Sheets API"
4. Klik "Enable"

### 2.4 Cipta API Key
1. Dalam menu sidebar, pilih "APIs & Services" > "Credentials"
2. Klik "Create Credentials" > "API Key"
3. API Key akan dicipta dan dipaparkan
4. Klik "Copy" untuk menyalin API Key

### 2.5 Sekuriti API Key (Pilihan tetapi Disyorkan)
1. Klik pada API Key yang baru dicipta
2. Dalam bahagian "Application restrictions":
   - Pilih "HTTP referrers (web sites)"
   - Tambah domain anda (contoh: `localhost`, `yourdomain.com`)
3. Dalam bahagian "API restrictions":
   - Pilih "Restrict key"
   - Pilih "Google Sheets API"
4. Klik "Save"

## Langkah 3: Konfigurasi Aplikasi

### 3.1 Edit Fail config.js
1. Buka fail `config.js` dalam editor
2. Ganti nilai-nilai berikut:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    // Ganti dengan Spreadsheet ID anda
    spreadsheetId: '1ABC123DEF456GHI789JKL',
    
    // Ganti dengan API Key anda
    apiKey: 'AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz',
    
    // Nama worksheet (biarkan seperti ini)
    suratMasukSheet: 'SuratMasuk',
    suratKeluarSheet: 'SuratKeluar'
};
```

### 3.2 Aktifkan Google Sheets Integration
1. Buka fail `script.js`
2. Cari fungsi `initializeApp()`
3. Uncomment baris `loadData();`
4. Comment baris `loadSampleData();`

```javascript
function initializeApp() {
    setupNavigation();
    setupEventListeners();
    
    // Periksa konfigurasi Google Sheets
    if (typeof validateConfig === 'function' && validateConfig()) {
        console.log('Google Sheets API dikonfigurasi dengan betul');
        loadData(); // Uncomment ini
    } else {
        console.log('Menggunakan data sample kerana Google Sheets tidak dikonfigurasi');
        // loadSampleData(); // Comment ini
    }
    
    // loadSampleData(); // Comment ini
}
```

## Langkah 4: Test Aplikasi

### 4.1 Buka Aplikasi
1. Buka fail `index.html` dalam browser
2. Buka Developer Tools (F12)
3. Periksa Console untuk mesej konfigurasi

### 4.2 Test Fungsi
1. Tambah surat baru
2. Periksa Google Sheets untuk melihat data
3. Test fungsi kemaskini dan padam

## Troubleshooting

### Masalah: "Google Sheets API not enabled"
**Penyelesaian:**
- Pastikan Google Sheets API diaktifkan dalam Google Cloud Console
- Tunggu beberapa minit untuk API diaktifkan

### Masalah: "API key not valid"
**Penyelesaian:**
- Periksa API Key dalam config.js
- Pastikan API Key tidak mempunyai sekatan yang terlalu ketat

### Masalah: "Spreadsheet not found"
**Penyelesaian:**
- Periksa Spreadsheet ID dalam config.js
- Pastikan spreadsheet dikongsi dengan akaun Google yang betul

### Masalah: "CORS error"
**Penyelesaian:**
- Pastikan domain anda ditambah dalam sekatan API Key
- Untuk development, tambah `localhost` dalam sekatan

### Masalah: "Quota exceeded"
**Penyelesaian:**
- Google Sheets API mempunyai had 300 requests per minit
- Tunggu beberapa minit sebelum cuba lagi
- Pertimbangkan untuk upgrade ke Google Cloud Platform

## Sekuriti

### Best Practices
1. **Jangan kongsi API Key** dalam kod awam
2. **Hadkan API Key** kepada domain tertentu
3. **Monitor usage** dalam Google Cloud Console
4. **Gunakan environment variables** untuk production

### Untuk Production
1. Setup domain yang betul
2. Konfigurasi CORS dengan betul
3. Monitor API usage
4. Backup data secara berkala

## Kos

### Google Sheets API
- **Free tier**: 300 requests per minit
- **Paid tier**: $0.10 per 1,000 requests
- **Google Cloud Platform**: Pelbagai pilihan pricing

### Google Cloud Platform
- **Free tier**: $300 credit untuk 90 hari pertama
- **Paid tier**: Pay-as-you-go

## Sokongan

Jika anda menghadapi masalah:
1. Periksa Console browser untuk error
2. Rujuk [Google Sheets API Documentation](https://developers.google.com/sheets/api)
3. Periksa [Google Cloud Console](https://console.cloud.google.com) untuk usage dan error
4. Rujuk dokumentasi aplikasi ini

---

**Nota**: Pastikan anda memahami terma dan syarat Google Cloud Platform sebelum menggunakan API ini. 