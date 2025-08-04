// Application State
let currentRole = 'guru-besar'; // 'guru-besar', 'gpkp', 'gpkhem', 'gpkko', 'pembantu-tadbir', 'pembantu-operasi'
let suratMasuk = [];
let suratKeluar = [];
let currentEditingId = null;
let uploadedFiles = [];
let googleSheetsApiKey = null;
let googleSheetsId = null;

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    apiKey: 'AIzaSyBFkqC_FD52gbJryLnazM9rUZDh68yeddk', // Replace with your API key
    spreadsheetId: '15nu60sG09vyZgCPGie8PosMszyNPTeVKMRIkr_4ooOM', // Replace with your spreadsheet ID
    range: 'A:Z'
};

// DOM Elements
const currentUserElement = document.getElementById('currentUser');
const switchRoleBtn = document.getElementById('switchRole');
const navButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

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
    switchRoleBtn.addEventListener('click', switchRole);
    
    // Navigation
    navButtons.forEach(btn => {
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
    
    // Notification close
    document.querySelector('.notification-close').addEventListener('click', hideNotification);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Upload functionality
    setupUploadListeners();
    
    // Google Sheets buttons
    document.getElementById('syncToSheets').addEventListener('click', syncToGoogleSheets);
    document.getElementById('loadFromSheets').addEventListener('click', loadFromGoogleSheets);
    document.getElementById('openSheets').addEventListener('click', openGoogleSheets);
    
    // Auto-sync toggle
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    if (autoSyncToggle) {
        autoSyncToggle.addEventListener('change', toggleAutoSync);
        // Set initial state
        autoSyncToggle.checked = localStorage.getItem('autoSyncToSheets') === 'true';
    }
}

// Upload Setup
function setupUploadListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
}

// File Upload Handler
function handleFileUpload(files) {
    Array.from(files).forEach(file => {
        if (validateFile(file)) {
            const fileData = {
                id: generateFileId(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                file: file
            };
            
            uploadedFiles.push(fileData);
            renderUploadedFiles();
            showNotification(`Fail ${file.name} berjaya dimuat naik`, 'success');
        }
    });
}

// File Validation
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
        showNotification(`Jenis fail ${file.name} tidak diterima`, 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification(`Saiz fail ${file.name} terlalu besar (maksimum 10MB)`, 'error');
        return false;
    }
    
    return true;
}

