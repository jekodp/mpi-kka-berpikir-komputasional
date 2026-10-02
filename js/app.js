// Data State Aplikasi Lokal
const appState = {
    currentView: 'menu', 
    currentModuleIndex: 0,
    currentPageIndex: 0,
    progress: {} 
};

// --- SILABUS / MATERI ---
const modules = [
    {
        id: 'mulai_belajar',
        title: 'Mulai Belajar',
        pages: [
            {
                title: 'Mulai Belajar',
                content: '<h2>Mulai Belajar</h2><p>Materi Berpikir Komputasional akan ditampilkan di sini.</p>'
            }
        ]
    },
    {
        id: 'cek_kisi',
        title: 'Cek Kisi-Kisi',
        pages: [
            {
                title: 'Kisi-Kisi',
                content: '<h2>Kisi-Kisi</h2><p>Berikut adalah kisi-kisi materi...</p>'
            }
        ]
    },
    {
        id: 'simulasi_asts',
        title: 'Simulasi ASTS',
        pages: [
            {
                title: 'Simulasi ASTS',
                content: '<h2>Simulasi ASTS</h2><p>Silakan mulai simulasi ujian.</p>'
            }
        ]
    },
    {
        id: 'pengaturan',
        title: 'Pengaturan',
        pages: [
            {
                title: 'Pengaturan',
                content: ''
            }
        ]
    },
    {
        id: 'tentang',
        title: 'Tentang',
        pages: [
            {
                title: 'Tentang Aplikasi',
                content: '<h2>Tentang Aplikasi</h2><p>Media Pembelajaran Interaktif (MPI) Berpikir Komputasional v1.0</p>'
            }
        ]
    }
];

// --- FUNGSI UTAMA ---

const elements = {
    header: document.querySelector('header'),
    footer: document.querySelector('footer'),
    contentArea: document.getElementById('content-area'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    pageIndicator: document.getElementById('page-indicator'),
    progressBar: document.getElementById('progress-bar')
};

function initApp() {
    loadProgress();
    
    // Paksa selalu kembali ke menu utama setiap kali halaman di-refresh/dibuka baru
    appState.currentView = 'menu';

    setupEventListeners();

    // Jika masih ada Simulasi ASTS yang berlangsung, langsung kunci ke ujian (js/simulasi.js)
    if (typeof simulasiCekSaatMuat === 'function' && simulasiCekSaatMuat()) { tandaiAplikasiSiap(); return; }

    renderPemuatan(renderCover);
}

// ==========================================
// LAYAR PEMUATAN (LOADING)
// Semua gambar yang dipakai aplikasi dimuat lebih dulu, supaya setelah itu tidak ada gambar
// yang muncul terlambat. Setelah selesai, lanjut ke sampul.
// ==========================================
const PEMUATAN_MIN_MS = 3000;        // lama minimum layar pemuatan, agar karakter pertama sempat terlihat
const PEMUATAN_GANTI_EKSPRESI_MS = 4000;   // tiap karakter tampil 4 detik; jumlah yang tampil mengikuti lama pemuatan
const PEMUATAN_PUDAR_MS = 1300;            // lama perpindahan antarkarakter (samakan dengan CSS .muat-karakter)
const PEMUATAN_GANTI_TIP_MS = 3200;
const PEMUATAN_TOMBOL_LEWATI_MS = 9000;   // jika jaringan lambat, tawarkan lanjut tanpa menunggu
// Tips di bawah bar: [label, isi]. Materi empat pilar dan fakta menarik yang berkaitan.
const PEMUATAN_TIPS = [
    ['Tips', 'Berpikir komputasional bukan soal coding, tetapi cara berpikir untuk memecahkan masalah.'],
    ['Dekomposisi', 'Masalah sebesar apa pun terasa ringan kalau dipecah menjadi tugas-tugas kecil.'],
    ['Pengenalan Pola', 'Kebiasaan yang berulang bisa dipakai untuk menebak apa yang terjadi berikutnya.'],
    ['Abstraksi', 'Fokus pada hal yang penting, abaikan detail yang tidak dibutuhkan.'],
    ['Algoritma', 'Langkah yang jelas dan berurutan membuat hasilnya bisa diulang siapa saja.'],
    ['Tips', 'Keempat pilar itu setara. Tidak ada yang paling penting, semuanya saling melengkapi.'],
    ['Tahukah kamu?', 'Kata "algoritma" berasal dari nama ilmuwan abad ke-9, Al-Khwarizmi.'],
    ['Tahukah kamu?', 'Resep masakan adalah algoritma: langkahnya berurutan dan hasilnya bisa diulang.'],
    ['Tahukah kamu?', 'Peta jalur kereta adalah abstraksi: jarak aslinya diabaikan, yang penting urutan stasiunnya.'],
    ['Tahukah kamu?', 'Kubus Rubik punya sekitar 43 kuintiliun susunan, tetapi semuanya bisa diselesaikan dalam 20 putaran atau kurang.'],
    ['Tahukah kamu?', 'Semua foto, lagu, dan gim di komputer tersusun hanya dari angka 0 dan 1.'],
    ['Tahukah kamu?', 'Dengan algoritma yang tepat, komputer bisa mengurutkan sejuta nama dalam waktu kurang dari sedetik.'],
    ['Tahukah kamu?', 'Istilah "computational thinking" dipopulerkan oleh Jeannette Wing lewat tulisannya pada tahun 2006.'],
    ['Tahukah kamu?', 'Mengikat tali sepatu pun algoritma: urutan langkah yang sudah kamu hafal di luar kepala.']
];

// Daftar semua gambar. Tiap entri: { karakter?: true, muat(selesai) }, dengan selesai(src) dipanggil
// saat gambar siap atau gagal. Gambar karakter didahulukan karena ditampilkan di layar pemuatan.
function pemuatanDaftarGambar() {
    const tugas = [];
    const berkas = (src) => tugas.push({ muat: (selesai) => { const im = new Image(); im.onload = im.onerror = () => selesai(); im.src = src; } });
    const aset = (nama) => tugas.push({ muat: (selesai) => cariAset(nama, () => selesai(), () => selesai()) });

    const sudah = {};
    [['kevin', null], ['kayana', null]].concat(dialogData
        .filter(d => d.type !== 'quiz' && d.emotion && (d.speaker === 'Kevin' || d.speaker === 'Kayana'))
        .map(d => [d.speaker.toLowerCase(), d.emotion]))
        .forEach(([k, e]) => {
            if (sudah[k + ':' + e]) return;
            sudah[k + ':' + e] = true;
            // ekspresi (atau cadangannya bila gambarnya belum dibuat)
            tugas.push({ karakter: true, muat: (selesai) => vnCariEkspresi(k, e, (src) => selesai(src), () => selesai()) });
        });
    tugas.push({ karakter: true, muat: (selesai) => cariAset('kayana_quiz', (src) => selesai(src), () => selesai()) });
    aset('cover');
    vnChapters.forEach(c => aset(c.bg));                                   // latar tiap bab
    if (typeof tentangData !== 'undefined') berkas(tentangData.pengembang.foto);
    if (typeof simulasiSoal !== 'undefined') {
        simulasiSoal.forEach(q => (q.konteks || []).forEach(b => { if (b.t === 'img' && b.src) berkas(b.src); }));
    }
    return tugas;
}

function renderPemuatan(setelahSelesai) {
    document.body.classList.remove('theme-light', 'theme-dark');
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';

    elements.contentArea.innerHTML = `
        <div class="muat-container">
            <div class="muat-latar" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
            <div class="muat-karakter" id="muat-kar-a"></div>
            <div class="muat-karakter" id="muat-kar-b"></div>
            <div class="muat-gelap"></div>
            <div class="muat-label-atas">MPI Berpikir Komputasional</div>
            <button id="muat-lewati" class="glass-btn muat-lewati">Lanjut tanpa menunggu &#10095;</button>
            <div class="muat-bawah">
                <div class="muat-baris">
                    <span class="muat-judul">Memuat<span class="muat-titik"><b>.</b><b>.</b><b>.</b></span></span>
                    <span class="muat-persen" id="muat-persen">0%</span>
                </div>
                <div class="muat-bar">
                    <div class="muat-bar-isi" id="muat-bar-isi"></div>
                    <div class="muat-bar-kepala" id="muat-bar-kepala"></div>
                </div>
                <div class="muat-tip" id="muat-tip"></div>
            </div>
        </div>`;
    tandaiAplikasiSiap();

    const root = elements.contentArea.firstElementChild;
    const bar = document.getElementById('muat-bar-isi');
    const kepala = document.getElementById('muat-bar-kepala');
    const persen = document.getElementById('muat-persen');
    const tip = document.getElementById('muat-tip');
    const lewati = document.getElementById('muat-lewati');
    const lapis = [document.getElementById('muat-kar-a'), document.getElementById('muat-kar-b')];

    // Tips bergantian, urutan diacak tiap kali aplikasi dibuka
    const urutanTip = PEMUATAN_TIPS.map((t, i) => i).sort(() => Math.random() - 0.5);
    let noTip = 0;
    const gantiTip = () => {
        const [label, isi] = PEMUATAN_TIPS[urutanTip[noTip % urutanTip.length]];
        noTip++;
        tip.innerHTML = `<b>${label}</b><span>${isi}</span>`;
        tip.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 400, easing: 'ease-out' });
    };
    gantiTip();
    const timerTip = setInterval(gantiTip, PEMUATAN_GANTI_TIP_MS);

    // Karakter tampil satu per satu, pelan-pelan: tiap 4 detik berganti, dengan gerakan
    // zoom in / zoom out bergantian. Berapa karakter yang sempat tampil bergantung pada
    // lamanya pemuatan; begitu 100%, layar lanjut ke sampul.
    const antre = [], pernah = {};
    let lapisAktif = 0, sedangTampil = null, noZoom = 0;
    const tampilBerikut = () => {
        if (!root.isConnected) return;
        // bila antrean habis tetapi pemuatan belum selesai, ulangi dari gambar yang sudah ada
        if (!antre.length) { const semua = Object.keys(pernah).filter(s => s !== sedangTampil); if (semua.length > 1) antre.push(...semua); }
        // Kevin dan Kayana ditampilkan bergantian bila memungkinkan; pilihannya diacak
        // supaya tiap kali aplikasi dibuka, karakter yang muncul tidak selalu sama
        const tokoh = (x) => (x || '').indexOf('kevin') >= 0 ? 'kevin' : 'kayana';
        let calon = antre.filter(x => tokoh(x) !== tokoh(sedangTampil));
        if (!calon.length) calon = antre;
        const src = calon[Math.floor(Math.random() * calon.length)];
        if (!src) return;
        antre.splice(antre.indexOf(src), 1);
        sedangTampil = src;
        lapisAktif = 1 - lapisAktif;
        const el = lapis[lapisAktif];
        el.style.backgroundImage = `url('${src}')`;
        // zoom in dan zoom out bergantian, berjalan pelan selama karakter tampil
        const zoomIn = (noZoom++ % 2 === 0);
        el.getAnimations().forEach(a => a.cancel());
        el.animate([{ transform: zoomIn ? 'scale(1)' : 'scale(1.1)' }, { transform: zoomIn ? 'scale(1.1)' : 'scale(1)' }],
            { duration: PEMUATAN_GANTI_EKSPRESI_MS + PEMUATAN_PUDAR_MS * 2, easing: 'linear', fill: 'forwards' });
        el.classList.add('aktif');
        lapis[1 - lapisAktif].classList.remove('aktif');
    };
    let timerKar = null, bolehMulai = false;
    const mulaiPutar = () => {
        if (timerKar || !antre.length) return;
        tampilBerikut();
        timerKar = setInterval(tampilBerikut, PEMUATAN_GANTI_EKSPRESI_MS);
    };
    // Karakter pertama ditunda sejenak agar ada beberapa pilihan untuk diacak. Bila jaringan
    // lambat dan belum ada gambar yang siap, karakter pertama tampil begitu gambarnya tiba.
    const timerAwal = setTimeout(() => { bolehMulai = true; mulaiPutar(); }, 350);

    const mulai = Date.now();
    const tugas = pemuatanDaftarGambar();
    let beres = 0, selesaiSemua = false;
    const lanjut = () => {
        if (selesaiSemua) return;
        selesaiSemua = true;
        clearInterval(timerTip);
        clearInterval(timerKar);
        clearTimeout(timerAwal);
        clearTimeout(timerLewati);
        if (!root.isConnected) return;
        const a = root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, easing: 'ease-in', fill: 'forwards' });
        a.onfinish = () => { setelahSelesai(); playPageEnter(); };
    };
    const maju = (t, src) => {
        if (t.karakter && src && !pernah[src]) {
            pernah[src] = true;
            antre.push(src);
            if (bolehMulai) mulaiPutar();
        }
        beres++;
        const p = Math.round(beres / tugas.length * 100);
        bar.style.width = p + '%';
        kepala.style.left = p + '%';
        persen.innerText = p + '%';
        if (beres >= tugas.length) setTimeout(lanjut, Math.max(400, PEMUATAN_MIN_MS - (Date.now() - mulai)));
    };
    tugas.forEach(t => { let sekali = false; t.muat((src) => { if (sekali) return; sekali = true; maju(t, src); }); });

    const timerLewati = setTimeout(() => lewati.classList.add('tampil'), PEMUATAN_TOMBOL_LEWATI_MS);
    lewati.addEventListener('click', lanjut);
}

