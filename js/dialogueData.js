// Kolom `emotion` menentukan gambar ekspresi karakter pada baris itu:
// assets/karakter/<karakter>_<emotion>.(webp|png|jpg), mis. kayana_menjelaskan.webp.
// Jika gambarnya belum ada, dipakai ekspresi cadangan lalu gambar dasar (lihat VN_EKSPRESI_CADANGAN di app.js).
// Kolom `sembunyikan: "Kevin"` / `"Kayana"` membuat karakter itu belum tampil pada baris tersebut
// (mis. Kevin baru muncul setelah Kayana menyapanya).
//
// KUIS: murid boleh mencoba lagi sampai benar. Umpan balik pilihan yang salah memberi alasan
// tanpa membocorkan jawabannya. Baris SESUDAH kuis boleh punya dua versi:
//   text / emotion            dipakai bila murid benar pada percobaan pertama (berisi pujian)
//   textSalah / emotionSalah  dipakai bila murid sempat salah (menjelaskan, tanpa pujian)
const dialogData = [
  // 1. Pendahuluan (Latar: Lorong Sekolah)
  { bg: "lorong_sekolah", speaker: "Narator", text: "Hari itu matahari bersinar cerah menembus jendela lorong sekolah. Waktu istirahat baru saja dimulai, tapi Kevin tampak mondar-mandir dengan wajah resah." },
  { speaker: "Kayana", text: "Kenapa muka kamu kusut banget, Kev? Kayak lagi mikirin utang negara aja.", emotion: "heran", sembunyikan: "Kevin" },
  { speaker: "Kevin", text: "Aduh, Kay. Orang tuaku minta aku ngurus pesta kejutan ulang tahun adikku.", emotion: "panik" },
  { speaker: "Kevin", text: "Aku belum pernah bikin acara apa-apa. Kepalaku rasanya mau meledak!", emotion: "panik" },
  { speaker: "Kayana", text: "Kalau masalahnya kamu lihat segede gunung, ya jelas pusing. Mau aku kasih tahu cara berpikir yang biasa dipakai ahli komputer?", emotion: "senyum" },
  { speaker: "Kevin", text: "Hah? Aku mau bikin pesta, Kay, bukan bikin aplikasi!", emotion: "bingung" },
  { speaker: "Kayana", text: "Bukan coding-nya, Kev. Cara berpikirnya. Namanya berpikir komputasional.", emotion: "tegas" },
  { speaker: "Kayana", text: "Eh, sebentar. Ada teman kita yang ikut menyimak dari tadi. Kita ajak sekalian, ya!", emotion: "mengajak" },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Hai, teman! Sebelum aku jelaskan ke Kevin, coba tebak dulu. Berpikir komputasional itu sebenarnya tentang apa?",
    options: [
      { text: "A. Belajar bahasa pemrograman supaya bisa membuat aplikasi.", correct: false, feedback: "Belum tepat, tapi banyak yang mengira begitu, kok. Ingat, Kevin mau bikin pesta, bukan aplikasi. Coba lagi!" },
      { text: "B. Melatih cara berpikir untuk memecahkan masalah secara logis dan teratur.", correct: true, feedback: "Tepat! Ini soal cara berpikir, bukan soal menulis kode." }
    ]
  },
  { speaker: "Kayana", text: "Seperti jawaban teman kita tadi, Kev: berpikir komputasional itu melatih cara berpikir untuk memecahkan masalah secara logis dan teratur.", emotion: "menjelaskan", textSalah: "Jadi begini: berpikir komputasional itu bukan belajar bahasa pemrograman. Ini melatih cara berpikir untuk memecahkan masalah secara logis dan teratur.", isMateri: true },
  { speaker: "Kevin", text: "Oh, gitu! Jadi bukan soal ngetik kode, tapi soal cara mikir biar ketemu solusinya. Pas banget sama yang lagi aku butuhin!", emotion: "aha", textSalah: "Tenang, aku tadi juga ngiranya begitu. Ternyata ini soal cara mikir, bukan soal ngetik kode. Pas banget sama yang lagi aku butuhin!" },
  { speaker: "Kayana", text: "Nah! Yuk ke perpustakaan, biar aku jelasin lebih lengkap.", emotion: "mengajak" },
  { speaker: "Kevin", text: "Ayo! Aku udah nggak sabar.", emotion: "semangat" },

  // 2. Konsep Empat Pilar (Latar: Perpustakaan)
  { bg: "perpustakaan", speaker: "Narator", text: "Mereka berdua berjalan menuju perpustakaan yang sepi. Deretan rak buku menjulang tinggi, memberikan suasana tenang yang cocok untuk berdiskusi." },
  { speaker: "Kevin", text: "Oke, Kay. Jadi gimana caranya berpikir komputasional bisa bantu aku ngurus pesta?", emotion: "tanya" },
  { speaker: "Kayana", text: "Ada empat pilarnya: dekomposisi, pengenalan pola, abstraksi, dan algoritma. Masalah sebesar apa pun bisa ditata pakai empat pilar itu.", emotion: "menjelaskan", isMateri: true },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Coba kita tes intuisimu. Saat membaca resep, kamu menentukan bumbu mana yang dimasukkan lebih dulu. Kira-kira itu pilar yang mana?",
    options: [
      { text: "A. Pengenalan pola", correct: false, feedback: "Belum tepat. Pengenalan pola itu mencari hal yang berulang, sedangkan yang ini soal urutan langkah. Coba lagi!" },
      { text: "B. Algoritma", correct: true, feedback: "Betul! Menyusun urutan langkah itu algoritma." }
    ]
  },
  { speaker: "Kayana", text: "Nah, menyusun langkah secara berurutan itu namanya algoritma. Intuisi teman kita bagus!", emotion: "memuji", textSalah: "Nggak apa-apa, kita baru mulai. Menyusun langkah secara berurutan itu namanya algoritma. Nanti kita bahas lebih dalam.", emotionSalah: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Lho, berarti waktu masak mi instan, aku udah pakai algoritma tanpa sadar?", emotion: "aha" },
  { speaker: "Kevin", text: "Terus, dari empat pilar itu, mana yang paling penting, Kay?", emotion: "tanya" },
  { speaker: "Kayana", text: "Nggak ada yang paling penting, Kev. Keempatnya setara dan saling melengkapi, kayak satu tim.", emotion: "tegas", isMateri: true },
  { speaker: "Kevin", text: "Oh, jadi harus jalan bareng, ya.", emotion: "senang" },
  { speaker: "Kayana", text: "Betul! Sekarang kita bedah masalah pestamu pakai empat pilar itu. Tapi aku lapar. Lanjut di kantin, yuk!", emotion: "mengajak" },
  { speaker: "Kevin", text: "Hahaha, kalau soal makan, kamu memang paling cepat. Ayo!", emotion: "tertawa" },

  // 3. Pilar 1: Dekomposisi (Latar: Kantin)
  { bg: "kantin", speaker: "Narator", text: "Bel tanda istirahat kedua berbunyi. Kevin dan Kayana bergegas menuju kantin yang mulai ramai oleh para murid." },
  { speaker: "Kayana", text: "Sambil nunggu bakso, kita bahas pilar pertama: dekomposisi. Artinya memecah masalah besar jadi bagian-bagian kecil yang lebih gampang dikerjakan.", emotion: "menjelaskan", isMateri: true },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Bantu Kevin, yuk! Pesta kejutan itu sebaiknya dipecah jadi tugas apa saja?",
    options: [
      { text: "A. Cari harga sewa badut, pinjam kamera, dan catat nama teman sekelas adik.", correct: false, feedback: "Belum tepat. Itu sudah terlalu rinci, padahal bagian utama pestanya belum ditentukan. Coba lagi!" },
      { text: "B. Beli kue dan kado, menghias ruang tamu, dan mengalihkan perhatian adik.", correct: true, feedback: "Betul! Itu tiga bagian utama pesta kejutan." }
    ]
  },
  { speaker: "Kayana", text: "Tepat seperti jawaban teman kita! Itulah dekomposisi: masalah besar dipecah jadi bagian utama dulu. Coba kamu susun, Kev.", emotion: "memuji", textSalah: "Kuncinya, pecah dulu jadi bagian utama, baru nanti masuk ke detail. Itulah dekomposisi. Coba kamu susun, Kev.", emotionSalah: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Oke. Berarti ada tiga tugas: (1) beli kue dan kado, (2) menghias ruang tamu, (3) cari cara biar adikku keluar rumah waktu dekorasi dipasang.", emotion: "menjabarkan" },
  { speaker: "Kayana", text: "Nah, itu dia! Jadi nggak terasa berat lagi, kan? Yuk ke taman, cari udara segar sambil bahas pilar kedua.", emotion: "memuji" },
  { speaker: "Kevin", text: "Iya, beneran. Benang kusut di kepalaku rasanya langsung terurai. Yuk!", emotion: "senang" },

  // 4. Pilar 2: Pengenalan Pola (Latar: Taman Sekolah)
  { bg: "taman_sekolah", speaker: "Narator", text: "Setelah menghabiskan makanan mereka, Kayana mengajak Kevin bersantai di bangku taman sekolah di bawah bayangan pohon yang rindang." },
  { speaker: "Kayana", text: "Sekarang tugas ketiga: gimana caranya biar adikmu keluar rumah. Coba ingat-ingat, apa kebiasaannya setiap sore?", emotion: "memancing" },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Saat Kevin mengingat-ingat kebiasaan adiknya untuk mencari celah waktu, ia sedang memakai pilar apa?",
    options: [
      { text: "A. Pengenalan pola", correct: true, feedback: "Betul! Kebiasaan yang berulang itu pola." },
      { text: "B. Dekomposisi", correct: false, feedback: "Belum tepat. Dekomposisi itu memecah masalah, seperti di kantin tadi. Yang ini mencari hal yang berulang. Coba lagi!" }
    ]
  },
  { speaker: "Kayana", text: "Seperti jawaban teman kita, mencari kebiasaan yang berulang untuk memperkirakan apa yang akan terjadi itu namanya pengenalan pola.", emotion: "menjelaskan", textSalah: "Mencari kebiasaan yang berulang untuk memperkirakan apa yang akan terjadi itu namanya pengenalan pola. Bedanya dengan dekomposisi: yang ini mencari, bukan memecah.", isMateri: true },
  { speaker: "Kevin", text: "Kebiasaan yang rutin, ya? Sebentar... Ada! Tiap sore jam 15.00 dia main sepeda ke taman, dan baru pulang jam 16.00.", emotion: "aha" },
  { speaker: "Kayana", text: "Nah! Dari pola itu, kita tahu ada waktu satu jam buat mendekorasi rumah. Yuk balik ke kelas, sebentar lagi bel masuk.", emotion: "memuji" },
  { speaker: "Kevin", text: "Wih, rencanaku makin matang. Ayo, lari!", emotion: "semangat" },

  // 5. Pilar 3: Abstraksi (Latar: Ruang Kelas)
  { bg: "ruang_kelas", speaker: "Narator", text: "Bel masuk terdengar nyaring. Mereka kembali ke ruang kelas yang masih lumayan sepi karena guru belum masuk." },
  { speaker: "Kevin", text: "Sekarang soal menghias ruang tamu. Aku harus gambar denah 3D dulu nggak, sih?", emotion: "panik" },
  { speaker: "Kevin", text: "Biar tahu warna balonnya cocok sama cat dinding, jendelanya di sebelah mana, lampunya ada berapa...", emotion: "panik" },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Waduh, Kevin mulai memikirkan hal yang nggak perlu. Bantu dia pakai abstraksi, yuk! Informasi mana yang bisa diabaikan?",
    options: [
      { text: "A. Warna cat dinding dan letak jendela.", correct: true, feedback: "Tepat! Itu tidak berpengaruh pada tempat kue kejutan." },
      { text: "B. Letak meja tempat kue akan ditaruh.", correct: false, feedback: "Belum tepat. Letak meja justru penting, karena di situlah kuenya ditaruh. Coba lagi!" }
    ]
  },
  { speaker: "Kayana", text: "Betul kata teman kita. Warna cat dinding dan letak jendela bisa diabaikan. Itulah abstraksi: ambil informasi yang penting, abaikan yang tidak perlu.", emotion: "memuji", textSalah: "Coba tanya begini: informasi mana yang menentukan hasilnya? Letak meja kue penting, warna cat dinding tidak. Itulah abstraksi: ambil yang penting, abaikan yang tidak perlu.", emotionSalah: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Oh! Jadi aku cukup fokus ke hal yang benar-benar menentukan, ya?", emotion: "aha" },
  { speaker: "Kayana", text: "Iya. Nggak perlu denah 3D. Cukup sketsa sederhana: satu kotak buat meja kue dan satu garis buat pintu masuk.", emotion: "senyum" },
  { speaker: "Kevin", text: "Bener juga. Kalau aku pusingin warna balon sekarang, nggak bakal selesai-selesai.", emotion: "senang" },
  { speaker: "Kayana", text: "Habis ini kita ada pelajaran TIK. Yuk ke lab komputer, nanti kita bahas pilar terakhir di sana.", emotion: "mengajak" },
  { speaker: "Kevin", text: "Gas! Penasaran sama pilar terakhirnya.", emotion: "semangat" },

  // 6. Pilar 4: Algoritma (Latar: Lab Komputer)
  { bg: "lab_komputer", speaker: "Narator", text: "Pelajaran TIK baru saja selesai. Sambil menunggu bel pulang, mereka duduk berdampingan di depan komputer laboratorium." },
  { speaker: "Kayana", text: "Pilar keempat: algoritma. Artinya urutan langkah yang jelas dan berurutan, supaya pestamu berjalan sesuai rencana.", emotion: "menjelaskan", isMateri: true },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Urutan langkah itu penting. Apa yang terjadi kalau urutannya begini: adik membuka pintu, ayah berseru \"Kejutan!\", lalu Kevin baru mematikan lampu?",
    options: [
      { text: "A. Kejutannya gagal, karena adik sudah melihat semuanya lebih dulu.", correct: true, feedback: "Betul! Urutan yang tertukar membuat rencananya gagal." },
      { text: "B. Pestanya tetap seru dan adik tetap kaget.", correct: false, feedback: "Belum tepat. Kalau lampu belum dimatikan, adik sudah melihat semua persiapannya. Coba lagi!" }
    ]
  },
  { speaker: "Kayana", text: "Teman kita teliti! Dalam algoritma, urutan langkah tidak boleh tertukar. Kalau tertukar, hasilnya bisa lain.", emotion: "memuji", textSalah: "Coba bayangkan: lampu masih menyala, jadi adik sudah melihat dekorasinya sebelum ada yang berseru. Dalam algoritma, urutan langkah tidak boleh tertukar.", emotionSalah: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Jadi mirip resep, ya. Langkahnya harus diikuti sesuai urutan biar hasilnya pas.", emotion: "aha" },
  { speaker: "Kayana", text: "Persis! Sekarang coba susun langkah pestamu sore ini, pakai semua yang sudah kita bahas.", emotion: "memancing" },
  { speaker: "Kevin", text: "Oke, ini algoritmanya. Langkah 1: jam 15.00 adik pergi main sepeda. Langkah 2: jam 15.05 dekorasi dipasang dan kue disiapkan.", emotion: "menjabarkan", isMateri: true },
  { speaker: "Kevin", text: "Langkah 3: jam 15.55 lampu dimatikan dan semua sembunyi. Langkah 4: jam 16.00 adik masuk, dan kita berseru \"Kejutan!\"", emotion: "menjabarkan", isMateri: true },
  { speaker: "Kayana", text: "Sempurna, rapi banget! Nah, itu bel pulang. Yuk beres-beres.", emotion: "memuji" },
  { speaker: "Kevin", text: "Aku harus cepat pulang, mau langsung jalanin rencananya!", emotion: "semangat" },

  // 7. Kesimpulan & Evaluasi (Latar: Gerbang Sekolah)
  { bg: "gerbang_sekolah", speaker: "Narator", text: "Langit mulai berwarna jingga keemasan. Jam pelajaran telah usai, dan mereka berjalan bersama menuju gerbang utama untuk pulang." },
  { speaker: "Kevin", text: "Akhirnya sampai gerbang. Serius, Kay, berkat berpikir komputasional aku jadi yakin pestanya bakal lancar. Makasih banyak, ya!", emotion: "senang" },
  { speaker: "Kayana", text: "Sama-sama, Kev. Sebelum pulang, aku mau menguji teman kita yang dari tadi ikut menyimak.", emotion: "senyum" },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Ujian pertama! Kamu jadi ketua panitia perpisahan kelas, lalu membagi teman-temanmu ke divisi acara, konsumsi, dan dokumentasi. Pilar mana yang kamu pakai?",
    options: [
      { text: "A. Dekomposisi", correct: true, feedback: "Hebat! Memecah tugas besar menjadi bagian kecil itu dekomposisi." },
      { text: "B. Pengenalan pola", correct: false, feedback: "Belum tepat. Pengenalan pola itu mencari hal yang berulang. Di sini tugas besar dibagi-bagi. Coba lagi!" },
      { text: "C. Abstraksi", correct: false, feedback: "Belum tepat. Abstraksi itu menyaring informasi yang penting. Di sini tugas besar dibagi-bagi. Coba lagi!" },
      { text: "D. Algoritma", correct: false, feedback: "Belum tepat. Algoritma itu urutan langkah. Di sini tugas besar dibagi-bagi. Coba lagi!" }
    ]
  },
  { speaker: "Kevin", text: "Wih, teman kita jago! Pantas dari tadi bisa bantu aku.", emotion: "senang", textSalah: "Nggak apa-apa, aku juga sempat ketukar tadi. Ingat aja: kalau memecah, itu dekomposisi." },
  {
    type: "quiz",
    speaker: "Kayana",
    text: "Ujian terakhir! Setelah panitia terbentuk, kamu menyusun jadwal kerja berurutan dari jam 07.00 sampai acara selesai. Menyusun urutan langkah seperti ini disebut apa?",
    options: [
      { text: "A. Dekomposisi", correct: false, feedback: "Belum tepat. Dekomposisi itu memecah tugas, dan itu sudah dilakukan saat membentuk divisi. Yang ini soal urutan. Coba lagi!" },
      { text: "B. Pengenalan pola", correct: false, feedback: "Belum tepat. Pengenalan pola itu mencari hal yang berulang. Yang ini soal urutan. Coba lagi!" },
      { text: "C. Abstraksi", correct: false, feedback: "Belum tepat. Abstraksi itu menyaring informasi yang penting. Yang ini soal urutan. Coba lagi!" },
      { text: "D. Algoritma", correct: true, feedback: "Betul! Urutan langkah yang jelas itu algoritma." }
    ]
  },
  { speaker: "Kevin", text: "Hahaha, teman kita malah lebih jago dari aku. Keren!", emotion: "tertawa", textSalah: "Hampir! Ingat pesta tadi: urutan langkah yang nggak boleh ketukar itu algoritma.", emotionSalah: "semangat" },
  { speaker: "Kayana", text: "Jadi, ingat empat pilarnya, ya: pecah masalahnya, cari polanya, ambil yang penting, lalu susun langkahnya.", emotion: "menjelaskan", isMateri: true },
  { speaker: "Kayana", text: "Selamat! Kamu dan Kevin sudah belajar memecahkan masalah dengan berpikir komputasional. Terus latih di kehidupan sehari-hari, ya. Sampai jumpa!", emotion: "melambai" },
];