// Render Uploaded Files
function renderUploadedFiles() {
    const container = document.getElementById('uploadedFilesList');
    container.innerHTML = '';
    
    uploadedFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = getFileIcon(file.type);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${formatFileSize(file.size)} • ${formatDate(file.uploadDate)}</p>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn btn-danger" onclick="removeFile('${file.id}')">
                    <i class="fas fa-trash"></i> Padam
                </button>
            </div>
        `;
        
        container.appendChild(fileItem);
    });
}

// Get File Icon
function getFileIcon(type) {
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fas fa-file-word';
    if (type.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove File
function removeFile(fileId) {
    const index = uploadedFiles.findIndex(f => f.id === fileId);
    if (index !== -1) {
        uploadedFiles.splice(index, 1);
        renderUploadedFiles();
        showNotification('Fail berjaya dipadam', 'success');
    }
}

// Generate File ID
function generateFileId() {
    return 'FILE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    const roleText = getRoleText(currentRole);
    currentUserElement.textContent = roleText;
    
    // Update permissions based on role
    const addButton = document.querySelector('[data-tab="tambah-surat"]');
    const uploadButton = document.querySelector('[data-tab="muat-naik"]');
    
    // Only Pembantu Operasi and Pembantu Tadbir can add letters
    if (currentRole === 'guru-besar' || currentRole === 'gpkp' || currentRole === 'gpkhem' || currentRole === 'gpkko') {
        addButton.style.opacity = '0.5';
        addButton.style.pointerEvents = 'none';
    } else {
        addButton.style.opacity = '1';
        addButton.style.pointerEvents = 'auto';
    }
    
    // All roles can upload files
    uploadButton.style.opacity = '1';
    uploadButton.style.pointerEvents = 'auto';
}

// Tab Management
function switchTab(tabId) {
    // Update navigation buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // Update tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}

// Data Management
function loadData() {
    // Load from localStorage or use sample data
    const storedMasuk = localStorage.getItem('suratMasuk');
    const storedKeluar = localStorage.getItem('suratKeluar');
    const storedFiles = localStorage.getItem('uploadedFiles');
    
    if (storedMasuk) {
        suratMasuk = JSON.parse(storedMasuk);
    } else {
        // Sample data for Surat Masuk
        suratMasuk = [
            {
                id: 'SM001',
                noRujukan: 'SKRP/2024/001',
                tarikh: '2024-01-15',
                pengirim: 'Jabatan Pendidikan Negeri',
                subjek: 'Permohonan Maklumat Program Akademik',
                keterangan: 'Surat rasmi untuk mendapatkan maklumat program akademik terkini',
                status: 'baru',
                tindakanSiapa: 'guru-besar'
            },
            {
                id: 'SM002',
                noRujukan: 'SKRP/2024/002',
                tarikh: '2024-01-20',
                pengirim: 'Universiti Malaya',
                subjek: 'Jemputan Kolaborasi Penyelidikan',
                keterangan: 'Jemputan untuk kerjasama dalam projek penyelidikan bersama',
                status: 'dalam_proses',
                tindakanSiapa: 'gpkp'
            }
        ];
    }
    
    if (storedKeluar) {
        suratKeluar = JSON.parse(storedKeluar);
    } else {
        // Sample data for Surat Keluar
        suratKeluar = [
            {
                id: 'SK001',
                noRujukan: 'SKRP/OUT/2024/001',
                tarikh: '2024-01-10',
                penerima: 'Kementerian Pendidikan Malaysia',
                subjek: 'Laporan Prestasi Akademik 2023',
                keterangan: 'Laporan tahunan prestasi akademik sekolah',
                status: 'selesai',
                tindakanSiapa: 'pembantu-operasi'
            },
            {
                id: 'SK002',
                noRujukan: 'SKRP/OUT/2024/002',
                tarikh: '2024-01-25',
                penerima: 'PIBG SKRP',
                subjek: 'Jemputan Mesyuarat Agung Tahunan',
                keterangan: 'Jemputan untuk mesyuarat agung tahunan PIBG',
                status: 'baru',
                tindakanSiapa: 'pembantu-tadbir'
            }
        ];
    }
    
    if (storedFiles) {
        uploadedFiles = JSON.parse(storedFiles);
    }
}

function saveData() {
    localStorage.setItem('suratMasuk', JSON.stringify(suratMasuk));
    localStorage.setItem('suratKeluar', JSON.stringify(suratKeluar));
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    
    // Auto-sync to Google Sheets if enabled
    if (localStorage.getItem('autoSyncToSheets') === 'true') {
        setTimeout(() => {
            syncToGoogleSheets();
        }, 1000);
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
        
        // Add event listener for file upload
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
        
        // Add event listener for file upload
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
    
    const formData = new FormData(e.target);
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
    
    // Find and update the surat
    let suratList = currentEditingId.startsWith('SM') ? suratMasuk : suratKeluar;
    const suratIndex = suratList.findIndex(s => s.id === currentEditingId);
    
    if (suratIndex !== -1) {
        suratList[suratIndex] = { ...suratList[suratIndex], ...suratData };
        saveData();
        renderTables();
        closeModal();
        showNotification('Surat berjaya dikemaskini', 'success');
    }
}

function handleDeleteSurat() {
    if (confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        let suratList = currentEditingId.startsWith('SM') ? suratMasuk : suratKeluar;
        const suratIndex = suratList.findIndex(s => s.id === currentEditingId);
        
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
    currentEditingId = id;
    const suratList = jenis === 'masuk' ? suratMasuk : suratKeluar;
    const surat = suratList.find(s => s.id === id);
    
    if (surat) {
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
        
        modalTitle.textContent = `Edit Surat ${jenis === 'masuk' ? 'Masuk' : 'Keluar'}`;
        modal.style.display = 'block';
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
    modal.style.display = 'none';
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
    
    // Prepare data for Google Sheets
    const data = prepareDataForSheets();
    
    // Check if Google Sheets API is available
    if (typeof gapi === 'undefined' || !gapi.client) {
        showNotification('Google Sheets API tidak tersedia. Sila periksa konfigurasi.', 'error');
        button.innerHTML = originalText;
        button.disabled = false;
        return;
    }
    
    // Clear existing data and write new data
    gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
        range: 'A:Z'
    }).then(() => {
        return gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: 'A1',
            valueInputOption: 'RAW',
            resource: {
                values: data
            }
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
        
        // Check if Google Sheets API is available
        if (typeof gapi === 'undefined' || !gapi.client) {
            showNotification('Google Sheets API tidak tersedia. Sila periksa konfigurasi.', 'error');
            button.innerHTML = originalText;
            button.disabled = false;
            return;
        }
        
        // Read data from Google Sheets
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
            range: 'A:Z'
        }).then((response) => {
            const values = response.result.values;
            if (values && values.length > 1) {
                // Process the data and update local storage
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
    // Skip header row
    const dataRows = values.slice(1);
    
    // Clear existing data
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
    
    // Save to local storage and re-render
    saveData();
    renderTables();
}

function prepareDataForSheets() {
    const headers = ['Jenis', 'No. Rujukan', 'Tarikh', 'Pengirim/Penerima', 'Subjek', 'Status', 'Tindakan Siapa', 'Fail Surat', 'Saiz Fail', 'Tarikh Muat Naik'];
    const data = [headers];
    
    // Add Surat Masuk
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
    
    // Add Surat Keluar
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
    
    // Validate file
    if (!validateFile(file)) {
        return;
    }
    
    // Find the surat in the appropriate array
    const suratArray = jenis === 'masuk' ? suratMasuk : suratKeluar;
    const surat = suratArray.find(s => s.id === suratId);
    
    if (surat) {
        // Update the surat with file information
        surat.suratFile = file.name;
        surat.fileSize = formatFileSize(file.size);
        surat.uploadDate = new Date().toISOString();
        
        // Save data
        saveData();
        
        // Re-render tables to show the uploaded file
        renderTables();
        
        showNotification(`Fail "${file.name}" berjaya dimuat naik untuk surat ${surat.noRujukan}`, 'success');
    }
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
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    notification.style.display = 'none';
}

// Initialize the application
updateUserInterface(); 