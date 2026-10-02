// =====================================================================
// MENU SIMULASI ASTS
//   ① Halaman awal  →  ② Mode ujian (waktu berjalan)  →  ③ Hasil  →  Pembahasan
// Aturan penting:
//   - Waktu disimpan sebagai JAM BERAKHIR, jadi terus berjalan mundur meski
//     halaman dimuat ulang, tab ditutup, atau HP mati.
//   - Selama ujian berlangsung, menu lain dikunci. Saat website dibuka lagi,
//     muncul pop-up "Lanjutkan Ujian". Jika waktu sudah habis, jawaban
//     dikumpulkan otomatis.
//   - Soal dan pilihan diacak setiap kali simulasi dimulai.
//   - PG Kompleks dinilai: tiap pilihan benar +1/k, tiap pilihan salah
//     −90%/(jumlah pilihan − k), hasil minimal 0.
// Data soal ada di js/simulasiData.js
// =====================================================================

const SIM_KEY = 'mpi_bk_simulasi';            // sesi ujian yang sedang berjalan
const SIM_HASIL = 'mpi_bk_simulasi_hasil';    // hasil terakhir (untuk halaman hasil & pembahasan)
const SIM_RIWAYAT = 'mpi_bk_simulasi_riwayat';// daftar nilai semua percobaan

let simTimerId = null;

function simLoad(key, def) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; }
}
function simSave(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* abaikan */ }
}
function simulasiAktif() {
    const s = simLoad(SIM_KEY, null);
    return !!(s && s.status === 'active');
}
// Waktu "sekarang" yang tidak bisa mundur (pengaman jika jam perangkat dimundurkan)
function simNow(s) { return Math.max(Date.now(), s.lastSeen || 0); }
function simSisaMs(s) { return Math.max(0, s.endsAt - simNow(s)); }
function simFormatWaktu(ms) {
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60), d = total % 60;
    return String(m).padStart(2, '0') + ':' + String(d).padStart(2, '0');
}
function simDurasiTeks(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60), d = total % 60;
    if (m === 0) return `${d} detik`;
    return d === 0 ? `${m} menit` : `${m} menit ${d} detik`;
}
// Petunjuk "gulir ke bawah" muncul jika isi panel masih ada di bawah
function simPasangPetunjukGulir(root) {
    root.querySelectorAll('.sim-soal, .sim-konteks').forEach(box => {
        const hint = document.createElement('div');
        hint.className = 'sim-gulir';
        hint.title = 'Gulir ke bawah';
        box.appendChild(hint);
        const cek = () => {
            const sisa = box.scrollHeight - box.clientHeight - box.scrollTop;
            hint.classList.toggle('tampil', sisa > 12);
        };
        box.addEventListener('scroll', cek);
        hint.addEventListener('click', (e) => { e.stopPropagation(); box.scrollBy({ top: box.clientHeight * 0.7, behavior: 'smooth' }); });
        requestAnimationFrame(cek);
        box.querySelectorAll('img').forEach(img => img.addEventListener('load', cek));
    });
}
function simAcak(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function simSoalById(id) { return simulasiSoal.find(q => q.id === id); }
function simNamaMateri(kode) {
    const m = (typeof kisiMateri !== 'undefined') ? kisiMateri.find(x => x.kode === kode) : null;
    return m ? m.nama : kode;
}
function simAngka(x) {
    // 0,67 / 1 / 86,7 — format Indonesia
    const r = Math.round(x * 100) / 100;
    return (Number.isInteger(r) ? String(r) : r.toFixed(2).replace(/0$/, '')).replace('.', ',');
}

// ---------- LAYAR PENUH ----------
// Saat simulasi dimulai browser dipaksa layar penuh. Setelah jawaban dikumpulkan,
// browser dikembalikan ke kondisi sebelum simulasi (layar penuh atau tidak).
function simLayarPenuhDidukung() {
    const el = document.documentElement;
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) &&
           !!(el.requestFullscreen || el.webkitRequestFullscreen);
}
function simSedangLayarPenuh() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
}
function simMasukLayarPenuh() {
    // Harus dipanggil langsung dari ketukan/klik murid (aturan browser)
    if (!simLayarPenuhDidukung() || simSedangLayarPenuh()) return;
    const el = document.documentElement;
    try {
        const p = el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : el.webkitRequestFullscreen();
        if (p && p.catch) p.catch(() => {});
    } catch (e) { /* abaikan */ }
}
function simKeluarLayarPenuh() {
    if (!simSedangLayarPenuh()) return;
    try {
        const p = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
        if (p && p.catch) p.catch(() => {});
    } catch (e) { /* abaikan */ }
}
// Jika murid keluar dari layar penuh di tengah ujian, ujian ditahan sampai kembali layar penuh
function simCekLayarPenuh() {
    if (!simulasiAktif() || !simLayarPenuhDidukung()) return;
    const ada = document.querySelector('.sim-modal-layarpenuh');
    if (simSedangLayarPenuh()) {
        if (ada) ada.remove();
        return;
    }
    // Pop-up "Lanjutkan Ujian" setelah reload sudah mengurus layar penuh sendiri
    if (ada || document.querySelector('.sim-modal-lanjut') || !document.querySelector('.sim-ujian')) return;
    const m = simModal(`
        <div class="sim-modal-icon">&#x26F6;</div>
        <h3>Ujian harus layar penuh</h3>
        <p>Kamu keluar dari mode layar penuh. Waktu ujian tetap berjalan, jadi segera kembali.</p>
        <button class="btn-primary sim-modal-btn" id="sim-kembali-penuh">Kembali ke Layar Penuh</button>`, false);
    m.classList.add('sim-modal-layarpenuh');
    m.querySelector('#sim-kembali-penuh').addEventListener('click', () => { simMasukLayarPenuh(); m.remove(); });
}
document.addEventListener('fullscreenchange', simCekLayarPenuh);
document.addEventListener('webkitfullscreenchange', simCekLayarPenuh);