// ==========================================
// HALAMAN SAMPUL (COVER)
// Tampil setiap kali aplikasi dibuka; tombol "Mulai" membawa murid ke Menu Utama.
// Gambar: assets/latar/cover.(webp|png|jpg). Judul dan tombol dibuat lewat kode agar tetap tajam.
// ==========================================
const COVER = {
    label: 'Media Pembelajaran Interaktif',
    judul: ['Berpikir', 'Komputasional'],
    subjudul: 'Koding dan Kecerdasan Artifisial Kelas X',
    tombol: 'Mulai'
};

function renderCover() {
    document.body.classList.remove('theme-light', 'theme-dark');
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';

    elements.contentArea.innerHTML = `
        <div class="cover-container">
            <div class="cover-bg" id="cover-bg"></div>
            <div class="cover-gelap"></div>
            <div class="cover-isi">
                <span class="cover-label">${COVER.label}</span>
                <h1 class="cover-judul">${COVER.judul.map(b => `<span>${b}</span>`).join('')}</h1>
                <p class="cover-subjudul">${COVER.subjudul}</p>
                <button id="btn-cover-mulai" class="btn-primary cover-mulai">${COVER.tombol} <span>&#10095;</span></button>
            </div>
        </div>`;

    document.getElementById('btn-cover-mulai').addEventListener('click', () => {
        navigateWithTransition(() => renderView());
    });

    // Sampul baru ditampilkan setelah gambarnya siap (atau gagal dimuat), supaya tidak berkedip
    let sudah = false;
    const tampil = () => { if (sudah) return; sudah = true; tandaiAplikasiSiap(); };
    cariAset('cover', (src) => {
        const bg = document.getElementById('cover-bg');
        if (bg) bg.style.backgroundImage = `url('${src}')`;
        tampil();
    }, tampil);
    setTimeout(tampil, 2500);
}

// Kanvas ditampilkan setelah halaman pertama selesai disiapkan (lihat html:not(.app-siap) di CSS)
function tandaiAplikasiSiap() {
    requestAnimationFrame(() => document.documentElement.classList.add('app-siap'));
}

function renderView() {
    // Selama Simulasi ASTS berlangsung, semua menu lain dikunci
    if (typeof simulasiAktif === 'function' && simulasiAktif()) {
        renderSimulasiUjian();
        return;
    }
    if (appState.currentView === 'menu') {
        renderMainMenu();
    } else {
        renderMateriPage();
    }
}

// --- ANIMASI TRANSISI ANTAR MENU ---
// Keluar : daftar menu menyusut & bergeser ke kiri layar, bagian lain memudar.
// Masuk  : daftar menu halaman baru muncul dari kiri layar, bagian lain memudar masuk.
// Pola ini sama dengan animasi saat murid menekan "Lanjutkan Materi".
const MENU_EXIT_MS = 450;
const MENU_ENTER_MS = 700;

function getPageParts() {
    const area = elements.contentArea;
    const root = area.firstElementChild;
    const list = root ? root.querySelector(':scope > .menu-list-box, :scope > .chapter-list-panel, :scope > .kisi-list-panel, :scope > .sim-side') : null;
    const others = list ? Array.from(root.children).filter(c => c !== list) : Array.from(area.children);
    return { list, others };
}

function navigateWithTransition(update) {
    if (window.menuTransitioning) return;          // cegah ketukan ganda saat animasi berjalan
    window.menuTransitioning = true;
    const { list, others } = getPageParts();
    if (list) {
        list.animate(
            [{ transform: 'translateX(0) scale(1)', opacity: 1 },
             { transform: 'translateX(-105%) scale(0.9)', opacity: 0 }],
            { duration: MENU_EXIT_MS, easing: 'cubic-bezier(0.55, 0, 0.75, 0.3)', fill: 'forwards' });
    }
    others.forEach(el => el.animate([{ opacity: 1 }, { opacity: 0 }],
        { duration: MENU_EXIT_MS * 0.8, easing: 'ease-in', fill: 'forwards' }));

    setTimeout(() => {
        update();
        playPageEnter();
        window.menuTransitioning = false;
    }, MENU_EXIT_MS);
}

function playPageEnter() {
    const { list, others } = getPageParts();
    if (list) {
        list.animate(
            [{ transform: 'translateX(-105%) scale(0.9)', opacity: 0 },
             { transform: 'translateX(0) scale(1)', opacity: 1 }],
            { duration: MENU_ENTER_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
    others.forEach(el => el.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 500, delay: list ? 250 : 0, easing: 'ease-out', fill: 'backwards' }));
}

// --- SYARAT MEMBUKA MENU ---
// Cek Kisi-Kisi  : semua materi Mulai Belajar selesai.
// Simulasi ASTS  : Mulai Belajar selesai DAN semua kompetensi kisi-kisi ditandai paham.
function progresBelajar() {
    const total = vnChapters.length;
    const done = Math.max(0, Math.min(total, (appState.vnProgress || 1) - 1));
    return { done, total };
}
function progresKisi() {
    if (typeof kisiMateri === 'undefined') return { done: 0, total: 0 };
    const checks = appState.kisiChecks || {};
    let done = 0, total = 0;
    kisiMateri.forEach(m => {
        total += m.kompetensi.length;
        done += (checks[m.kode] || []).filter(Boolean).length;
    });
    return { done, total };
}
// Mengembalikan null jika menu terbuka, atau daftar syarat jika masih terkunci
function kunciModul(index) {
    const mod = modules[index];
    if (!mod) return null;
    const b = progresBelajar(), k = progresKisi();
    const syaratBelajar = { label: 'Selesaikan semua materi Mulai Belajar', done: b.done, total: b.total, tujuan: 'mulai_belajar' };
    const syaratKisi = { label: 'Tandai semua kompetensi di Cek Kisi-Kisi sebagai paham', done: k.done, total: k.total, tujuan: 'cek_kisi' };
    let syarat = [];
    if (mod.id === 'cek_kisi') syarat = [syaratBelajar];
    else if (mod.id === 'simulasi_asts') syarat = [syaratBelajar, syaratKisi];
    if (!syarat.length || syarat.every(x => x.done >= x.total)) return null;
    return syarat;
}
function tampilKunciModul(index) {
    const syarat = kunciModul(index);
    if (!syarat || typeof simModal !== 'function') return;
    const daftar = syarat.map(x => {
        const ok = x.done >= x.total;
        return `<div class="kunci-syarat ${ok ? 'ok' : ''}">
                    <span class="kunci-tanda">${ok ? '&#10003;' : '&#9711;'}</span>
                    <div class="kunci-isi">
                        <div class="kunci-label">${x.label}</div>
                        <div class="kunci-bar"><div style="width:${x.total ? x.done / x.total * 100 : 0}%"></div></div>
                    </div>
                    <span class="kunci-angka">${x.done}/${x.total}</span>
                </div>`;
    }).join('');
    const belum = syarat.find(x => x.done < x.total);
    const tujuanIdx = modules.findIndex(m => m.id === belum.tujuan);
    const m = simModal(`
        <div class="sim-modal-icon">&#128274;</div>
        <h3>${modules[index].title} masih terkunci</h3>
        <p>Penuhi syarat berikut untuk membukanya:</p>
        <div class="kunci-daftar">${daftar}</div>
        <div class="sim-modal-aksi">
            <button class="glass-btn sim-modal-btn2" data-aksi="tutup">Tutup</button>
            <button class="btn-primary sim-modal-btn2" id="kunci-ke-tujuan">Ke ${modules[tujuanIdx].title} &#10095;</button>
        </div>`, true);
    m.querySelector('#kunci-ke-tujuan').addEventListener('click', () => {
        m.remove();
        window.lastMenuIndex = tujuanIdx;
        navigateWithTransition(() => {
            appState.currentModuleIndex = tujuanIdx;
            appState.currentPageIndex = 0;
            appState.currentView = 'materi';
            renderView();
        });
    });
}

// ---------- MENU PUTAR: UKUR ULANG SAAT TATA LETAK BERUBAH ----------
// Posisi item menu putar disimpan (cache) agar gerakannya ringan. Cache itu bisa keliru bila
// diukur saat kanvas tersembunyi, yaitu ketika halaman dibuka dengan HP masih TEGAK: semua
// ukuran terbaca 0. Hal yang sama terjadi bila HP diputar tegak lalu mendatar lagi (posisi
// gulir kembali ke 0), atau saat font selesai dimuat dan tinggi item berubah.
// pantauRoda memanggil ukurUlang(pertama) setiap kali ukuran menu berubah:
//   pertama = true  -> pengukuran sebelumnya tidak sah, pakai posisi awal;
//   pertama = false -> pertahankan item yang sedang aktif di tengah.
function pantauRoda(scroller, ukurUlang) {
    if (!scroller || !window.ResizeObserver) return;
    let sah = scroller.offsetHeight > 0;
    let tinggi = scroller.offsetHeight, isi = scroller.scrollHeight;
    const ro = new ResizeObserver(() => {
        if (!scroller.isConnected) { ro.disconnect(); return; }
        const h = scroller.offsetHeight, i = scroller.scrollHeight;
        if (!h) { tinggi = 0; return; }                 // sedang tersembunyi (HP tegak)
        if (h === tinggi && i === isi) return;
        const pertama = !sah;
        sah = true; tinggi = h; isi = i;
        ukurUlang(pertama);
    });
    ro.observe(scroller);
    if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);
}

