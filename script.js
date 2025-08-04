// Application State
let currentRole = 'guru-besar';
let suratMasuk = [];
let suratKeluar = [];
let currentEditingId = null;

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY',
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'A:Z'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    renderTables();
    setCurrentDate();
    initializeGoogleSheets();
});

// Setup Event Listeners
function setupEventListeners() {
    // Role switching
    document.getElementById('switchRole').addEventListener('click', switchRole);
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Search functionality
    document.getElementById('searchMasuk').addEventListener('input', filterSuratMasuk);
    document.getElementById('searchKeluar').addEventListener('input', filterSuratKeluar);
    
    // Form submission
    document.getElementById('formTambahSurat').addEventListener('submit', handleAddSurat);
    document.getElementById('formEditSurat').addEventListener('submit', handleEditSurat);
    
    // Modal events
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('btnCancel').addEventListener('click', closeModal);
    document.getElementById('btnDelete').addEventListener('click', handleDeleteSurat);
    
    // Google Sheets buttons
    document.getElementById('syncToSheets').addEventListener('click', syncToGoogleSheets);
    document.getElementById('loadFromSheets').addEventListener('click', loadFromGoogleSheets);
    document.getElementById('openSheets').addEventListener('click', openGoogleSheets);
    
    // Auto-sync toggle
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    if (autoSyncToggle) {
        autoSyncToggle.addEventListener('change', toggleAutoSync);
        autoSyncToggle.checked = localStorage.getItem('autoSyncToSheets') === 'true';
    }
}

