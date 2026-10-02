// =====================================================================
// HALAMAN PENGATURAN
// Tampilan: bento empat ubin (Musik Latar, Progresmu, Profil Siswa,
// Mulai dari Awal) dengan gaya kartu yang sama seperti halaman Tentang.
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
    let percobaan = 0, terbaik = null;
    try {
        const riwayat = JSON.parse(localStorage.getItem('mpi_bk_simulasi_riwayat') || '[]');
        percobaan = riwayat.length;
        riwayat.forEach(x => { if (typeof x.nilai === 'number' && (terbaik === null || x.nilai > terbaik)) terbaik = x.nilai; });
    } catch (e) { /* abaikan */ }
    return { b, k, percobaan, terbaik };
}

function renderPengaturan() {
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    document.body.className = 'theme-dark';

    const r = pengaturanRingkasan();
    const kosong = r.b.done === 0 && r.k.done === 0 && r.percobaan === 0;

    // Cincin progres (SVG): persen 0..100
    const cincin = (persen, warna, tengah) => {
        const k = 2 * Math.PI * 34;
        return `<svg viewBox="0 0 84 84" class="at-cincin"><circle cx="42" cy="42" r="34" class="at-cincin-latar"/>
            <circle cx="42" cy="42" r="34" stroke="${warna}" stroke-dasharray="${k}" stroke-dashoffset="${k * (1 - Math.min(100, Math.max(0, persen)) / 100)}" class="at-cincin-isi"/>
            <text x="42" y="47" text-anchor="middle">${tengah}</text></svg>`;
    };
    const pB = r.b.total ? r.b.done / r.b.total * 100 : 0;
    const pK = r.k.total ? r.k.done / r.k.total * 100 : 0;
    const nilai = r.terbaik === null ? null : Math.round(r.terbaik);

    // Tata letak bento (empat ubin), dengan gaya yang sama seperti halaman Tentang:
    // gambar sampul sebagai latar, ubin kaca biru tua, dan satu warna aksen (ungu = warna tombol Pengaturan).
    elements.contentArea.innerHTML = `
        <div class="ttg-container atur">
            <div class="ttg-latar atb-latar" id="ttg-latar"></div>
            <div class="kisi-list-header ttg-kepala">
                <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                <h2>Pengaturan</h2>
            </div>
            <div class="atb-grid">
                <section class="ttg-kartu atb-ubin atb-musik">
                    ${typeof musikKartuHTML === 'function' ? musikKartuHTML() : ''}
                </section>

                <section class="ttg-kartu atb-ubin atb-progres">
                    <span class="ttg-label">Progresmu</span>
                    <div class="at-progres-baris">
                        <div class="at-stat">${cincin(pB, '#3498db', Math.round(pB) + '%')}<div><b>Mulai Belajar</b><span>${r.b.done} dari ${r.b.total} bab selesai</span></div></div>
                        <div class="at-stat">${cincin(pK, '#e67e22', Math.round(pK) + '%')}<div><b>Cek Kisi-Kisi</b><span>${r.k.done} dari ${r.k.total} kompetensi</span></div></div>
                        <div class="at-stat">${cincin(nilai === null ? 0 : nilai, '#2ecc71', nilai === null ? '&ndash;' : nilai)}<div><b>Simulasi ASTS</b><span>${r.percobaan ? `Nilai terbaik dari ${r.percobaan} percobaan` : 'Belum pernah dicoba'}</span></div></div>
                    </div>
                </section>

                ${modeDev() ? `
                <section class="ttg-kartu atb-ubin">
                    <div class="at-kepala"><span class="ttg-label">Mode Developer</span><span class="at-lencana hijau">Aktif</span></div>
                    <p class="at-ket">Semua menu dan bab terbuka, dan navigasi bab selalu tampil. Progres asli tidak diubah.</p>
                    <label class="atur-centang"><input type="checkbox" id="dev-lewati" ${devLewatiPembuka() ? 'checked' : ''}> Lewati layar pemuatan dan sampul</label>
                    <button id="dev-matikan" class="at-tombol hijau">Matikan mode developer</button>
                </section>` : `
                <section class="ttg-kartu atb-ubin">
                    <div class="at-kepala"><span class="ttg-label">Profil Siswa</span><span class="at-lencana">Segera hadir</span></div>
                    <div class="at-profil-baris"><b>Nama Panggilan</b><span>Kevin dan Kayana akan memanggilmu dengan nama ini.</span></div>
                    <div class="at-profil-baris"><b>Pemandu</b><span>Pilih siapa yang memandumu: Kevin atau Kayana.</span></div>
                </section>`}

                <section class="ttg-kartu atb-ubin">
                    <span class="ttg-label">Mulai dari Awal</span>
                    <p class="at-ket">Menghapus semua data belajarmu di perangkat ini. Aplikasi kembali seperti pertama kali dibuka.</p>
                    <span class="at-catatan">${kosong ? 'Belum ada data belajar yang tersimpan.' : 'Data yang dihapus tidak bisa dikembalikan.'}</span>
                    <button id="atur-reset" class="at-tombol merah">Reset Semua Data</button>
                </section>
            </div>
        </div>`;
    cariAset('cover', (src) => { const bg = document.getElementById('ttg-latar'); if (bg) bg.style.backgroundImage = `url('${src}')`; });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => { appState.currentView = 'menu'; renderView(); });
    });
    document.getElementById('atur-reset').addEventListener('click', pengaturanKonfirmasiReset);
    if (typeof musikPasangKartu === 'function') musikPasangKartu();

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
