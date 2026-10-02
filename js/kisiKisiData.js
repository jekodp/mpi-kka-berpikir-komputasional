// =====================================================================
// DATA KISI-KISI ASESMEN SUMATIF TENGAH SEMESTER (ASTS)
// Sumber: kartu_soal_uts_bk.docx
//   - Bagian A: Kisi-kisi, kompetensi yang diharapkan
//   - Bagian B: Alokasi soal (jumlah soal per materi)
// Isi file ini boleh diubah langsung. Tampilan dan diagram di halaman
// "Cek Kisi-Kisi" akan menyesuaikan sendiri.
// =====================================================================

const kisiInfo = {
    judul: 'Kisi-Kisi ASTS',
    mapel: 'Koding dan Kecerdasan Artifisial',
    kelas: 'X / Fase E',
    totalSoal: 30
};

// Bagian A + jumlah soal per materi (Bagian B)
// chapterId = id bab di Mulai Belajar (vnChapters) yang paling berkaitan
const kisiMateri = [
    {
        kode: 'M1',
        nama: 'Konsep BK & Empat Pilar',
        namaLengkap: 'Konsep Berpikir Komputasional dan Empat Pilar',
        chapterId: 2,
        kompetensi: [
            'Menjelaskan pengertian berpikir komputasional sebagai cara berpikir sistematis untuk memecahkan masalah, termasuk masalah sehari-hari.',
            'Menyebutkan dan membedakan empat pilar berpikir komputasional: dekomposisi, pengenalan pola, abstraksi, dan algoritma.',
            'Mengevaluasi ketepatan pernyataan orang lain tentang berpikir komputasional dan empat pilarnya.'
        ],
        soal: { PG: 1, PGK: 2, Teori: 3, Analisis: 0, LOTS: 2, HOTS: 1 }
    },
    {
        kode: 'M2',
        nama: 'Dekomposisi',
        namaLengkap: 'Dekomposisi',
        chapterId: 3,
        kompetensi: [
            'Menjelaskan pengertian dekomposisi sebagai memecah masalah kompleks menjadi bagian-bagian kecil.',
            'Memecah masalah menjadi bagian yang sejenis dan saling berkaitan, misalnya pembagian divisi panitia dan pemecahan masalah sampah plastik.',
            'Memecah perhitungan menjadi bagian kecil, misalnya menghitung persegi menurut ukurannya dan energi listrik tiap alat, lalu menggabungkan hasilnya.'
        ],
        soal: { PG: 5, PGK: 0, Teori: 1, Analisis: 4, LOTS: 1, HOTS: 4 }
    },
    {
        kode: 'M3',
        nama: 'Pengenalan Pola',
        namaLengkap: 'Pengenalan Pola',
        chapterId: 4,
        kompetensi: [
            'Menjelaskan pengertian pengenalan pola sebagai menemukan kesamaan atau keteraturan pada masalah atau data.',
            'Mengenali pola pada gambar, program, dan tabel data, misalnya program robot, pelabelan pesan oleh AI, keramaian perpustakaan, penjualan kantin, dan ubin lantai.',
            'Memakai pola untuk memperbaiki dugaan, memprediksi data berikutnya, dan menentukan unsur yang belum diketahui.'
        ],
        soal: { PG: 6, PGK: 0, Teori: 1, Analisis: 5, LOTS: 2, HOTS: 4 }
    },
    {
        kode: 'M4',
        nama: 'Abstraksi',
        namaLengkap: 'Abstraksi',
        chapterId: 5,
        kompetensi: [
            'Menjelaskan abstraksi sebagai memilih informasi penting dan mengabaikan detail yang tidak diperlukan.',
            'Menentukan informasi yang perlu disimpan dan yang dibuang sesuai tujuan, misalnya pada denah rute dan data kartu game.',
            'Membuat templat dari dua contoh dengan memisahkan bagian tetap dan bagian yang berubah, serta menyaring informasi akhir dari percakapan.'
        ],
        soal: { PG: 4, PGK: 0, Teori: 0, Analisis: 4, LOTS: 1, HOTS: 3 }
    },
    {
        kode: 'M5',
        nama: 'Algoritma',
        namaLengkap: 'Algoritma',
        chapterId: 6,
        kompetensi: [
            'Menjelaskan pengertian algoritma sebagai urutan langkah yang jelas dan berurutan untuk menyelesaikan masalah.',
            'Menelusuri hasil algoritma atau program, termasuk perulangan dan aturan tarif, sampai menentukan keadaan akhirnya.',
            'Memperbaiki algoritma yang keliru, misalnya kondisi percabangan pada batas nilai dan penggunaan variabel bantu.'
        ],
        soal: { PG: 5, PGK: 0, Teori: 1, Analisis: 4, LOTS: 1, HOTS: 4 }
    },
    {
        kode: 'M6',
        nama: 'Gabungan Pilar',
        namaLengkap: 'Gabungan Pilar',
        chapterId: 7,
        kompetensi: [
            'Membedakan penerapan keempat pilar pada satu kasus dan menjelaskan hubungan antarpilar.',
            'Menentukan dampak jika sebuah pilar terlewat dalam penyelesaian masalah.',
            'Menerapkan beberapa pilar sekaligus untuk menganalisis dan menyelesaikan kasus, misalnya program lampu LED, chatbot sekolah, robot pembersih lorong, kegiatan kebun, dan lampu lalu lintas berbasis AI.'
        ],
        soal: { PG: 4, PGK: 3, Teori: 2, Analisis: 5, LOTS: 1, HOTS: 6 }
    }
];

// Tiga diagram Bagian B. Urutan di sini = urutan di carousel.
const kisiDiagram = [
    {
        judul: 'Sebaran Soal Menurut Jenis',
        seri: [
            { kunci: 'PG', label: 'Pilihan Ganda', warna: '#3498db' },
            { kunci: 'PGK', label: 'PG Kompleks', warna: '#e67e22' }
        ]
    },
    {
        judul: 'Sebaran Soal Menurut Kategori',
        seri: [
            { kunci: 'Teori', label: 'Teori', warna: '#2ecc71' },
            { kunci: 'Analisis', label: 'Analisis', warna: '#9b59b6' }
        ]
    },
    {
        judul: 'Sebaran Soal Menurut Level',
        seri: [
            { kunci: 'LOTS', label: 'LOTS', warna: '#5dade2' },
            { kunci: 'HOTS', label: 'HOTS', warna: '#e74c3c' }
        ]
    }
];

// Penjelasan singkat istilah (muncul saat murid mengetuk istilah di diagram)
const kisiIstilah = {
    PG: 'Pilihan Ganda: pilih satu jawaban yang paling tepat.',
    PGK: 'PG Kompleks: jawaban benar bisa lebih dari satu, jadi periksa setiap pilihan.',
    Teori: 'Teori: menguji pemahaman pengertian dan konsep.',
    Analisis: 'Analisis: menerapkan konsep pada kasus, gambar, tabel data, atau program.',
    LOTS: 'LOTS (Lower Order Thinking Skills): soal mengingat, memahami, dan menerapkan.',
    HOTS: 'HOTS (Higher Order Thinking Skills): soal menganalisis, mengevaluasi, dan menalar lebih dalam.'
};