// Role Management
function switchRole() {
    const roles = ['guru-besar', 'gpkp', 'gpkhem', 'gpkko', 'pembantu-tadbir', 'pembantu-operasi'];
    const currentIndex = roles.indexOf(currentRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    currentRole = roles[nextIndex];
    
    updateUserInterface();
    showNotification(`Peranan ditukar kepada: ${getRoleText(currentRole)}`, 'success');
}

function getRoleText(role) {
    const roleMap = {
        'guru-besar': 'Guru Besar',
        'gpkp': 'GPKP',
        'gpkhem': 'GPKHEM',
        'gpkko': 'GPKKO',
        'pembantu-tadbir': 'Pembantu Tadbir',
        'pembantu-operasi': 'Pembantu Operasi'
    };
    return roleMap[role] || role;
}

function updateUserInterface() {
    document.getElementById('currentUser').textContent = getRoleText(currentRole);
}

// Tab Management
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Data Management
function loadData() {
    const savedSuratMasuk = localStorage.getItem('suratMasuk');
    const savedSuratKeluar = localStorage.getItem('suratKeluar');
    
    if (savedSuratMasuk) suratMasuk = JSON.parse(savedSuratMasuk);
    if (savedSuratKeluar) suratKeluar = JSON.parse(savedSuratKeluar);
    
    if (suratMasuk.length === 0 && suratKeluar.length === 0) {
        loadSampleData();
    }
}

function loadSampleData() {
    suratMasuk = [
        {
            id: 'SM001',
            noRujukan: 'SM/2024/001',
            tarikh: '2024-01-15',
            pengirim: 'Jabatan Pendidikan Negeri',
            subjek: 'Pelan Pembangunan Sekolah 2024',
            status: 'baru',
            tindakanSiapa: 'guru-besar'
        }
    ];
    
    suratKeluar = [
        {
            id: 'SK001',
            noRujukan: 'SK/2024/001',
            tarikh: '2024-01-10',
            penerima: 'Jabatan Pendidikan Negeri',
            subjek: 'Laporan Aktiviti Sekolah Bulan Januari',
            status: 'selesai',
            tindakanSiapa: 'pembantu-tadbir'
        }
    ];
    
    saveData();
}

function saveData() {
    localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
    localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
    
    if (localStorage.getItem('autoSyncToSheets') === 'true') {
        setTimeout(() => syncToGoogleSheets(), 1000);
    }
}

// Table Rendering
function renderTables() {
    renderSuratMasuk();
    renderSuratKeluar();
}

function renderSuratMasuk() {
    const tbody = document.getElementById('tbodySuratMasuk');
    tbody.innerHTML = '';
    
    suratMasuk.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.noRujukan}</td>
            <td>${formatDate(surat.tarikh)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${surat.status}">${getStatusText(surat.status)}</span></td>
            <td><span class="role-badge role-${surat.tindakanSiapa}">${getRoleText(surat.tindakanSiapa)}</span></td>
            <td>
                <div class="upload-section">
                    <input type="file" id="upload-${surat.id}" class="file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display: none;">
                    <button class="btn btn-upload" onclick="document.getElementById('upload-${surat.id}').click()">
                        <i class="fas fa-upload"></i> Muat Naik
                    </button>
                    ${surat.suratFile ? `<div class="file-info"><i class="fas fa-file"></i> ${surat.suratFile}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editSurat('masuk', '${surat.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteSurat('masuk', '${surat.id}')">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        
        const fileInput = document.getElementById(`upload-${surat.id}`);
        fileInput.addEventListener('change', (e) => {
            handleSuratFileUpload(e, surat.id, 'masuk');
        });
    });
}

function renderSuratKeluar() {
    const tbody = document.getElementById('tbodySuratKeluar');
    tbody.innerHTML = '';
    
    suratKeluar.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.noRujukan}</td>
            <td>${formatDate(surat.tarikh)}</td>
            <td>${surat.penerima}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${surat.status}">${getStatusText(surat.status)}</span></td>
            <td><span class="role-badge role-${surat.tindakanSiapa}">${getRoleText(surat.tindakanSiapa)}</span></td>
            <td>
                <div class="upload-section">
                    <input type="file" id="upload-${surat.id}" class="file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display: none;">
                    <button class="btn btn-upload" onclick="document.getElementById('upload-${surat.id}').click()">
                        <i class="fas fa-upload"></i> Muat Naik
                    </button>
                    ${surat.suratFile ? `<div class="file-info"><i class="fas fa-file"></i> ${surat.suratFile}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" onclick="editSurat('keluar', '${surat.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteSurat('keluar', '${surat.id}')">
                        <i class="fas fa-trash"></i> Padam
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
        
        const fileInput = document.getElementById(`upload-${surat.id}`);
        fileInput.addEventListener('change', (e) => {
            handleSuratFileUpload(e, surat.id, 'keluar');
        });
    });
}

// Search and Filter
function filterSuratMasuk() {
    const searchTerm = document.getElementById('searchMasuk').value.toLowerCase();
    const tbody = document.getElementById('tbodySuratMasuk');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterSuratKeluar() {
    const searchTerm = document.getElementById('searchKeluar').value.toLowerCase();
    const tbody = document.getElementById('tbodySuratKeluar');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Form Handling
function handleAddSurat(e) {
    e.preventDefault();
    
    if (currentRole === 'guru-besar' || currentRole === 'gpkp' || currentRole === 'gpkhem' || currentRole === 'gpkko') {
        showNotification(`${getRoleText(currentRole)} tidak boleh menambah surat baru`, 'error');
        return;
    }
    
    const jenisSurat = document.getElementById('jenisSurat').value;
    
    if (!jenisSurat) {
        showNotification('Sila pilih jenis surat', 'error');
        return;
    }
    
    const suratData = {
        id: generateId(jenisSurat),
        noRujukan: document.getElementById('noRujukan').value,
        tarikh: document.getElementById('tarikh').value,
        subjek: document.getElementById('subjek').value,
        keterangan: document.getElementById('keterangan').value,
        status: document.getElementById('status').value,
        tindakanSiapa: document.getElementById('tindakanSiapa').value
    };
    
    if (jenisSurat === 'masuk') {
        suratData.pengirim = document.getElementById('pengirimPenerima').value;
        suratMasuk.push(suratData);
    } else {
        suratData.penerima = document.getElementById('pengirimPenerima').value;
        suratKeluar.push(suratData);
    }
    
    saveData();
    renderTables();
    e.target.reset();
    showNotification('Surat berjaya ditambah', 'success');
}

function handleEditSurat(e) {
    e.preventDefault();
    
    const suratData = {
        noRujukan: document.getElementById('editNoRujukan').value,
        tarikh: document.getElementById('editTarikh').value,
        subjek: document.getElementById('editSubjek').value,
        keterangan: document.getElementById('editKeterangan').value,
        status: document.getElementById('editStatus').value,
        tindakanSiapa: document.getElementById('editTindakanSiapa').value
    };
    
    const suratList = currentEditingId.jenis === 'masuk' ? suratMasuk : suratKeluar;
    const suratIndex = suratList.findIndex(s => s.id === currentEditingId.id);
    
    if (suratIndex !== -1) {
        Object.assign(suratList[suratIndex], suratData);
        
        if (currentEditingId.jenis === 'masuk') {
            suratList[suratIndex].pengirim = document.getElementById('editPengirimPenerima').value;
        } else {
            suratList[suratIndex].penerima = document.getElementById('editPengirimPenerima').value;
        }
        
        saveData();
        renderTables();
        closeModal();
        showNotification('Surat berjaya dikemaskini', 'success');
    }
}

function handleDeleteSurat() {
    if (confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        const suratList = currentEditingId.jenis === 'masuk' ? suratMasuk : suratKeluar;
        const suratIndex = suratList.findIndex(s => s.id === currentEditingId.id);
        
        if (suratIndex !== -1) {
            suratList.splice(suratIndex, 1);
            saveData();
            renderTables();
            closeModal();
            showNotification('Surat berjaya dipadam', 'success');
        }
    }
}

// Edit and Delete Functions
function editSurat(jenis, id) {
    const suratList = jenis === 'masuk' ? suratMasuk : suratKeluar;
    const surat = suratList.find(s => s.id === id);
    
    if (surat) {
        currentEditingId = { jenis, id };
        
        document.getElementById('editNoRujukan').value = surat.noRujukan;
        document.getElementById('editTarikh').value = surat.tarikh;
        document.getElementById('editSubjek').value = surat.subjek;
        document.getElementById('editKeterangan').value = surat.keterangan || '';
        document.getElementById('editStatus').value = surat.status;
        document.getElementById('editTindakanSiapa').value = surat.tindakanSiapa;
        
        if (jenis === 'masuk') {
            document.getElementById('editPengirimPenerima').value = surat.pengirim;
        } else {
            document.getElementById('editPengirimPenerima').value = surat.penerima;
        }
        
        document.getElementById('modalTitle').textContent = `Edit Surat ${jenis === 'masuk' ? 'Masuk' : 'Keluar'}`;
        document.getElementById('modal').style.display = 'block';
    }
}

function deleteSurat(jenis, id) {
    if (confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        const suratList = jenis === 'masuk' ? suratMasuk : suratKeluar;
        const suratIndex = suratList.findIndex(s => s.id === id);
        
        if (suratIndex !== -1) {
            suratList.splice(suratIndex, 1);
            saveData();
            renderTables();
            showNotification('Surat berjaya dipadam', 'success');
        }
    }
}

// Modal Management
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    currentEditingId = null;
    document.getElementById('formEditSurat').reset();
}

// Google Sheets Integration
function initializeGoogleSheets() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: GOOGLE_SHEETS_CONFIG.apiKey,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(() => {
            console.log('Google Sheets API initialized');
        }).catch(error => {
            console.error('Error initializing Google Sheets API:', error);
        });
    });
}

