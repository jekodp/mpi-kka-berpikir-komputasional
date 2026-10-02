// =====================================================================
// MUSIK LATAR
// - Dua lagu: tema menu dan tema cerita. File ditaruh di assets/musik/
//   (format .mp3, .m4a, .ogg, atau .wav). Nama file dan judulnya diatur di
//   MUSIK_LAGU di bawah; huruf besar-kecil nama file harus persis sama.
// - Mulai berbunyi saat murid menekan "Mulai" di sampul (browser melarang
//   suara sebelum ada sentuhan). Lagu berganti mengikuti halaman, dengan
//   efek memudar. Saat Simulasi ASTS berlangsung, musik berhenti dan
//   lanjut lagi setelah ujian selesai.
// - Pemutar bergaya aplikasi musik ada di menu Pengaturan: putar/jeda,
//   ganti lagu, geser posisi, dan volume. Pilihan murid diingat.
//   Volume dan bisu juga bisa diatur dari tombol kecil di layar dialog.
// - Jika file lagu belum dipasang, aplikasi tetap berjalan tanpa suara.
// Rencana berikutnya (belum dibuat): efek suara tombol dan jawaban kuis.
// =====================================================================

const MUSIK_KEY = 'mpi_bk_musik';
const MUSIK_FORMAT = ['mp3', 'm4a', 'ogg', 'wav'];
const MUSIK_PUDAR_MS = 900;
const MUSIK_LAGU = {
    menu:   { berkas: 'Sunlight_on_the_Desk',    judul: 'Sunlight on the Desk',    ket: 'Tema menu' },
    cerita: { berkas: 'Afternoon_Library_Light', judul: 'Afternoon Library Light', ket: 'Tema cerita' }
};
const MUSIK_URUTAN = ['menu', 'cerita'];

const musik = {
    nyala: true, volume: 0.4,
    terbuka: false,          // sudah ada sentuhan murid, jadi browser mengizinkan suara
    halaman: null,           // lagu yang diminta halaman saat ini ('menu' | 'cerita' | null = senyap)
    pilihan: null,           // lagu yang dipilih murid di pemutar Pengaturan (berlaku selama di halaman itu)
    aktif: null,             // lagu yang sedang berbunyi
    audio: {}, tersedia: {}, timerPudar: {},
    volumeBisaDiatur: true   // di iPhone, volume diatur lewat tombol fisik, bukan oleh halaman web
};

(function () {
    try {
        const s = JSON.parse(localStorage.getItem(MUSIK_KEY) || 'null');
        if (s) { musik.nyala = s.nyala !== false; if (typeof s.volume === 'number') musik.volume = Math.min(1, Math.max(0, s.volume)); }
    } catch (e) { /* abaikan */ }
})();
function musikSimpan() {
    try { localStorage.setItem(MUSIK_KEY, JSON.stringify({ nyala: musik.nyala, volume: musik.volume })); } catch (e) { /* abaikan */ }
}

// Dipakai pemutar di Pengaturan dan tombol volume di layar dialog
function musikAturVolume(v) {
    musik.volume = Math.min(1, Math.max(0, v));
    musikSimpan();
    const a = musik.audio[musik.aktif];
    if (a && musik.volumeBisaDiatur) { clearInterval(musik.timerPudar[musik.aktif]); a.volume = musik.volume; }
}
function musikAturNyala(nyala) {
    musik.terbuka = true;
    musik.nyala = !!nyala;
    musikSimpan();
    musikTerapkan();
}

// Menyiapkan elemen audio; format dicoba berurutan sampai ada yang bisa dimuat
function musikSiapkan(id) {
    if (musik.audio[id]) return musik.audio[id];
    const a = new Audio();
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0;
    let ke = 0;
    const coba = () => {
        if (ke >= MUSIK_FORMAT.length) { musik.tersedia[id] = false; musikPerbaruiUI(); return; }
        a.src = `assets/musik/${MUSIK_LAGU[id].berkas}.${MUSIK_FORMAT[ke++]}`;
        a.load();
    };
    a.addEventListener('error', coba);
    a.addEventListener('canplay', () => { if (musik.tersedia[id] !== true) { musik.tersedia[id] = true; musikTerapkan(); } });
    ['play', 'pause', 'timeupdate', 'loadedmetadata'].forEach(ev => a.addEventListener(ev, musikPerbaruiUI));
    musik.audio[id] = a;
    coba();
    return a;
}

function musikPudar(id, tujuan, setelah) {
    const a = musik.audio[id];
    if (!a) return;
    clearInterval(musik.timerPudar[id]);
    if (!musik.volumeBisaDiatur) { if (setelah) setelah(); return; }
    const awal = a.volume, langkah = 18, t0 = Date.now();
    musik.timerPudar[id] = setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / MUSIK_PUDAR_MS);
        a.volume = Math.min(1, Math.max(0, awal + (tujuan - awal) * p));
        if (p >= 1) { clearInterval(musik.timerPudar[id]); if (setelah) setelah(); }
    }, 1000 / langkah);
}

