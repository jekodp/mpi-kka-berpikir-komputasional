// =====================================================================
// PANDUAN INSTAL APLIKASI (mode "Tambahkan ke Layar Utama" / PWA)
// - Tombol "Instal" di pojok kanan atas Menu Utama, tampil di semua
//   perangkat SELAMA website dibuka lewat browser. Disembunyikan bila
//   sedang dibuka dari ikon aplikasi (pasti sudah terpasang).
// - Sorotan (spotlight) ke tombol itu muncul SEKALI saja.
// - Jendela panduan bertab: Android, iPhone/iPad, Laptop/PC, WhatsApp/IG.
// - Jika browser memberi tanda aplikasi sudah terpasang (Chrome/Edge),
//   jendela panduan menampilkan pesan "sepertinya sudah terpasang".
// =====================================================================

const PASANG_SPOTLIGHT_KEY = 'mpi_bk_spotlight_pasang';
const PASANG_TERPASANG_KEY = 'mpi_bk_terpasang';   // tanda dari browser bahwa aplikasi pernah terpasang
let pasangPromptAndroid = null;   // jendela instal bawaan Chrome/Edge (Android & laptop), jika tersedia

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();            // tahan dulu, munculkan saat murid menekan tombol Instal
    pasangPromptAndroid = e;
    // Chrome hanya menawarkan instal bila aplikasi BELUM terpasang, jadi tanda lama dihapus
    pasangSetTanda(false);
    pasangPerbaruiTombolAndroid();
});
window.addEventListener('appinstalled', () => {
    pasangPromptAndroid = null;
    pasangSetTanda(true);
    pasangPerbaruiTombolAndroid();
});

function pasangSetTanda(on) {
    try { on ? localStorage.setItem(PASANG_TERPASANG_KEY, '1') : localStorage.removeItem(PASANG_TERPASANG_KEY); } catch (e) { /* abaikan */ }
}
function pasangTerdeteksiTerpasang() {
    try { return localStorage.getItem(PASANG_TERPASANG_KEY) === '1'; } catch (e) { return false; }
}

// Service worker sederhana agar Chrome mengenali website sebagai aplikasi (hanya di HTTPS, mis. GitHub Pages)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

// ---------- DETEKSI PERANGKAT ----------
function pasangPlatform() {
    const ua = navigator.userAgent;
    if (/FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|Snapchat|; wv\)/i.test(ua)) return 'inapp';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return 'desktop';
}
function pasangSudahTerpasang() {
    return window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches;
}
function pasangPerluDitawarkan() {
    return !pasangSudahTerpasang();
}
// Dibuka dari ikon: catat tandanya (di Android/laptop penyimpanan dipakai bersama browser)
if (pasangSudahTerpasang()) pasangSetTanda(true);

