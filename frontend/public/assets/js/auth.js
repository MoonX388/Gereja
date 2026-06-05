// @ts-nocheck
// ========== TOAST ==========
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon} toast-icon"></i><span class="toast-message">${msg}</span><i class="fa-solid fa-xmark toast-close" onclick="this.parentElement.remove()"></i>`;
    container.appendChild(toast);
    setTimeout(() => { if(toast.parentElement) toast.remove(); }, 4000);
}

// ========== LOGIN HANDLER (BACKEND NESTJS) ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;

        if (!email.trim()) { showToast('Masukkan email', 'error'); return; }
        if (!password) { showToast('Password tidak boleh kosong', 'error'); return; }

        try {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login gagal');
            
            if (data.user.role !== 'admin') {
                showToast('Akun ini bukan admin', 'error');
                return;
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast(`Selamat datang, ${data.user.nama}!`, 'success');
            setTimeout(() => {
                window.parent.location.href = '/admin';
            }, 1000);
        } catch (err) {
            showToast(err.message || 'Login gagal', 'error');
        }
    });
}

// ========== REGISTER HANDLER (LOCALSTORAGE) ==========
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nama = document.getElementById('regNama').value.trim();
        const gender = document.getElementById('regGender').value;
        const baptis = document.getElementById('regBaptis').value;
        const tempatLahir = document.getElementById('regTempatLahir').value.trim();
        const tglLahir = document.getElementById('regTglLahir').value;
        const telp = document.getElementById('regTelp').value.trim();
        const alamat = document.getElementById('regAlamat').value.trim();
        const nikah = document.getElementById('regNikah').value;
        const pekerjaan = document.getElementById('regPekerjaan').value.trim();
        const status = document.getElementById('regStatus').value;

        if (!nama) { showToast('Nama lengkap wajib diisi', 'error'); return; }
        if (!gender) { showToast('Pilih jenis kelamin', 'error'); return; }
        if (!baptis) { showToast('Pilih status baptis', 'error'); return; }
        if (!tempatLahir) { showToast('Tempat lahir wajib diisi', 'error'); return; }
        if (!tglLahir) { showToast('Tanggal lahir wajib diisi', 'error'); return; }
        if (!telp) { showToast('Nomor telepon wajib diisi', 'error'); return; }
        if (!alamat) { showToast('Alamat wajib diisi', 'error'); return; }
        if (!nikah) { showToast('Pilih status pernikahan', 'error'); return; }
        if (!pekerjaan) { showToast('Pekerjaan wajib diisi', 'error'); return; }
        if (!status) { showToast('Pilih status keaktifan', 'error'); return; }

        const newMember = {
            id: `jmt_${Date.now()}`,
            nama, gender, baptis, tempatLahir, tglLahir, alamat, telp, nikah, pekerjaan, status
        };

        const jemaat = JSON.parse(localStorage.getItem('gd_jemaat') || '[]');
        jemaat.push(newMember);
        localStorage.setItem('gd_jemaat', JSON.stringify(jemaat));
        showToast(`Anggota ${nama} berhasil didaftarkan!`, 'success');
        document.getElementById('registerForm').reset();
    });
}