// Safari di iPhone tidak mendukung layar penuh. Jika dibuka dari tab Safari biasa
// (bukan dari ikon Layar Utama), tampilkan panduan "Tambahkan ke Layar Utama".
function simPerluPanduanIphone() {
    const iphone = /iPhone|iPod/.test(navigator.userAgent);
    const modeAplikasi = window.navigator.standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches;
    return iphone && !modeAplikasi;
}

// ---------- PENILAIAN ----------
function simHitungPoin(q, jawaban) {
    jawaban = jawaban || [];
    if (jawaban.length === 0) return 0;
    if (q.jenis === 'PG') return (jawaban.length === 1 && jawaban[0] === q.kunci[0]) ? 1 : 0;
    const k = q.kunci.length;
    const salahTersedia = q.opsi.length - k;
    const benar = jawaban.filter(j => q.kunci.includes(j)).length;
    const salah = jawaban.length - benar;
    const poin = benar / k - salah * (0.9 / salahTersedia);
    return Math.max(0, Math.min(1, Math.round(poin * 10000) / 10000));
}
function simStatus(q, jawaban, poin) {
    if (!jawaban || jawaban.length === 0) return 'kosong';
    if (poin >= 0.9999) return 'benar';
    if (poin > 0) return 'sebagian';
    return 'salah';
}

// ---------- PINTU MASUK DARI MENU ----------
function renderSimulasi() {
    if (simulasiAktif()) { renderSimulasiUjian(); return; }
    renderSimulasiAwal();
}

function simSiapkanHalaman() {
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    document.body.className = 'theme-dark';
    if (simTimerId) { clearInterval(simTimerId); simTimerId = null; }
}

// Dipanggil saat website dibuka: jika ada ujian berjalan, langsung kunci ke ujian
function simulasiCekSaatMuat() {
    const s = simLoad(SIM_KEY, null);
    if (!s || s.status !== 'active') return false;
    appState.currentModuleIndex = modules.findIndex(m => m.id === 'simulasi_asts');
    appState.currentView = 'materi';
    if (simSisaMs(s) > 0) {
        renderSimulasiUjian();
        simTampilPopupLanjut();
    } else {
        simKumpulkan(true, true);
        renderSimulasiHasil();
        simModal(`
            <div class="sim-modal-icon">&#9203;</div>
            <h3>Waktu ujian sudah habis</h3>
            <p>Jawaban yang sempat kamu isi sudah dikumpulkan otomatis.</p>
            <button class="btn-primary sim-modal-btn" data-aksi="tutup">Lihat Hasil</button>`, false);
    }
    return true;
}