// ---------- TOMBOL DI MENU UTAMA & SPOTLIGHT ----------
// Dipanggil setiap kali Menu Utama selesai digambar (lihat renderMainMenu di app.js)
function pasangSetelahMenu() {
    if (!pasangPerluDitawarkan()) return;
    const root = document.querySelector('.main-menu-container');
    if (!root || document.getElementById('btn-pasang')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-pasang';
    btn.className = 'glass-btn pasang-btn';
    btn.innerHTML = '&#128242; Instal';
    btn.title = 'Cara memasang aplikasi ini';
    btn.addEventListener('click', (e) => { e.stopPropagation(); bukaPanduanPasang(); });
    root.appendChild(btn);

    let sudah = null;
    try { sudah = localStorage.getItem(PASANG_SPOTLIGHT_KEY); } catch (e) { sudah = '1'; }
    const ujianBerjalan = (typeof simulasiAktif === 'function') && simulasiAktif();
    if (!sudah && !ujianBerjalan) {
        setTimeout(() => {
            // Pastikan masih di Menu Utama (murid belum pindah halaman)
            if (document.getElementById('btn-pasang') === btn && !document.querySelector('.pasang-spot')) pasangTampilSpotlight(btn);
        }, 1100);
    }
}

function pasangTampilSpotlight(btn) {
    try { localStorage.setItem(PASANG_SPOTLIGHT_KEY, '1'); } catch (e) { /* abaikan */ }
    const root = btn.parentElement;
    const pad = 8;
    const x = btn.offsetLeft - pad, y = btn.offsetTop - pad;
    const w = btn.offsetWidth + pad * 2, h = btn.offsetHeight + pad * 2;

    const spot = document.createElement('div');
    spot.className = 'pasang-spot';
    spot.innerHTML = `
        <div class="pasang-spot-lubang" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>
        <div class="pasang-spot-tip" style="top:${y + h + 18}px;right:${root.clientWidth - (x + w)}px">
            <div class="pasang-spot-panah"></div>
            <h4>Instal MPI BK di perangkatmu!</h4>
            <p>Tampil layar penuh dan bisa dibuka langsung dari ikon, seperti aplikasi.</p>
            <div class="pasang-spot-aksi">
                <button class="glass-btn pasang-nanti">Nanti saja</button>
                <button class="btn-primary pasang-lihat">Lihat caranya &#10095;</button>
            </div>
        </div>`;
    root.appendChild(spot);
    spot.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
    spot.querySelector('.pasang-spot-tip').animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 450, delay: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });

    const tutup = () => {
        const a = spot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-in' });
        a.onfinish = () => spot.remove();
    };
    spot.querySelector('.pasang-nanti').addEventListener('click', (e) => { e.stopPropagation(); tutup(); });
    spot.querySelector('.pasang-lihat').addEventListener('click', (e) => { e.stopPropagation(); tutup(); bukaPanduanPasang(); });
    spot.querySelector('.pasang-spot-lubang').addEventListener('click', (e) => { e.stopPropagation(); tutup(); bukaPanduanPasang(); });
    spot.addEventListener('click', (e) => e.stopPropagation());   // menu di belakang tidak ikut tersentuh
}

// ---------- ISI PANDUAN (dipakai di jendela panduan & halaman Tentang) ----------
const PASANG_IKON_SHARE = '<span class="pasang-ikon"><svg viewBox="0 0 24 24" width="15" height="15"><path d="M12 3l-4 4h3v8h2V7h3l-4-4zM5 10v10h14V10h-2v8H7v-8H5z" fill="currentColor"/></svg></span>';
const PASANG_IKON_TITIK = '<span class="pasang-ikon">&#8942;</span>';
const PASANG_IKON_INSTAL = '<span class="pasang-ikon"><svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 4h16v11H4zM2 17h20v2H2zM12 6v5.2l2.1-2.1 1.4 1.4L12 14l-3.5-3.5 1.4-1.4 2.1 2.1V6z" fill="currentColor"/></svg></span>';

