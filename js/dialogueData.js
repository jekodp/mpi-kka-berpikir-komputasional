// Kolom `emotion` menentukan gambar ekspresi karakter pada baris itu:
// assets/karakter/<karakter>_<emotion>.(webp|png|jpg), mis. kayana_menjelaskan.webp.
// Jika gambarnya belum ada, dipakai ekspresi cadangan lalu gambar dasar (lihat VN_EKSPRESI_CADANGAN di app.js).
// Kolom `sembunyikan: "Kevin"` / `"Kayana"` membuat karakter itu belum tampil pada baris tersebut
// (mis. Kevin baru muncul setelah Kayana menyapanya).
const dialogData = [
  // 1. Pendahuluan (Latar: Lorong Sekolah)
  { bg: "lorong_sekolah", speaker: "Narator", text: "Hari itu matahari bersinar cerah menembus jendela lorong sekolah. Waktu istirahat baru saja dimulai, tapi Kevin tampak mondar-mandir dengan wajah resah." },
  { speaker: "Kayana", text: "Kenapa muka kamu kusut banget, Kev? Kayak lagi mikirin utang negara saja.", emotion: "heran", sembunyikan: "Kevin" },
  { speaker: "Kevin", text: "Aduh, Kay. Orang tuaku minta tolong aku yang urus Pesta Kejutan Ulang Tahun adikku. Aku belum pernah bikin acara apa-apa! Rasanya kepalaku mau meledak mikirin ribetnya.", emotion: "panik" },
  { speaker: "Kayana", text: "Kalau kamu melihat masalahnya segede gunung, ya pasti pusing. Bagaimana kalau aku ajari rahasia ahli komputer untuk menyelesaikan masalah tanpa stres?", emotion: "senyum" },
  { speaker: "Kevin", text: "Hah? Aku kan mau bikin pesta, bukan mau bikin aplikasi, Kay!", emotion: "bingung" },
  { speaker: "Kayana", text: "Bukan coding-nya, Kev! Tapi cara berpikirnya. Namanya Berpikir Komputasional.", emotion: "tegas" },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Hei kamu! Sebelum aku jelaskan ke Kevin, coba tebak. Menurutmu, Berpikir Komputasional itu sebenarnya belajar tentang apa sih?", 
    options: [
      { text: "A. Belajar bahasa pemrograman rumit agar kita jago membuat aplikasi dan meretas (hack) komputer.", correct: false, feedback: "Kurang tepat! Kita sama sekali tidak akan menyentuh kode komputer di sini. Tujuannya justru untuk..." },
      { text: "B. Melatih otak memecahkan masalah sehari-hari secara logis, efektif, dan efisien.", correct: true, feedback: "Tepat sekali! Ini murni soal logika." }
    ]
  },
  { speaker: "Kayana", text: "Intinya, Kev, Berpikir Komputasional itu sama dengan melatih otak memecahkan masalah secara logis. Sama seperti jawaban teman kita tadi!", emotion: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Oh, aku paham sekarang! Jadi ini bukan soal mengetik kode komputer, tapi meretas cara otak kita bekerja supaya lebih jago mencari solusi. Wah, ini sih ilmu yang aku butuhkan banget!", emotion: "aha" },
  { speaker: "Kayana", text: "Tepat sekali! Kalau begitu, ayo kita ke perpustakaan biar aku bisa jelasin lebih detail ke kamu.", emotion: "mengajak" },
  { speaker: "Kevin", text: "Ayo! Aku udah nggak sabar pengen tahu rahasianya.", emotion: "semangat" },
  
  // 2. Konsep Berpikir Komputasional (Latar: Perpustakaan)
  { bg: "perpustakaan", speaker: "Narator", text: "Mereka berdua berjalan menuju perpustakaan yang sepi. Deretan rak buku menjulang tinggi, memberikan suasana tenang yang cocok untuk berdiskusi." },
  { speaker: "Kevin", text: "Wah, tumben kamu ngajak ke perpus. Terus, emang ngaruh buat urusan sehari-hari?", emotion: "tanya" },
  { speaker: "Kayana", text: "Sangat ngaruh! Masalah sebesar apa pun bisa diselesaikan kalau kita merapikannya menggunakan 4 Pilar: (1) Dekomposisi, (2) Pengenalan Pola, (3) Abstraksi, dan (4) Algoritma.", emotion: "menjelaskan", isMateri: true },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Coba kita tes intuisimu. Kalau kamu sedang membaca resep masakan lalu menyusun urutan bumbu mana yang harus masuk lebih dulu, kira-kira kamu sedang memakai pilar yang mana?", 
    options: [
      { text: "A. Pengenalan Pola", correct: false, feedback: "Ups, keliru! Pengenalan Pola itu mencari kebiasaan yang berulang. Kalau menyusun langkah-langkah, itu namanya..." },
      { text: "B. Algoritma", correct: true, feedback: "Kamu cerdas! Menyusun langkah berurutan itu namanya Algoritma." }
    ]
  },
  { speaker: "Kayana", text: "Nah, menyusun langkah berurutan itu namanya Algoritma.", emotion: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Astaga, aku baru sadar! Berarti tanpa sadar, saat aku sekadar masak mie instan saja aku sudah mempraktikkan salah satu pilarnya ya!", emotion: "aha" },
  { speaker: "Kevin", text: "Wah, dari 4 pilar itu, mana sih yang paling penting dan paling berkuasa, Kay?", emotion: "tanya" },
  { speaker: "Kayana", text: "Nggak ada, Kev! Keempat pilar ini sifatnya setara dan bekerja sebagai satu tim yang saling melengkapi. Tidak ada pilar yang lebih superior atau mendominasi pilar lainnya.", emotion: "tegas", isMateri: true },
  { speaker: "Kevin", text: "Oh, jadi keempatnya sama-sama penting dan harus jalan barengan ya?", emotion: "senang" },
  { speaker: "Kayana", text: "Betul! Nah Kev, mari kita bedah masalah pesta ulang tahun adikmu ini pakai keempat pilar itu. Tapi perutku lapar nih, kita lanjut bahas pilar pertamanya di kantin yuk!", emotion: "mengajak" },
  { speaker: "Kevin", text: "Hahaha, kalau urusan makan memang kamu yang paling cepat! Ayo deh, kebetulan perutku juga udah minta diisi sebelum mikir berat.", emotion: "tertawa" },

  // 3. Pilar 1: Dekomposisi (Latar: Kantin)
  { bg: "kantin", speaker: "Narator", text: "Bel tanda istirahat kedua berbunyi. Kevin dan Kayana bergegas menuju kantin yang mulai ramai oleh para murid." },
  { speaker: "Kayana", text: "Nah, sambil nunggu bakso datang, kita bahas Pilar pertama: Dekomposisi. Artinya, kita memecah masalah yang super besar menjadi tugas-tugas kecil yang gampang dikerjakan.", emotion: "menjelaskan", isMateri: true },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Bantu Kevin, yuk! Menurutmu, apa pecahan tugas yang paling masuk akal untuk merencanakan 'Pesta Kejutan'?", 
    options: [
      { text: "A. Membaginya jadi: Mencari tahu harga sewa badut, pinjaman kamera, dan nama teman sekelasnya.", correct: false, feedback: "Wah, tugas itu terlalu detail dan belum menyentuh inti acara kejutannya. Kalau begitu pestanya bisa gagal. Yang benar adalah..." },
      { text: "B. Membaginya jadi: Membeli kue & kado, menghias ruang tamu, dan mengalihkan perhatian adiknya.", correct: true, feedback: "Yap, cerdas! Ini adalah inti dari pesta kejutan. Mari kita dengar jawaban Kevin." }
    ]
  },
  { speaker: "Kayana", text: "Tepat seperti yang dijawab teman kita! Memecah tugas menjadi bagian yang lebih sederhana itu inti dari Dekomposisi. Coba kamu terapkan, Kev.", emotion: "memuji", isMateri: true },
  { speaker: "Kevin", text: "Aha! Aku paham! Berarti pestanya bisa kupecah jadi: (1) Beli kue & kado, (2) Menghias ruang tamu, dan (3) Cari cara supaya adikku keluar rumah saat dekorasi.", emotion: "menjabarkan" },
  { speaker: "Kayana", text: "Nah, itu dia! Terasa lebih ringan dan tidak menakutkan lagi, kan? Ayo kita jalan-jalan ke taman sekolah buat cari udara segar sambil bahas pilar kedua.", emotion: "memuji" },
  { speaker: "Kevin", text: "Iya beneran! Rasanya benang kusut di kepalaku langsung terurai. Yuk, kita ke taman!", emotion: "senang" },

  // 4. Pilar 2: Pengenalan Pola (Latar: Taman Sekolah)
  { bg: "taman_sekolah", speaker: "Narator", text: "Setelah menghabiskan makanan mereka, Kayana mengajak Kevin bersantai di bangku taman sekolah di bawah bayangan pohon yang rindang." },
  { speaker: "Kayana", text: "Oke, sekarang tugas ke-3: mencari cara agar adikmu keluar rumah. Coba kamu ingat-ingat kebiasaannya (polanya) setiap hari Minggu sore.", emotion: "memancing" },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Teman-teman, ketika Kevin mencoba mengingat-ingat kebiasaan adiknya di masa lalu untuk mencari celah, dia sedang menggunakan pilar apa?", 
    options: [
      { text: "A. Pengenalan Pola", correct: true, feedback: "Betul! Mari kita lihat apakah Kevin berhasil menemukannya." },
      { text: "B. Dekomposisi", correct: false, feedback: "Bukan! Dekomposisi itu untuk memecah masalah besar (seperti di pilar 1 tadi). Kalau mencari kebiasaan yang berulang di masa lalu, itu namanya..." }
    ]
  },
  { speaker: "Kayana", text: "Seperti tebakan teman kita, menganalisa kebiasaan masa lalu untuk memprediksi kejadian itu namanya Pengenalan Pola.", emotion: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Oh, maksudnya mencari hal yang rutin dia lakukan? Tunggu sebentar... Aha! Setiap Minggu jam 15.00 sore, dia selalu pergi main sepeda ke taman. Dia baru pulang jam 16.00!", emotion: "aha" },
  { speaker: "Kayana", text: "Tepat! Karena kamu berhasil mengenali pola kebiasaannya, kita punya celah waktu rahasia selama satu jam penuh untuk mendekorasi rumah. Yuk balik ke kelas, bel masuk sudah mau bunyi.", emotion: "memuji" },
  { speaker: "Kevin", text: "Wih, ajaib banget! Dengan begini rencanaku jadi makin matang. Ayo cepat, kita lari ke kelas!", emotion: "semangat" },

  // 5. Pilar 3: Abstraksi (Latar: Ruang Kelas)
  { bg: "ruang_kelas", speaker: "Narator", text: "Bel masuk terdengar nyaring. Mereka kembali ke ruang kelas yang masih lumayan sepi karena guru belum masuk." },
  { speaker: "Kevin", text: "Oke, lanjut. Sekarang soal menghias ruang tamu. Aku harus menggambar denah ruangan 3D dulu nggak sih? Biar aku tahu warna balonnya tabrakan atau nggak dengan warna cat dinding, letak jendela di mana...", emotion: "panik" },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Gawat, Kevin mau membuang waktu memikirkan hal yang nggak penting! Kita harus suruh dia pakai pilar Abstraksi. Informasi mana yang sebaiknya diabaikan oleh Kevin?", 
    options: [
      { text: "A. Warna cat dinding dan detail letak jendela ruangan.", correct: true, feedback: "Tepat! Itu sama sekali tidak relevan dengan menaruh kue kejutan." },
      { text: "B. Letak meja utama tempat kue kejutan akan ditaruh.", correct: false, feedback: "Waduh, kalau lokasi meja utama malah diabaikan, kuenya mau ditaruh mana dong? Yang benar-benar harus dibuang dari pikiran Kevin adalah..." }
    ]
  },
  { speaker: "Kayana", text: "Betul kata teman kita tadi, informasi yang tidak penting seperti warna cat dinding harus diabaikan. Itulah inti dari pilar ketiga: Abstraksi.", emotion: "menjelaskan", isMateri: true },
  { speaker: "Kevin", text: "Aha! Jadi Abstraksi itu kemampuan menyaring memori dan membuang gangguan agar kita fokus pada hal yang benar-benar penting saja ya?", emotion: "aha" },
  { speaker: "Kayana", text: "Tepat sekali! Kamu tidak butuh denah 3D yang rumit. Cukup buat sketsa kotak sederhana untuk tempat meja kue, dan garis untuk menandai pintu masuk.", emotion: "senyum" },
  { speaker: "Kevin", text: "Benar juga! Kalau aku memusingkan warna balon sekarang, kerjaku nggak bakal selesai. Abstraksi bikin perencanaanku jadi super efisien!", emotion: "senang" },
  { speaker: "Kayana", text: "Pintar! Nah, sekarang kebetulan kita ada jadwal pelajaran TIK. Ayo kita pindah ke Lab Komputer untuk membahas pilar yang terakhir.", emotion: "mengajak" },
  { speaker: "Kevin", text: "Gas! Aku udah nggak sabar pengen tahu senjata pamungkas buat menyukseskan pesta ini!", emotion: "semangat" },

  // 6. Pilar 4: Algoritma (Latar: Lab Komputer)
  { bg: "lab_komputer", speaker: "Narator", text: "Jam pelajaran TIK pun dimulai. Mereka duduk berdampingan menghadap layar komputer yang menyala terang di dalam laboratorium." },
  { speaker: "Kayana", text: "Nah, di depan komputer ini, mari kita bahas pilar keempat: Algoritma. Ini adalah instruksi berurutan yang pasti dan mutlak agar pestanya tidak berantakan.", emotion: "menjelaskan", isMateri: true },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Algoritma itu urutannya harus logis. Apa yang terjadi kalau algoritma Kevin terbalik: Adik membuka pintu -> Ayah teriak 'Kejutan!' -> Lalu Kevin baru berlari mematikan lampu?", 
    options: [
      { text: "A. Pestanya gagal total karena kejutannya bocor di awal dan suasananya jadi aneh.", correct: true, feedback: "Betul banget! Makanya Algoritma itu urutannya tidak boleh sembarangan." },
      { text: "B. Pestanya akan tetap seru dan adiknya tetap kaget.", correct: false, feedback: "Sayang sekali! Kalau lampu belum dimatikan dan ayah sudah teriak, adiknya melihat semua persiapan sebelum kejutan dimulai. Pestanya..." }
    ]
  },
  { speaker: "Kayana", text: "Seperti teman kita yang teliti ini, Algoritma itu urutannya harus sangat presisi. Kalau terbalik, rencana pestanya bisa gagal total!", emotion: "tegas", isMateri: true },
  { speaker: "Kevin", text: "Aha! Aku ngerti. Berarti Algoritma itu bagaikan resep langkah demi langkah yang tidak boleh ditukar urutannya agar hasilnya sempurna, kan?", emotion: "aha" },
  { speaker: "Kayana", text: "Betul banget! Nah, berbekal ketiga pilar sebelumnya, coba kamu susun langkah pasti pelaksanaan pestamu sore ini.", emotion: "memancing" },
  { speaker: "Kevin", text: "Oke, ini Algoritmanya: Langkah (1) Jam 15.00 Adik pergi bermain. Langkah (2) 15.05 Mulai dekorasi dan siapkan kue. Langkah (3) 15.55 Matikan lampu dan sembunyi. Langkah (4) 16.00 Adik masuk, kita teriak Kejutan!", emotion: "menjabarkan", isMateri: true },
  { speaker: "Kayana", text: "Sempurna! Sangat terstruktur! Wah, kebetulan bel sekolah sudah berbunyi nih. Ayo kita segera beres-beres untuk pulang.", emotion: "memuji" },
  { speaker: "Kevin", text: "Wah, nggak terasa udah bel pulang aja. Ayo, aku harus cepat-cepat ke rumah buat langsung mengeksekusi semua rencana kita ini!", emotion: "semangat" },

  // 7. Kesimpulan & Evaluasi Akhir (Latar: Gerbang Sekolah Sore Hari)
  { bg: "gerbang_sekolah", speaker: "Narator", text: "Langit mulai berwarna jingga keemasan. Jam pelajaran telah usai, dan mereka berjalan bersama menuju gerbang utama untuk pulang." },
  { speaker: "Kevin", text: "Akhirnya sampai gerbang depan. Gila, Kay! Berkat Berpikir Komputasional ini, pestanya pasti bakal sukses tanpa bikin aku stres. Makasih banyak, ya!", emotion: "senang" },
  { speaker: "Kayana", text: "Sama-sama, Kev. Nah, sebelum kita berpisah, aku mau menguji teman kita yang dari tadi menyimak di balik layar ini.", emotion: "senyum" },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Ujian pertama! Kalau kamu ditunjuk menjadi ketua panitia perpisahan kelas, lalu hal pertama yang kamu lakukan adalah membagi teman-temanmu menjadi divisi-divisi kecil (divisi acara, konsumsi, dokumentasi). Pilar mana yang sedang kamu pakai?", 
    options: [
      { text: "A. Dekomposisi", correct: true, feedback: "Hebat! Memecah tugas besar menjadi bagian kecil adalah Dekomposisi." },
      { text: "B. Abstraksi", correct: false, feedback: "Tetot! Abstraksi itu mengabaikan informasi. Di sini kamu sedang memecah acara besar menjadi divisi-divisi kecil agar mudah diatur. Jawaban yang benar adalah..." }
    ]
  },
  { speaker: "Kevin", text: "Wih, teman kita ternyata pintar juga ya, Kay! Pantas saja dia selalu berhasil ngebantu kita dari tadi.", emotion: "senang" },
  { 
    type: "quiz", 
    speaker: "Kayana", 
    text: "Ujian terakhir! Setelah panitia terbentuk, kamu membuat jadwal urutan kerja dari jam 07.00 pagi sampai acara selesai jam 12.00 siang, agar tidak ada acara yang tabrakan. Menyusun urutan langkah pasti ini disebut apa?", 
    options: [
      { text: "A. Pengenalan Pola", correct: false, feedback: "Bukan dong! Pengenalan pola itu mencari kesamaan dari pengalaman masa lalu. Kalau menyusun daftar langkah yang berurutan, itu namanya..." },
      { text: "B. Algoritma", correct: true, feedback: "Lulus dengan nilai sempurna! Urutan langkah yang jelas dan pasti selalu disebut Algoritma." }
    ]
  },
  { speaker: "Kevin", text: "Hahaha, ternyata teman kita ini lebih jago menguasai konsepnya daripada aku! Keren banget!", emotion: "tertawa" },
  { speaker: "Kayana", text: "Tentu saja! Selamat, kamu dan Kevin kini sudah resmi jadi Master Pemecah Masalah. Teruslah berlatih menggunakan 4 pilar ini di kehidupan nyata ya. Sampai jumpa di petualangan berikutnya!", emotion: "melambai" }
];

