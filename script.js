// Konfigurasi Google Sheets diimport dari config.js

// Data aplikasi
let suratMasukData = [];
let suratKeluarData = [];

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupEventListeners();
    
    // Periksa konfigurasi Google Sheets
    if (typeof validateConfig === 'function' && validateConfig()) {
        console.log('Google Sheets API dikonfigurasi dengan betul');
        // loadData(); // Uncomment untuk menggunakan Google Sheets
    } else {
        console.log('Menggunakan data sample kerana Google Sheets tidak dikonfigurasi');
    }
    
    loadSampleData();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = button.getAttribute('data-page');
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });
        });
    });
}

function setupEventListeners() {
    const suratForm = document.getElementById('surat-form');
    if (suratForm) {
        suratForm.addEventListener('submit', handleFormSubmit);
    }

    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditModal);
    }

    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
}

function loadSampleData() {
    suratMasukData = [
        {
            id: 1,
            noRujukan: 'SKRP/2024/001',
            tarikhTerima: '2024-01-15',
            pengirim: 'Jabatan Pendidikan Negeri',
            subjek: 'Permohonan Bantuan Peralatan Komputer',
            status: 'Baru',
            tindakanSiapa: 'En. Ahmad',
            muatNaikSurat: 'surat_001.pdf'
        },
        {
            id: 2,
            noRujukan: 'SKRP/2024/002',
            tarikhTerima: '2024-01-16',
            pengirim: 'Majlis Daerah',
            subjek: 'Pemberitahuan Mesyuarat Bulanan',
            status: 'Dalam Proses',
            tindakanSiapa: 'Pn. Siti',
            muatNaikSurat: 'surat_002.pdf'
        }
    ];

    suratKeluarData = [
        {
            id: 1,
            noRujukan: 'SKRP/OUT/2024/001',
            tarikhTerima: '2024-01-17',
            pengirim: 'SKRPget',
            subjek: 'Jawapan Permohonan Bantuan',
            status: 'Selesai',
            tindakanSiapa: 'En. Ahmad',
            muatNaikSurat: 'surat_keluar_001.pdf'
        }
    ];

    renderSuratMasukTable();
    renderSuratKeluarTable();
}