function syncToGoogleSheets() {
    const button = document.getElementById('syncToSheets');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span class="loading"></span> Menyegerakan...';
    button.disabled = true;
    
    const data = prepareDataForSheets();
    
    if (typeof gapi === 'undefined' || !gapi.client) {
        showNotification('Google Sheets API tidak tersedia. Sila periksa konfigurasi.', 'error');
        button.innerHTML = originalText;
        button.disabled = false;
        return;
    }
    
    gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: 'A:Z'
    }).then(() => {
        return gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: 'A1',
            valueInputOption: 'RAW',
            resource: { values: data }
        });
    }).then((response) => {
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification(`Data berjaya disegerakan ke Google Sheets! ${response.result.updatedCells} sel dikemas kini.`, 'success');
    }).catch((error) => {
        console.error('Error syncing to Google Sheets:', error);
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification('Ralat semasa menyegerakan data ke Google Sheets. Sila periksa konfigurasi API.', 'error');
    });
}

function loadFromGoogleSheets() {
    const button = document.getElementById('loadFromSheets');
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loading"></span> Memuat dari Google Sheets...';
        button.disabled = true;
        
        if (typeof gapi === 'undefined' || !gapi.client) {
            showNotification('Google Sheets API tidak tersedia. Sila periksa konfigurasi.', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
            return;
        }
        
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: 'A:Z'
        }).then((response) => {
            const values = response.result.values;
            if (values && values.length > 1) {
                processSheetsData(values);
                button.innerHTML = originalText;
                button.disabled = false;
                showNotification('Data berjaya dimuat dari Google Sheets!', 'success');
            } else {
                button.innerHTML = originalText;
                button.disabled = false;
                showNotification('Tiada data dalam Google Sheets', 'warning');
            }
        }).catch((error) => {
            console.error('Error loading from Google Sheets:', error);
            button.innerHTML = originalText;
            button.disabled = false;
            showNotification('Ralat semasa memuat data dari Google Sheets.', 'error');
        });
    }
}

