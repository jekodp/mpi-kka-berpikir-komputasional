// =====================================================================
// HALAMAN CEK KISI-KISI
// - Kiri : menu putar (Ringkasan Soal + M1–M6), perilaku sama dengan Pilih Materi
// - Kanan: Ringkasan  -> carousel 3D berulang berisi 3 diagram (Bagian B)
//          Materi M1–M6 -> daftar cek kompetensi (Bagian A) + sebaran soal materi
// Data diambil dari js/kisiKisiData.js
// =====================================================================

function renderKisiKisi() {
    elements.header.style.display = 'none';
    elements.footer.style.display = 'none';
    elements.contentArea.style.padding = '0';
    elements.contentArea.style.overflow = 'hidden';
    document.body.className = 'theme-dark';

    if (!appState.kisiChecks) appState.kisiChecks = {};
    window.kisiDoneSebelumnya = undefined;

    // Item menu putar: Ringkasan + 6 materi
    const wheelItems = [{ key: 'ringkasan', label: 'Ringkasan Soal', kode: '' }]
        .concat(kisiMateri.map(m => ({ key: m.kode, label: m.nama, kode: m.kode })));

    let listHTML = '<div class="scroll-block" style="padding-top: 288px; padding-bottom: 288px;">';
    wheelItems.forEach((it, idx) => {
        const kode = it.kode ? `<span class="kisi-kode">${it.kode}</span>` : '<span class="kisi-kode kisi-kode-icon">&#9638;</span>';
        listHTML += `<div class="menu-item chapter-wheel-item unlocked kisi-wheel-item" data-key="${it.key}" data-idx="${idx}">
                        <h3>${kode}<span class="kisi-label-teks">${it.label}</span>${it.kode ? `<span class="kisi-prog" data-kode="${it.kode}"></span>` : ''}</h3>
                        <span class="chevron">&#10095;</span>
                     </div>`;
    });
    listHTML += '</div>';

    elements.contentArea.innerHTML = `
        <div class="kisi-container">
            <div class="kisi-list-panel">
                <div class="kisi-list-header">
                    <button id="btn-back-menu" class="glass-btn kisi-back-btn">&#8592; Menu Utama</button>
                    <h2>${kisiInfo.judul}</h2>
                    <p class="kisi-subjudul">${kisiInfo.mapel} &middot; ${kisiInfo.kelas}</p>
                </div>
                <div id="kisi-wheel-scroll" class="kisi-wheel-scroll">${listHTML}</div>
            </div>

            <div class="kisi-detail">
                <div class="kisi-topbar">
                    <div id="kisi-title" class="kisi-title"></div>
                    <div class="kisi-ready" title="Jumlah kompetensi yang sudah kamu tandai paham">
                        <span class="kisi-ready-label">Kesiapanmu</span>
                        <div class="kisi-ready-bar"><div id="kisi-ready-fill"></div></div>
                        <span id="kisi-ready-text" class="kisi-ready-text"></span>
                    </div>
                </div>
                <div id="kisi-body" class="kisi-body"></div>
            </div>

        </div>
    `;

    document.getElementById('btn-back-menu').addEventListener('click', () => {
        navigateWithTransition(() => {
            appState.currentView = 'menu';
            renderView();
        });
    });

    const state = { activeKey: null, slide: 0 };
    updateKisiReadiness();
    kisiPerbaruiProgresMenu();

    // ---------- MENU PUTAR (sama dengan logika Pilih Materi) ----------
    const scroller = document.getElementById('kisi-wheel-scroll');
    const itemEls = Array.from(document.querySelectorAll('.kisi-wheel-item'));
    let itemData = [];

    function centerOn(idx, smooth) {
        const d = itemData[idx];
        if (!d) return;
        const top = d.top - (scroller.offsetHeight / 2) + (d.height / 2);
        scroller.scrollTo({ top: top, behavior: smooth ? 'smooth' : 'auto' });
    }
    state.centerOnKey = (key) => {
        const idx = wheelItems.findIndex(w => w.key === key);
        if (idx >= 0) centerOn(idx, true);
    };

    const tandaiTitik = pasangTitikRoda(document.querySelector('.kisi-list-panel'),
        wheelItems.map(w => ({ judul: (w.kode ? w.kode + ' · ' : '') + w.label })),
        (i) => centerOn(i, true));

    function updatePhysics() {
        const scroll = scroller.scrollTop;
        const centerY = scroller.offsetHeight / 2;
        let closest = null, minDist = Infinity;
        itemData.forEach(d => {
            const itemCenter = (d.top - scroll) + d.height / 2;
            const dist = Math.abs(centerY - itemCenter);
            const ratio = Math.max(0, 1 - dist / 300);
            const scale = 0.75 + ratio * 0.30;
            const translateX = -Math.pow(dist, 2) / 1000 + ratio * 15;
            d.el.style.transform = `scale(${scale}) translateX(${translateX}px)`;
            d.el.style.opacity = ratio;
            d.el.classList.remove('active-center');
            if (dist < minDist) { minDist = dist; closest = d; }
        });
        if (closest) {
            closest.el.classList.add('active-center');
            tandaiTitik(itemData.indexOf(closest));
            if (closest.key !== state.activeKey) {
                state.activeKey = closest.key;
                showKisiDetail(state);
            }
        }
    }

    setTimeout(() => {
        itemData = itemEls.map(el => ({
            el: el,
            key: el.getAttribute('data-key'),
            top: el.offsetTop,
            height: el.offsetHeight
        }));
        itemEls.forEach((el, idx) => el.addEventListener('click', () => centerOn(idx, true)));
        centerOn(0, false);
        updatePhysics();
        let sudahTur = '1';
        try { sudahTur = localStorage.getItem(KISI_TUR_KEY); } catch (e) {}
        if (!sudahTur) setTimeout(() => { if (document.querySelector('.kisi-container')) kisiMulaiTur(state); }, 900);
        scroller.addEventListener('scroll', () => window.requestAnimationFrame(updatePhysics));

        // Ukur ulang bila tata letak berubah (HP diputar, font selesai dimuat, dsb.)
        pantauRoda(scroller, (pertama) => {
            itemData.forEach(d => { d.top = d.el.offsetTop; d.height = d.el.offsetHeight; });
            let idx = pertama ? 0 : wheelItems.findIndex(w => w.key === state.activeKey);
            if (idx < 0) idx = 0;
            centerOn(idx, false);
            updatePhysics();
        });
    }, 50);

    // Panah kiri/kanan di keyboard untuk carousel (berguna saat ditayangkan di proyektor)
    if (!window.kisiKeyHandlerAdded) {
        window.kisiKeyHandlerAdded = true;
        document.addEventListener('keydown', (e) => {
            if (!document.querySelector('.kisi-carousel')) return;
            if (e.key === 'ArrowRight' && window.kisiGoSlide) window.kisiGoSlide(1);
            if (e.key === 'ArrowLeft' && window.kisiGoSlide) window.kisiGoSlide(-1);
        });
    }
}