function pasangIsiPanduan() {
    return `
        <div class="pasang-tabs">
            <button data-tab="android">Android</button>
            <button data-tab="ios">iPhone / iPad</button>
            <button data-tab="desktop">Laptop / PC</button>
            <button data-tab="inapp">Dibuka dari WhatsApp / IG</button>
        </div>
        <div class="pasang-panel" data-panel="android">
            <div class="pasang-android-langsung">
                <p>HP-mu siap memasang aplikasi ini dengan satu ketukan.</p>
                <button class="btn-primary pasang-android-btn">&#128242; Pasang Aplikasi</button>
            </div>
            <ol class="pasang-langkah">
                <li><b>Buka di Chrome</b>, bukan browser lain.</li>
                <li>Ketuk ${PASANG_IKON_TITIK} <b>menu titik tiga</b> di pojok kanan atas.</li>
                <li>Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>, lalu ketuk <b>Instal</b>.</li>
                <li>Buka dari ikon <b>MPI BK</b> di layar HP-mu.</li>
            </ol>
        </div>
        <div class="pasang-panel" data-panel="ios">
            <ol class="pasang-langkah">
                <li><b>Buka di Safari</b>, bukan Chrome atau browser lain.</li>
                <li>Ketuk ${PASANG_IKON_SHARE} <b>Bagikan</b> di bilah bawah atau atas Safari.</li>
                <li>Gulir lalu pilih <b>Tambahkan ke Layar Utama</b>, kemudian ketuk <b>Tambah</b>.</li>
                <li>Buka dari ikon <b>MPI BK</b> di layar HP-mu.</li>
            </ol>
            <p class="pasang-catatan">&#9432; Di iPhone, progres belajar di ikon Layar Utama terpisah dari Safari. Sebaiknya selalu belajar lewat ikon.</p>
        </div>
        <div class="pasang-panel" data-panel="desktop">
            <div class="pasang-android-langsung">
                <p>Browser-mu siap memasang aplikasi ini dengan satu klik.</p>
                <button class="btn-primary pasang-android-btn">&#128187; Instal Aplikasi</button>
            </div>
            <ol class="pasang-langkah">
                <li><b>Buka di Chrome atau Microsoft Edge.</b></li>
                <li>Klik ikon ${PASANG_IKON_INSTAL} <b>Instal</b> di ujung kanan bilah alamat. Kalau tidak ada, buka menu ${PASANG_IKON_TITIK} lalu cari <b>Instal</b> / <b>Aplikasi</b>.</li>
                <li>Klik <b>Instal</b>. Aplikasi terbuka di jendela sendiri dan ikonnya muncul di desktop atau menu Start.</li>
            </ol>
            <p class="pasang-catatan">&#9432; Di Safari (Mac): menu <b>File</b> &rarr; <b>Tambahkan ke Dock</b>.</p>
        </div>
        <div class="pasang-panel" data-panel="inapp">
            <p>Browser di dalam WhatsApp, Instagram, atau Facebook tidak bisa memasang aplikasi. Buka dulu di browser utama:</p>
            <ol class="pasang-langkah">
                <li>Ketuk ${PASANG_IKON_TITIK} atau <b>&middot;&middot;&middot;</b> di pojok layar.</li>
                <li>Pilih <b>Buka di Chrome</b> / <b>Buka di browser</b> (iPhone: <b>Buka di Safari</b>).</li>
                <li>Ikuti langkah Android atau iPhone.</li>
            </ol>
            <button class="glass-btn pasang-salin">&#128279; Salin tautan website</button>
        </div>`;
}

function pasangPasangPerilaku(wadah) {
    const tabs = wadah.querySelectorAll('.pasang-tabs button');
    const pilih = (t) => {
        tabs.forEach(b => b.classList.toggle('aktif', b.getAttribute('data-tab') === t));
        wadah.querySelectorAll('.pasang-panel').forEach(p => p.classList.toggle('aktif', p.getAttribute('data-panel') === t));
    };
    tabs.forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); pilih(b.getAttribute('data-tab')); }));
    pilih(pasangPlatform());

    wadah.querySelectorAll('.pasang-android-btn').forEach(btnAndroid => btnAndroid.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!pasangPromptAndroid) return;
        pasangPromptAndroid.prompt();
        try { await pasangPromptAndroid.userChoice; } catch (err) { /* abaikan */ }
        pasangPromptAndroid = null;
        pasangPerbaruiTombolAndroid();
    }));
    const salin = wadah.querySelector('.pasang-salin');
    salin.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = location.href.split('#')[0];
        const ok = () => { salin.innerHTML = '&#10003; Tautan tersalin, tempel di Chrome/Safari'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok).catch(() => { salin.innerText = url; });
        else salin.innerText = url;
    });
    pasangPerbaruiTombolAndroid();
}

// Tombol "Instal Aplikasi" sekali ketuk hanya tampil jika Chrome/Edge menyediakannya
function pasangPerbaruiTombolAndroid() {
    document.querySelectorAll('.pasang-android-langsung').forEach(el => {
        el.style.display = pasangPromptAndroid ? 'block' : 'none';
    });
}