function processSheetsData(values) {
    const dataRows = values.slice(1);
    
    suratMasuk = [];
    suratKeluar = [];
    
    dataRows.forEach(row => {
        if (row.length >= 7) {
            const suratData = {
                id: generateId(row[0] === 'Masuk' ? 'masuk' : 'keluar'),
                noRujukan: row[1],
                tarikh: row[2],
                subjek: row[4],
                status: getStatusFromText(row[5]),
                tindakanSiapa: getRoleFromText(row[6]),
                suratFile: row[7] !== '-' ? row[7] : null,
                fileSize: row[8] !== '-' ? row[8] : null,
                uploadDate: row[9] !== '-' ? new Date(row[9]).toISOString() : null
            };
            
            if (row[0] === 'Masuk') {
                suratData.pengirim = row[3];
                suratMasuk.push(suratData);
            } else {
                suratData.penerima = row[3];
                suratKeluar.push(suratData);
            }
        }
    });
    
    saveData();
    renderTables();
}

function prepareDataForSheets() {
    const headers = ['Jenis', 'No. Rujukan', 'Tarikh', 'Pengirim/Penerima', 'Subjek', 'Status', 'Tindakan Siapa', 'Fail Surat', 'Saiz Fail', 'Tarikh Muat Naik'];
    const data = [headers];
    
    suratMasuk.forEach(surat => {
        data.push([
            'Masuk',
            surat.noRujukan,
            surat.tarikh,
            surat.pengirim,
            surat.subjek,
            getStatusText(surat.status),
            getRoleText(surat.tindakanSiapa),
            surat.suratFile || '-',
            surat.fileSize || '-',
            surat.uploadDate ? formatDate(surat.uploadDate) : '-'
        ]);
    });
    
    suratKeluar.forEach(surat => {
        data.push([
            'Keluar',
            surat.noRujukan,
            surat.tarikh,
            surat.penerima,
            surat.subjek,
            getStatusText(surat.status),
            getRoleText(surat.tindakanSiapa),
            surat.suratFile || '-',
            surat.fileSize || '-',
            surat.uploadDate ? formatDate(surat.uploadDate) : '-'
        ]);
    });
    
    return data;
}

function openGoogleSheets() {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}`;
    window.open(url, '_blank');
}

function toggleAutoSync() {
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    const isEnabled = autoSyncToggle.checked;
    
    localStorage.setItem('autoSyncToSheets', isEnabled.toString());
    
    if (isEnabled) {
        showNotification('Auto-sync ke Google Sheets diaktifkan', 'success');
    } else {
        showNotification('Auto-sync ke Google Sheets dimatikan', 'warning');
    }
}

// Handle file upload for individual surat
function handleSuratFileUpload(e, suratId, jenis) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateFile(file)) {
        return;
    }
    
    const suratArray = jenis === 'masuk' ? suratMasuk : suratKeluar;
    const surat = suratArray.find(s => s.id === suratId);
    
    if (surat) {
        surat.suratFile = file.name;
        surat.fileSize = formatFileSize(file.size);
        surat.uploadDate = new Date().toISOString();
        
        saveData();
        renderTables();
        
        showNotification(`Fail "${file.name}" berjaya dimuat naik untuk surat ${surat.noRujukan}`, 'success');
    }
}

// File validation
function validateFile(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        showNotification(`Jenis fail "${file.name}" tidak diterima. Sila pilih fail PDF, DOC, DOCX, JPG, atau PNG.`, 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification(`Saiz fail "${file.name}" terlalu besar. Saiz maksimum ialah 10MB.`, 'error');
        return false;
    }
    
    return true;
}

// Utility Functions
function generateId(jenis) {
    const prefix = jenis === 'masuk' ? 'SM' : 'SK';
    const existingIds = jenis === 'masuk' 
        ? suratMasuk.map(s => s.id) 
        : suratKeluar.map(s => s.id);
    
    let counter = 1;
    let newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    
    while (existingIds.includes(newId)) {
        counter++;
        newId = `${prefix}${counter.toString().padStart(3, '0')}`;
    }
    
    return newId;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getStatusText(status) {
    const statusMap = {
        'baru': 'Baru',
        'dalam_proses': 'Dalam Proses',
        'selesai': 'Selesai',
        'ditolak': 'Ditolak'
    };
    return statusMap[status] || status;
}

function getStatusFromText(text) {
    const statusMap = {
        'Baru': 'baru',
        'Dalam Proses': 'dalam_proses',
        'Selesai': 'selesai',
        'Ditolak': 'ditolak'
    };
    return statusMap[text] || 'baru';
}

function getRoleFromText(text) {
    const roleMap = {
        'Guru Besar': 'guru-besar',
        'GPKP': 'gpkp',
        'GPKHEM': 'gpkhem',
        'GPKKO': 'gpkko',
        'Pembantu Tadbir': 'pembantu-tadbir',
        'Pembantu Operasi': 'pembantu-operasi'
    };
    return roleMap[text] || 'pembantu-tadbir';
}

function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tarikh').value = today;
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    document.getElementById('notification').style.display = 'none';
}

// Initialize the application
updateUserInterface(); 