// Menyamakan suara dengan keadaan saat ini (halaman, pilihan murid, nyala/mati)
function musikTerapkan() {
    if (!musik.terbuka) { musikPerbaruiUI(); return; }
    const mau = (musik.nyala && !document.hidden) ? (musik.pilihan || musik.halaman) : null;
    MUSIK_URUTAN.forEach(id => {
        const a = musikSiapkan(id);
        if (id === mau && musik.tersedia[id] !== false) {
            if (a.paused) { const p = a.play(); if (p && p.catch) p.catch(() => {}); }
            musikPudar(id, musik.volume);
        } else if (!a.paused) {
            musikPudar(id, 0, () => a.pause());
        }
    });
    musik.aktif = mau;
    musikPerbaruiUI();
}

// Lagu untuk tiap halaman, ditentukan dari isi kanvas
function musikLaguHalaman() {
    const root = elements.contentArea.firstElementChild;
    if (!root) return null;
    const c = root.classList;
    if (c.contains('muat-container') || c.contains('cover-container')) return null;   // sebelum "Mulai": senyap
    if (typeof simulasiAktif === 'function' && simulasiAktif()) return null;          // ujian berlangsung: senyap
    // Di layar dialog, anak pertama kanvas adalah tombol Kembali, jadi wadah dialog dicari langsung
    if (c.contains('chapter-select-container') || elements.contentArea.querySelector(':scope > .vn-container')) return 'cerita';
    return 'menu';
}
function musikCekHalaman() {
    const lagu = musikLaguHalaman();
    const diPengaturan = !!document.querySelector('.musik-kartu');
    if (!diPengaturan) musik.pilihan = null;             // pilihan di pemutar hanya berlaku selama di Pengaturan
    if (lagu === musik.halaman && musik.aktif === ((musik.nyala && !document.hidden) ? (musik.pilihan || lagu) : null)) return;
    musik.halaman = lagu;
    musikTerapkan();
}

document.addEventListener('DOMContentLoaded', () => {
    // Di iPhone volume tidak bisa diubah oleh halaman web: penggeser volume disembunyikan
    try { const t = new Audio(); t.volume = 0.5; musik.volumeBisaDiatur = Math.abs(t.volume - 0.5) < 0.01; } catch (e) { /* abaikan */ }

    new MutationObserver(musikCekHalaman).observe(elements.contentArea, { childList: true });
    // Ujian dimulai/selesai tanpa mengganti seluruh halaman pun tetap terpantau
    setInterval(musikCekHalaman, 1000);

    // Sentuhan pertama membuka izin suara. Di layar pemuatan belum dihitung; di sampul hanya tombol "Mulai".
    const buka = (e) => {
        if (musik.terbuka) return;
        const root = elements.contentArea.firstElementChild;
        if (!root || root.classList.contains('muat-container')) return;
        if (root.classList.contains('cover-container') && !(e.target.closest && e.target.closest('#btn-cover-mulai'))) return;
        musik.terbuka = true;
        // Putar-jeda sekejap di dalam sentuhan ini, agar browser HP mengizinkan lagu dimulai nanti
        MUSIK_URUTAN.forEach(id => { const a = musikSiapkan(id); const p = a.play(); if (p && p.then) p.then(() => { if (musik.aktif !== id) a.pause(); }).catch(() => {}); });
        musik.halaman = musikLaguHalaman() || (root.classList.contains('cover-container') ? 'menu' : null);
        musikTerapkan();
    };
    document.addEventListener('pointerdown', buka, true);
    document.addEventListener('keydown', buka, true);
    document.addEventListener('visibilitychange', musikTerapkan);
});