function renderMainMenu() {
    document.body.classList.remove('theme-light', 'theme-dark');
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    
    // Hilangkan padding bawaan agar menu bisa merapat penuh ke kiri
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    
    // Progres Mulai Belajar ditampilkan langsung di item menunya
    const pb = progresBelajar();
    let sudahBukaBelajar = '1';
    try { sudahBukaBelajar = localStorage.getItem(MENU_SOROT_KEY); } catch (e) {}
    const sorotBelajar = !sudahBukaBelajar && pb.done === 0;
    let progBelajarHTML = '';
    if (pb.done >= pb.total) {
        progBelajarHTML = '<span class="menu-prog selesai">&#10003; Selesai</span>' +
                          '<div class="menu-bar selesai"><i style="width:100%"></i></div>';
    } else if (pb.done > 0) {
        progBelajarHTML = '<span class="menu-prog">' + pb.done + '/' + pb.total + ' bab</span>' +
                          '<div class="menu-bar"><i style="width:' + (pb.done / pb.total * 100) + '%"></i></div>';
    }

    let singleListHTML = '';
    modules.forEach((mod, index) => {
        const terkunci = !!kunciModul(index);
        const kelas = (terkunci ? ' menu-locked' : '') + (index === 0 && sorotBelajar ? ' menu-sorot' : '');
        singleListHTML += '<div class="menu-item' + kelas + '" data-index="' + index + '">' +
                            '<h3>' + mod.title + (terkunci ? ' &#128274;' : '') + '</h3>' +
                            (index === 0 ? progBelajarHTML : '') +
                            '<span class="chevron">&#10095;</span>' +
                          '</div>';
    });

    // Buat 10 blok menu yang sama persis agar aman dari layar yang sangat tinggi
    let tenBlocksHTML = '';
    for(let i=0; i<10; i++) {
        tenBlocksHTML += '<div class="scroll-block">' + singleListHTML + '</div>';
    }

    const menuHTML = '<div class="main-menu-container">' +
        // Slideshow latar bab yang sudah selesai (bagian kanan layar)
        '<div class="menu-slideshow" aria-hidden="true">' +
            '<div class="menu-slide-wadah"><div class="menu-slide"></div><div class="menu-slide"></div></div>' +
        '</div>' +
        '<div class="menu-list-box">' +
            '<div class="menu-items belum-siap" id="menu-items-scroll">' +
                tenBlocksHTML +
            '</div>' +
        '</div>' +
        '<button id="btn-buka-menu">Buka Menu</button>' +
    '</div>';

    menuSlideReset();
    elements.contentArea.innerHTML = menuHTML;

    // Tombol "Instal" + sorotan sekali di kunjungan pertama (js/pasang.js)
    if (typeof pasangSetelahMenu === 'function') pasangSetelahMenu();

    const bukaModul = (index) => {
        if (kunciModul(index)) { tampilKunciModul(index); return; }
        // Sorotan "Mulai Belajar" hilang setelah menu itu dibuka sekali
        if (index === 0) { try { localStorage.setItem(MENU_SOROT_KEY, '1'); } catch (e) {} }
        window.lastMenuIndex = index;
        navigateWithTransition(() => {
            appState.currentModuleIndex = index;
            appState.currentPageIndex = 0;
            appState.currentView = 'materi';
            renderView();
        });
    };

    // Tombol Buka Logic
    const btnBuka = document.getElementById('btn-buka-menu');
    btnBuka.addEventListener('click', () => {
        const index = btnBuka.getAttribute('data-index');
        if (index !== null) bukaModul(parseInt(index));
    });

    // Event listener untuk menu-item
    const itemElements = document.querySelectorAll('.menu-item');
    itemElements.forEach(item => {
        // Klik sekali = gulir ke tengah
        item.addEventListener('click', (e) => {
            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        
        // Klik ganda (Double Tap / Double Click) = langsung buka materinya
        item.addEventListener('dblclick', (e) => {
            bukaModul(parseInt(e.currentTarget.getAttribute('data-index')));
        });
    });

    const scrollContainer = document.getElementById('menu-items-scroll');
    scrollContainer.style.position = 'relative'; // Agar offsetTop relatif terhadap container
    let scrollTimeout;

    // Cache posisi elemen agar browser tidak lag (menghindari getBoundingClientRect berulang)
    const items = document.querySelectorAll('.menu-item');
    const itemData = [];
    
    // Tunggu sejenak agar CSS selesai merender ukuran sebelum caching
    setTimeout(() => {
        items.forEach(item => {
            itemData.push({
                el: item,
                top: item.offsetTop,
                height: item.offsetHeight,
                index: item.getAttribute('data-index')
            });
        });

        const block = document.querySelector('.scroll-block');
        if(!block) return;
        
        let blockHeight = block.offsetHeight; // Penting untuk digunakan oleh scroll event di bawah
        
        // Posisikan awal secara instan agar "Mulai Belajar" (Index 0 pada blok ke-5) persis di tengah layar
        const containerHeight = scrollContainer.offsetHeight;
        // Blok ke-5 dimulai di item ke-20 (5 blok x 5 item). Saat website baru dibuka, "Mulai Belajar"
        // yang di tengah; saat kembali dari sebuah menu, menu yang terakhir dibuka yang di tengah.
        const targetItemData = itemData[20 + (window.lastMenuIndex || 0)];
        
        if (targetItemData) {
            scrollContainer.scrollTop = targetItemData.top - (containerHeight / 2) + (targetItemData.height / 2);
        }

        // Fungsi fisika roda 3D siêu cepat (O(1) DOM Reads)
        function updateMenuPhysics() {
            const currentScroll = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.offsetHeight;
            const centerY = containerHeight / 2;
            
            let closestItem = null;
            let minDistance = Infinity;

            for (let i = 0; i < itemData.length; i++) {
                const data = itemData[i];
                
                // Kalkulasi matematis titik tengah tanpa memanggil API DOM yang berat
                const itemCenterY = (data.top - currentScroll) + (data.height / 2);
                const distance = Math.abs(centerY - itemCenterY);
                
                // Culling: Abaikan dan sembunyikan jika item jauh di luar layar
                if (itemCenterY < -100 || itemCenterY > containerHeight + 100) {
                    data.el.style.opacity = '0';
                    data.el.classList.remove('active-center');
                    continue;
                }
                
                const maxDist = 350;
                let ratio = Math.max(0, 1 - (distance / maxDist));
                
                let scale = 0.75 + (ratio * 0.30);
                let opacity = ratio * 1.0; // Dikurangi 15%, sehingga di ujung benar-benar hilang (0%)
                let curveLeft = -Math.pow(distance, 2) / 1200; 
                let translateX = curveLeft + (ratio * 15);

                // Terapkan gaya seketika ke elemen (Write DOM - sangat cepat)
                data.el.style.transform = 'scale(' + scale + ') translateX(' + translateX + 'px)';
                data.el.style.opacity = opacity;

                data.el.classList.remove('active-center');

                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = data.el;
                }
            }

            if (closestItem) {
                closestItem.classList.add('active-center');
                const idx = closestItem.getAttribute('data-index');
                btnBuka.setAttribute('data-index', idx);
                if (kunciModul(parseInt(idx))) {
                    btnBuka.innerHTML = "&#128274; Lihat Syarat";
                    btnBuka.classList.add('terkunci');
                } else {
                    btnBuka.innerText = "Buka " + modules[idx].title;
                    btnBuka.classList.remove('terkunci');
                }
                // Slideshow hanya berjalan saat "Mulai Belajar" berada di tengah
                menuSlideAktif(idx === '0');
            }
        }

        // Cek fisika pertama kali
        updateMenuPhysics();
        btnBuka.classList.add('show');
        // Daftar baru ditampilkan setelah posisinya benar (lihat .menu-items.belum-siap di CSS).
        // Bila kanvas sedang tersembunyi (HP tegak), tunggu sampai pengukuran ulang di bawah.
        if (scrollContainer.offsetHeight) scrollContainer.classList.remove('belum-siap');

        // Ukur ulang bila tata letak berubah (HP diputar, font selesai dimuat, dsb.)
        pantauRoda(scrollContainer, (pertama) => {
            itemData.forEach(d => { d.top = d.el.offsetTop; d.height = d.el.offsetHeight; });
            blockHeight = block.offsetHeight;
            const aktif = pertama ? (window.lastMenuIndex || 0) : (parseInt(btnBuka.getAttribute('data-index')) || 0);
            const t = itemData[20 + aktif];
            if (t) scrollContainer.scrollTop = t.top - (scrollContainer.offsetHeight / 2) + (t.height / 2);
            updateMenuPhysics();
            scrollContainer.classList.remove('belum-siap');
        });

        // Event Scroll yang sangat mulus
        scrollContainer.addEventListener('scroll', () => {
            if (scrollContainer.scrollTop < blockHeight * 2) {
                scrollContainer.scrollTop += (blockHeight * 4);
            } else if (scrollContainer.scrollTop > blockHeight * 6) {
                scrollContainer.scrollTop -= (blockHeight * 4);
            }

            // Panggil render 3D
            window.requestAnimationFrame(updateMenuPhysics);

            btnBuka.classList.remove('show');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                btnBuka.classList.add('show');
            }, 150);
        });
    }, 50);
}

