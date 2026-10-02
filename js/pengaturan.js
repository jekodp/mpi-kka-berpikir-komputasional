// =====================================================================
// HALAMAN PENGATURAN
// - Profil siswa (nama panggilan & gender) : segera hadir.
// - Reset ke keadaan awal: menghapus semua data aplikasi yang tersimpan
//   di perangkat ini (progres belajar, centang kisi-kisi, hasil simulasi,
//   dan petunjuk sekali-tampil), lalu memuat ulang aplikasi.
//   Tanda "aplikasi sudah terpasang" tidak dihapus karena itu keadaan
//   perangkat, bukan data belajar.
// =====================================================================

const PENGATURAN_PREFIX = 'mpi_bk_';
const PENGATURAN_DIBIARKAN = ['mpi_bk_terpasang', 'mpi_bk_dev', 'mpi_bk_dev_lewati'];
const PENGATURAN_RESET_OK = 'mpi_bk_reset_berhasil';   // sessionStorage: tampilkan pesan setelah dimuat ulang

function pengaturanRingkasan() {
    const b = progresBelajar();
    const k = progresKisi();
    let percobaan = 0;
    try { percobaan = JSON.parse(localStorage.getItem('mpi_bk_simulasi_riwayat') || '[]').length; } catch (e) { /* abaikan */ }
    return { b, k, percobaan };
}

function renderPengaturan() {
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    document.body.className = 'theme-dark';

    const r = pengaturanRingkasan();
    const kosong = r.b.done === 0 && r.k.done === 0 && r.percobaan === 0;

    elements.contentArea.innerHTML = `
        <div class="sim-container">
            <div class="sim-side">
                <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                <h2 class="sim-judul">Pengaturan</h2>
                <p class="kisi-subjudul">Atur aplikasi sesuai kebutuhanmu</p>
            </div>
            <div class="atur-kanan">
                <section class="tentang-kartu atur-kartu atur-segera" ${modeDev() ? 'style="display:none"' : ''}>
                    <div class="atur-kepala">
                        <h3 class="tentang-judul">&#128100; Profil Siswa</h3>
                        <span class="atur-chip">Segera hadir</span>
                    </div>
                    <div class="atur-baris">
                        <div><b>Nama Panggilan</b><span>Tokoh di materi akan memanggilmu dengan nama ini.</span></div>
                        <div class="atur-isian">&mdash;</div>
                    </div>
                    <div class="atur-baris">
                        <div><b>Gender</b><span>Menentukan siapa pemandu materimu: Kevin atau Kayana.</span></div>
                        <div class="atur-isian">&mdash;</div>
                    </div>
                </section>

                ${modeDev() ? `
                <section class="tentang-kartu atur-kartu atur-dev">
                    <div class="atur-kepala">
                        <h3 class="tentang-judul">&#128736; Mode Developer</h3>
                        <span class="atur-chip atur-chip-dev">Aktif</span>
                    </div>
                    <p class="atur-ket">Semua menu dan bab terbuka, dan navigasi bab selalu tampil. Progres asli tidak diubah.</p>
                    <div class="atur-aksi">
                        <label class="atur-centang"><input type="checkbox" id="dev-lewati" ${devLewatiPembuka() ? 'checked' : ''}> Lewati layar pemuatan dan sampul</label>
                        <button id="dev-matikan" class="atur-reset-btn atur-dev-btn">Matikan</button>
                    </div>
                </section>` : ''}

                <section class="tentang-kartu atur-kartu atur-bahaya">
                    <h3 class="tentang-judul">&#8634; Reset ke Keadaan Awal</h3>
                    <p class="atur-ket">Menghapus semua data belajarmu di perangkat ini, lalu aplikasi dimulai lagi dari awal seperti pertama kali dibuka.</p>
                    <div class="atur-data">
                        <div><span>Mulai Belajar</span><b>${r.b.done}<i>/${r.b.total} bab</i></b></div>
                        <div><span>Cek Kisi-Kisi</span><b>${r.k.done}<i>/${r.k.total} kompetensi</i></b></div>
                        <div><span>Simulasi ASTS</span><b>${r.percobaan}<i> percobaan</i></b></div>
                    </div>
                    <div class="atur-aksi">
                        <span class="atur-catatan">${kosong ? 'Belum ada data belajar yang tersimpan.' : '&#9888; Data yang sudah dihapus tidak bisa dikembalikan.'}</span>
                        <button id="atur-reset" class="atur-reset-btn">Reset Semua Data</button>
                    </div>
                </section>
            </div>
        </div>`;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => { appState.currentView = 'menu'; renderView(); });
    });
    document.getElementById('atur-reset').addEventListener('click', pengaturanKonfirmasiReset);

    const devMati = document.getElementById('dev-matikan');
    if (devMati) {
        devMati.addEventListener('click', () => { setModeDev(false); renderPengaturan(); });
        document.getElementById('dev-lewati').addEventListener('change', (e) => {
            try { e.target.checked ? localStorage.setItem(DEV_LEWATI_KEY, '1') : localStorage.removeItem(DEV_LEWATI_KEY); } catch (err) { /* abaikan */ }
        });
    }
}