const vnChapters = [
    { id: 1, title: "Pendahuluan", startIndex: 0, bg: "lorong_sekolah", theme: "light", summary: ["Berpikir Komputasional bukan tentang belajar ilmu komputer.", "Melatih otak untuk menyelesaikan masalah sehari-hari secara logis dan teratur.", "Membantu menemukan solusi yang efektif (berhasil) dan efisien (hemat waktu dan tenaga)."] },
    { id: 2, title: "Konsep 4 Pilar", startIndex: 13, bg: "perpustakaan", theme: "dark", summary: ["Berpikir komputasional bukan soal coding, tapi melatih otak.", "Terdapat 4 pilar utama: Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.", "Berguna untuk memecahkan masalah besar secara logis dan terstruktur."] },
    { id: 3, title: "Pilar 1 - Dekomposisi", startIndex: 24, bg: "kantin", theme: "light", summary: ["Dekomposisi: Memecah masalah besar menjadi bagian-bagian kecil.", "Contoh: Memecah kepanitiaan menjadi divisi acara, konsumsi, dan dekorasi.", "Membantu agar tugas tidak terasa berat dan lebih mudah dikelola."] },
    { id: 4, title: "Pilar 2 - Pengenalan Pola", startIndex: 31, bg: "taman_sekolah", theme: "light", summary: ["Pengenalan Pola: Mencari kesamaan atau pola dari masalah sebelumnya.", "Contoh: Mengingat menu makanan yang sukses di acara tahun lalu.", "Berfungsi untuk mempercepat penyelesaian masalah tanpa harus mengulang dari awal."] },
    { id: 5, title: "Pilar 3 - Abstraksi", startIndex: 38, bg: "ruang_kelas", theme: "light", summary: ["Abstraksi: Mengabaikan detail yang tidak penting dan fokus pada informasi utama.", "Contoh: Fokus pada kapasitas gedung daripada warna tirainya.", "Mencegah kita terdistraksi oleh hal-hal sepele yang memperlambat pekerjaan."] },
    { id: 6, title: "Pilar 4 - Algoritma", startIndex: 48, bg: "lab_komputer", theme: "dark", summary: ["Algoritma: Menyusun langkah-langkah berurutan untuk menyelesaikan masalah.", "Contoh: Membuat rundown (susunan acara) dari jam 7 pagi sampai selesai.", "Memastikan tidak ada langkah yang terlewat atau bertabrakan."] },
    { id: 7, title: "Kesimpulan & Evaluasi", startIndex: 58, bg: "gerbang_sekolah", theme: "light", summary: ["Berpikir Komputasional dapat diterapkan di hampir semua aspek kehidupan sehari-hari.", "Dekomposisi: Memecah bab pelajaran untuk mengatur jadwal ujian.", "Pengenalan Pola: Mengingat barang yang sering terlupa saat kemah.", "Abstraksi: Fokus pada barang yang dicari di kamar berantakan.", "Algoritma: Mengikuti urutan langkah pasti saat memasak resep baru."] }
];