// ==========================================
// SLIDESHOW LATAR DI MENU UTAMA
// - Berisi latar dari bab Mulai Belajar yang SUDAH selesai (semua bab jika tamat).
// - Muncul setelah "Mulai Belajar" diam di tengah beberapa saat: 3 detik saat
//   pertama kali, 0,8 detik bila murid kembali ke menu itu.
// - Saat murid memutar ke menu lain, slideshow memudar dan langsung disiapkan
//   ke latar berikutnya, sehingga saat kembali latar yang tampil sudah berganti.
// - Setiap latar bergerak pelan: zoom in, geser, zoom out, geser balik.
// ==========================================
const MENU_SOROT_KEY = 'mpi_bk_sorot_belajar';
const MENU_SLIDE_JEDA_AWAL = 3000;
const MENU_SLIDE_JEDA_KEMBALI = 800;
const MENU_SLIDE_DURASI = 7000;     // lama satu latar sebelum berganti
const MENU_SLIDE_FADE = 1400;       // lama perpindahan antarlatar (samakan dengan CSS .menu-slide)
const MENU_SLIDE_EFEK = [
    [{ transform: 'scale(1)' }, { transform: 'scale(1.16)' }],                                          // zoom in
    [{ transform: 'scale(1.14) translateX(3.5%)' }, { transform: 'scale(1.14) translateX(-3.5%)' }],     // geser ke kiri
    [{ transform: 'scale(1.16)' }, { transform: 'scale(1)' }],                                          // zoom out
    [{ transform: 'scale(1.14) translateX(-3.5%)' }, { transform: 'scale(1.14) translateX(3.5%)' }]      // geser ke kanan
];
const menuSlide = { urutan: 0, efek: 0, lapis: 0, pernahTampil: false, tampil: false, aktif: false, sesi: 0, timer: null };

function menuSlideDaftar() {
    return vnChapters.slice(0, progresBelajar().done).map(c => c.bg);
}
function menuSlideReset() {
    clearTimeout(menuSlide.timer);
    menuSlide.sesi++;
    menuSlide.aktif = false;
    menuSlide.tampil = false;
}
function menuSlideAktif(aktif) {
    if (aktif === menuSlide.aktif) return;
    menuSlide.aktif = aktif;
    clearTimeout(menuSlide.timer);
    const sesi = ++menuSlide.sesi;
    const wadah = document.querySelector('.menu-slide-wadah');
    const daftar = menuSlideDaftar();
    if (!wadah || !daftar.length) return;

    if (!aktif) {
        if (menuSlide.tampil) menuSlide.urutan = (menuSlide.urutan + 1) % daftar.length;   // A -> B
        menuSlide.tampil = false;
        wadah.classList.remove('tampil');
        return;
    }
    const jeda = menuSlide.pernahTampil ? MENU_SLIDE_JEDA_KEMBALI : MENU_SLIDE_JEDA_AWAL;
    menuSlide.timer = setTimeout(() => {
        const masihBerlaku = () => sesi === menuSlide.sesi && wadah.isConnected;
        const lanjut = () => {
            menuSlide.timer = setTimeout(() => {
                if (!masihBerlaku()) return;
                menuSlide.urutan = (menuSlide.urutan + 1) % daftar.length;
                menuSlideGanti(wadah, daftar[menuSlide.urutan], masihBerlaku, lanjut);
            }, MENU_SLIDE_DURASI);
        };
        menuSlide.urutan %= daftar.length;
        menuSlideGanti(wadah, daftar[menuSlide.urutan], masihBerlaku, () => {
            menuSlide.tampil = true;
            menuSlide.pernahTampil = true;
            wadah.classList.add('tampil');
            lanjut();
        });
    }, jeda);
}
function menuSlideGanti(wadah, bg, masihBerlaku, selesai) {
    cariAset(bg, (src) => {
        if (!masihBerlaku()) return;
        menuSlide.lapis = 1 - menuSlide.lapis;
        const lapisan = wadah.children;
        const el = lapisan[menuSlide.lapis];
        el.style.backgroundImage = `url('${src}')`;
        el.getAnimations().forEach(a => a.cancel());
        el.animate(MENU_SLIDE_EFEK[menuSlide.efek % MENU_SLIDE_EFEK.length],
            { duration: MENU_SLIDE_DURASI + MENU_SLIDE_FADE * 2, easing: 'linear', fill: 'forwards' });
        menuSlide.efek++;
        el.classList.add('aktif');
        lapisan[1 - menuSlide.lapis].classList.remove('aktif');
        selesai();
    }, () => { if (masihBerlaku()) selesai(); });
}

function renderMateriPage() {
    if (appState.currentModuleIndex === 0) {
        startVisualNovel();
        return;
    }

    // Menu yang syaratnya belum terpenuhi tidak bisa dibuka lewat jalur mana pun
    if (kunciModul(appState.currentModuleIndex)) {
        const idx = appState.currentModuleIndex;
        appState.currentView = 'menu';
        renderMainMenu();
        tampilKunciModul(idx);
        return;
    }

    // Halaman Pengaturan: reset data, profil siswa (kode ada di js/pengaturan.js)
    if (modules[appState.currentModuleIndex].id === 'pengaturan') {
        renderPengaturan();
        return;
    }

    // Halaman Tentang: identitas materi & pengembang (kode ada di js/pasang.js)
    if (modules[appState.currentModuleIndex].id === 'tentang') {
        renderTentang();
        return;
    }

    // Halaman Simulasi ASTS (kode ada di js/simulasi.js)
    if (modules[appState.currentModuleIndex].id === 'simulasi_asts') {
        renderSimulasi();
        return;
    }

    // Halaman Cek Kisi-Kisi (kode ada di js/kisiKisi.js)
    if (modules[appState.currentModuleIndex].id === 'cek_kisi') {
        renderKisiKisi();
        return;
    }

    elements.header.style.display = 'block';
    elements.footer.style.display = 'flex';

    // Kembalikan padding normal untuk halaman materi
    elements.contentArea.style.padding = '20px';
    elements.contentArea.style.overflowY = 'auto';

    const currentModule = modules[appState.currentModuleIndex];
    const page = currentModule.pages[appState.currentPageIndex];
    
    elements.contentArea.innerHTML = 
        '<button id="btn-back-menu" class="btn-secondary" style="margin-bottom: 20px;">&#8592; Kembali</button>' +
        '<div class="page-content">' + page.content + '</div>';
    
    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => {
            appState.currentView = 'menu';
            renderView();
        });
    });

    document.querySelector('header h1').innerText = currentModule.title;
    
    elements.pageIndicator.innerText = 'Halaman ' + (appState.currentPageIndex + 1) + ' dari ' + currentModule.pages.length;
    
    const progressPercent = ((appState.currentPageIndex + 1) / currentModule.pages.length) * 100;
    elements.progressBar.style.width = progressPercent + '%';

    elements.btnPrev.disabled = (appState.currentPageIndex === 0);
    
    if (appState.currentPageIndex === currentModule.pages.length - 1) {
        elements.btnNext.innerText = 'Selesai';
    } else {
        elements.btnNext.innerText = 'Selanjutnya';
    }
    
    saveProgress();
}

function setupEventListeners() {
    elements.btnNext.addEventListener('click', () => {
        const currentModule = modules[appState.currentModuleIndex];
        if (appState.currentPageIndex < currentModule.pages.length - 1) {
            appState.currentPageIndex++;
            renderView();
        } else {
            alert('Selamat! Murid telah menyelesaikan modul ini.');
            appState.currentView = 'menu';
            renderView();
        }
    });

    elements.btnPrev.addEventListener('click', () => {
        if (appState.currentPageIndex > 0) {
            appState.currentPageIndex--;
            renderView();
        }
    });
}

function saveProgress() {
    localStorage.setItem('mpi_bk_progress', JSON.stringify(appState));
}

function loadProgress() {
    const saved = localStorage.getItem('mpi_bk_progress');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.currentView = parsed.currentView || 'menu';
            appState.currentModuleIndex = parsed.currentModuleIndex || 0;
            appState.currentPageIndex = parsed.currentPageIndex || 0;
            appState.vnProgress = parsed.vnProgress || 0;
            appState.vnLastIndex = parsed.vnLastIndex || 0;
            appState.progress = parsed.progress || {};
            appState.kisiChecks = parsed.kisiChecks || {}; // daftar cek kompetensi di Cek Kisi-Kisi
        } catch (e) {
            console.error('Gagal memuat progres lokal', e);
        }
    }
}

// Keamanan
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('copy', event => {
    event.preventDefault();
    alert('Maaf, menyalin materi tidak diizinkan.');
});

document.addEventListener('cut', event => event.preventDefault());

// Menonaktifkan sementara blokir Screenshot untuk keperluan perbaikan (sesuai permintaan)
/*
document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Maaf, mengambil tangkapan layar (screenshot) tidak diizinkan.');
    }
});
*/

window.addEventListener('wheel', function(e) {
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, { passive: false });

window.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '_' || 
            e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 107 || e.keyCode === 109) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }
}, { passive: false });

// --- KANVAS TETAP 1280x720 ---
// Seluruh aplikasi didesain di kanvas berukuran tetap. Fungsi ini menghitung skala
// agar kanvas pas di layar (laptop, proyektor, tablet, HP landscape) tanpa mengubah
// ukuran atau posisi elemen di dalamnya. Sisa ruang di tepi layar diisi warna latar.
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

function fitCanvasToScreen() {
    // Di HP, window.innerHeight bisa ikut menghitung area di balik bilah alamat browser.
    // visualViewport memberi ukuran area yang BENAR-BENAR terlihat oleh murid.
    const vv = window.visualViewport;
    const w = vv ? vv.width : window.innerWidth;
    const h = vv ? vv.height : window.innerHeight;
    const offsetX = vv ? vv.offsetLeft : 0;
    const offsetY = vv ? vv.offsetTop : 0;

    const scale = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT);
    const root = document.documentElement.style;
    root.setProperty('--canvas-scale', scale);
    root.setProperty('--canvas-x', (offsetX + w / 2) + 'px');
    root.setProperty('--canvas-y', (offsetY + h / 2) + 'px');
}

// Bilah alamat di HP muncul/hilang dengan animasi, jadi ukur ulang beberapa kali setelah layar berubah
function refitCanvasSoon() {
    fitCanvasToScreen();
    setTimeout(fitCanvasToScreen, 150);
    setTimeout(fitCanvasToScreen, 500);
}

window.addEventListener('resize', refitCanvasSoon);
window.addEventListener('orientationchange', refitCanvasSoon);
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', refitCanvasSoon);
    window.visualViewport.addEventListener('scroll', fitCanvasToScreen);
}
window.addEventListener('load', refitCanvasSoon);
fitCanvasToScreen();

document.addEventListener('DOMContentLoaded', initApp);