function renderSuratMasukTable() {
    const tbody = document.getElementById('surat-masuk-tbody');
    if (!tbody) return;

    if (suratMasukData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tiada Surat Masuk</h3>
                    <p>Belum ada surat masuk yang direkodkan</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = suratMasukData.map(surat => `
        <tr>
            <td><strong>${surat.noRujukan}</strong></td>
            <td>${formatDate(surat.tarikhTerima)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${getStatusClass(surat.status)}">${surat.status}</span></td>
            <td>${surat.tindakanSiapa}</td>
            <td>
                ${surat.muatNaikSurat ? 
                    `<a href="#" onclick="downloadFile('${surat.muatNaikSurat}')" class="btn-secondary">
                        <i class="fas fa-download"></i> ${surat.muatNaikSurat}
                    </a>` : 
                    '<span class="text-muted">Tiada fail</span>'
                }
            </td>
            <td>
                <button class="btn-edit" onclick="editSurat('masuk', ${surat.id})">
                    <i class="fas fa-edit"></i> Kemaskini
                </button>
                <button class="btn-delete" onclick="deleteSurat('masuk', ${surat.id})">
                    <i class="fas fa-trash"></i> Padam
                </button>
            </td>
        </tr>
    `).join('');
}

function renderSuratKeluarTable() {
    const tbody = document.getElementById('surat-keluar-tbody');
    if (!tbody) return;

    if (suratKeluarData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-paper-plane"></i>
                    <h3>Tiada Surat Keluar</h3>
                    <p>Belum ada surat keluar yang direkodkan</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = suratKeluarData.map(surat => `
        <tr>
            <td><strong>${surat.noRujukan}</strong></td>
            <td>${formatDate(surat.tarikhTerima)}</td>
            <td>${surat.pengirim}</td>
            <td>${surat.subjek}</td>
            <td><span class="status-badge status-${getStatusClass(surat.status)}">${surat.status}</span></td>
            <td>${surat.tindakanSiapa}</td>
            <td>
                ${surat.muatNaikSurat ? 
                    `<a href="#" onclick="downloadFile('${surat.muatNaikSurat}')" class="btn-secondary">
                        <i class="fas fa-download"></i> ${surat.muatNaikSurat}
                    </a>` : 
                    '<span class="text-muted">Tiada fail</span>'
                }
            </td>
            <td>
                <button class="btn-edit" onclick="editSurat('keluar', ${surat.id})">
                    <i class="fas fa-edit"></i> Kemaskini
                </button>
                <button class="btn-delete" onclick="deleteSurat('keluar', ${surat.id})">
                    <i class="fas fa-trash"></i> Padam
                </button>
            </td>
        </tr>
    `).join('');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const suratData = {
        jenisSurat: formData.get('jenis-surat'),
        noRujukan: formData.get('no-rujukan'),
        tarikhTerima: formData.get('tarikh-terima'),
        pengirim: formData.get('pengirim'),
        subjek: formData.get('subjek'),
        status: formData.get('status'),
        tindakanSiapa: formData.get('tindakan-siapa'),
        muatNaikSurat: formData.get('muat-naik')?.name || ''
    };

    if (suratData.jenisSurat === 'masuk') {
        addSuratMasuk(suratData);
    } else {
        addSuratKeluar(suratData);
    }
    
    e.target.reset();
    showMessage('Surat berjaya ditambah', 'success');
    switchToPage(suratData.jenisSurat === 'masuk' ? 'surat-masuk' : 'surat-keluar');
}

function addSuratMasuk(suratData) {
    const newSurat = {
        id: Date.now(),
        ...suratData
    };
    
    suratMasukData.push(newSurat);
    renderSuratMasukTable();
}

function addSuratKeluar(suratData) {
    const newSurat = {
        id: Date.now(),
        ...suratData
    };
    
    suratKeluarData.push(newSurat);
    renderSuratKeluarTable();
}

function editSurat(jenis, id) {
    const data = jenis === 'masuk' ? suratMasukData : suratKeluarData;
    const surat = data.find(s => s.id === id);
    
    if (!surat) {
        showMessage('Surat tidak dijumpai', 'error');
        return;
    }

    document.getElementById('edit-id').value = surat.id;
    document.getElementById('edit-jenis').value = jenis;
    document.getElementById('edit-no-rujukan').value = surat.noRujukan;
    document.getElementById('edit-tarikh-terima').value = surat.tarikhTerima;
    document.getElementById('edit-pengirim').value = surat.pengirim;
    document.getElementById('edit-subjek').value = surat.subjek;
    document.getElementById('edit-status').value = surat.status;
    document.getElementById('edit-tindakan-siapa').value = surat.tindakanSiapa;

    document.getElementById('edit-modal').style.display = 'block';
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const suratData = {
        id: parseInt(formData.get('edit-id')),
        jenis: formData.get('edit-jenis'),
        noRujukan: formData.get('edit-no-rujukan'),
        tarikhTerima: formData.get('edit-tarikh-terima'),
        pengirim: formData.get('edit-pengirim'),
        subjek: formData.get('edit-subjek'),
        status: formData.get('edit-status'),
        tindakanSiapa: formData.get('edit-tindakan-siapa'),
        muatNaikSurat: formData.get('edit-muat-naik')?.name || ''
    };

    if (suratData.jenis === 'masuk') {
        updateSuratMasuk(suratData);
    } else {
        updateSuratKeluar(suratData);
    }
    
    closeEditModal();
    showMessage('Surat berjaya dikemaskini', 'success');
}

function updateSuratMasuk(suratData) {
    const index = suratMasukData.findIndex(s => s.id === suratData.id);
    if (index !== -1) {
        suratMasukData[index] = { ...suratMasukData[index], ...suratData };
        renderSuratMasukTable();
    }
}

function updateSuratKeluar(suratData) {
    const index = suratKeluarData.findIndex(s => s.id === suratData.id);
    if (index !== -1) {
        suratKeluarData[index] = { ...suratKeluarData[index], ...suratData };
        renderSuratKeluarTable();
    }
}

function deleteSurat(jenis, id) {
    if (!confirm('Adakah anda pasti mahu memadamkan surat ini?')) {
        return;
    }

    if (jenis === 'masuk') {
        deleteSuratMasuk(id);
    } else {
        deleteSuratKeluar(id);
    }
    
    showMessage('Surat berjaya dipadamkan', 'success');
}

function deleteSuratMasuk(id) {
    suratMasukData = suratMasukData.filter(s => s.id !== id);
    renderSuratMasukTable();
}

function deleteSuratKeluar(id) {
    suratKeluarData = suratKeluarData.filter(s => s.id !== id);
    renderSuratKeluarTable();
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('edit-form').reset();
}

function showAddForm(jenis) {
    document.getElementById('jenis-surat').value = jenis;
    switchToPage('tambah-surat');
}

function switchToPage(pageId) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    
    navButtons.forEach(btn => btn.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    const targetButton = document.querySelector(`[data-page="${pageId}"]`);
    const targetPage = document.getElementById(pageId);
    
    if (targetButton) targetButton.classList.add('active');
    if (targetPage) targetPage.classList.add('active');
}

function downloadFile(filename) {
    alert(`Muat turun fail: ${filename}\n\nNota: Fungsi ini memerlukan implementasi backend untuk memuat turun fail sebenar.`);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY');
}

function getStatusClass(status) {
    switch (status) {
        case 'Baru': return 'baru';
        case 'Dalam Proses': return 'proses';
        case 'Selesai': return 'selesai';
        case 'Ditolak': return 'ditolak';
        default: return 'baru';
    }
}

function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Export functions for global access
window.showAddForm = showAddForm;
window.editSurat = editSurat;
window.deleteSurat = deleteSurat;
window.downloadFile = downloadFile;
window.closeEditModal = closeEditModal; 