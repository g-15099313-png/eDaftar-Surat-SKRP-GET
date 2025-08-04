// Konfigurasi Google Sheets API
// Ganti nilai-nilai ini dengan maklumat Google Sheets anda

const GOOGLE_SHEETS_CONFIG = {
    // ID Google Sheets - dapatkan dari URL spreadsheet
    // Contoh: https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit
    // ID: 1ABC123DEF456GHI789JKL
    spreadsheetId: 'YOUR_GOOGLE_SHEETS_ID_HERE',
    
    // API Key Google Sheets - dapatkan dari Google Cloud Console
    // https://console.cloud.google.com/apis/credentials
    apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY_HERE',
    
    // Nama worksheet untuk surat masuk
    suratMasukSheet: 'SuratMasuk',
    
    // Nama worksheet untuk surat keluar
    suratKeluarSheet: 'SuratKeluar',
    
    // Konfigurasi tambahan
    options: {
        // Jumlah baris maksimum yang akan dimuatkan
        maxRows: 1000,
        
        // Format tarikh
        dateFormat: 'YYYY-MM-DD',
        
        // Zon masa
        timezone: 'Asia/Kuala_Lumpur',
        
        // Auto refresh data setiap 30 saat (dalam milisaat)
        autoRefreshInterval: 30000,
        
        // Enable/disable auto refresh
        enableAutoRefresh: false
    }
};

// Fungsi untuk memeriksa konfigurasi
function validateConfig() {
    const errors = [];
    
    if (!GOOGLE_SHEETS_CONFIG.spreadsheetId || GOOGLE_SHEETS_CONFIG.spreadsheetId === 'YOUR_GOOGLE_SHEETS_ID_HERE') {
        errors.push('Google Sheets ID belum dikonfigurasi');
    }
    
    if (!GOOGLE_SHEETS_CONFIG.apiKey || GOOGLE_SHEETS_CONFIG.apiKey === 'YOUR_GOOGLE_SHEETS_API_KEY_HERE') {
        errors.push('Google Sheets API Key belum dikonfigurasi');
    }
    
    if (errors.length > 0) {
        console.warn('Konfigurasi Google Sheets tidak lengkap:', errors);
        return false;
    }
    
    return true;
}

// Fungsi untuk mendapatkan URL Google Sheets
function getGoogleSheetsUrl() {
    if (GOOGLE_SHEETS_CONFIG.spreadsheetId && GOOGLE_SHEETS_CONFIG.spreadsheetId !== 'YOUR_GOOGLE_SHEETS_ID_HERE') {
        return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/edit`;
    }
    return null;
}

// Export untuk digunakan dalam fail lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, validateConfig, getGoogleSheetsUrl };
} 