// ==========================================
// MESIN VISUAL NOVEL (K-KA)
// ==========================================
// ---------- LOKASI GAMBAR ----------
// Struktur folder assets:
//   assets/latar/      latar tiap bab dan gambar sampul (cover)
//   assets/karakter/   Kevin & Kayana beserta semua ekspresinya (kevin_aha, kayana_quiz, ...)
//   assets/soal/       gambar pada soal Simulasi ASTS
//   assets/profil/     foto pengembang (halaman Tentang)
//   assets/icon/       logo dan ikon aplikasi (tetap PNG karena dibutuhkan saat instalasi)
// Kode cukup menyebut NAMA gambar (mis. 'kantin' atau 'kevin_aha'); foldernya ditentukan di sini.
// Format dicoba berurutan: .webp, .png, lalu .jpg, jadi gambar baru boleh memakai format mana pun.
const ASET_FORMAT = ['webp', 'png', 'jpg'];
function folderAset(nama) {
    if (/^(kevin|kayana)(_|$)/.test(nama)) return 'karakter/';
    return 'latar/';
}
const asetDitemukan = {};
function cariAset(baseName, onOk, onGagal) {
    if (asetDitemukan[baseName]) { onOk(asetDitemukan[baseName]); return; }
    const coba = (i) => {
        if (i >= ASET_FORMAT.length) { if (onGagal) onGagal(); return; }
        const src = `assets/${folderAset(baseName)}${baseName}.${ASET_FORMAT[i]}`;
        const img = new Image();
        img.onload = () => { asetDitemukan[baseName] = src; onOk(src); };
        img.onerror = () => coba(i + 1);
        img.src = src;
    };
    coba(0);
}

function loadVNAsset(elementId, baseName, isCharacter = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.innerText = '';

    cariAset(baseName, (src) => {
        el.style.backgroundImage = `url('${src}')`;
    }, () => {
        {
            // Jika semua format gagal
            el.style.backgroundImage = 'none';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            
            if (isCharacter) {
                el.innerText = `[Karakter: ${baseName}]`;
                el.style.color = '#fff';
                el.style.backgroundColor = 'rgba(255,255,255,0.2)';
            } else {
                el.innerText = `[Latar: ${baseName}]`;
                el.style.color = 'rgba(255,255,255,0.7)';
                el.style.fontSize = '1.5rem';
                el.style.fontWeight = 'bold';
            }
        }
    });
}

// ---------- EKSPRESI KARAKTER PER BARIS DIALOG ----------
// Gambar ekspresi: assets/karakter/<karakter>_<ekspresi>.(webp|png|jpg). Jika belum ada, dicoba ekspresi
// cadangan secara berurutan, dan terakhir gambar dasar (kevin.png / kayana.png).
// Jadi ekspresi boleh dilengkapi bertahap: cukup taruh filenya di assets, tanpa mengubah kode.
const VN_EKSPRESI_CADANGAN = {
    kevin:  { tanya: [], panik: [], bingung: [], tertawa: ['senang'], menjabarkan: ['semangat', 'aha'] },
    kayana: { senyum: [], tegas: ['menjelaskan'], mengajak: ['memuji'], memancing: [], heran: [], melambai: [] }
};
// Ekspresi yang memang diwakili gambar dasar (tidak perlu dicari filenya)
const VN_EKSPRESI_DASAR = { kevin: 'tanya', kayana: 'senyum' };

function vnCalonEkspresi(karakter, ekspresi) {
    if (!ekspresi || ekspresi === VN_EKSPRESI_DASAR[karakter]) return [karakter];
    const cadangan = (VN_EKSPRESI_CADANGAN[karakter] || {})[ekspresi] || [];
    return [ekspresi].concat(cadangan).map(e => `${karakter}_${e}`).concat([karakter]);
}
// Mencari gambar pertama yang tersedia dari daftar calon (hasilnya diingat agar tidak dicari ulang)
const vnEkspresiTerpilih = {};
function vnCariEkspresi(karakter, ekspresi, onOk, onGagal) {
    const kunci = karakter + ':' + (ekspresi || '');
    if (vnEkspresiTerpilih[kunci]) { onOk(vnEkspresiTerpilih[kunci]); return; }
    const calon = vnCalonEkspresi(karakter, ekspresi);
    const coba = (i) => {
        if (i >= calon.length) { if (onGagal) onGagal(); return; }
        cariAset(calon[i], (src) => { vnEkspresiTerpilih[kunci] = src; onOk(src); }, () => coba(i + 1));
    };
    coba(0);
}
function vnPasangEkspresi(el, karakter, ekspresi) {
    if (!el) return;
    const kunci = karakter + ':' + (ekspresi || '');
    if (el.dataset.ekspresi === kunci) return;
    el.dataset.ekspresi = kunci;
    vnCariEkspresi(karakter, ekspresi, (src) => {
        // Abaikan bila sementara itu dialog sudah berpindah ke ekspresi lain
        if (el.dataset.ekspresi !== kunci) return;
        el.innerText = '';
        el.style.backgroundImage = `url('${src}')`;
    }, () => {
        // Gambar dasar pun tidak ada: tampilkan tulisan pengganti
        if (el.dataset.ekspresi === kunci) loadVNAsset(el.id, karakter, true);
    });
}
// Muat semua gambar ekspresi lebih dulu supaya pergantian di dialog tidak tersendat
function vnMuatAwalEkspresi() {
    const sudah = {};
    dialogData.forEach(d => {
        if (d.type === 'quiz' || !d.emotion) return;
        const k = d.speaker === 'Kevin' ? 'kevin' : (d.speaker === 'Kayana' ? 'kayana' : null);
        if (!k || sudah[k + d.emotion]) return;
        sudah[k + d.emotion] = true;
        vnCariEkspresi(k, d.emotion, () => {});
    });
}
// Ekspresi terakhir seorang karakter sebelum baris tertentu, dalam bab yang sama
function vnEkspresiTerakhir(nama, sampaiIndex) {
    const bab = vnChapters.filter(c => c.startIndex <= sampaiIndex).pop();
    const awal = bab ? bab.startIndex : 0;
    for (let i = sampaiIndex; i >= awal; i--) {
        const d = dialogData[i];
        if (d && d.type !== 'quiz' && d.speaker === nama && d.emotion) return d.emotion;
    }
    return null;
}

function loadVNAsset(elementId, baseName, isCharacter = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.innerText = '';

    cariAset(baseName, (src) => {
        el.style.backgroundImage = `url('${src}')`;
    }, () => {
        {
            // Jika semua format gagal
            el.style.backgroundImage = 'none';
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            
            if (isCharacter) {
                el.innerText = `[Karakter: ${baseName}]`;
                el.style.color = '#fff';
                el.style.backgroundColor = 'rgba(255,255,255,0.2)';
            } else {
                el.innerText = `[Latar: ${baseName}]`;
                el.style.color = 'rgba(255,255,255,0.7)';
                el.style.fontSize = '1.5rem';
                el.style.fontWeight = 'bold';
            }
        }
    });
}

let vnCurrentIndex = 0;
let vnIsTyping = false;
let vnTypewriterTimeout;

function startVisualNovel() {
    if (!appState.vnProgress || appState.vnProgress === 0) {
        // Pemain baru: Paksa mulai dari Chapter 1 langsung ke dialog
        appState.vnProgress = 1;
        appState.vnLastIndex = 0;
        saveProgress();
        vnCurrentIndex = 0;
        renderVNEngine();
    } else {
        // Pemain lama: Tampilkan Chapter Select
        renderChapterSelect();
    }
}