const vnChapters = [
    { id: 1, title: "Pendahuluan", startIndex: 0, bg: "lorong_sekolah", theme: "light", summary: ["Berpikir Komputasional bukan tentang belajar ilmu komputer.", "Melatih otak untuk menyelesaikan masalah sehari-hari secara logis dan teratur.", "Membantu menemukan solusi yang efektif (berhasil) dan efisien (hemat waktu dan tenaga)."] },
    { id: 2, title: "Konsep 4 Pilar", startIndex: 11, bg: "perpustakaan", theme: "dark", summary: ["Berpikir komputasional bukan soal coding, tapi melatih otak.", "Terdapat 4 pilar utama: Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma.", "Berguna untuk memecahkan masalah besar secara logis dan terstruktur."] },
    { id: 3, title: "Pilar 1 - Dekomposisi", startIndex: 22, bg: "kantin", theme: "light", summary: ["Dekomposisi: Memecah masalah besar menjadi bagian-bagian kecil.", "Contoh: Memecah kepanitiaan menjadi divisi acara, konsumsi, dan dekorasi.", "Membantu agar tugas tidak terasa berat dan lebih mudah dikelola."] },
    { id: 4, title: "Pilar 2 - Pengenalan Pola", startIndex: 29, bg: "taman_sekolah", theme: "light", summary: ["Pengenalan Pola: Mencari kesamaan atau pola dari masalah sebelumnya.", "Contoh: Mengingat menu makanan yang sukses di acara tahun lalu.", "Berfungsi untuk mempercepat penyelesaian masalah tanpa harus mengulang dari awal."] },
    { id: 5, title: "Pilar 3 - Abstraksi", startIndex: 36, bg: "ruang_kelas", theme: "light", summary: ["Abstraksi: Mengabaikan detail yang tidak penting dan fokus pada informasi utama.", "Contoh: Fokus pada kapasitas gedung daripada warna tirainya.", "Mencegah kita terdistraksi oleh hal-hal sepele yang memperlambat pekerjaan."] },
    { id: 6, title: "Pilar 4 - Algoritma", startIndex: 45, bg: "lab_komputer", theme: "dark", summary: ["Algoritma: Menyusun langkah-langkah berurutan untuk menyelesaikan masalah.", "Contoh: Membuat rundown (susunan acara) dari jam 7 pagi sampai selesai.", "Memastikan tidak ada langkah yang terlewat atau bertabrakan."] },
    { id: 7, title: "Kesimpulan & Evaluasi", startIndex: 54, bg: "gerbang_sekolah", theme: "light", summary: ["Berpikir Komputasional dapat diterapkan di hampir semua aspek kehidupan sehari-hari.", "Dekomposisi: Memecah bab pelajaran untuk mengatur jadwal ujian.", "Pengenalan Pola: Mengingat barang yang sering terlupa saat kemah.", "Abstraksi: Fokus pada barang yang dicari di kamar berantakan.", "Algoritma: Mengikuti urutan langkah pasti saat memasak resep baru."] }
];