// ---------- PEMUTAR DI MENU PENGATURAN ----------
function musikWaktu(d) {
    if (!isFinite(d) || d < 0) d = 0;
    return Math.floor(d / 60) + ':' + String(Math.floor(d % 60)).padStart(2, '0');
}
function musikKartuHTML() {
    return `
        <div class="musik-kartu">
            <div class="musik-atas">
                <div class="musik-sampul"><span class="musik-eq"><i></i><i></i><i></i><i></i></span></div>
                <div class="musik-info">
                    <span class="musik-label">Musik latar</span>
                    <b id="musik-judul">-</b>
                    <span id="musik-ket">-</span>
                </div>
            </div>
            <div class="musik-garis">
                <span id="musik-kini">0:00</span>
                <input type="range" id="musik-posisi" min="0" max="1000" value="0" aria-label="Posisi lagu">
                <span id="musik-total">0:00</span>
            </div>
            <div class="musik-tombol">
                <button id="musik-sebelum" aria-label="Lagu sebelumnya">&#9198;</button>
                <button id="musik-putar" class="musik-putar" aria-label="Putar atau jeda"></button>
                <button id="musik-berikut" aria-label="Lagu berikutnya">&#9197;</button>
            </div>
            <div class="musik-volume" id="musik-volume-baris">
                <span>&#128264;</span>
                <input type="range" id="musik-volume" min="0" max="100" value="${Math.round(musik.volume * 100)}" aria-label="Volume">
                <span>&#128266;</span>
            </div>
            <div class="musik-daftar" id="musik-daftar"></div>
            <p class="musik-catatan" id="musik-catatan"></p>
        </div>`;
}
function musikPasangKartu() {
    const kartu = document.querySelector('.musik-kartu');
    if (!kartu) return;
    const lagu = () => musik.pilihan || musik.halaman || 'menu';
    document.getElementById('musik-putar').addEventListener('click', () => {
        musikAturNyala(!musik.nyala);
    });
    const ganti = (arah) => {
        const i = MUSIK_URUTAN.indexOf(lagu());
        musik.pilihan = MUSIK_URUTAN[(i + arah + MUSIK_URUTAN.length) % MUSIK_URUTAN.length];
        musik.terbuka = true;
        if (!musik.nyala) { musik.nyala = true; musikSimpan(); }
        musikTerapkan();
    };
    document.getElementById('musik-sebelum').addEventListener('click', () => ganti(-1));
    document.getElementById('musik-berikut').addEventListener('click', () => ganti(1));
    document.getElementById('musik-volume').addEventListener('input', (e) => {
        musikAturVolume(e.target.value / 100);
        e.target.style.setProperty('--isi', e.target.value + '%');
    });
    const posisi = document.getElementById('musik-posisi');
    posisi.addEventListener('input', () => {
        const a = musik.audio[lagu()];
        if (a && isFinite(a.duration)) a.currentTime = a.duration * posisi.value / 1000;
    });
    document.getElementById('musik-daftar').addEventListener('click', (e) => {
        const baris = e.target.closest('[data-lagu]');
        if (!baris) return;
        musik.pilihan = baris.getAttribute('data-lagu');
        musik.terbuka = true;
        if (!musik.nyala) { musik.nyala = true; musikSimpan(); }
        musikTerapkan();
    });
    if (!musik.volumeBisaDiatur) document.getElementById('musik-volume-baris').style.display = 'none';
    MUSIK_URUTAN.forEach(musikSiapkan);
    musikPerbaruiUI();
}
function musikPerbaruiUI() {
    const kartu = document.querySelector('.musik-kartu');
    if (!kartu) return;
    const id = musik.pilihan || musik.halaman || 'menu';
    const a = musik.audio[id];
    const berbunyi = !!(a && !a.paused && musik.nyala);
    const adaBerkas = MUSIK_URUTAN.some(x => musik.tersedia[x] !== false);
    kartu.classList.toggle('berbunyi', berbunyi);
    document.getElementById('musik-judul').innerText = MUSIK_LAGU[id].judul;
    document.getElementById('musik-ket').innerText = MUSIK_LAGU[id].ket + ' · MPI Berpikir Komputasional';
    document.getElementById('musik-putar').innerHTML = musik.nyala ? '&#10074;&#10074;' : '&#9654;';
    const posisi = document.getElementById('musik-posisi');
    const dur = a && isFinite(a.duration) ? a.duration : 0;
    if (document.activeElement !== posisi) posisi.value = dur ? Math.round(a.currentTime / dur * 1000) : 0;
    posisi.style.setProperty('--isi', (posisi.value / 10) + '%');
    document.getElementById('musik-kini').innerText = musikWaktu(a ? a.currentTime : 0);
    document.getElementById('musik-total').innerText = musikWaktu(dur);
    const vol = document.getElementById('musik-volume');
    vol.style.setProperty('--isi', vol.value + '%');
    document.getElementById('musik-daftar').innerHTML = MUSIK_URUTAN.map((x, i) => `
        <div class="musik-baris ${x === id ? 'dipilih' : ''} ${musik.tersedia[x] === false ? 'kosong' : ''}" data-lagu="${x}">
            <span class="musik-no">${x === id && berbunyi ? '<span class="musik-eq kecil"><i></i><i></i><i></i></span>' : (i + 1)}</span>
            <span class="musik-nama"><b>${MUSIK_LAGU[x].judul}</b><small>${MUSIK_LAGU[x].ket}${musik.tersedia[x] === false ? ' · berkas belum dipasang' : ''}</small></span>
        </div>`).join('');
    document.getElementById('musik-catatan').innerText = !adaBerkas
        ? 'Berkas musik belum dipasang di assets/musik.'
        : (musik.nyala ? 'Musik berhenti sendiri saat Simulasi ASTS berlangsung.' : 'Musik dimatikan. Tekan tombol putar untuk menyalakan.');
}