function renderChapterSelect() {
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';

    let maxUnlocked = appState.vnProgress || 1;
    let isCompleted = maxUnlocked > vnChapters.length;
    
    // 288px = 40% dari tinggi kanvas 720px (sebelumnya 40vh, yang ikut berubah mengikuti layar)
    let listHTML = '<div class="scroll-block" style="padding-top: 288px; padding-bottom: 288px;">';
    let previewHTML = '';

    vnChapters.forEach((chap, idx) => {
        const isUnlocked = chap.id <= maxUnlocked;
        const stateClass = isUnlocked ? 'unlocked' : 'locked';
        const lockIcon = isUnlocked ? '' : ' 🔒';
        const dataIndex = idx % 5;
        
        listHTML += `<div class="menu-item chapter-wheel-item ${stateClass}" data-index="${dataIndex}" data-id="${chap.id}" data-start="${chap.startIndex}" data-bg="${chap.bg}">
                        <h3>${chap.title}${lockIcon}</h3>
                        <span class="chevron">&#10095;</span>
                     </div>`;
                     
        previewHTML += `<div class="chapter-preview-bg ${stateClass}" id="preview-bg-${chap.id}"></div>`;
    });
    listHTML += '</div>';

    const html = `
        <div class="chapter-select-container">
            <div class="chapter-preview-panel">
                ${previewHTML}
            </div>
            
            <div class="search-container" style="position: absolute; top: 20px; right: 40px; z-index: 100;">
                <input type="text" id="chapter-search" class="glass-input" placeholder="Cari materi..." style="padding: 10px 20px; border-radius: 25px; width: 250px; outline: none; font-family: 'Nunito', sans-serif;">
                <div id="search-results" class="glass-panel" style="position: absolute; top: 50px; right: 0; width: 100%; border-radius: 10px; overflow: hidden; display: none;"></div>
            </div>
            
            <div class="chapter-list-panel">
                <div class="chapter-list-header" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 100; background: linear-gradient(to bottom, rgba(26, 27, 46, 0.95), transparent); padding: 20px;">
                    <button id="btn-back-menu" class="glass-btn" style="margin-bottom: 10px; padding: 10px 20px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 8px;">&#8592; Menu Utama</button>
                    <h2 style="margin: 0; padding: 0; border: none; color: #f1c40f; text-shadow: 2px 2px 5px black;">Pilih Materi</h2>
                </div>
                
                <div id="chapter-wheel-scroll" style="width: 200%; height: 100%; overflow-y: auto; overflow-x: hidden; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none;">
                    <div style="width: 50%;">
                        ${listHTML}
                    </div>
                </div>
            </div>
            <div style="position: absolute; bottom: 40px; right: 40px; z-index: 10; display: flex; gap: 15px;">
                <button id="btn-lihat-materi" class="glass-btn" style="display: none; font-size: 1.2rem; padding: 15px 30px; border-radius: 25px; cursor: pointer;">Lihat Materi</button>
                <button id="btn-start-chapter" class="btn-primary" style="display: none; font-size: 1.5rem; padding: 15px 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">Mulai Materi Ini</button>
            </div>
            
            <div id="materi-popup" class="glass-panel" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60%; max-width: 600px; z-index: 200; padding: 30px; border-radius: 15px;">
                <h2 id="materi-popup-title" style="color: #f1c40f; margin-top: 0; text-shadow: 1px 1px 3px black;">Judul</h2>
                <ul id="materi-popup-list" style="color: white; line-height: 1.6; font-size: 1.1rem; padding-left: 20px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);"></ul>
                <div style="text-align: right; margin-top: 20px;">
                    <button id="btn-close-popup" class="btn-primary" style="padding: 8px 25px;">Tutup</button>
                </div>
            </div>
        </div>
    `;

    elements.contentArea.innerHTML = html;

    // Load gambar latar
    vnChapters.forEach(chap => {
        loadVNAsset('preview-bg-' + chap.id, chap.bg, false);
    });

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => {
            appState.currentView = 'menu';
            renderView();
        });
    });
    
    document.getElementById('btn-close-popup').addEventListener('click', () => {
        document.getElementById('materi-popup').style.display = 'none';
    });

    const scrollContainer = document.getElementById('chapter-wheel-scroll');
    const items = document.querySelectorAll('.chapter-wheel-item');
    const btnStart = document.getElementById('btn-start-chapter');
    const btnLihat = document.getElementById('btn-lihat-materi');
    const searchInput = document.getElementById('chapter-search');
    const searchResults = document.getElementById('search-results');
    
    let itemData = [];
    
    // Fitur Pencarian
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        searchResults.innerHTML = '';
        if (val.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        let matches = [];
        vnChapters.forEach((chap, i) => {
            if (chap.id <= maxUnlocked) {
                let matchFound = false;
                if (chap.title.toLowerCase().includes(val)) matchFound = true;
                if (!matchFound && chap.summary && chap.summary.some(s => s.toLowerCase().includes(val))) matchFound = true;
                
                // Cari juga di dialog isMateri
                if (!matchFound) {
                    let sIdx = chap.startIndex;
                    let eIdx = i + 1 < vnChapters.length ? vnChapters[i + 1].startIndex : dialogData.length;
                    for (let j = sIdx; j < eIdx; j++) {
                        if (dialogData[j].isMateri && dialogData[j].text.toLowerCase().includes(val)) {
                            matchFound = true;
                            break;
                        }
                    }
                }
                
                if (matchFound) {
                    matches.push({ chap: chap, index: i });
                }
            }
        });
        
        if (matches.length > 0) {
            searchResults.style.display = 'block';
            matches.slice(0, 3).forEach(m => {
                let div = document.createElement('div');
                div.style.padding = '10px 15px';
                div.style.color = 'white';
                div.style.cursor = 'pointer';
                div.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                div.innerText = m.chap.title;
                div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.1)';
                div.onmouseout = () => div.style.background = 'transparent';
                div.onclick = () => {
                    itemData[m.index].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                };
                searchResults.appendChild(div);
            });
        } else {
            searchResults.style.display = 'block';
            searchResults.innerHTML = '<div style="padding: 10px 15px; color: #aaa; text-align: center;">Materi tidak ditemukan</div>';
        }
    });

    setTimeout(() => {
        items.forEach(item => {
            itemData.push({
                el: item,
                top: item.offsetTop,
                height: item.offsetHeight,
                id: item.getAttribute('data-id'),
                start: item.getAttribute('data-start'),
                unlocked: item.classList.contains('unlocked')
            });
            
            // Klik item untuk scroll ke tengah
            item.addEventListener('click', (e) => {
                e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        // Posisi awal: scroll ke bab tertinggi yang belum diselesaikan (kembali ke awal jika sudah tamat)
        let targetIndex = Math.min(maxUnlocked - 1, itemData.length - 1);
        if (isCompleted) targetIndex = 0;

        if (itemData[targetIndex]) {
            scrollContainer.scrollTop = itemData[targetIndex].top - (scrollContainer.offsetHeight / 2) + (itemData[targetIndex].height / 2);
        }

        function updateChapterPhysics() {
            const currentScroll = scrollContainer.scrollTop;
            const containerHeight = scrollContainer.offsetHeight;
            const centerY = containerHeight / 2;
            
            let closestItem = null;
            let minDistance = Infinity;

            for (let i = 0; i < itemData.length; i++) {
                const data = itemData[i];
                const itemCenterY = (data.top - currentScroll) + (data.height / 2);
                const distance = Math.abs(centerY - itemCenterY);
                
                const maxDist = 300;
                let ratio = Math.max(0, 1 - (distance / maxDist));
                
                let scale = 0.75 + (ratio * 0.30);
                let opacity = data.unlocked ? (ratio * 1.0) : (ratio * 0.4);
                let curveLeft = -Math.pow(distance, 2) / 1000; 
                let translateX = curveLeft + (ratio * 15);

                data.el.style.transform = `scale(${scale}) translateX(${translateX}px)`;
                data.el.style.opacity = opacity;
                data.el.classList.remove('active-center');

                if (distance < minDistance) {
                    minDistance = distance;
                    closestItem = data;
                }
            }

            if (closestItem) {
                closestItem.el.classList.add('active-center');
                
                // Ubah gambar background
                document.querySelectorAll('.chapter-preview-bg').forEach(bg => bg.classList.remove('active'));
                document.getElementById('preview-bg-' + closestItem.id).classList.add('active');
                
                // --- DETEKSI TEMA GELAP/TERANG ---
                const chapData = vnChapters.find(c => c.id == closestItem.id);
                if (chapData && chapData.theme) {
                    document.body.className = `theme-${chapData.theme}`;
                }
                
                if (closestItem.unlocked) {
                    btnStart.style.display = 'block';
                    btnStart.innerText = (isCompleted || parseInt(closestItem.id) < maxUnlocked) ? "Baca Ulang Materi" : "Lanjutkan Materi";
                    btnStart.onclick = () => {
                        // Animasi menyusut ke kiri
                        const listPanel = document.querySelector('.chapter-list-panel');
                        if (listPanel) {
                            listPanel.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
                            listPanel.style.transform = 'translateX(-100%)';
                            listPanel.style.opacity = '0';
                        }
                        const btnBack = document.getElementById('btn-back-main');
                        if (btnBack) {
                            btnBack.style.transition = 'opacity 0.3s ease';
                            btnBack.style.opacity = '0';
                        }
                        
                        // Resume logic: Gunakan vnLastIndex jika materi tersebut adalah materi yang belum diselesaikan
                        let resumeIndex = parseInt(closestItem.start);
                        if (!isCompleted && parseInt(closestItem.id) === maxUnlocked && appState.vnLastIndex) {
                            resumeIndex = appState.vnLastIndex;
                        }
                        
                        setTimeout(() => {
                            vnCurrentIndex = resumeIndex;
                            renderVNEngine();
                        }, 1000);
                    };
                    
                    if (isCompleted || parseInt(closestItem.id) < maxUnlocked) {
                        btnLihat.style.display = 'block';
                        btnLihat.onclick = () => {
                            const chapData = vnChapters.find(c => c.id == closestItem.id);
                            document.getElementById('materi-popup-title').innerText = chapData.title;
                            const ul = document.getElementById('materi-popup-list');
                            ul.innerHTML = '';
                            
                            if (chapData.summary && chapData.summary.length > 0) {
                                chapData.summary.forEach(pt => {
                                    ul.innerHTML += `<li style="margin-bottom: 10px;">${pt}</li>`;
                                });
                            } else {
                                ul.innerHTML += `<li>Materi belum tersedia.</li>`;
                            }
                            
                            document.getElementById('materi-popup').style.display = 'block';
                        };
                    } else {
                        btnLihat.style.display = 'none';
                    }
                } else {
                    btnStart.style.display = 'none';
                    btnLihat.style.display = 'none';
                }
            }
        }

        updateChapterPhysics();
        scrollContainer.addEventListener('scroll', () => {
            window.requestAnimationFrame(updateChapterPhysics);
        });

        // Ukur ulang bila tata letak berubah (HP diputar, font selesai dimuat, dsb.)
        pantauRoda(scrollContainer, (pertama) => {
            itemData.forEach(d => { d.top = d.el.offsetTop; d.height = d.el.offsetHeight; });
            let idx = itemData.findIndex(d => d.el.classList.contains('active-center'));
            if (pertama || idx < 0) idx = targetIndex;
            if (itemData[idx]) {
                scrollContainer.style.scrollBehavior = 'auto';
                scrollContainer.scrollTop = itemData[idx].top - (scrollContainer.offsetHeight / 2) + (itemData[idx].height / 2);
                scrollContainer.style.scrollBehavior = '';
            }
            updateChapterPhysics();
        });

    }, 50);
}

function renderVNEngine() {
    window.vnPreviousSpeaker = null;
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';

    const vnHTML = 
        '<button id="btn-back-menu" class="btn-secondary" style="position: absolute; top: 20px; left: 20px; z-index: 100;">&#8592; Kembali</button>' +
        '<div id="vn-progress-dots" class="vn-nav"></div>' +
        '<div class="vn-container">' +
            '<div id="vn-bg"></div>' +
            '<div id="vn-char-kevin" class="vn-character left"></div>' +
            '<div id="vn-char-kayana" class="vn-character right"></div>' +
            '<div id="vn-char-kayana-quiz" class="vn-character left quiz-only"></div>' +
            '<div id="vn-dialogue-container" class="vn-dialogue-box">' +
                '<div id="vn-speaker" class="vn-speaker"></div>' +
                '<div id="vn-text" class="vn-text"></div>' +
                '<div id="vn-next-indicator" class="vn-next-indicator">Klik Layar untuk Lanjut &#9658;</div>' +
            '</div>' +
            '<div id="vn-quiz-overlay" class="vn-quiz-overlay">' +
                '<div class="quiz-content-right">' +
                    '<div id="vn-quiz-callout" class="callout-bubble">' +
                        '<div id="vn-quiz-question"></div>' +
                        '<div id="vn-quiz-next-indicator" style="display:none; text-align:right; margin-top:20px; font-size: 0.9rem; color: #e74c8b; animation: blink 1.2s infinite; cursor: pointer;">Klik layar untuk lanjut &#9658;</div>' +
                    '</div>' +
                    '<div id="vn-quiz-options" class="vn-quiz-options"></div>' +
                '</div>' +
            '</div>' +
        '</div>';

    elements.contentArea.innerHTML = vnHTML;
    
    // Load karakter secara dinamis (mendeteksi PNG/JPG atau teks fallback)
    // Gambar Kevin & Kayana dipasang lewat vnPasangEkspresi di bawah (ekspresi terakhir, atau gambar dasar).
    // Tidak dimuat dua kali di sini, supaya gambar dasar tidak menimpa ekspresi bila selesai dimuat belakangan.
    loadVNAsset('vn-char-kayana-quiz', 'kayana_quiz', true);

    // Ekspresi: muat awal semuanya, lalu samakan kedua karakter dengan keadaan terakhirnya di bab ini
    vnMuatAwalEkspresi();
    vnPasangEkspresi(document.getElementById('vn-char-kevin'), 'kevin', vnEkspresiTerakhir('Kevin', vnCurrentIndex));
    vnPasangEkspresi(document.getElementById('vn-char-kayana'), 'kayana', vnEkspresiTerakhir('Kayana', vnCurrentIndex));

    // Saat melanjutkan dari TENGAH bab (mis. setelah website dimuat ulang), baris dialog itu
    // tidak membawa info latar. Maka latar diambil dari baris dialog terakhir sebelumnya yang
    // punya latar; jika tidak ada, dari latar bab tempat dialog itu berada.
    let lanjutTengahBab = false;
    if (dialogData[vnCurrentIndex] && !dialogData[vnCurrentIndex].bg) {
        lanjutTengahBab = true;
        let bgAwal = null;
        for (let i = vnCurrentIndex; i >= 0 && !bgAwal; i--) {
            if (dialogData[i].bg) bgAwal = dialogData[i].bg;
        }
        if (!bgAwal) {
            const bab = vnChapters.filter(c => c.startIndex <= vnCurrentIndex).pop();
            if (bab) bgAwal = bab.bg;
        }
        if (bgAwal) {
            loadVNAsset('vn-bg', bgAwal, false);
            const babLatar = vnChapters.find(c => c.bg === bgAwal);
            document.body.className = 'theme-' + ((babLatar && babLatar.theme) || 'dark');
        }
    }

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        clearTimeout(vnTypewriterTimeout);
        if (window.vnSplashTimeout) clearTimeout(window.vnSplashTimeout);
        navigateWithTransition(() => renderChapterSelect());
    });

    if (!lanjutTengahBab) { playVNDialogue(); return; }

    // Melanjutkan dari tengah bab: munculkan bertahap agar halus.
    // Latar memudar masuk dulu, lalu karakter naik perlahan, lalu kotak dialog.
    // (Kotak dialog baris pertama memang dimunculkan mesin dialog setelah 1,2 detik;
    //  di sini hanya ditambah gerakan naik agar seirama.)
    const halus = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const bgEl = document.getElementById('vn-bg');
    const kotak = document.getElementById('vn-dialogue-container');
    const dots = document.getElementById('vn-progress-dots');
    if (bgEl) bgEl.animate([{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 1100, easing: 'ease-out' });
    document.querySelectorAll('.vn-character').forEach((el, i) => {
        // Hanya keadaan awal yang ditentukan; keadaan akhir mengikuti gaya karakter (aktif/redup/tersembunyi)
        el.animate([{ opacity: 0, translate: '0 26px' }, { translate: '0 0' }],
            { duration: 800, delay: 450 + i * 130, easing: halus, fill: 'backwards' });
    });
    if (kotak) kotak.animate([{ translate: '0 30px' }, { translate: '0 0' }],
        { duration: 700, delay: 1200, easing: halus, fill: 'backwards' });
    if (dots) dots.animate([{ opacity: 0 }, {}], { duration: 500, delay: 1200, fill: 'backwards' });

    playVNDialogue();
}

// Navigasi dengan sentuh-dan-geser (untuk HP, juga berfungsi dengan mouse):
// sentuh navigasi -> membesar; geser kiri/kanan -> titik terdekat disorot dan keterangannya muncul;
// lepas -> melompat ke titik itu. Ketukan biasa memilih titik yang paling dekat dengan jari.
function vnPasangGeserNavigasi(nav, startIdx) {
    const titik = () => Array.from(nav.querySelectorAll('.vn-nav-dot'));
    const tip = nav.querySelector('.vn-nav-tip');
    let pilih = -1;
    const terdekat = (x) => {
        let best = -1, jarak = Infinity;
        titik().forEach((el, i) => {
            const r = el.getBoundingClientRect();
            const d = Math.abs(x - (r.left + r.width / 2));
            if (d < jarak) { jarak = d; best = i; }
        });
        return best;
    };
    const sorot = (x) => {
        pilih = terdekat(x);
        titik().forEach((el, i) => el.classList.toggle('dipilih', i === pilih));
        const el = titik()[pilih];
        if (el && tip) { tip.innerText = el.title; tip.style.left = (el.offsetLeft + el.offsetWidth / 2) + 'px'; }
    };
    const selesai = () => { nav.classList.remove('geser'); titik().forEach(el => el.classList.remove('dipilih')); };
    nav.onpointerdown = (e) => {
        e.stopPropagation();
        try { nav.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
        nav.classList.add('geser');
        sorot(e.clientX);
    };
    nav.onpointermove = (e) => { if (nav.classList.contains('geser')) sorot(e.clientX); };
    nav.onpointerup = (e) => {
        e.stopPropagation();
        if (!nav.classList.contains('geser')) return;
        const tujuan = pilih;
        selesai();
        if (tujuan >= 0 && startIdx + tujuan !== vnCurrentIndex) vnLompatKe(startIdx + tujuan);
    };
    nav.onpointercancel = selesai;
}

// Melompat ke baris tertentu lewat navigasi bab (hanya tersedia di bab yang sudah selesai)
function vnLompatKe(index) {
    clearTimeout(vnTypewriterTimeout);
    if (window.vnSplashTimeout) clearTimeout(window.vnSplashTimeout);
    const container = document.querySelector('.vn-container');
    if (container) { container.onclick = null; container.classList.remove('quiz-mode', 'chapter-transition'); }
    vnCurrentIndex = index;
    // Samakan ekspresi kedua karakter dengan keadaan terakhirnya sebelum baris ini
    vnPasangEkspresi(document.getElementById('vn-char-kevin'), 'kevin', vnEkspresiTerakhir('Kevin', index));
    vnPasangEkspresi(document.getElementById('vn-char-kayana'), 'kayana', vnEkspresiTerakhir('Kayana', index));
    playVNDialogue();
}

function playVNDialogue() {
    if (vnCurrentIndex >= dialogData.length) {
        if ((appState.vnProgress || 0) <= vnChapters.length) {
            appState.vnProgress = vnChapters.length + 1;
            saveProgress();
        }
        alert('Selamat! Kamu telah menyelesaikan petualangan Berpikir Komputasional! Menu Cek Kisi-Kisi sekarang sudah terbuka.');
        appState.currentView = 'menu';
        renderView();
        return;
    }

    // Auto-Unlock Chapter
    let currentChap = 1;
    for (let c = vnChapters.length - 1; c >= 0; c--) {
        if (vnCurrentIndex >= vnChapters[c].startIndex) {
            currentChap = vnChapters[c].id;
            break;
        }
    }
    // Hanya simpan state posisi terakhir jika pemain membaca bab terbaru, bukan saat replay
    if (currentChap >= (appState.vnProgress || 1)) {
        appState.vnProgress = currentChap;
        appState.vnLastIndex = vnCurrentIndex;
    }
    saveProgress();

    // Navigasi bab (titik-titik di atas): hanya untuk bab yang SUDAH selesai (mode baca ulang).
    // Tiap titik bisa diketuk untuk melompat ke baris itu. Saat bab masih dipelajari pertama kali,
    // navigasi disembunyikan agar murid mengikuti alurnya dan tidak melompati kuis.
    const dotsContainer = document.getElementById('vn-progress-dots');
    if (dotsContainer) {
        const babIni = vnChapters.filter(c => c.startIndex <= vnCurrentIndex).pop();
        const babSelesai = babIni && babIni.id < (appState.vnProgress || 1);
        dotsContainer.innerHTML = '';
        dotsContainer.classList.toggle('tampil', !!babSelesai);
        dotsContainer.onclick = (e) => e.stopPropagation();   // ketukan di area navigasi tidak memajukan dialog
        if (babSelesai) {
            const idxBab = vnChapters.indexOf(babIni);
            const startIdx = babIni.startIndex;
            const endIdx = idxBab + 1 < vnChapters.length ? vnChapters[idxBab + 1].startIndex : dialogData.length;
            for (let i = startIdx; i < endIdx; i++) {
                const d = dialogData[i];
                const jenis = d.type === 'quiz' ? 'kuis' : (d.isMateri ? 'materi' : 'dialog');
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'vn-nav-dot ' + jenis + (i === vnCurrentIndex ? ' aktif' : (i < vnCurrentIndex ? ' lewat' : ''));
                const ket = jenis === 'kuis' ? 'Kuis' : (jenis === 'materi' ? 'Materi inti' : (d.speaker === 'Narator' ? 'Narasi' : d.speaker));
                dot.title = `${i - startIdx + 1}. ${ket}`;
                dot.setAttribute('aria-label', dot.title);
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (i === vnCurrentIndex) return;
                    vnLompatKe(i);
                });
                dotsContainer.appendChild(dot);
            }
            const hitung = document.createElement('span');
            hitung.className = 'vn-nav-hitung';
            hitung.innerText = `${vnCurrentIndex - startIdx + 1}/${endIdx - startIdx}`;
            dotsContainer.appendChild(hitung);
            const tip = document.createElement('span');
            tip.className = 'vn-nav-tip';
            dotsContainer.appendChild(tip);
            vnPasangGeserNavigasi(dotsContainer, startIdx);
        }
    }

    // --- LOGIKA SPLASH SCREEN (JUDUL MATERI) ---
    const chapterData = vnChapters.find(c => c.startIndex === vnCurrentIndex);
    const isReplay = chapterData && (chapterData.id < (appState.vnProgress || 0));
    
    if (chapterData && appState.lastSplashIndex !== vnCurrentIndex && !isReplay) {
        appState.lastSplashIndex = vnCurrentIndex;
        
        const isFromMenu = (window.vnPreviousSpeaker === null);
        const container = document.querySelector('.vn-container');
        const dialogBox = document.getElementById('vn-dialogue-container');
        
        function runSplashScreen() {
            let splashEl = document.getElementById('vn-chapter-splash');
            if (!splashEl) {
                splashEl = document.createElement('div');
                splashEl.id = 'vn-chapter-splash';
                if(container) container.appendChild(splashEl);
            }
            
            splashEl.innerHTML = `<h1 class="chapter-splash-text">${chapterData.title}</h1>`;
            // Memunculkan layar hitam pekat perlahan (menunggu browser merender elemen)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    splashEl.classList.add('show-bg');
                    splashEl.classList.add('splash-active');
                    
                    // Perlahan pudar dari hitam pekat ke transparan (reveal background) setelah layar tertutup hitam
                    setTimeout(() => {
                        if (splashEl) splashEl.classList.add('reveal-bg');
                    }, 600);
                });
            });
            
            // Tunda eksekusi dialog hingga animasi selesai (4 detik)
            window.vnSplashTimeout = setTimeout(() => {
                splashEl.classList.remove('show-bg');
                splashEl.classList.remove('reveal-bg');
                setTimeout(() => {
                    splashEl.remove();
                }, 800); // Tunggu transisi opacity 0.8s selesai
                
                if (container) container.classList.remove('chapter-transition');
                
                if (appState.currentView === 'materi') {
                    playVNDialogue(); 
                }
            }, 4000);
        }

        if (!isFromMenu) {
            // Tahap 1: Hilangkan Karakter & Kotak Dialog bertahap
            if (container) container.classList.add('chapter-transition');
            if (dialogBox) {
                dialogBox.style.transition = 'opacity 0.5s ease';
                dialogBox.style.opacity = '0';
            }
            
            // Tunggu 500ms agar karakter/dialog lenyap sempurna
            setTimeout(() => {
                // Tahap 2: Transisi Halus Background Baru
                if (dialogData[vnCurrentIndex].bg) {
                    loadVNAsset('vn-bg', dialogData[vnCurrentIndex].bg, false);
                    let bgTheme = 'dark';
                    for (let i = 0; i < vnChapters.length; i++) {
                        if (vnChapters[i].bg === dialogData[vnCurrentIndex].bg) {
                            bgTheme = vnChapters[i].theme || 'dark'; break;
                        }
                    }
                    document.body.className = `theme-${bgTheme}`;
                }
                
                // Tunggu 600ms membiarkan background bertransisi sebelum memunculkan judul
                setTimeout(() => {
                    // Tahap 3: Munculkan Judul
                    runSplashScreen();
                }, 600);
            }, 500);
            
            return; // Hentikan alur agar menunggu timeouts
        } else {
            // Masuk dari Menu: Langsung sembunyikan semua secara instan dan jalankan
            if (container) container.classList.add('chapter-transition');
            if (dialogBox) {
                dialogBox.style.transition = 'none';
                dialogBox.style.opacity = '0';
            }
            if (dialogData[vnCurrentIndex].bg) {
                loadVNAsset('vn-bg', dialogData[vnCurrentIndex].bg, false);
                let bgTheme = 'dark';
                for (let i = 0; i < vnChapters.length; i++) {
                    if (vnChapters[i].bg === dialogData[vnCurrentIndex].bg) {
                        bgTheme = vnChapters[i].theme || 'dark'; break;
                    }
                }
                document.body.className = `theme-${bgTheme}`;
            }
            runSplashScreen();
            return;
        }
    } else if (chapterData && isReplay && appState.lastSplashIndex !== vnCurrentIndex) {
        appState.lastSplashIndex = vnCurrentIndex;
        
        const isFromMenu = (window.vnPreviousSpeaker === null);
        
        if (isFromMenu) {
            const container = document.querySelector('.vn-container');
            const dialogBox = document.getElementById('vn-dialogue-container');
            
            // Masking loading background dengan layar hitam transparan tanpa memunculkan teks judul
            let splashEl = document.createElement('div');
            splashEl.id = 'vn-chapter-splash';
            if(container) container.appendChild(splashEl);
            
            if (dialogBox) {
                dialogBox.style.transition = 'none';
                dialogBox.style.opacity = '0'; 
            }
            if (container) container.classList.add('chapter-transition');
            
            if (dialogData[vnCurrentIndex].bg) {
                loadVNAsset('vn-bg', dialogData[vnCurrentIndex].bg, false);
                let bgTheme = 'dark';
                for (let i = 0; i < vnChapters.length; i++) {
                    if (vnChapters[i].bg === dialogData[vnCurrentIndex].bg) {
                        bgTheme = vnChapters[i].theme || 'dark'; break;
                    }
                }
                document.body.className = `theme-${bgTheme}`;
            }
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    splashEl.classList.add('show-bg');
                    
                    // Reveal background lebih cepat (hanya masking sesaat)
                    setTimeout(() => {
                        splashEl.classList.add('reveal-bg');
                    }, 400);
                    
                    // Hapus mask dan mulai dialog
                    setTimeout(() => {
                        splashEl.classList.remove('show-bg');
                        splashEl.classList.remove('reveal-bg');
                        setTimeout(() => {
                            if(splashEl) splashEl.remove();
                        }, 500);
                        if (container) container.classList.remove('chapter-transition');
                        
                        // Lanjut siklus dialog (splash screen akan dilewati karena lastSplashIndex sudah terekam)
                        playVNDialogue(); 
                    }, 1000);
                });
            });
            return; // Tunda typewriter sampai transisi masking selesai
        } else {
            // Replay tapi transisi antar dialog (linear) -> Langsung ganti background tanpa splash
            if (dialogData[vnCurrentIndex].bg) {
                loadVNAsset('vn-bg', dialogData[vnCurrentIndex].bg, false);
                let bgTheme = 'dark';
                for (let i = 0; i < vnChapters.length; i++) {
                    if (vnChapters[i].bg === dialogData[vnCurrentIndex].bg) {
                        bgTheme = vnChapters[i].theme || 'dark'; break;
                    }
                }
                document.body.className = `theme-${bgTheme}`;
            }
        }
    }


    const data = dialogData[vnCurrentIndex];
    const container = document.querySelector('.vn-container');
    const quizOverlay = document.getElementById('vn-quiz-overlay');
    const textEl = document.getElementById('vn-text');
    const speakerEl = document.getElementById('vn-speaker');
    const indicator = document.getElementById('vn-next-indicator');
    const charKevin = document.getElementById('vn-char-kevin');
    const charKayana = document.getElementById('vn-char-kayana');

    if (data.bg) {
        loadVNAsset('vn-bg', data.bg, false);
        // --- DETEKSI TEMA GELAP/TERANG ---
        let bgTheme = 'dark';
        for (let i = 0; i < vnChapters.length; i++) {
            if (vnChapters[i].bg === data.bg) {
                bgTheme = vnChapters[i].theme || 'dark';
                break;
            }
        }
        document.body.className = `theme-${bgTheme}`;
    }

    if (data.type === 'quiz') {
        container.classList.add('quiz-mode');
        
        // Pastikan Kayana aktif sebagai penanya
        charKayana.classList.add('active');
        charKayana.classList.remove('inactive');
        
        document.getElementById('vn-quiz-question').innerText = data.text;
        
        const optionsContainer = document.getElementById('vn-quiz-options');
        optionsContainer.innerHTML = '';
        optionsContainer.style.display = 'flex'; // Pastikan opsi terlihat lagi
        document.getElementById('vn-quiz-next-indicator').style.display = 'none';

        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'vn-quiz-btn';
            btn.innerText = opt.text;
            btn.onclick = () => {
                showFeedback(opt.feedback, opt.correct);
            };
            optionsContainer.appendChild(btn);
        });
        return; 
    }

    container.classList.remove('quiz-mode');

    // Tampilkan Dialog Normal
    speakerEl.innerText = data.speaker;
    
    // Atur Fokus Karakter & Mode Narator
    if (data.speaker === 'Narator') {
        container.classList.add('narrator-mode');
        speakerEl.style.display = 'none'; // Sembunyikan label nama 'Narator'
        
        charKevin.classList.remove('active');
        charKevin.classList.add('inactive');
        charKayana.classList.remove('active');
        charKayana.classList.add('inactive');
    } else {
        container.classList.remove('narrator-mode');
        speakerEl.style.display = 'block';
        
        if (data.speaker === 'Kevin') {
            vnPasangEkspresi(charKevin, 'kevin', data.emotion);
            charKevin.classList.add('active');
            charKevin.classList.remove('inactive');
            charKayana.classList.remove('active');
            charKayana.classList.add('inactive');
        } else {
            vnPasangEkspresi(charKayana, 'kayana', data.emotion);
            charKayana.classList.add('active');
            charKayana.classList.remove('inactive');
            charKevin.classList.remove('active');
            charKevin.classList.add('inactive');
        }
    }

    // Karakter yang belum waktunya tampil pada baris ini (kolom `sembunyikan` di dialogueData.js)
    charKevin.classList.toggle('belum-muncul', data.sembunyikan === 'Kevin');
    charKayana.classList.toggle('belum-muncul', data.sembunyikan === 'Kayana');

    let isFirstLine = (window.vnPreviousSpeaker === null);
    let isTransitioningFromNarrator = (window.vnPreviousSpeaker === 'Narator') && (data.speaker !== 'Narator');
    window.vnPreviousSpeaker = data.speaker;

    const dialogBox = document.getElementById('vn-dialogue-container');
    indicator.style.display = 'none';
    textEl.innerText = '';
    vnIsTyping = true;
    let i = 0;
    
    function typeWriter() {
        if (i < data.text.length) {
            textEl.innerHTML += data.text.charAt(i);
            i++;
            vnTypewriterTimeout = setTimeout(typeWriter, 25);
        } else {
            vnIsTyping = false;
            indicator.style.display = 'block';
        }
    }
    clearTimeout(vnTypewriterTimeout);

    if (isFirstLine) {
        dialogBox.style.transition = 'none';
        dialogBox.style.opacity = '0';
        setTimeout(() => {
            dialogBox.style.transition = 'opacity 0.5s ease';
            dialogBox.style.opacity = '1';
            typeWriter();
        }, 1200); // Jeda dramatis sebelum chapter dimulai
    } else if (isTransitioningFromNarrator) {
        dialogBox.style.transition = 'none';
        dialogBox.style.opacity = '0';
        
        setTimeout(() => {
            dialogBox.style.transition = 'opacity 0.4s ease';
            dialogBox.style.opacity = '1';
            typeWriter();
        }, 600); // Jeda menunggu karakter muncul
    } else {
        dialogBox.style.transition = 'none';
        dialogBox.style.opacity = '1';
        typeWriter();
    }

    // Event Klik untuk Lanjut atau Skip animasi ngetik
    container.onclick = (e) => {
        if(e.target.className === 'vn-quiz-btn' || e.target.id === 'btn-back-menu') return;
        
        if (vnIsTyping) {
            clearTimeout(vnTypewriterTimeout);
            textEl.innerText = data.text;
            vnIsTyping = false;
            indicator.style.display = 'block';
        } else {
            container.onclick = null; // hapus event agar tidak dobel
            vnCurrentIndex++;
            playVNDialogue();
        }
    };
}

