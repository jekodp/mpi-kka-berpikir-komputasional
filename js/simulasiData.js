// =====================================================================
// DATA SIMULASI ASTS
// Sumber: kartu_soal_latihan_bk.docx (Bagian A: kartu soal & pembahasan, Bagian B: kunci)
// Isi file ini boleh diubah atau ditambah. Halaman Simulasi ASTS akan menyesuaikan sendiri.
//
// Bentuk konteks:
//   { t: 'p', text }           paragraf
//   { t: 'list', items: [] }   daftar berpoin
//   { t: 'code', lines: [] }   pseudokode / langkah program
//   { t: 'table', rows: [] }   tabel (baris pertama = judul kolom)
//   { t: 'img', src }          gambar di folder assets/soal/
// jenis: 'PG' (satu jawaban) atau 'PGK' (PG Kompleks, 2–4 jawaban benar)
// kode : materi pada kisi-kisi (M1–M6)
// =====================================================================

const simulasiInfo = {
    judul: 'Simulasi ASTS',
    durasiMenit: 15,
    acak: true          // acak urutan soal dan pilihan setiap kali simulasi dimulai
};

const simulasiSoal = [
    {
        "id": "L1",
        "judul": "Ciri Abstraksi",
        "jenis": "PG",
        "kategori": "Teori",
        "level": "C2",
        "tingkat": "LOTS",
        "pilar": "Abstraksi",
        "kode": "M4",
        "konteks": [],
        "pertanyaan": "Manakah pernyataan yang paling tepat menggambarkan abstraksi?",
        "opsi": [
            {
                "id": "A",
                "teks": "Memilih informasi penting dan membuang detail lain agar solusi lama dipakai ulang, misalnya meringkas catatan, lalu memakai versi ringkasnya."
            },
            {
                "id": "B",
                "teks": "Memilih informasi penting dan membuang detail lain agar pekerjaan lebih sederhana, misalnya meringkas catatan, lalu memakai versi ringkasnya."
            },
            {
                "id": "C",
                "teks": "Membagi masalah menjadi bagian kecil agar pekerjaan lebih sederhana, misalnya memakai ulang catatan, lalu menggabungkan tiap bagian."
            },
            {
                "id": "D",
                "teks": "Memilih informasi penting dan membuang detail lain agar pekerjaan lebih sederhana, misalnya membagi catatan, lalu menambah lagi detailnya."
            },
            {
                "id": "E",
                "teks": "Membagi masalah menjadi bagian kecil agar solusi lama dipakai ulang, misalnya membagi catatan, lalu menambah lagi detailnya."
            }
        ],
        "kunci": [
            "B"
        ],
        "pembahasan": [
            "Abstraksi adalah pilar berpikir komputasional yang memilih informasi penting dan mengabaikan detail yang tidak diperlukan, sehingga pekerjaan menjadi lebih sederhana. Hasilnya berupa gambaran yang lebih ringkas untuk dipakai menyelesaikan masalah. Contohnya meringkas catatan menjadi poin-poin utama."
        ]
    },
    {
        "id": "L2",
        "judul": "Identifikasi Pilar pada Program Game Kebun",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C3",
        "tingkat": "LOTS",
        "pilar": "Pengenalan pola",
        "kode": "M3",
        "konteks": [
            {
                "t": "p",
                "text": "Rina membuat game kebun. Karakter menanam satu tanaman pada tiap petak di satu baris yang terdiri atas 12 petak. Lingkaran menandai bunga dan segitiga menandai daun. Garis putus-putus menandai kelompok A, B, C, dan D. Rina menyingkat program awalnya menjadi program baru."
            },
            {
                "t": "img",
                "src": "assets/soal/L2_kebun.webp"
            },
            {
                "t": "code",
                "lines": [
                    "Program awal:",
                    "tanam bunga, tanam daun, tanam daun",
                    "tanam bunga, tanam daun, tanam daun",
                    "tanam bunga, tanam daun, tanam daun",
                    "tanam bunga, tanam daun, tanam daun",
                    "",
                    "Program baru:",
                    "ulangi 4 kali:",
                    "    tanam bunga, tanam daun, tanam daun"
                ]
            }
        ],
        "pertanyaan": "Pilar berpikir komputasional apa yang Rina gunakan saat menyingkat program awalnya menjadi program baru?",
        "opsi": [
            {
                "id": "A",
                "teks": "Abstraksi: melihat setiap petak berisi tanaman berbeda, mengganti perintah berulang dengan ulangi 4 kali, sehingga urutan tanaman berubah."
            },
            {
                "id": "B",
                "teks": "Pengenalan pola: menemukan empat kelompok yang sama, mengganti perintah berulang dengan ulangi 4 kali, sehingga urutan tanaman berubah."
            },
            {
                "id": "C",
                "teks": "Abstraksi: melihat setiap petak berisi tanaman berbeda, menghapus perintah yang tidak diperlukan, sehingga urutan tanaman berubah."
            },
            {
                "id": "D",
                "teks": "Pengenalan pola: menemukan empat kelompok yang sama, mengganti perintah berulang dengan ulangi 4 kali, sehingga program lebih singkat."
            },
            {
                "id": "E",
                "teks": "Pengenalan pola: melihat setiap petak berisi tanaman berbeda, menghapus perintah yang tidak diperlukan, sehingga program lebih singkat."
            }
        ],
        "kunci": [
            "D"
        ],
        "pembahasan": [
            "Pada gambar, keempat kelompok A, B, C, dan D berisi urutan yang sama, yaitu bunga, daun, daun. Program awal mengulang perintah \"tanam bunga, tanam daun, tanam daun\" sebanyak empat kali. Menemukan kesamaan atau keteraturan seperti ini adalah pengenalan pola. Karena polanya sama, perintah cukup ditulis sekali lalu diulang 4 kali, sehingga program lebih singkat. Urutan tanaman di kebun tidak berubah."
        ]
    },
    {
        "id": "L3",
        "judul": "Pengenalan Pola dan Solusi Alternatif pada AI Perkiraan Ketepatan Bus Sekolah",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Pengenalan pola",
        "kode": "M3",
        "konteks": [
            {
                "t": "p",
                "text": "Sebuah sekolah memakai AI untuk memperkirakan ketepatan waktu bus antar-jemput. Awalnya AI menduga bus Rute B selalu terlambat karena perjalanan Rute B yang pertama terlambat. Data enam perjalanan berikut kemudian dicatat."
            },
            {
                "t": "table",
                "rows": [
                    [
                        "No.",
                        "Rute",
                        "Hujan",
                        "Ketepatan waktu"
                    ],
                    [
                        "1",
                        "A",
                        "Ya",
                        "Terlambat"
                    ],
                    [
                        "2",
                        "B",
                        "Ya",
                        "Terlambat"
                    ],
                    [
                        "3",
                        "C",
                        "Tidak",
                        "Tepat waktu"
                    ],
                    [
                        "4",
                        "A",
                        "Ya",
                        "Terlambat"
                    ],
                    [
                        "5",
                        "B",
                        "Tidak",
                        "Tepat waktu"
                    ],
                    [
                        "6",
                        "C",
                        "Tidak",
                        "Tepat waktu"
                    ]
                ]
            }
        ],
        "pertanyaan": "Dugaan awal AI ternyata tidak berlaku, sehingga AI mencari solusi alternatif dari data di atas. Jika perjalanan ke-7 memakai Rute B tanpa hujan, manakah pernyataan yang tepat?",
        "opsi": [
            {
                "id": "A",
                "teks": "Perjalanan ke-7 diperkirakan tepat waktu; dugaan awal gagal terlihat pada perjalanan nomor 2 dan 5, dan penentunya adalah hujan."
            },
            {
                "id": "B",
                "teks": "Perjalanan ke-7 diperkirakan terlambat; dugaan awal gagal terlihat pada perjalanan nomor 2 dan 6, dan penentunya adalah urutan perjalanan."
            },
            {
                "id": "C",
                "teks": "Perjalanan ke-7 diperkirakan tepat waktu; dugaan awal gagal terlihat pada perjalanan nomor 3 dan 5, dan penentunya adalah hujan."
            },
            {
                "id": "D",
                "teks": "Perjalanan ke-7 diperkirakan terlambat; dugaan awal gagal terlihat pada perjalanan nomor 1 dan 3, dan penentunya adalah keadaan perjalanan sebelumnya."
            },
            {
                "id": "E",
                "teks": "Perjalanan ke-7 diperkirakan tepat waktu; dugaan awal gagal terlihat pada perjalanan nomor 1 dan 5, dan penentunya adalah nama rute."
            }
        ],
        "kunci": [
            "A"
        ],
        "pembahasan": [
            "Dugaan awal (Rute B selalu terlambat) gagal karena perjalanan nomor 2 dan 5 sama-sama Rute B, tetapi hasilnya berbeda: Rute B dengan hujan terlambat, Rute B tanpa hujan tepat waktu. Pola yang cocok dengan seluruh data adalah hujan: semua perjalanan dengan hujan terlambat (1, 2, 4) dan semua perjalanan tanpa hujan tepat waktu (3, 5, 6). Perjalanan ke-7 tanpa hujan, jadi diperkirakan tepat waktu."
        ]
    },
    {
        "id": "L4",
        "judul": "Abstraksi pada Aplikasi Pengingat Peminjaman Buku",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Abstraksi",
        "kode": "M4",
        "konteks": [
            {
                "t": "p",
                "text": "Dewi membuat aplikasi pengingat untuk perpustakaan sekolah. Setiap kartu pinjam memuat empat data, seperti pada gambar. Program hanya menampilkan nama peminjam yang batas kembalinya sudah lewat."
            },
            {
                "t": "img",
                "src": "assets/soal/L4_kartu_pinjam.webp"
            }
        ],
        "pertanyaan": "Agar program menerapkan abstraksi, data manakah yang sebaiknya dipertahankan dari setiap kartu pinjam?",
        "opsi": [
            {
                "id": "A",
                "teks": "Program mempertahankan Judul, Rak, dan Batas kembali."
            },
            {
                "id": "B",
                "teks": "Program mempertahankan Nama, Judul, dan Batas kembali."
            },
            {
                "id": "C",
                "teks": "Program mempertahankan Judul dan Rak."
            },
            {
                "id": "D",
                "teks": "Program mempertahankan Nama dan Rak."
            },
            {
                "id": "E",
                "teks": "Program mempertahankan Nama dan Batas kembali."
            }
        ],
        "kunci": [
            "E"
        ],
        "pembahasan": [
            "Abstraksi berarti mempertahankan data yang penting dan mengabaikan detail lain. Untuk menentukan peminjam yang terlambat, program perlu data Batas kembali. Untuk menampilkan hasilnya, program juga perlu Nama. Judul dan Rak tidak memengaruhi hasil sehingga diabaikan."
        ]
    },
    {
        "id": "L5",
        "judul": "Algoritma dan Solusi Alternatif pada Program Tiket Taman Wisata",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Algoritma",
        "kode": "M5",
        "konteks": [
            {
                "t": "p",
                "text": "Sebuah taman wisata memiliki aturan: pengunjung berusia 5 sampai 12 tahun, termasuk yang berusia tepat 5 dan tepat 12 tahun, membayar tiket Rp10.000. Pengunjung lainnya membayar tiket Rp25.000. Program loket taman wisata tersebut memiliki langkah berikut."
            },
            {
                "t": "code",
                "lines": [
                    "1. Masukkan usia pengunjung.",
                    "2. Jika usia > 5 dan usia < 12, maka tiket Rp10.000.",
                    "3. Jika tidak, maka tiket Rp25.000."
                ]
            },
            {
                "t": "p",
                "text": "Saat diuji, pengunjung berusia tepat 5 tahun ternyata membayar Rp25.000. Petugas lalu mengganti kata \"dan\" menjadi \"atau\", tetapi cara ini juga gagal karena pengunjung berusia 30 tahun justru membayar Rp10.000. Petugas pun mencari solusi alternatif."
            },
            {
                "t": "p",
                "text": "Catatan: tanda > dibaca \"lebih dari\", < dibaca \"kurang dari\", ≥ dibaca \"lebih dari atau sama dengan\", dan ≤ dibaca \"kurang dari atau sama dengan\"."
            }
        ],
        "pertanyaan": "Manakah solusi alternatif untuk langkah 2 dan 3 yang sesuai dengan aturan taman wisata?",
        "opsi": [
            {
                "id": "A",
                "teks": "Jika usia > 5 dan usia ≤ 12, maka tiket Rp25.000; jika tidak, maka tiket Rp10.000."
            },
            {
                "id": "B",
                "teks": "Jika usia ≥ 5 dan usia < 12, maka tiket Rp10.000; jika tidak, maka tiket Rp25.000."
            },
            {
                "id": "C",
                "teks": "Jika usia ≥ 5 dan usia ≤ 12, maka tiket Rp10.000; jika tidak, maka tiket Rp25.000."
            },
            {
                "id": "D",
                "teks": "Jika usia > 5 dan usia < 12, maka tiket Rp25.000; jika tidak, maka tiket Rp10.000."
            },
            {
                "id": "E",
                "teks": "Jika usia ≥ 5 dan usia ≤ 12, maka tiket Rp25.000; jika tidak, maka tiket Rp10.000."
            }
        ],
        "kunci": [
            "C"
        ],
        "pembahasan": [
            "Aturan taman wisata berlaku untuk usia 5 sampai 12 tahun, termasuk usia tepat 5 dan tepat 12. Karena itu batas bawah memakai ≥ 5 dan batas atas memakai ≤ 12, keduanya digabung dengan \"dan\". \"Maka\" berisi tiket Rp10.000, dan \"jika tidak\" berisi tiket Rp25.000. Tanda > dan < pada program awal membuat usia tepat 5 dan 12 membayar Rp25.000. Mengganti \"dan\" menjadi \"atau\" membuat semua usia membayar Rp10.000."
        ]
    },
    {
        "id": "L6",
        "judul": "Hubungan Antarpilar: Dampak Pilar yang Belum Diterapkan",
        "jenis": "PG",
        "kategori": "Teori",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Hubungan antarpilar (abstraksi dan algoritma)",
        "kode": "M6",
        "konteks": [
            {
                "t": "p",
                "text": "Dua tim PMR membuat aplikasi pencatatan kunjungan siswa ke UKS."
            },
            {
                "t": "list",
                "items": [
                    "Tim A menyimpan semua keterangan siswa, termasuk hobi dan warna favorit, padahal aplikasi hanya membutuhkan nama, kelas, dan keluhan.",
                    "Tim B menulis langkah kerja aplikasi tanpa nomor urut."
                ]
            }
        ],
        "pertanyaan": "Pilar berpikir komputasional apa yang belum diterapkan masing-masing tim, dan apa akibatnya?",
        "opsi": [
            {
                "id": "A",
                "teks": "Tim A: pengenalan pola, sehingga langkah berulang. Tim B: dekomposisi, sehingga urutan langkah tidak jelas."
            },
            {
                "id": "B",
                "teks": "Tim A: dekomposisi, sehingga pekerjaan sulit dibagi. Tim B: pengenalan pola, sehingga pengerjaan memakan waktu lama."
            },
            {
                "id": "C",
                "teks": "Tim A: abstraksi, sehingga data berlebih. Tim B: algoritma, sehingga langkah berulang."
            },
            {
                "id": "D",
                "teks": "Tim A: abstraksi, sehingga data berlebih. Tim B: algoritma, sehingga urutan langkah tidak jelas."
            },
            {
                "id": "E",
                "teks": "Tim A: dekomposisi, sehingga data berlebih. Tim B: algoritma, sehingga pekerjaan sulit dibagi."
            }
        ],
        "kunci": [
            "D"
        ],
        "pembahasan": [
            "Tim A menyimpan semua keterangan siswa, termasuk yang tidak dibutuhkan, sehingga yang belum diterapkan adalah abstraksi dan akibatnya data berlebih. Tim B menulis langkah kerja tanpa nomor urut, sehingga yang belum diterapkan adalah algoritma dan akibatnya urutan langkah tidak jelas."
        ]
    },
    {
        "id": "L7",
        "judul": "Dekomposisi dan Strategi Alternatif pada Teka-teki Menghitung Segitiga",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Dekomposisi",
        "kode": "M2",
        "konteks": [
            {
                "t": "p",
                "text": "Raka mendapat teka-teki: \"Berapa banyak segitiga dari semua ukuran pada gambar?\" Gambarnya berupa segitiga besar yang tiap sisinya dibagi menjadi 3 bagian sama panjang. Segitiga kecil memiliki sisi 1 bagian, segitiga sedang memiliki sisi 2 bagian, dan segitiga besar memiliki sisi 3 bagian. Raka awalnya menghitung semua segitiga sekaligus, tetapi hasilnya selalu berbeda karena ada segitiga yang terlewat. Raka pun mencari strategi alternatif."
            },
            {
                "t": "img",
                "src": "assets/soal/L7_segitiga.webp"
            }
        ],
        "pertanyaan": "Manakah strategi alternatif yang tepat agar tidak ada segitiga yang terlewat?",
        "opsi": [
            {
                "id": "A",
                "teks": "Bagi menurut letak kiri dan kanan → hitung segitiga kecil menghadap atas → lanjut sampai segitiga besar → pilih hasil terbanyak."
            },
            {
                "id": "B",
                "teks": "Bagi menurut ukuran → hitung segitiga kecil menghadap atas dan bawah → lanjut sampai segitiga besar → jumlahkan hasil tiap bagian."
            },
            {
                "id": "C",
                "teks": "Bagi menurut letak kiri dan kanan → hitung segitiga kecil menghadap atas → lanjut sampai segitiga sedang → pilih hasil terbanyak."
            },
            {
                "id": "D",
                "teks": "Bagi menurut ukuran → hitung segitiga kecil menghadap atas → lanjut sampai segitiga sedang → jumlahkan hasil tiap bagian."
            },
            {
                "id": "E",
                "teks": "Bagi menurut ukuran → hitung segitiga kecil menghadap atas dan bawah → lanjut sampai segitiga besar → pilih hasil terbanyak."
            }
        ],
        "kunci": [
            "B"
        ],
        "pembahasan": [
            "Strategi yang tepat adalah dekomposisi: membagi teka-teki menurut ukuran segitiga, menghitung tiap bagian tersendiri, lalu menjumlahkan hasilnya. Gambar memiliki 9 segitiga kecil (6 menghadap atas dan 3 menghadap bawah), 3 segitiga sedang, dan 1 segitiga besar (seluruh gambar). Total segitiga adalah 6 + 3 + 3 + 1 = 13. Strategi harus mencakup segitiga kecil menghadap bawah dan segitiga besar, karena keduanya mudah terlewat."
        ]
    },
    {
        "id": "L8",
        "judul": "Gabungan Pilar pada AI Penyaring Ulasan Kantin",
        "jenis": "PG",
        "kategori": "Analisis",
        "level": "C4",
        "tingkat": "HOTS",
        "pilar": "Gabungan pilar (dekomposisi, abstraksi, pengenalan pola, algoritma)",
        "kode": "M6",
        "konteks": [
            {
                "t": "p",
                "text": "Aplikasi kantin sebuah sekolah memakai AI untuk menentukan jenis ulasan siswa, yaitu Pujian atau Keluhan. AI bekerja dalam empat tahap: memecah ulasan menjadi kata-kata, mencari kata yang selalu muncul pada semua ulasan dengan jenis yang sama, mengabaikan kata lain, lalu memakai aturan \"jika ada kata itu, maka jenisnya itu\". Perhatikan ulasan contoh berikut."
            },
            {
                "t": "table",
                "rows": [
                    [
                        "No.",
                        "Ulasan",
                        "Jenis"
                    ],
                    [
                        "1",
                        "Makanan enak dan porsi besar",
                        "Pujian"
                    ],
                    [
                        "2",
                        "Enak sekali, antrean cepat",
                        "Pujian"
                    ],
                    [
                        "3",
                        "Antrean lama dan porsi kecil",
                        "Keluhan"
                    ],
                    [
                        "4",
                        "Makanan dingin, antrean lama",
                        "Keluhan"
                    ],
                    [
                        "5",
                        "Rasa enak, harga murah",
                        "Pujian"
                    ],
                    [
                        "6",
                        "Harga mahal, pesanan lama",
                        "Keluhan"
                    ]
                ]
            }
        ],
        "pertanyaan": "AI menerima dua ulasan baru: ulasan 7 \"Porsi besar dan rasa enak\" dan ulasan 8 \"Pesanan lama dan harga murah\". Manakah jenis dan kata penentu yang tepat untuk kedua ulasan tersebut? Kata penentu ditulis dalam tanda kurung.",
        "opsi": [
            {
                "id": "A",
                "teks": "Ulasan 7: Pujian (\"porsi\"); ulasan 8: Keluhan (\"pesanan\")"
            },
            {
                "id": "B",
                "teks": "Ulasan 7: Keluhan (\"lama\"); ulasan 8: Pujian (\"pesanan\")"
            },
            {
                "id": "C",
                "teks": "Ulasan 7: Pujian (\"besar\"); ulasan 8: Pujian (\"murah\")"
            },
            {
                "id": "D",
                "teks": "Ulasan 7: Pujian (\"enak\"); ulasan 8: Keluhan (\"harga\")"
            },
            {
                "id": "E",
                "teks": "Ulasan 7: Pujian (\"enak\"); ulasan 8: Keluhan (\"lama\")"
            }
        ],
        "kunci": [
            "E"
        ],
        "pembahasan": [
            "Tahap memecah ulasan menjadi kata (dekomposisi), mengabaikan kata yang tidak selalu muncul (abstraksi), mencari kata yang muncul pada semua ulasan satu jenis (pengenalan pola), lalu memakai aturan jika-maka (algoritma). Kata \"enak\" muncul pada semua ulasan Pujian (1, 2, 5) dan tidak pada ulasan Keluhan. Kata \"lama\" muncul pada semua ulasan Keluhan (3, 4, 6) dan tidak pada ulasan Pujian. Jadi ulasan 7 yang memuat \"enak\" berjenis Pujian, dan ulasan 8 yang memuat \"lama\" berjenis Keluhan."
        ]
    },
    {
        "id": "L9",
        "judul": "Identifikasi Pilar pada Kegiatan Class Meeting",
        "jenis": "PGK",
        "kategori": "Analisis",
        "level": "C3",
        "tingkat": "LOTS",
        "pilar": "Identifikasi pilar pada kasus",
        "kode": "M6",
        "konteks": [
            {
                "t": "p",
                "text": "Panitia class meeting kelas X menyiapkan acara sekolah. Berikut kegiatan yang mereka lakukan."
            },
            {
                "t": "table",
                "rows": [
                    [
                        "No.",
                        "Kegiatan"
                    ],
                    [
                        "1",
                        "Membagi pembuatan video profil kelas menjadi menulis naskah, merekam, dan menyunting"
                    ],
                    [
                        "2",
                        "Menulis langkah mendaftar lomba: isi formulir, serahkan ke panitia, ambil nomor urut"
                    ],
                    [
                        "3",
                        "Menyadari bahwa tiga lomba terakhir selalu ramai penonton saat dimulai pukul 10.00"
                    ],
                    [
                        "4",
                        "Mengenali bahwa stan es selalu cepat habis setiap cuaca panas, lalu menambah stoknya"
                    ],
                    [
                        "5",
                        "Membuat denah panggung yang memuat posisi tiang dan pintu, tanpa gambar hiasan"
                    ]
                ]
            }
        ],
        "pertanyaan": "Manakah pernyataan yang benar tentang pilar berpikir komputasional pada kegiatan di atas? (Jawaban benar lebih dari 1)",
        "opsi": [
            {
                "id": "A",
                "teks": "Kegiatan 1 menerapkan abstraksi."
            },
            {
                "id": "B",
                "teks": "Kegiatan 2 menerapkan algoritma."
            },
            {
                "id": "C",
                "teks": "Kegiatan 3 menerapkan dekomposisi."
            },
            {
                "id": "D",
                "teks": "Kegiatan 4 menerapkan pengenalan pola."
            },
            {
                "id": "E",
                "teks": "Kegiatan 5 menerapkan abstraksi."
            }
        ],
        "kunci": [
            "B",
            "D",
            "E"
        ],
        "pembahasan": [
            "Opsi B benar: menulis langkah-langkah berurutan untuk mendaftar lomba adalah algoritma.",
            "Opsi D benar: mengenali bahwa stan es selalu cepat habis pada cuaca panas adalah pengenalan pola.",
            "Opsi E benar: denah hanya memuat informasi yang penting (tiang dan pintu) dan mengabaikan hiasan. Itu abstraksi."
        ]
    },
    {
        "id": "L10",
        "judul": "Evaluasi Pernyataan tentang Berpikir Komputasional dalam Percakapan Siswa",
        "jenis": "PGK",
        "kategori": "Teori",
        "level": "C5",
        "tingkat": "HOTS",
        "pilar": "Evaluasi pernyataan tentang BK dan empat pilar",
        "kode": "M1",
        "konteks": [
            {
                "t": "p",
                "text": "Rafi dan Salsa menyusun jadwal piket kelas sebagai tugas dari Bu Wati."
            },
            {
                "t": "list",
                "items": [
                    "Rafi: \"Bu Wati minta jadwal piket ini disusun dengan Berpikir Komputasional. Menurutku itu bisa dipakai untuk urusan kelas, tidak harus untuk membuat program.\"",
                    "Salsa: \"Kita mulai dari pembagiannya. Muridnya ada 30, jadi kita bagi menjadi enam kelompok, satu kelompok untuk tiap hari piket. Kurasa itu dekomposisi.\"",
                    "Rafi: \"Aku sudah memeriksa catatan bulan lalu. Ternyata kelas paling kotor setiap hari Senin, jadi petugas Senin kita tambah. Kurasa itu abstraksi.\"",
                    "Salsa: \"Di kolom jadwal, aku menulis nama dan hari piket, tanpa nomor absen dan warna seragam. Kupikir itu pengenalan pola.\"",
                    "Rafi: \"Terakhir, tugas tiap petugas: menyapu, mengepel, lalu membuang sampah. Kutulis berurutan supaya tidak ada yang bingung. Kurasa itu algoritma.\""
                ]
            }
        ],
        "pertanyaan": "Manakah evaluasi yang tepat terhadap ucapan Rafi dan Salsa? (Jawaban benar lebih dari 1)",
        "opsi": [
            {
                "id": "A",
                "teks": "Ucapan Rafi tentang penggunaan berpikir komputasional sudah tepat."
            },
            {
                "id": "B",
                "teks": "Ucapan Salsa tentang pembagian kelompok piket sudah tepat."
            },
            {
                "id": "C",
                "teks": "Ucapan Rafi tentang catatan bulan lalu sudah tepat."
            },
            {
                "id": "D",
                "teks": "Ucapan Salsa tentang isi kolom jadwal sudah tepat."
            },
            {
                "id": "E",
                "teks": "Ucapan Rafi tentang tugas tiap petugas sudah tepat."
            }
        ],
        "kunci": [
            "A",
            "B",
            "E"
        ],
        "pembahasan": [
            "Opsi A benar: berpikir komputasional adalah cara berpikir untuk memecahkan masalah, sehingga dapat dipakai untuk urusan sehari-hari seperti jadwal piket, tidak harus untuk membuat program.",
            "Opsi B benar: membagi 30 murid menjadi enam kelompok, satu kelompok per hari, berarti memecah masalah besar menjadi bagian kecil. Itu dekomposisi.",
            "Opsi E benar: tugas petugas yang ditulis berurutan (menyapu, mengepel, membuang sampah) adalah algoritma."
        ]
    }
];