// ---------- ① HALAMAN AWAL ----------
function renderSimulasiAwal() {
    simSiapkanHalaman();
    const riwayat = simLoad(SIM_RIWAYAT, []);
    const jmlPG = simulasiSoal.filter(q => q.jenis === 'PG').length;
    const jmlPGK = simulasiSoal.length - jmlPG;
    const terbaik = riwayat.length ? Math.max(...riwayat.map(r => r.nilai)) : null;
    const terakhir = riwayat.length ? riwayat[riwayat.length - 1].nilai : null;

    const riwayatHTML = riwayat.length ? `
        <div class="sim-riwayat">
            <div><span>Nilai terakhir</span><b>${simAngka(terakhir)}</b></div>
            <div><span>Nilai terbaik</span><b class="emas">${simAngka(terbaik)}</b></div>
            <div><span>Percobaan</span><b>${riwayat.length}&times;</b></div>
        </div>
        <button id="sim-lihat-hasil" class="sim-link">Lihat hasil terakhir &#10095;</button>` : `
        <div class="sim-riwayat sim-riwayat-kosong">Belum ada percobaan. Ini kesempatan pertamamu!</div>`;

    elements.contentArea.innerHTML = `
        <div class="sim-container">
            <div class="sim-side">
                <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                <h2 class="sim-judul">${simulasiInfo.judul}</h2>
                <p class="kisi-subjudul">${kisiInfo.mapel} &middot; ${kisiInfo.kelas}</p>
                <div class="sim-stat-row">
                    <div class="sim-stat"><b>${simulasiSoal.length}</b><span>soal</span></div>
                    <div class="sim-stat"><b>${simulasiInfo.durasiMenit}</b><span>menit</span></div>
                    <div class="sim-stat"><b>${jmlPG}<i>+</i>${jmlPGK}</b><span>PG + PG Kompleks</span></div>
                </div>
                ${riwayatHTML}
                ${simPerluPanduanIphone() ? `
                <div class="sim-iphone">
                    <div class="sim-iphone-judul">&#128241; Pakai iPhone?</div>
                    <p>Safari tidak bisa layar penuh. Pasang dulu aplikasinya agar ujian tampil penuh.</p>
                    <button id="sim-panduan-pasang" class="sim-link">Lihat cara memasang &#10095;</button>
                </div>` : ''}
            </div>
            <div class="sim-awal-kanan">
                <h3 class="sim-aturan-judul">Sebelum mulai</h3>
                <ul class="sim-aturan">
                    <li><span>&#9201;</span><div><b>Waktu langsung berjalan</b>${simulasiInfo.durasiMenit} menit sejak kamu menekan Mulai, dan tetap berjalan meski halaman ditutup.</div></li>
                    <li><span>&#9638;</span><div><b>Bebas pindah soal</b>Lompat ke nomor mana pun lewat tombol Nomor Soal.</div></li>
                    <li><span>&#9873;</span><div><b>Tandai ragu-ragu</b>Soal yang belum yakin bisa ditandai dan diperiksa lagi sebelum dikumpulkan.</div></li>
                    <li><span>&#9745;</span><div><b>PG Kompleks</b>Pilih lebih dari satu jawaban. Pilihan salah mengurangi poin soal itu.</div></li>
                    <li><span>&#128274;</span><div><b>Layar penuh &amp; menu dikunci</b>Selama ujian layar menjadi penuh dan menu lain dikunci. Saat waktu habis, jawaban dikumpulkan otomatis.</div></li>
                </ul>
            </div>
            <button id="sim-mulai" class="btn-primary sim-mulai-btn">Mulai Simulasi &#10095;</button>
        </div>`;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => { appState.currentView = 'menu'; renderView(); });
    });
    document.getElementById('sim-mulai').addEventListener('click', simMulai);
    const panduan = document.getElementById('sim-panduan-pasang');
    if (panduan) panduan.addEventListener('click', () => bukaPanduanPasang());
    const lihat = document.getElementById('sim-lihat-hasil');
    if (lihat) lihat.addEventListener('click', () => navigateWithTransition(renderSimulasiHasil));
}

function simMulai() {
    const sebelumnyaPenuh = simSedangLayarPenuh();
    simMasukLayarPenuh();
    const now = Date.now();
    const urut = simulasiSoal.map(q => q.id);
    const order = simulasiInfo.acak ? simAcak(urut) : urut;
    const optOrder = {};
    simulasiSoal.forEach(q => {
        const ids = q.opsi.map(o => o.id);
        optOrder[q.id] = simulasiInfo.acak ? simAcak(ids) : ids;
    });
    simSave(SIM_KEY, {
        status: 'active',
        startedAt: now,
        endsAt: now + simulasiInfo.durasiMenit * 60000,
        lastSeen: now,
        layarPenuhAwal: sebelumnyaPenuh,   // dikembalikan ke kondisi ini setelah selesai
        order: order,
        optOrder: optOrder,
        answers: {},
        ragu: {},
        current: 0
    });
    navigateWithTransition(renderSimulasiUjian);
}