function showFeedback(feedbackText, isCorrect) {
    const questionEl = document.getElementById('vn-quiz-question');
    const indicator = document.getElementById('vn-quiz-next-indicator');
    const optionsContainer = document.getElementById('vn-quiz-options');
    const container = document.querySelector('.vn-container');

    optionsContainer.style.display = 'none'; // Sembunyikan opsi
    indicator.style.display = 'none';
    questionEl.innerText = '';
    
    // Opsional: Berikan warna berbeda untuk feedback benar/salah pada teks
    questionEl.style.color = isCorrect ? '#2ecc71' : '#e74c3c';
    
    vnIsTyping = true;
    let i = 0;
    
    function typeWriterFeedback() {
        if (i < feedbackText.length) {
            questionEl.innerHTML += feedbackText.charAt(i);
            i++;
            vnTypewriterTimeout = setTimeout(typeWriterFeedback, 25);
        } else {
            vnIsTyping = false;
            indicator.style.display = 'block';
        }
    }
    clearTimeout(vnTypewriterTimeout);
    typeWriterFeedback();

    container.onclick = (e) => {
        if(e.target.id === 'btn-back-menu') return;
        if (vnIsTyping) {
            clearTimeout(vnTypewriterTimeout);
            questionEl.innerText = feedbackText;
            vnIsTyping = false;
            indicator.style.display = 'block';
        } else {
            container.onclick = null;
            questionEl.style.color = '#1a1b2e'; // Kembalikan ke warna awal
            
            // Cegah kotak dialog lama muncul seketika saat quiz-mode dihapus
            const dialogBox = document.getElementById('vn-dialogue-container');
            dialogBox.style.transition = 'none';
            dialogBox.style.opacity = '0';
            
            // Hapus mode kuis untuk memulai animasi CSS (overlay memudar, karakter normal kembali)
            container.classList.remove('quiz-mode');
            
            // Beri jeda agar animasi selesai sebelum memunculkan teks dialog berikutnya
            setTimeout(() => {
                vnCurrentIndex++;
                playVNDialogue();
            }, 600);
        }
    };
}