// ---------- JENDELA PANDUAN ----------
function bukaPanduanPasang() {
    const root = elements.contentArea.firstElementChild;
    if (!root || root.querySelector('.pasang-modal-backdrop')) return;
    const wrap = document.createElement('div');
    wrap.className = 'pasang-modal-backdrop';
    const terpasang = pasangSudahTerpasang();
    wrap.innerHTML = `
        <div class="pasang-modal">
            <button class="pasang-tutup" aria-label="Tutup">&#10005;</button>
            <div class="pasang-head">
                <img src="assets/icon/icon-192.png" alt="Logo MPI BK">
                <div><h3>Instal MPI BK</h3><p>Tampil layar penuh, tanpa bilah alamat, dan bisa dibuka dari ikon seperti aplikasi.</p></div>
            </div>
            ${terpasang ? '<div class="pasang-sudah">&#10003; Aplikasi sudah terpasang dan sedang kamu buka dari ikon.</div>'
                : (pasangTerdeteksiTerpasang() ? '<div class="pasang-sudah pasang-sepertinya">&#10003; Aplikasi ini sepertinya sudah terpasang. Buka dari ikon <b>MPI BK</b> di layar perangkatmu.</div>' : '') + pasangIsiPanduan()}
        </div>`;
    root.appendChild(wrap);
    wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
    wrap.querySelector('.pasang-modal').animate([{ transform: 'scale(0.94)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    if (!terpasang) pasangPasangPerilaku(wrap);
    const tutup = () => wrap.remove();
    wrap.querySelector('.pasang-tutup').addEventListener('click', (e) => { e.stopPropagation(); tutup(); });
    wrap.addEventListener('click', (e) => { e.stopPropagation(); if (e.target === wrap) tutup(); });
}

// ---------- HALAMAN TENTANG ----------
const tentangData = {
    materi: [
        ['Mata Pelajaran', 'Koding dan Kecerdasan Artifisial'],
        ['Fase / Kelas', 'E / X'],
        ['Unit', 'Berpikir Komputasional'],
        ['Sub Unit', 'Pemecahan Masalah Kompleks Sehari-hari']
    ],
    tujuan: 'Murid mampu menerapkan berpikir komputasional untuk memecahkan permasalahan sehari-hari yang kompleks.',
    pengembang: {
        nama: 'Achmad Jaka Dwena Putra, S.Kom.',
        foto: 'assets/pengembang.jpg',
        sekolah: 'SMA Negeri 5 Mataram',
        mapel: 'Informatika dan KKA',
        email: 'achmad5511@guru.sma.belajar.id'
    }
};

function renderTentang() {
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    document.body.className = 'theme-dark';

    const d = tentangData, p = d.pengembang;
    const materiHTML = d.materi.map(([label, isi]) =>
        `<div class="tentang-item"><span>${label}</span><b>${isi}</b></div>`).join('');

    elements.contentArea.innerHTML = `
        <div class="sim-container">
            <div class="sim-side">
                <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                <h2 class="sim-judul">Tentang</h2>
                <p class="kisi-subjudul">${kisiInfo.mapel} &middot; ${kisiInfo.kelas}</p>
                <div class="tentang-app">
                    <img src="assets/icon/icon-192.png" alt="Logo MPI BK">
                    <h3>MPI Berpikir Komputasional</h3>
                    <p>Media Pembelajaran Interaktif untuk belajar Berpikir Komputasional lewat dialog, kisi-kisi, dan simulasi ASTS.</p>
                    <span class="kisi-chip">Versi 1.0</span>
                </div>
            </div>
            <div class="tentang-kanan">
                <section class="tentang-kartu">
                    <h3 class="tentang-judul">&#128218; Identitas Materi</h3>
                    <div class="tentang-grid">${materiHTML}</div>
                    <div class="tentang-tujuan">
                        <span>Tujuan Pembelajaran</span>
                        <p>${d.tujuan}</p>
                    </div>
                </section>
                <section class="tentang-kartu">
                    <h3 class="tentang-judul">&#128100; Identitas Pengembang</h3>
                    <div class="tentang-dev">
                        <img class="tentang-foto" src="${p.foto}" alt="Foto ${p.nama}">
                        <div class="tentang-dev-isi">
                            <h4>${p.nama}</h4>
                            <div class="tentang-dev-baris"><span>Sekolah</span><b>${p.sekolah}</b></div>
                            <div class="tentang-dev-baris"><span>Mata Pelajaran yang Diampu</span><b>${p.mapel}</b></div>
                            <div class="tentang-dev-baris"><span>Email</span><a href="mailto:${p.email}">${p.email}</a></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>`;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => { appState.currentView = 'menu'; renderView(); });
    });
}
