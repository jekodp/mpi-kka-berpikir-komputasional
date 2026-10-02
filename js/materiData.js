// =====================================================================
// RINGKASAN MATERI TIAP BAB (tombol "Lihat Materi" di halaman Pilih Materi)
// Ditulis seperti buku pelajaran: pengertian, penjelasan, contoh, dan catatan penting.
// Kunci objek = id bab pada vnChapters (js/dialogueData.js).
//
// Bentuk isi tiap bagian:
//   ['p', 'paragraf']                      paragraf penjelasan
//   ['ul', ['butir 1', 'butir 2']]         daftar berbutir
//   ['ol', ['langkah 1', 'langkah 2']]     daftar bernomor
//   ['cerita', 'teks']                     kotak "Dari cerita Kevin dan Kayana"
//   ['contoh', 'teks']                     kotak "Contoh lain"
//   ['ingat', 'teks']                      kotak "Ingat!"
// Tag <b>...</b> boleh dipakai untuk menebalkan istilah penting.
// =====================================================================

const materiBab = {
    1: {
        judul: 'Pendahuluan: Apa Itu Berpikir Komputasional?',
        bagian: [
            { judul: 'Pengertian', isi: [
                ['p', '<b>Berpikir komputasional</b> (<i>computational thinking</i>) adalah cara berpikir yang sistematis untuk memahami suatu masalah dan merumuskan penyelesaiannya. Hasil pemikirannya berupa langkah-langkah yang jelas, sehingga dapat dijalankan oleh manusia maupun oleh komputer.'],
                ['p', 'Cara berpikir ini tidak hanya dipakai saat bekerja dengan komputer. Masalah sehari-hari, seperti merencanakan acara, mengatur jadwal belajar, atau menyiapkan perjalanan, dapat diselesaikan dengan cara berpikir yang sama.']
            ] },
            { judul: 'Bukan Sekadar Menulis Kode', isi: [
                ['p', 'Berpikir komputasional sering disamakan dengan <i>coding</i>, padahal keduanya berbeda. <i>Coding</i> adalah kegiatan menuliskan perintah untuk komputer. Berpikir komputasional adalah proses berpikir yang dilakukan <b>sebelum</b> perintah itu ditulis, yaitu saat kita menentukan apa masalahnya dan bagaimana cara menyelesaikannya.'],
                ['p', 'Karena itu, berpikir komputasional dapat dilatih tanpa komputer sama sekali.']
            ] },
            { judul: 'Mengapa Perlu Dipelajari?', isi: [
                ['ul', [
                    'Masalah yang besar dan rumit menjadi lebih teratur dan tidak lagi terasa menakutkan.',
                    'Penyelesaian yang dihasilkan <b>efektif</b>, artinya tujuan benar-benar tercapai.',
                    'Penyelesaian yang dihasilkan <b>efisien</b>, artinya hemat waktu, tenaga, dan biaya.',
                    'Langkah penyelesaiannya dapat dijelaskan kepada orang lain dan dipakai ulang untuk masalah serupa.'
                ]]
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Kevin diminta mengurus pesta kejutan ulang tahun adiknya dan merasa kewalahan karena memandang tugas itu sebagai satu masalah besar. Kayana lalu mengajaknya memakai berpikir komputasional: bukan untuk membuat aplikasi, melainkan untuk menata cara berpikirnya.'],
                ['ingat', 'Berpikir komputasional bukan berarti berpikir seperti robot. Ini adalah cara manusia memecahkan masalah secara logis dan teratur.']
            ] }
        ]
    },

    2: {
        judul: 'Empat Pilar Berpikir Komputasional',
        bagian: [
            { judul: 'Empat Pilar', isi: [
                ['p', 'Berpikir komputasional bertumpu pada empat pilar. Setiap pilar menjawab satu pertanyaan saat kita menghadapi masalah.'],
                ['ul', [
                    '<b>Dekomposisi</b>: memecah masalah yang besar menjadi bagian-bagian kecil. Pertanyaannya: <i>bagian apa saja yang menyusun masalah ini?</i>',
                    '<b>Pengenalan pola</b>: menemukan kesamaan atau keteraturan pada masalah atau data. Pertanyaannya: <i>apa yang berulang atau mirip?</i>',
                    '<b>Abstraksi</b>: memilih informasi yang penting dan mengabaikan yang tidak diperlukan. Pertanyaannya: <i>informasi mana yang benar-benar dibutuhkan?</i>',
                    '<b>Algoritma</b>: menyusun langkah penyelesaian yang jelas dan berurutan. Pertanyaannya: <i>apa langkah-langkahnya, dari awal sampai selesai?</i>'
                ]]
            ] },
            { judul: 'Hubungan Keempat Pilar', isi: [
                ['p', 'Keempat pilar itu <b>setara</b> dan saling melengkapi. Tidak ada pilar yang lebih penting daripada yang lain. Dalam satu masalah, biasanya beberapa pilar dipakai sekaligus, dan urutannya tidak harus selalu sama.'],
                ['p', 'Untuk membedakannya, perhatikan apa yang sedang dilakukan: <b>memecah</b> (dekomposisi), <b>mencari yang berulang</b> (pengenalan pola), <b>menyaring</b> (abstraksi), atau <b>mengurutkan langkah</b> (algoritma).']
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Kevin menyadari bahwa saat memasak mi instan ia sudah mengikuti urutan langkah yang pasti. Tanpa sadar, ia sedang menjalankan sebuah algoritma.'],
                ['contoh', 'Membaca resep lalu menentukan bumbu mana yang dimasukkan lebih dulu termasuk <b>algoritma</b>, karena yang disusun adalah urutan langkah. Kegiatan itu bukan pengenalan pola, sebab tidak ada kesamaan atau kebiasaan berulang yang dicari.'],
                ['ingat', 'Pernyataan seperti "algoritma adalah pilar yang paling penting" keliru. Keempat pilar bekerja sebagai satu tim.']
            ] }
        ]
    },

    3: {
        judul: 'Pilar 1: Dekomposisi',
        bagian: [
            { judul: 'Pengertian', isi: [
                ['p', '<b>Dekomposisi</b> adalah memecah masalah yang kompleks menjadi bagian-bagian yang lebih kecil dan lebih mudah diselesaikan. Setiap bagian dikerjakan satu per satu, lalu hasilnya digabungkan untuk menyelesaikan masalah utama.']
            ] },
            { judul: 'Ciri Dekomposisi yang Baik', isi: [
                ['ul', [
                    'Setiap bagian lebih sederhana daripada masalah semula.',
                    'Hal-hal yang sejenis dikelompokkan dalam bagian yang sama.',
                    'Bagian-bagiannya saling berkaitan dan, jika digabungkan, mencakup seluruh masalah.',
                    'Pemecahannya menyentuh inti masalah, tidak langsung tenggelam dalam detail kecil.'
                ]]
            ] },
            { judul: 'Dekomposisi pada Perhitungan', isi: [
                ['p', 'Dekomposisi juga dipakai dalam perhitungan. Perhitungan yang rumit dipecah menjadi beberapa perhitungan kecil, kemudian hasilnya dijumlahkan.'],
                ['contoh', 'Untuk menghitung energi listrik yang dipakai sebuah rumah dalam sehari, hitung dulu energi tiap alat (lampu, kipas, televisi), lalu jumlahkan semuanya.']
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Pesta kejutan dipecah Kevin menjadi tiga tugas: (1) membeli kue dan kado, (2) menghias ruang tamu, dan (3) mencari cara agar adiknya keluar rumah saat dekorasi dipasang. Setelah dipecah, tugas itu terasa jauh lebih ringan.'],
                ['contoh', 'Panitia perpisahan kelas dibagi menjadi divisi acara, konsumsi, dan dokumentasi. Setiap divisi mengurus tugas yang sejenis.'],
                ['ingat', 'Pecahan yang terlalu rinci tetapi tidak menyentuh inti masalah bukan dekomposisi yang baik. Mencari harga sewa badut, misalnya, belum menjawab apa saja yang harus disiapkan untuk sebuah pesta kejutan.']
            ] }
        ]
    },

    4: {
        judul: 'Pilar 2: Pengenalan Pola',
        bagian: [
            { judul: 'Pengertian', isi: [
                ['p', '<b>Pengenalan pola</b> adalah menemukan kesamaan, keteraturan, atau hal yang berulang pada suatu masalah atau kumpulan data. Pola dapat ditemukan pada kebiasaan, gambar, urutan angka, tabel data, maupun perintah dalam sebuah program.']
            ] },
            { judul: 'Kegunaan Pola', isi: [
                ['ul', [
                    '<b>Memprediksi</b> apa yang akan terjadi atau data apa yang muncul berikutnya.',
                    '<b>Menentukan unsur yang belum diketahui</b>, misalnya bagian yang hilang dari suatu susunan.',
                    '<b>Memakai ulang penyelesaian</b> yang pernah berhasil untuk masalah yang mirip, sehingga tidak perlu mulai dari nol.'
                ]]
            ] },
            { judul: 'Cara Mengenali Pola', isi: [
                ['ol', [
                    'Amati data atau kejadian yang tersedia dengan teliti.',
                    'Cari hal yang sama, yang berulang, atau yang berubah secara teratur.',
                    'Rumuskan dugaan tentang aturannya.',
                    'Uji dugaan itu dengan data lain. Jika tidak cocok, perbaiki dugaannya.'
                ]]
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Kevin mengingat kebiasaan adiknya: setiap Minggu pukul 15.00 adiknya bersepeda ke taman dan baru pulang pukul 16.00. Dari pola itu, ia tahu ada waktu satu jam untuk menghias rumah.'],
                ['contoh', 'Data pengunjung perpustakaan menunjukkan bahwa perpustakaan selalu ramai pada jam istirahat kedua. Petugas dapat memperkirakan kapan harus menyiapkan meja tambahan.'],
                ['ingat', 'Satu kejadian belum dapat disebut pola. Pola baru dapat dipercaya jika muncul berulang kali dan tetap cocok saat diuji dengan data baru.']
            ] }
        ]
    },

    5: {
        judul: 'Pilar 3: Abstraksi',
        bagian: [
            { judul: 'Pengertian', isi: [
                ['p', '<b>Abstraksi</b> adalah memilih informasi yang penting untuk menyelesaikan masalah dan mengabaikan detail yang tidak diperlukan. Dengan abstraksi, masalah menjadi lebih sederhana tanpa kehilangan hal yang pokok.']
            ] },
            { judul: 'Penting atau Tidak, Bergantung pada Tujuan', isi: [
                ['p', 'Sebuah informasi tidak selalu penting atau selalu tidak penting. Semuanya bergantung pada <b>tujuan</b>. Karena itu, langkah pertama abstraksi adalah menetapkan tujuan, baru kemudian menyaring informasinya.'],
                ['contoh', 'Pada denah rute menuju sekolah, yang perlu digambar adalah jalan, belokan, dan patokan. Warna rumah dan jumlah pohon di tepi jalan dapat diabaikan karena tidak membantu orang menemukan arah.']
            ] },
            { judul: 'Membuat Templat', isi: [
                ['p', 'Abstraksi juga dipakai untuk membuat <b>templat</b>. Dari beberapa contoh yang mirip, kita memisahkan bagian yang <b>tetap</b> dari bagian yang <b>berubah</b>. Bagian yang tetap menjadi kerangka, sedangkan bagian yang berubah menjadi tempat isian.'],
                ['contoh', 'Pada undangan, kalimat pembuka, waktu, dan tempat acara selalu sama. Yang berubah hanya nama tamu, sehingga cukup nama itulah yang diganti.']
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Kevin hampir menghabiskan waktu untuk menggambar denah tiga dimensi lengkap dengan warna cat dinding dan letak jendela. Dengan abstraksi, ia cukup membuat sketsa sederhana: sebuah kotak untuk meja kue dan sebuah garis untuk pintu masuk.'],
                ['ingat', 'Abstraksi bukan membuang informasi secara sembarangan. Informasi yang menentukan hasil, seperti letak meja kue, justru harus dipertahankan.']
            ] }
        ]
    },

    6: {
        judul: 'Pilar 4: Algoritma',
        bagian: [
            { judul: 'Pengertian', isi: [
                ['p', '<b>Algoritma</b> adalah urutan langkah yang jelas dan berurutan untuk menyelesaikan suatu masalah. Siapa pun yang mengikuti langkah-langkah itu dengan benar akan memperoleh hasil yang sama.']
            ] },
            { judul: 'Ciri Algoritma yang Baik', isi: [
                ['ul', [
                    '<b>Jelas</b>: setiap langkah hanya dapat dipahami dengan satu cara, tidak membingungkan.',
                    '<b>Berurutan secara logis</b>: langkah yang harus dilakukan lebih dulu ditempatkan lebih dulu.',
                    '<b>Mempunyai awal dan akhir</b>: algoritma berhenti setelah tujuannya tercapai.',
                    '<b>Dapat diulang</b>: hasilnya sama setiap kali dijalankan dengan keadaan awal yang sama.'
                ]]
            ] },
            { judul: 'Tiga Susunan Dasar', isi: [
                ['ul', [
                    '<b>Urutan</b>: langkah dijalankan satu per satu dari atas ke bawah.',
                    '<b>Percabangan</b>: langkah dipilih berdasarkan suatu syarat (<i>jika ... maka ...</i>).',
                    '<b>Perulangan</b>: langkah yang sama dijalankan berkali-kali sampai syarat tertentu terpenuhi.'
                ]]
            ] },
            { judul: 'Menelusuri dan Memperbaiki Algoritma', isi: [
                ['p', '<b>Menelusuri</b> algoritma berarti menjalankan langkahnya satu per satu sambil mencatat perubahan yang terjadi, sampai diperoleh keadaan akhirnya. Cara ini dipakai untuk memeriksa apakah algoritma sudah benar.'],
                ['p', 'Kesalahan yang sering muncul adalah urutan langkah yang tertukar dan syarat percabangan yang keliru pada nilai batas, misalnya tertukar antara "lebih dari 10" dan "10 atau lebih".']
            ] },
            { judul: 'Penerapan', isi: [
                ['cerita', 'Algoritma pesta Kevin: (1) pukul 15.00 adik pergi bermain, (2) pukul 15.05 dekorasi dipasang dan kue disiapkan, (3) pukul 15.55 lampu dimatikan dan semua bersembunyi, (4) pukul 16.00 adik masuk dan semua berseru "Kejutan!".'],
                ['ingat', 'Urutan langkah tidak boleh ditukar sembarangan. Jika ayah berseru "Kejutan!" sebelum lampu dimatikan, kejutannya gagal.']
            ] }
        ]
    },

    7: {
        judul: 'Kesimpulan: Keempat Pilar Bekerja Bersama',
        bagian: [
            { judul: 'Satu Masalah, Empat Pilar', isi: [
                ['p', 'Dalam penyelesaian masalah yang sesungguhnya, keempat pilar dipakai bersama. Rencana pesta kejutan Kevin memperlihatkan peran tiap pilar.'],
                ['ul', [
                    '<b>Dekomposisi</b>: pesta dipecah menjadi tiga tugas (kue dan kado, dekorasi, mengalihkan perhatian adik).',
                    '<b>Pengenalan pola</b>: kebiasaan adik bersepeda setiap Minggu sore dipakai untuk menentukan waktu dekorasi.',
                    '<b>Abstraksi</b>: denah disederhanakan menjadi letak meja kue dan pintu masuk saja.',
                    '<b>Algoritma</b>: semua kegiatan disusun berurutan menurut jamnya.'
                ]]
            ] },
            { judul: 'Hubungan Antarpilar', isi: [
                ['p', 'Dekomposisi biasanya dilakukan lebih dulu, karena pola lebih mudah ditemukan pada bagian yang kecil. Abstraksi menyederhanakan tiap bagian dengan membuang detail yang tidak perlu. Algoritma kemudian menyatukan semuanya menjadi langkah yang siap dijalankan.']
            ] },
            { judul: 'Jika Sebuah Pilar Terlewat', isi: [
                ['ul', [
                    'Tanpa <b>dekomposisi</b>, masalah tetap terasa terlalu besar dan sulit dimulai.',
                    'Tanpa <b>pengenalan pola</b>, kita tidak dapat memperkirakan apa yang akan terjadi dan harus selalu mulai dari nol.',
                    'Tanpa <b>abstraksi</b>, waktu habis untuk detail yang tidak menentukan hasil.',
                    'Tanpa <b>algoritma</b>, pelaksanaannya tidak teratur: ada langkah yang terlewat, tertukar, atau bertabrakan.'
                ]]
            ] },
            { judul: 'Penerapan dalam Kehidupan Sehari-hari', isi: [
                ['ul', [
                    'Membagi bab pelajaran saat menyusun jadwal belajar menjelang ujian (dekomposisi).',
                    'Mengingat barang yang sering tertinggal setiap kali berkemah (pengenalan pola).',
                    'Memusatkan perhatian pada barang yang dicari di kamar yang berantakan (abstraksi).',
                    'Mengikuti urutan langkah saat memasak resep baru (algoritma).'
                ]],
                ['ingat', 'Saat menghadapi sebuah kasus, tanyakan empat hal: apa bagian-bagiannya, apa yang berulang, informasi mana yang penting, dan apa urutan langkahnya.']
            ] }
        ]
    }
};