function pengaturanKonfirmasiReset() {
    const r = pengaturanRingkasan();
    const m = simModal(`
        <div class="sim-modal-icon">&#9888;&#65039;</div>
        <h3>Reset semua data?</h3>
        <p>Yang akan dihapus dari perangkat ini:</p>
        <ul class="atur-daftar-hapus">
            <li>Progres <b>Mulai Belajar</b> (${r.b.done}/${r.b.total} bab)</li>
            <li>Centang <b>Cek Kisi-Kisi</b> (${r.k.done}/${r.k.total} kompetensi)</li>
            <li>Nilai &amp; riwayat <b>Simulasi ASTS</b> (${r.percobaan} percobaan)</li>
            <li>Petunjuk yang sudah pernah ditampilkan akan muncul lagi</li>
        </ul>
        <p class="atur-peringatan">Tindakan ini tidak bisa dibatalkan.</p>
        <div class="sim-modal-aksi">
            <button class="glass-btn sim-modal-btn2" data-aksi="tutup">Batal</button>
            <button class="sim-modal-btn2 atur-reset-yakin" id="atur-reset-yakin" disabled>Ya, reset (3)</button>
        </div>`, true);

    // Tombol baru bisa ditekan setelah 3 detik, agar tidak terhapus karena salah ketuk
    const yakin = m.querySelector('#atur-reset-yakin');
    let sisa = 3;
    const hitung = setInterval(() => {
        if (!m.isConnected) { clearInterval(hitung); return; }
        sisa--;
        if (sisa > 0) { yakin.innerText = `Ya, reset (${sisa})`; return; }
        clearInterval(hitung);
        yakin.disabled = false;
        yakin.innerText = 'Ya, reset sekarang';
    }, 1000);
    yakin.addEventListener('click', () => { if (!yakin.disabled) pengaturanJalankanReset(); });
}

function pengaturanJalankanReset() {
    try {
        Object.keys(localStorage)
            .filter(k => k.startsWith(PENGATURAN_PREFIX) && !PENGATURAN_DIBIARKAN.includes(k))
            .forEach(k => localStorage.removeItem(k));
        sessionStorage.setItem(PENGATURAN_RESET_OK, '1');
    } catch (e) { /* abaikan */ }
    // Muat ulang agar semua keadaan di memori ikut kembali ke awal
    location.reload();
}

// Setelah dimuat ulang: beri tahu bahwa reset berhasil
document.addEventListener('DOMContentLoaded', () => {
    let ok = null;
    try { ok = sessionStorage.getItem(PENGATURAN_RESET_OK); sessionStorage.removeItem(PENGATURAN_RESET_OK); } catch (e) { /* abaikan */ }
    if (!ok) return;
    setTimeout(() => {
        const root = elements.contentArea.firstElementChild;
        if (!root) return;
        const t = document.createElement('div');
        t.className = 'atur-toast';
        t.innerHTML = '&#10003; Semua data sudah direset. Selamat belajar dari awal!';
        root.appendChild(t);
        t.animate([{ opacity: 0, transform: 'translate(-50%, 20px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }],
            { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        setTimeout(() => {
            const a = t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
            a.onfinish = () => t.remove();
        }, 3500);
    }, 400);
});