// ---------- ② MODE UJIAN ----------
function renderSimulasiUjian() {
    simSiapkanHalaman();
    const s = simLoad(SIM_KEY, null);
    if (!s || s.status !== 'active') { renderSimulasiAwal(); return; }

    const nomorHTML = s.order.map((id, i) => `<button class="sim-no" data-i="${i}">${i + 1}</button>`).join('');
    elements.contentArea.innerHTML = `
        <div class="sim-container sim-ujian">
            <div class="sim-topbar">
                <div class="sim-top-kiri">
                    <span class="sim-top-judul">${simulasiInfo.judul}</span>
                    <span id="sim-posisi" class="kisi-chip"></span>
                </div>
                <div class="sim-top-kanan">
                    <button id="sim-btn-nomor" class="glass-btn sim-pill">&#9638; Nomor Soal <span id="sim-terjawab"></span></button>
                    <div id="sim-timer" class="sim-pill sim-timer">&#9201; <span id="sim-timer-text">--:--</span></div>
                </div>
            </div>
            <div id="sim-main" class="sim-main"></div>
            <div class="sim-bottombar">
                <button id="sim-prev" class="glass-btn sim-nav-btn">&#10094; Sebelumnya</button>
                <button id="sim-ragu" class="sim-ragu-btn">&#9873; Ragu-ragu</button>
                <button id="sim-next" class="btn-primary sim-nav-btn">Berikutnya &#10095;</button>
            </div>
            <div id="sim-nomor-panel" class="sim-nomor-panel">
                <div class="sim-nomor-head">Nomor Soal</div>
                <div class="sim-nomor-grid">${nomorHTML}</div>
                <div class="sim-legend">
                    <span><i class="lg-jawab"></i>Dijawab</span>
                    <span><i class="lg-ragu"></i>Ragu-ragu</span>
                    <span><i class="lg-kosong"></i>Belum</span>
                </div>
                <button id="sim-kumpul-panel" class="btn-primary sim-kumpul-panel">Kumpulkan Jawaban</button>
            </div>
        </div>`;

    document.getElementById('sim-prev').addEventListener('click', () => simPindah(-1));
    document.getElementById('sim-next').addEventListener('click', () => {
        const st = simLoad(SIM_KEY, null);
        if (st.current >= st.order.length - 1) simKonfirmasiKumpul(); else simPindah(1);
    });
    document.getElementById('sim-ragu').addEventListener('click', () => {
        const st = simLoad(SIM_KEY, null);
        const id = st.order[st.current];
        st.ragu[id] = !st.ragu[id];
        simSave(SIM_KEY, st);
        simPerbaruiStatus();
    });
    const panel = document.getElementById('sim-nomor-panel');
    document.getElementById('sim-btn-nomor').addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('show');
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
    document.querySelector('.sim-ujian').addEventListener('click', () => panel.classList.remove('show'));
    panel.querySelectorAll('.sim-no').forEach(b => b.addEventListener('click', () => {
        const st = simLoad(SIM_KEY, null);
        st.current = parseInt(b.getAttribute('data-i'));
        simSave(SIM_KEY, st);
        panel.classList.remove('show');
        simRenderSoal(true);
    }));
    document.getElementById('sim-kumpul-panel').addEventListener('click', () => {
        panel.classList.remove('show');
        simKonfirmasiKumpul();
    });

    simRenderSoal(false);
    simMulaiTimer();
}

function simPindah(step) {
    const st = simLoad(SIM_KEY, null);
    const n = st.current + step;
    if (n < 0 || n >= st.order.length) return;
    st.current = n;
    simSave(SIM_KEY, st);
    simRenderSoal(true, step);
}