// ---------- KESIAPAN & PRIORITAS ----------
function kisiCheckedCount(kode) {
    const arr = appState.kisiChecks[kode] || [];
    return arr.filter(Boolean).length;
}

function updateKisiReadiness() {
    const total = kisiMateri.reduce((s, m) => s + m.kompetensi.length, 0);
    const done = kisiMateri.reduce((s, m) => s + kisiCheckedCount(m.kode), 0);
    const fill = document.getElementById('kisi-ready-fill');
    const text = document.getElementById('kisi-ready-text');
    if (fill) fill.style.width = (done / total * 100) + '%';
    if (text) text.innerText = `${done}/${total} kompetensi`;

    // Beri tahu murid saat Simulasi ASTS baru saja terbuka / terkunci lagi
    const sebelumnya = window.kisiDoneSebelumnya;
    window.kisiDoneSebelumnya = done;
    if (sebelumnya === undefined || sebelumnya === done) return;
    const belajarSelesai = progresBelajar().done >= progresBelajar().total;
    if (belajarSelesai && done === total && sebelumnya < total) kisiToast('&#127881; Simulasi ASTS sekarang sudah terbuka!');
    else if (belajarSelesai && sebelumnya === total && done < total) kisiToast('&#128274; Simulasi ASTS terkunci lagi sampai semua kompetensi dicentang.');
}