// Konteks soal: paragraf, daftar, pseudokode, tabel, gambar
function simKonteksHTML(q) {
    return q.konteks.map(b => {
        if (b.t === 'p') return `<p>${b.text}</p>`;
        if (b.t === 'list') return `<ul class="sim-k-list">${b.items.map(x => `<li>${x}</li>`).join('')}</ul>`;
        if (b.t === 'code') return `<pre class="sim-k-code">${b.lines.join('\n')}</pre>`;
        if (b.t === 'img') return `<div class="sim-k-img"><img src="${b.src}" alt="Gambar soal"><span>Ketuk gambar untuk memperbesar</span></div>`;
        if (b.t === 'table') {
            const [head, ...rows] = b.rows;
            return `<table class="sim-k-table"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
        }
        return '';
    }).join('');
}

function simRenderSoal(animasi, arah) {
    const st = simLoad(SIM_KEY, null);
    const q = simSoalById(st.order[st.current]);
    const main = document.getElementById('sim-main');
    const jawaban = st.answers[q.id] || [];
    const huruf = ['A', 'B', 'C', 'D', 'E', 'F'];
    const pgk = q.jenis === 'PGK';

    const opsiHTML = st.optOrder[q.id].map((oid, i) => {
        const o = q.opsi.find(x => x.id === oid);
        const on = jawaban.includes(oid);
        return `<button class="sim-opsi ${pgk ? 'pgk' : ''} ${on ? 'dipilih' : ''}" data-id="${oid}">
                    <span class="sim-huruf">${on && pgk ? '&#10003;' : huruf[i]}</span>
                    <span class="sim-opsi-teks">${o.teks}</span>
                </button>`;
    }).join('');

    const adaKonteks = q.konteks.length > 0;
    main.className = 'sim-main' + (adaKonteks ? '' : ' single');
    main.innerHTML = `
        ${adaKonteks ? `<div class="sim-konteks"><div class="sim-label">Bacaan</div>${simKonteksHTML(q)}</div>` : ''}
        <div class="sim-soal">
            <div class="sim-jenis ${pgk ? 'pgk' : ''}">${pgk ? '&#9745; PG Kompleks &middot; pilih lebih dari satu jawaban' : '&#9673; Pilihan Ganda &middot; pilih satu jawaban'}</div>
            <div class="sim-pertanyaan">${q.pertanyaan}</div>
            <div class="sim-opsi-list">${opsiHTML}</div>
        </div>`;

    if (animasi) {
        main.animate([{ opacity: 0, transform: `translateX(${(arah || 1) * 30}px)` }, { opacity: 1, transform: 'translateX(0)' }],
            { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }

    main.querySelectorAll('.sim-opsi').forEach(btn => btn.addEventListener('click', () => {
        const s2 = simLoad(SIM_KEY, null);
        const oid = btn.getAttribute('data-id');
        let jw = (s2.answers[q.id] || []).slice();
        if (pgk) {
            jw = jw.includes(oid) ? jw.filter(x => x !== oid) : jw.concat(oid);
        } else {
            jw = (jw.length === 1 && jw[0] === oid) ? [] : [oid]; // ketuk lagi = batalkan
        }
        s2.answers[q.id] = jw;
        simSave(SIM_KEY, s2);
        main.querySelectorAll('.sim-opsi').forEach((b, i) => {
            const on = jw.includes(b.getAttribute('data-id'));
            b.classList.toggle('dipilih', on);
            b.querySelector('.sim-huruf').innerHTML = (on && pgk) ? '&#10003;' : huruf[i];
        });
        simPerbaruiStatus();
    }));
    simPasangPetunjukGulir(main);
    main.querySelectorAll('.sim-k-img img').forEach(img => img.addEventListener('click', (e) => {
        e.stopPropagation();
        simZoomGambar(img.getAttribute('src'));
    }));

    simPerbaruiStatus();
}

function simPerbaruiStatus() {
    const st = simLoad(SIM_KEY, null);
    if (!st) return;
    const total = st.order.length;
    const id = st.order[st.current];
    const terjawab = st.order.filter(x => (st.answers[x] || []).length > 0).length;
    document.getElementById('sim-posisi').innerText = `Soal ${st.current + 1} dari ${total}`;
    document.getElementById('sim-terjawab').innerText = `${terjawab}/${total}`;
    document.getElementById('sim-prev').disabled = st.current === 0;
    const next = document.getElementById('sim-next');
    next.innerHTML = st.current === total - 1 ? 'Kumpulkan &#10003;' : 'Berikutnya &#10095;';
    next.classList.toggle('sim-kumpul', st.current === total - 1);
    document.getElementById('sim-ragu').classList.toggle('aktif', !!st.ragu[id]);
    document.querySelectorAll('.sim-no').forEach((b, i) => {
        const sid = st.order[i];
        b.classList.toggle('dijawab', (st.answers[sid] || []).length > 0);
        b.classList.toggle('ragu', !!st.ragu[sid]);
        b.classList.toggle('aktif', i === st.current);
    });
}

function simMulaiTimer() {
    if (simTimerId) clearInterval(simTimerId);
    let detikTerakhir = -1;
    const tick = () => {
        const st = simLoad(SIM_KEY, null);
        if (!st || st.status !== 'active') { clearInterval(simTimerId); simTimerId = null; return; }
        const sisa = simSisaMs(st);
        const teks = simFormatWaktu(sisa);
        const el = document.getElementById('sim-timer-text');
        if (el) el.innerText = teks;
        document.querySelectorAll('.sim-popup-sisa').forEach(p => p.innerText = teks);
        const timer = document.getElementById('sim-timer');
        if (timer) {
            timer.classList.toggle('warn', sisa <= 180000 && sisa > 60000);
            timer.classList.toggle('danger', sisa <= 60000);
        }
        // Catat waktu terakhir ujian aktif (pengaman jam mundur), cukup tiap detik
        const detik = Math.floor(Date.now() / 1000);
        if (detik !== detikTerakhir) {
            detikTerakhir = detik;
            st.lastSeen = Math.max(st.lastSeen || 0, Date.now());
            simSave(SIM_KEY, st);
        }
        if (sisa <= 0) {
            clearInterval(simTimerId); simTimerId = null;
            simKumpulkan(true);
        }
    };
    tick();
    simTimerId = setInterval(tick, 250);
}

// ---------- POP-UP & MODAL ----------
function simModal(html, bisaDitutup) {
    const root = elements.contentArea.firstElementChild;
    const wrap = document.createElement('div');
    wrap.className = 'sim-modal-backdrop';
    wrap.innerHTML = `<div class="sim-modal">${html}</div>`;
    root.appendChild(wrap);
    wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
    wrap.querySelector('.sim-modal').animate([{ transform: 'scale(0.92)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    const tutup = () => wrap.remove();
    wrap.querySelectorAll('[data-aksi="tutup"]').forEach(b => b.addEventListener('click', tutup));
    if (bisaDitutup) wrap.addEventListener('click', (e) => { if (e.target === wrap) tutup(); });
    return wrap;
}

function simTampilPopupLanjut() {
    const st = simLoad(SIM_KEY, null);
    const terjawab = st.order.filter(x => (st.answers[x] || []).length > 0).length;
    const m = simModal(`
        <div class="sim-modal-icon">&#9201;</div>
        <h3>Ujian masih berlangsung</h3>
        <div class="sim-popup-info">
            <div><span>Sisa waktu</span><b class="sim-popup-sisa">${simFormatWaktu(simSisaMs(st))}</b><small>terus berjalan</small></div>
            <div><span>Terjawab</span><b>${terjawab}<i>/${st.order.length}</i></b><small>soal</small></div>
        </div>
        <button class="btn-primary sim-modal-btn" data-aksi="tutup" id="sim-lanjut-btn">Lanjutkan Ujian &#10095;</button>`, false);
    m.classList.add('sim-modal-lanjut');
    m.querySelector('#sim-lanjut-btn').addEventListener('click', simMasukLayarPenuh);
}

function simKonfirmasiKumpul() {
    const st = simLoad(SIM_KEY, null);
    const kosong = st.order.filter(x => !(st.answers[x] || []).length).length;
    const ragu = st.order.filter(x => st.ragu[x]).length;
    let pesan = 'Semua soal sudah dijawab. Jawaban yang dikumpulkan tidak bisa diubah lagi.';
    if (kosong || ragu) {
        const bagian = [];
        if (kosong) bagian.push(`<b>${kosong} soal belum dijawab</b>`);
        if (ragu) bagian.push(`<b>${ragu} soal ditandai ragu-ragu</b>`);
        pesan = `Masih ada ${bagian.join(' dan ')}. Jawaban yang dikumpulkan tidak bisa diubah lagi.`;
    }
    const m = simModal(`
        <div class="sim-modal-icon">&#9745;</div>
        <h3>Kumpulkan jawaban?</h3>
        <p>${pesan}</p>
        <div class="sim-modal-aksi">
            <button class="glass-btn sim-modal-btn2" data-aksi="tutup">Periksa lagi</button>
            <button class="btn-primary sim-modal-btn2" id="sim-ya-kumpul">Ya, kumpulkan</button>
        </div>`, true);
    m.querySelector('#sim-ya-kumpul').addEventListener('click', () => { m.remove(); simKumpulkan(false); });
}

function simZoomGambar(src) {
    const m = simModal(`<img class="sim-zoom-img" src="${src}" alt="Gambar soal"><button class="glass-btn sim-modal-btn2" data-aksi="tutup">Tutup</button>`, true);
    m.classList.add('sim-zoom');
}

// ---------- KUMPULKAN & HITUNG NILAI ----------
function simKumpulkan(otomatis, tanpaTampilan) {
    const st = simLoad(SIM_KEY, null);
    if (!st || st.status !== 'active') return;
    if (simTimerId) { clearInterval(simTimerId); simTimerId = null; }
    const poin = {};
    let total = 0;
    st.order.forEach(id => {
        const p = simHitungPoin(simSoalById(id), st.answers[id]);
        poin[id] = p; total += p;
    });
    const nilai = Math.round(total / st.order.length * 1000) / 10;
    const selesai = Math.min(simNow(st), st.endsAt);
    const hasil = {
        order: st.order, optOrder: st.optOrder, answers: st.answers,
        poin: poin, totalPoin: total, nilai: nilai,
        durasiMs: selesai - st.startedAt, selesaiAt: selesai, otomatis: !!otomatis
    };
    simSave(SIM_HASIL, hasil);
    const riwayat = simLoad(SIM_RIWAYAT, []);
    riwayat.push({ nilai: nilai, tanggal: selesai });
    simSave(SIM_RIWAYAT, riwayat);
    localStorage.removeItem(SIM_KEY);   // kunci menu dibuka lagi
    document.querySelectorAll('.sim-modal-layarpenuh').forEach(x => x.remove());
    if (!st.layarPenuhAwal) simKeluarLayarPenuh();   // kembali seperti sebelum simulasi

    if (tanpaTampilan) return;
    if (otomatis) {
        const m = simModal(`
            <div class="sim-modal-icon">&#9203;</div>
            <h3>Waktu habis!</h3>
            <p>Jawabanmu sudah dikumpulkan otomatis.</p>
            <button class="btn-primary sim-modal-btn" id="sim-ke-hasil">Lihat Hasil &#10095;</button>`, false);
        m.querySelector('#sim-ke-hasil').addEventListener('click', () => navigateWithTransition(renderSimulasiHasil));
    } else {
        navigateWithTransition(renderSimulasiHasil);
    }
}

// ---------- ③ HALAMAN HASIL ----------
function renderSimulasiHasil() {
    simSiapkanHalaman();
    const h = simLoad(SIM_HASIL, null);
    if (!h) { renderSimulasiAwal(); return; }
    const riwayat = simLoad(SIM_RIWAYAT, []);
    const terbaik = riwayat.length ? Math.max(...riwayat.map(r => r.nilai)) : h.nilai;

    const status = h.order.map(id => simStatus(simSoalById(id), h.answers[id], h.poin[id]));
    const hitung = k => status.filter(x => x === k).length;
    let pesan = 'Ayo ulangi lagi, kamu pasti bisa!';
    if (h.nilai >= 85) pesan = 'Luar biasa! Kamu siap menghadapi ASTS.';
    else if (h.nilai >= 70) pesan = 'Bagus! Sedikit lagi menuju sempurna.';
    else if (h.nilai >= 50) pesan = 'Cukup baik. Terus berlatih, ya!';

    // Per materi (urutan sesuai kisi-kisi)
    const perMateri = {};
    h.order.forEach(id => {
        const q = simSoalById(id);
        perMateri[q.kode] = perMateri[q.kode] || { poin: 0, maks: 0 };
        perMateri[q.kode].poin += h.poin[id];
        perMateri[q.kode].maks += 1;
    });
    const materiHTML = Object.keys(perMateri).sort().map(kode => {
        const d = perMateri[kode], pct = d.poin / d.maks * 100;
        const warna = pct >= 80 ? '#2ecc71' : pct >= 50 ? '#f1c40f' : '#e74c3c';
        return `<div class="sim-materi-row">
                    <span class="sim-materi-nama"><span class="kisi-kode">${kode}</span>${simNamaMateri(kode)}</span>
                    <div class="sim-materi-bar"><div data-w="${pct}" style="background:${warna}"></div></div>
                    <span class="sim-materi-skor">${simAngka(d.poin)}/${d.maks}</span>
                </div>`;
    }).join('');

    const ikon = { benar: '&#10003;', sebagian: '&#9680;', salah: '&#10007;', kosong: '&ndash;' };
    const nomorHTML = h.order.map((id, i) => `
        <button class="sim-hasil-no ${status[i]}" data-i="${i}" title="Lihat pembahasan soal ${i + 1}">
            <b>${i + 1}</b><span>${ikon[status[i]]}</span>
        </button>`).join('');

    const R = 88, KEL = 2 * Math.PI * R;
    elements.contentArea.innerHTML = `
        <div class="sim-container">
            <div class="sim-side">
                <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                <h2 class="sim-judul">Hasil Simulasi</h2>
                <p class="kisi-subjudul">${h.otomatis ? 'Dikumpulkan otomatis saat waktu habis' : 'Dikumpulkan'} &middot; dikerjakan ${simDurasiTeks(h.durasiMs)}</p>
                <div class="sim-gauge">
                    <svg viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="${R}" class="sim-gauge-bg"/>
                        <circle cx="100" cy="100" r="${R}" class="sim-gauge-fg" id="sim-gauge-fg"
                            stroke-dasharray="${KEL}" stroke-dashoffset="${KEL}"/>
                    </svg>
                    <div class="sim-gauge-text"><b id="sim-nilai">0</b><span>nilai</span></div>
                </div>
                <p class="sim-pesan">${pesan}</p>
                <div class="sim-hasil-stat">
                    <div class="benar"><b>${hitung('benar')}</b><span>Benar</span></div>
                    <div class="sebagian"><b>${hitung('sebagian')}</b><span>Sebagian</span></div>
                    <div class="salah"><b>${hitung('salah')}</b><span>Salah</span></div>
                    <div class="kosong"><b>${hitung('kosong')}</b><span>Kosong</span></div>
                </div>
            </div>
            <div class="sim-hasil-kanan">
                <div class="sim-label">Hasil per materi</div>
                <div class="sim-materi-list">${materiHTML}</div>
                <div class="sim-label">Jawabanmu &middot; <span>ketuk nomor untuk melihat pembahasan</span></div>
                <div class="sim-hasil-grid">${nomorHTML}</div>
                <div class="sim-terbaik">Nilai terbaikmu: <b>${simAngka(terbaik)}</b> &middot; ${riwayat.length}&times; percobaan</div>
            </div>
            <div class="sim-hasil-aksi">
                <button id="sim-bahas" class="glass-btn sim-nav-btn">Lihat Pembahasan</button>
                <button id="sim-ulang" class="btn-primary sim-nav-btn">&#8635; Ulangi Simulasi</button>
            </div>
        </div>`;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => { appState.currentView = 'menu'; renderView(); });
    });
    document.getElementById('sim-ulang').addEventListener('click', () => navigateWithTransition(renderSimulasiAwal));
    document.getElementById('sim-bahas').addEventListener('click', () => navigateWithTransition(() => renderSimulasiPembahasan(0)));
    document.querySelectorAll('.sim-hasil-no').forEach(b => b.addEventListener('click', () =>
        navigateWithTransition(() => renderSimulasiPembahasan(parseInt(b.getAttribute('data-i'))))));

    // Animasi nilai & bar
    const fg = document.getElementById('sim-gauge-fg');
    const nilaiEl = document.getElementById('sim-nilai');
    requestAnimationFrame(() => requestAnimationFrame(() => {
        fg.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s';
        fg.style.strokeDashoffset = KEL * (1 - h.nilai / 100);
        document.querySelectorAll('.sim-materi-bar div').forEach((b, i) => {
            b.style.transition = `width 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${0.4 + i * 0.08}s`;
            b.style.width = b.getAttribute('data-w') + '%';
        });
    }));
    const t0 = performance.now() + 300;
    const step = (now) => {
        if (!document.body.contains(nilaiEl)) return;
        const p = Math.min(1, Math.max(0, (now - t0) / 1400));
        nilaiEl.innerText = simAngka(Math.round(h.nilai * (1 - Math.pow(1 - p, 3)) * 10) / 10);
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ---------- PEMBAHASAN ----------
function renderSimulasiPembahasan(idx) {
    simSiapkanHalaman();
    const h = simLoad(SIM_HASIL, null);
    if (!h) { renderSimulasiAwal(); return; }
    const id = h.order[idx];
    const q = simSoalById(id);
    const jawaban = h.answers[id] || [];
    const poin = h.poin[id];
    const status = simStatus(q, jawaban, poin);
    const label = { benar: 'Benar', sebagian: `Sebagian &middot; ${simAngka(poin)} poin`, salah: 'Salah', kosong: 'Tidak dijawab' };
    const huruf = ['A', 'B', 'C', 'D', 'E', 'F'];

    // Di pembahasan, pilihan ditampilkan sesuai urutan asli kartu soal (A–E),
    // supaya huruf kunci dan isi pembahasan ("Opsi B benar ...") cocok.
    const opsiHTML = q.opsi.map((o, i) => {
        const oid = o.id;
        const kunci = q.kunci.includes(oid), pilih = jawaban.includes(oid);
        let kelas = '', tanda = '';
        if (kunci && pilih) { kelas = 'kunci dipilih'; tanda = '<em class="ok">Jawabanmu &#10003;</em>'; }
        else if (kunci) { kelas = 'kunci'; tanda = '<em class="ok">Kunci</em>'; }
        else if (pilih) { kelas = 'keliru'; tanda = '<em class="no">Jawabanmu &#10007;</em>'; }
        return `<div class="sim-opsi review ${q.jenis === 'PGK' ? 'pgk' : ''} ${kelas}">
                    <span class="sim-huruf">${o.id}</span>
                    <span class="sim-opsi-teks">${o.teks}</span>${tanda}
                </div>`;
    }).join('');

    const bahasHTML = q.pembahasan.length > 1
        ? `<ul>${q.pembahasan.map(p => `<li>${p}</li>`).join('')}</ul>`
        : `<p>${q.pembahasan[0] || ''}</p>`;
    const adaKonteks = q.konteks.length > 0;

    elements.contentArea.innerHTML = `
        <div class="sim-container sim-ujian">
            <div class="sim-topbar">
                <div class="sim-top-kiri">
                    <button id="sim-ke-hasil" class="glass-btn kisi-back-btn sim-back-inline">&#8592; Hasil</button>
                    <span class="sim-top-judul">Pembahasan</span>
                    <span class="kisi-chip">Soal ${idx + 1} dari ${h.order.length}</span>
                    <span class="sim-status-chip ${status}">${label[status]}</span>
                </div>
                <div class="sim-top-kanan"><span class="kisi-chip">${q.kode} &middot; ${simNamaMateri(q.kode)}</span></div>
            </div>
            <div class="sim-main ${adaKonteks ? '' : 'single'}">
                ${adaKonteks ? `<div class="sim-konteks"><div class="sim-label">Bacaan</div>${simKonteksHTML(q)}</div>` : ''}
                <div class="sim-soal">
                    <div class="sim-pertanyaan">${q.pertanyaan}</div>
                    <div class="sim-opsi-list">${opsiHTML}</div>
                    <div class="sim-pembahasan"><div class="sim-label">Pembahasan &middot; kunci ${q.kunci.join(', ')}</div>${bahasHTML}</div>
                </div>
            </div>
            <div class="sim-bottombar">
                <button id="sim-prev" class="glass-btn sim-nav-btn" ${idx === 0 ? 'disabled' : ''}>&#10094; Sebelumnya</button>
                <span></span>
                <button id="sim-next" class="btn-primary sim-nav-btn">${idx === h.order.length - 1 ? 'Kembali ke Hasil' : 'Berikutnya &#10095;'}</button>
            </div>
        </div>`;

    document.getElementById('sim-ke-hasil').addEventListener('click', () => navigateWithTransition(renderSimulasiHasil));
    document.getElementById('sim-prev').addEventListener('click', () => { if (idx > 0) renderSimulasiPembahasan(idx - 1); });
    document.getElementById('sim-next').addEventListener('click', () => {
        if (idx < h.order.length - 1) renderSimulasiPembahasan(idx + 1);
        else navigateWithTransition(renderSimulasiHasil);
    });
    document.querySelectorAll('.sim-k-img img').forEach(img => img.addEventListener('click', () => simZoomGambar(img.getAttribute('src'))));
    simPasangPetunjukGulir(document.querySelector('.sim-main'));
}

// Peringatan bawaan browser jika halaman ditutup/dimuat ulang saat ujian berlangsung
window.addEventListener('beforeunload', (e) => {
    if (simulasiAktif()) { e.preventDefault(); e.returnValue = ''; }
});