function kisiToast(html) {
    const root = document.querySelector('.kisi-container');
    if (!root) return;
    root.querySelectorAll('.kisi-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'kisi-toast';
    t.innerHTML = html;
    root.appendChild(t);
    t.animate([{ opacity: 0, transform: 'translate(-50%, 20px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }],
        { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    setTimeout(() => {
        const a = t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
        a.onfinish = () => t.remove();
    }, 3200);
}

function kisiTotalSoal(m) { return m.soal.PG + m.soal.PGK; }

// ---------- PANEL KANAN ----------
function showKisiDetail(state) {
    const body = document.getElementById('kisi-body');
    const title = document.getElementById('kisi-title');
    if (!body) return;

    body.classList.remove('kisi-fade-in');
    void body.offsetWidth;
    body.classList.add('kisi-fade-in');
    window.kisiGoSlide = null;

    if (state.activeKey === 'ringkasan') {
        title.innerHTML = `Ringkasan Soal <span class="kisi-chip">${kisiInfo.totalSoal} soal &middot; ${kisiMateri.length} materi</span>`;
        renderKisiRingkasan(body, state);
    } else {
        const m = kisiMateri.find(x => x.kode === state.activeKey);
        // Judul materi ikut berada di blok tengah (lihat renderKisiMateri)
        title.innerHTML = '';
        renderKisiMateri(body, m, state);
    }
}

// ---------- MATERI: DAFTAR CEK KOMPETENSI + SEBARAN SOAL ----------
function renderKisiMateri(body, m, state) {
    const checks = appState.kisiChecks[m.kode] || [];
    let listHTML = '';
    m.kompetensi.forEach((k, i) => {
        const on = !!checks[i];
        listHTML += `<div class="kisi-komp ${on ? 'checked' : ''}" data-i="${i}">
                        <div class="kisi-no">${i + 1}</div>
                        <div class="kisi-komp-text">${k}</div>
                        <button class="kisi-cek" aria-label="Tandai sudah paham">
                            <span class="kisi-check">${on ? '&#10003;' : ''}</span>
                            <span class="kisi-cek-teks">${on ? 'Paham' : 'Sudah paham?'}</span>
                        </button>
                     </div>`;
    });

    const total = kisiTotalSoal(m);
    const rows = kisiDiagram.map(d => {
        let segs = '';
        d.seri.forEach(s => {
            const v = m.soal[s.kunci];
            if (v > 0) segs += `<div class="kisi-hseg" data-w="${v / total * 100}" style="background:${s.warna}"></div>`;
        });
        const ket = d.seri.map(s => `<span><i style="background:${s.warna}"></i>${s.kunci} ${m.soal[s.kunci]}</span>`).join('');
        return `<div class="kisi-hrow">
                    <div class="kisi-hhead"><span class="kisi-hlabel">${d.judul.replace('Sebaran Soal Menurut ', '')}</span><span class="kisi-hket">${ket}</span></div>
                    <div class="kisi-hbar">${segs}</div>
                </div>`;
    }).join('');

    body.innerHTML = `
        <div class="kisi-materi-main">
            <div class="kisi-title kisi-materi-title"><span class="kisi-kode-besar">${m.kode}</span><span class="kisi-title-text">${m.nama}</span></div>
            <div class="kisi-section-label">Kompetensi yang diharapkan</div>
            <div class="kisi-instruksi">&#128214; Baca setiap kompetensi. Kalau sudah paham, ketuk <b>Sudah paham?</b> di sebelah kanannya. Centang semua untuk membuka <b>Simulasi ASTS</b>.</div>
            <div class="kisi-komp-list">${listHTML}</div>
            <div class="kisi-lanjut-wrap"><button class="kisi-lanjut"></button></div>
        </div>
        <div class="kisi-footer">
            <div class="kisi-footer-label">Sebaran ${total} soal</div>
            <div class="kisi-hbars">${rows}</div>
        </div>
    `;

    body.querySelectorAll('.kisi-komp').forEach(el => {
        el.addEventListener('click', () => {
            const i = parseInt(el.getAttribute('data-i'));
            const arr = (appState.kisiChecks[m.kode] || [false, false, false]).slice();
            arr[i] = !arr[i];
            appState.kisiChecks[m.kode] = arr;
            saveProgress();
            el.classList.toggle('checked', arr[i]);
            el.querySelector('.kisi-check').innerHTML = arr[i] ? '&#10003;' : '';
            el.querySelector('.kisi-cek-teks').innerText = arr[i] ? 'Paham' : 'Sudah paham?';
            if (arr[i]) { try { localStorage.setItem(KISI_PERNAH_CENTANG, '1'); } catch (e) {} }
            kisiTandaiAjakan(body);
            updateKisiReadiness();
            kisiPerbaruiProgresMenu();
            kisiPerbaruiTombolLanjut(body, m, true);
        });
    });

    // Tombol "Lanjut" ke kisi-kisi berikutnya, muncul setelah semua kompetensi materi ini dicentang
    body.querySelector('.kisi-lanjut').addEventListener('click', (e) => {
        e.stopPropagation();
        const t = kisiTujuanLanjut(m);
        if (t.simulasi) {
            const idx = modules.findIndex(x => x.id === 'simulasi_asts');
            if (kunciModul(idx)) { tampilKunciModul(idx); return; }
            navigateWithTransition(() => {
                appState.currentModuleIndex = idx;
                window.lastMenuIndex = idx;
                appState.currentView = 'materi';
                renderView();
            });
        } else if (state && state.centerOnKey) {
            state.centerOnKey(t.kode);
        }
    });
    kisiPerbaruiTombolLanjut(body, m, false);

    kisiTandaiAjakan(body);

    // Animasi batang horizontal tumbuh dari 0
    requestAnimationFrame(() => requestAnimationFrame(() => {
        body.querySelectorAll('.kisi-hseg').forEach((s, i) => {
            s.style.transitionDelay = (i * 60) + 'ms';
            s.style.width = s.getAttribute('data-w') + '%';
        });
    }));
}

// ---------- RINGKASAN: KOTAK RINGKASAN + CAROUSEL 3D ----------
function renderKisiRingkasan(body, state) {
    // Urutan kartu: Sekilas Soal (angka statistik), lalu 3 diagram
    const cards = buildKisiStatCard() + kisiDiagram.map((d, i) => buildKisiChartCard(d, i)).join('');
    const dots = [0, 1, 2, 3].slice(0, kisiDiagram.length + 1).map(i => `<span class="kisi-dot" data-i="${i}"></span>`).join('');

    body.innerHTML = `
        <div class="kisi-carousel" id="kisi-carousel">
            ${cards}
            <button class="kisi-chev kisi-chev-left" aria-label="Diagram sebelumnya">&#10094;</button>
            <button class="kisi-chev kisi-chev-right" aria-label="Diagram berikutnya">&#10095;</button>
        </div>
        <div class="kisi-footer kisi-footer-center">
            <div class="kisi-dots">${dots}</div>
            <div class="kisi-swipe-hint">&#8249; geser diagram ke kiri atau kanan &#8250;</div>
        </div>
    `;

    const carousel = document.getElementById('kisi-carousel');
    const cardEls = Array.from(carousel.querySelectorAll('.kisi-card'));
    const n = cardEls.length;

    function layout(animateFront) {
        cardEls.forEach((c, i) => {
            let off = ((i - state.slide) % n + n) % n;  // 0 = depan
            if (off > n / 2) off -= n;                   // -1 = kiri, 1 = kanan, 2 = paling belakang
            c.classList.remove('pos-front', 'pos-left', 'pos-right', 'pos-back');
            c.classList.add(off === 0 ? 'pos-front' : off === -1 ? 'pos-left' : off === 1 ? 'pos-right' : 'pos-back');
            if (off === 0 && animateFront) animateKisiCard(c);
        });
        body.querySelectorAll('.kisi-dot').forEach((dEl, i) => dEl.classList.toggle('active', i === state.slide));
    }

    function go(step) {
        cardEls.forEach(hideKisiTip);
        state.slide = ((state.slide + step) % n + n) % n;
        layout(true);
        const hint = body.querySelector('.kisi-swipe-hint');
        if (hint) hint.classList.add('hide');
    }
    window.kisiGoSlide = go;

    carousel.querySelector('.kisi-chev-left').addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
    carousel.querySelector('.kisi-chev-right').addEventListener('click', (e) => { e.stopPropagation(); go(1); });
    body.querySelectorAll('.kisi-dot').forEach(dEl => dEl.addEventListener('click', () => {
        const target = parseInt(dEl.getAttribute('data-i'));
        if (target !== state.slide) { state.slide = target; layout(true); }
    }));

    // Geser (swipe) dengan jari atau seret dengan mouse
    let startX = null, startY = null, moved = false;
    carousel.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.kisi-chev')) return;
        startX = e.clientX; startY = e.clientY; moved = false;
    });
    carousel.addEventListener('pointermove', (e) => {
        if (startX === null) return;
        if (Math.abs(e.clientX - startX) > 10) moved = true;
    });
    const endSwipe = (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        startX = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    };
    carousel.addEventListener('pointerup', endSwipe);
    carousel.addEventListener('pointercancel', () => { startX = null; });
    carousel.addEventListener('pointerleave', endSwipe);

    // Ketuk kartu belakang = majukan kartu itu; ketuk kolom/istilah di kartu depan = tampilkan rincian
    cardEls.forEach((c) => {
        c.addEventListener('click', (e) => {
            if (moved) return;
            if (c.classList.contains('pos-left')) { go(-1); return; }
            if (c.classList.contains('pos-right')) { go(1); return; }
            if (!c.classList.contains('pos-front')) return;
            const term = e.target.closest('[data-term]');
            const col = e.target.closest('.kisi-col');
            c.querySelectorAll('.kisi-col').forEach(x => x.classList.remove('selected'));
            if (term) {
                showKisiTip(c, term, kisiIstilah[term.getAttribute('data-term')]);
            } else if (col) {
                col.classList.add('selected');
                const m = kisiMateri.find(x => x.kode === col.getAttribute('data-kode'));
                const d = kisiDiagram[parseInt(c.getAttribute('data-i'))];
                if (!d) return;
                const rows = d.seri.map(s => `<span><i style="background:${s.warna}"></i>${s.label} <b>${m.soal[s.kunci]}</b></span>`).join('');
                showKisiTip(c, col.querySelector('.kisi-stack'), `<strong>${m.nama}</strong>${rows}`);
            } else {
                hideKisiTip(c);
            }
        });
    });

    layout(false);
    // Kartu belakang tampil penuh (diam); kartu depan beranimasi dari 0
    cardEls.forEach(c => setKisiCardFull(c));
    animateKisiCard(cardEls[state.slide]);
}

function buildKisiChartCard(d, i) {
    const MAX = 8;        // sumbu Y 0–8, sama seperti diagram di dokumen
    const PLOT_H = 250;   // tinggi area batang (px), harus sama dengan .kisi-chart di CSS
    const legend = d.seri.map(s => {
        const tot = kisiMateri.reduce((sum, m) => sum + m.soal[s.kunci], 0);
        return `<span class="kisi-legend" data-term="${s.kunci}"><i style="background:${s.warna}"></i>${s.label} (${tot})<em>?</em></span>`;
    }).join('');

    let grid = '';
    for (let g = 0; g <= MAX; g += 2) grid += `<div class="kisi-grid" style="bottom:${g / MAX * 100}%"><span>${g}</span></div>`;

    const cols = kisiMateri.map(m => {
        const total = kisiTotalSoal(m);
        let segs = '';
        d.seri.forEach(s => {
            const v = m.soal[s.kunci];
            if (v > 0) segs += `<div class="kisi-seg" data-h="${v / MAX * PLOT_H}" style="background:${s.warna}"><span class="kisi-num" data-target="${v}">${v}</span></div>`;
        });
        return `<div class="kisi-col" data-kode="${m.kode}">
                    <div class="kisi-stack">
                        <div class="kisi-total"><span class="kisi-num" data-target="${total}">${total}</span></div>
                        ${segs}
                    </div>
                    <div class="kisi-xlabel"><b>${m.kode}</b>${m.nama.replace('Konsep BK & Empat Pilar', 'Konsep BK')}</div>
                </div>`;
    }).join('');

    return `<div class="kisi-card" data-i="${i}">
                <div class="kisi-card-head">
                    <h4>${d.judul.replace('Sebaran Soal Menurut ', '')} Soal</h4>
                    <div class="kisi-legends">${legend}</div>
                </div>
                <div class="kisi-chart">
                    ${grid}
                    <div class="kisi-cols">${cols}</div>
                </div>
            </div>`;
}

function setKisiChartFull(card) {
    card.querySelectorAll('.kisi-seg').forEach(s => {
        s.style.transition = 'none';
        s.style.height = s.getAttribute('data-h') + 'px';
    });
    card.querySelectorAll('.kisi-num').forEach(nEl => nEl.innerText = nEl.getAttribute('data-target'));
    card.querySelectorAll('.kisi-total').forEach(t => t.style.opacity = 1);
}

// Batang tumbuh dari 0 ke nilainya, angka ikut menghitung naik
function growKisiChart(card) {
    const segs = card.querySelectorAll('.kisi-seg');
    const cols = card.querySelectorAll('.kisi-col');
    segs.forEach(s => { s.style.transition = 'none'; s.style.height = '0px'; });
    card.querySelectorAll('.kisi-total').forEach(t => { t.style.transition = 'none'; t.style.opacity = 0; });
    card.querySelectorAll('.kisi-num').forEach(nEl => nEl.innerText = '0');
    void card.offsetWidth;

    const DUR = 900;
    cols.forEach((col, ci) => {
        const delay = 250 + ci * 90;
        col.querySelectorAll('.kisi-seg').forEach(s => {
            s.style.transition = `height ${DUR}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;
            s.style.height = s.getAttribute('data-h') + 'px';
        });
        const tot = col.querySelector('.kisi-total');
        tot.style.transition = `opacity 300ms ease ${delay + DUR * 0.6}ms`;
        tot.style.opacity = 1;
        col.querySelectorAll('.kisi-num').forEach(nEl => {
            const target = parseInt(nEl.getAttribute('data-target'));
            const t0 = performance.now() + delay;
            const step = (now) => {
                if (!document.body.contains(nEl)) return;
                const p = Math.min(1, Math.max(0, (now - t0) / DUR));
                const eased = 1 - Math.pow(1 - p, 3);
                nEl.innerText = Math.round(target * eased);
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    });
}

// Gelembung kecil yang muncul di dekat batang/istilah yang diketuk
function showKisiTip(card, anchor, html) {
    hideKisiTip(card);
    const tip = document.createElement('div');
    tip.className = 'kisi-tip';
    tip.innerHTML = html;
    card.appendChild(tip);
    // Posisi dihitung dalam koordinat kartu (offset tidak terpengaruh skala kanvas)
    let x = 0, y = 0, el = anchor;
    while (el && el !== card) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    const left = Math.max(8, Math.min(card.clientWidth - tip.offsetWidth - 8, x + anchor.offsetWidth / 2 - tip.offsetWidth / 2));
    const top = y - tip.offsetHeight - 30;
    tip.style.left = left + 'px';
    tip.style.top = (top < 4 ? y + anchor.offsetHeight + 10 : top) + 'px';
    requestAnimationFrame(() => tip.classList.add('show'));
}
function hideKisiTip(card) {
    card.querySelectorAll('.kisi-tip').forEach(t => t.remove());
}

// ---------- KARTU "SEKILAS SOAL" (angka statistik, kartu pertama carousel) ----------
function buildKisiStatCard() {
    const sum = k => kisiMateri.reduce((t, m) => t + m.soal[k], 0);
    const rows = kisiDiagram.map(d => {
        const [a, b] = d.seri;
        const va = sum(a.kunci), vb = sum(b.kunci), tot = va + vb;
        return `<div class="kisi-stat-row">
                    <div class="kisi-stat-label">${d.judul.replace('Sebaran Soal Menurut ', '')}</div>
                    <div class="kisi-stat-pair">
                        <span class="kisi-stat-item" data-term="${a.kunci}"><b style="color:${a.warna}" class="kisi-num" data-target="${va}">${va}</b>${a.label}</span>
                        <span class="kisi-stat-item kisi-stat-right" data-term="${b.kunci}">${b.label}<b style="color:${b.warna}" class="kisi-num" data-target="${vb}">${vb}</b></span>
                    </div>
                    <div class="kisi-stat-bar">
                        <div class="kisi-stat-seg" data-w="${va / tot * 100}" style="background:${a.warna}"></div>
                        <div class="kisi-stat-seg" data-w="${vb / tot * 100}" style="background:${b.warna}"></div>
                    </div>
                </div>`;
    }).join('');
    return `<div class="kisi-card kisi-card-stat" data-i="-1">
                <div class="kisi-card-head"><h4>Sekilas Soal ASTS</h4></div>
                <div class="kisi-stat-total">
                    <b class="kisi-num" data-target="${kisiInfo.totalSoal}">${kisiInfo.totalSoal}</b>
                    <span>soal<br><small>dari ${kisiMateri.length} materi</small></span>
                </div>
                ${rows}
            </div>`;
}

function setKisiCardFull(card) {
    if (!card.classList.contains('kisi-card-stat')) { setKisiChartFull(card); return; }
    card.querySelectorAll('.kisi-stat-seg').forEach(sg => { sg.style.transition = 'none'; sg.style.width = sg.getAttribute('data-w') + '%'; });
    card.querySelectorAll('.kisi-num').forEach(nEl => nEl.innerText = nEl.getAttribute('data-target'));
}

function animateKisiCard(card) {
    if (!card.classList.contains('kisi-card-stat')) { growKisiChart(card); return; }
    const segs = card.querySelectorAll('.kisi-stat-seg');
    segs.forEach(sg => { sg.style.transition = 'none'; sg.style.width = '0%'; });
    void card.offsetWidth;
    segs.forEach((sg, i) => {
        sg.style.transition = `width 900ms cubic-bezier(0.22, 1, 0.36, 1) ${250 + Math.floor(i / 2) * 120}ms`;
        sg.style.width = sg.getAttribute('data-w') + '%';
    });
    card.querySelectorAll('.kisi-num').forEach((nEl, i) => {
        const target = parseInt(nEl.getAttribute('data-target'));
        const t0 = performance.now() + 200 + i * 60;
        nEl.innerText = '0';
        const step = (now) => {
            if (!document.body.contains(nEl)) return;
            const p = Math.min(1, Math.max(0, (now - t0) / 900));
            nEl.innerText = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

// =====================================================================
// PETUNJUK UNTUK MURID
// =====================================================================
const KISI_TUR_KEY = 'mpi_bk_tur_kisi';                 // tur singkat sudah pernah ditampilkan
const KISI_PERNAH_CENTANG = 'mpi_bk_kisi_pernah_centang'; // murid sudah pernah mencentang

// Progres "x/3" di setiap materi pada menu putar
function kisiPerbaruiProgresMenu() {
    document.querySelectorAll('.kisi-prog').forEach(el => {
        const m = kisiMateri.find(x => x.kode === el.getAttribute('data-kode'));
        const c = kisiCheckedCount(m.kode), t = m.kompetensi.length;
        el.innerHTML = c >= t ? '&#10003;' : `${c}/${t}`;
        el.classList.toggle('lengkap', c >= t);
    });
}

// Tombol pertama yang belum dicentang berdenyut, sampai murid pertama kali mencentang
function kisiTandaiAjakan(body) {
    body.querySelectorAll('.kisi-cek').forEach(b => b.classList.remove('ajak'));
    let pernah = '1';
    try { pernah = localStorage.getItem(KISI_PERNAH_CENTANG); } catch (e) {}
    if (pernah) return;
    const pertama = body.querySelector('.kisi-komp:not(.checked) .kisi-cek');
    if (pertama) pertama.classList.add('ajak');
}

// Tur singkat 3 langkah dengan sorotan (sekali saja per perangkat)
function kisiMulaiTur(state) {
    try { localStorage.setItem(KISI_TUR_KEY, '1'); } catch (e) {}
    const root = document.querySelector('.kisi-container');
    if (!root) return;
    const langkah = [
        { cari: () => root.querySelector('.kisi-wheel-item.active-center'), posisi: 'kanan',
          judul: 'Pilih materi di sini',
          teks: 'Putar daftar ke atas atau bawah. Mulai dari Ringkasan Soal, lalu materi M1 sampai M6.' },
        { sebelum: () => state.centerOnKey('M1'), tunggu: 1100,
          cari: () => root.querySelector('.kisi-komp'), posisi: 'bawah',
          judul: 'Baca kompetensinya',
          teks: 'Ini kemampuan yang akan diuji. Kalau kamu sudah paham, ketuk <b>Sudah paham?</b> di kanan.' },
        { cari: () => root.querySelector('.kisi-ready'), posisi: 'bawah-kanan',
          judul: 'Kumpulkan semua centang',
          teks: 'Centang semua 18 kompetensi untuk membuka <b>Simulasi ASTS</b>.' }
    ];
    const skala = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--canvas-scale')) || 1;
    const tur = document.createElement('div');
    tur.className = 'kisi-tur';
    tur.innerHTML = `<div class="kisi-tur-lubang"></div>
        <div class="kisi-tur-tip">
            <div class="kisi-tur-langkah"></div>
            <h4></h4><p></p>
            <div class="kisi-tur-aksi">
                <button class="glass-btn kisi-tur-lewati">Lewati</button>
                <button class="btn-primary kisi-tur-lanjut">Lanjut &#10095;</button>
            </div>
        </div>`;
    tur.addEventListener('click', (e) => e.stopPropagation());
    root.appendChild(tur);
    tur.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: 'ease-out' });
    const lubang = tur.querySelector('.kisi-tur-lubang');
    const tip = tur.querySelector('.kisi-tur-tip');
    let ke = 0;

    const tampil = () => {
        const L = langkah[ke];
        const el = L.cari();
        if (!el) { selesai(); return; }
        // Koordinat di dalam kanvas (dibagi skala kanvas agar tepat di layar mana pun)
        // Pakai offset (tidak terpengaruh transform animasi masuk), dijumlahkan sampai root
        let ox = 0, oy = 0, n = el;
        while (n && n !== root) {
            ox += n.offsetLeft; oy += n.offsetTop;
            let pr = n.parentElement;
            const op = n.offsetParent;
            while (pr && pr !== op && pr !== root) { ox -= pr.scrollLeft; oy -= pr.scrollTop; pr = pr.parentElement; }
            if (op && op !== root) { ox -= op.scrollLeft; oy -= op.scrollTop; }
            n = op;
        }
        if (n !== root) {
            const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect(), sk = skala();
            ox = (r.left - rr.left) / sk; oy = (r.top - rr.top) / sk;
        }
        const pad = 10;
        const x = ox - pad, y = oy - pad;
        const w = el.offsetWidth + pad * 2, h = el.offsetHeight + pad * 2;
        Object.assign(lubang.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
        tip.querySelector('.kisi-tur-langkah').innerText = `Langkah ${ke + 1} dari ${langkah.length}`;
        tip.querySelector('h4').innerText = L.judul;
        tip.querySelector('p').innerHTML = L.teks;
        tip.querySelector('.kisi-tur-lanjut').innerHTML = ke === langkah.length - 1 ? 'Mengerti!' : 'Lanjut &#10095;';
        const W = root.clientWidth, H = root.clientHeight, tw = 340, th = tip.offsetHeight || 170;
        let left, top;
        if (L.posisi === 'kanan') { left = x + w + 22; top = y + h / 2 - th / 2; }
        else if (L.posisi === 'bawah-kanan') { left = x + w - tw; top = y + h + 16; }
        else { left = x + 30; top = y + h + 16; }
        left = Math.max(16, Math.min(W - tw - 16, left));
        top = Math.max(16, Math.min(H - th - 16, top));
        Object.assign(tip.style, { left: left + 'px', top: top + 'px' });
        tip.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    };
    const lanjut = () => {
        ke++;
        if (ke >= langkah.length) { selesai(); return; }
        const L = langkah[ke];
        if (L.sebelum) {
            tip.style.opacity = '0';
            L.sebelum();
            setTimeout(() => { tip.style.opacity = ''; tampil(); }, L.tunggu || 600);
        } else tampil();
    };
    const selesai = () => {
        const a = tur.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 });
        a.onfinish = () => tur.remove();
    };
    tur.querySelector('.kisi-tur-lanjut').addEventListener('click', lanjut);
    tur.querySelector('.kisi-tur-lewati').addEventListener('click', selesai);
    tampil();
}

// Tujuan tombol Lanjut: materi berikutnya; dari M6 ke materi yang belum lengkap, atau ke Simulasi ASTS
function kisiTujuanLanjut(m) {
    const lengkap = (x) => kisiCheckedCount(x.kode) >= x.kompetensi.length;
    const i = kisiMateri.findIndex(x => x.kode === m.kode);
    if (i < kisiMateri.length - 1) {
        const n = kisiMateri[i + 1];
        return { kode: n.kode, label: `Lanjut ke ${n.kode}: ${n.nama}` };
    }
    const belum = kisiMateri.find(x => !lengkap(x));
    if (belum) return { kode: belum.kode, label: `Lanjut ke ${belum.kode} (belum lengkap)` };
    return { simulasi: true, label: 'Lanjut ke Simulasi ASTS' };
}

function kisiPerbaruiTombolLanjut(body, m, animasi) {
    const wrap = body.querySelector('.kisi-lanjut-wrap');
    if (!wrap) return;
    const btn = wrap.querySelector('.kisi-lanjut');
    const semua = kisiCheckedCount(m.kode) >= m.kompetensi.length;
    btn.innerHTML = `Selanjutnya <span class="kisi-lanjut-chev">&#10095;</span>`;
    btn.title = kisiTujuanLanjut(m).label;
    btn.tabIndex = semua ? 0 : -1;
    if (!animasi) wrap.classList.add('tanpa-animasi');
    else wrap.classList.remove('tanpa-animasi');
    wrap.classList.toggle('tampil', semua);
}
