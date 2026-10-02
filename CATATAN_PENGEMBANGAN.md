# Catatan Pengembangan MPI Berpikir Komputasional

Catatan hal-hal yang sengaja ditunda dari versi 1.0 dan cara melanjutkannya.

## 1. Ekspresi karakter yang belum dibuat

Delapan ekspresi di naskah dialog belum punya gambar. Untuk sementara aplikasi memakai
gambar pengganti, jadi dialog tetap berjalan normal.

| Prioritas | Nama berkas | Dipakai | Pengganti sementara |
|---|---|---|---|
| 1 | `kayana_mengajak` | 4 baris | `kayana_memuji` |
| 2 | `kevin_menjabarkan` | 3 baris | `kevin_semangat` |
| 3 | `kayana_tegas` | 2 baris | `kayana_menjelaskan` |
| 4 | `kayana_memancing` | 2 baris | gambar dasar `kayana` |
| 5 | `kevin_tertawa` | 2 baris | `kevin_senang` |
| 6 | `kevin_bingung` | 1 baris | gambar dasar `kevin` |
| 7 | `kayana_heran` | 1 baris | gambar dasar `kayana` |
| 8 | `kayana_melambai` | 1 baris | gambar dasar `kayana` |

### Cara menambahkan satu ekspresi

1. Buat gambarnya (ukuran 1024 x 1536, latar transparan, gaya sama dengan gambar yang ada).
2. Simpan sebagai `.webp` di `assets/karakter/` dengan nama persis seperti di tabel,
   misalnya `assets/karakter/kayana_mengajak.webp`. Huruf kecil semua.
3. Buka `js/app.js`, cari `VN_EKSPRESI_BELUM_ADA`, lalu hapus nama ekspresi itu dari
   daftarnya (untuk contoh di atas: hapus `'mengajak'` dari baris `kayana`).
4. Simpan, lalu `git add .`, `git commit`, `git push`.

Selama nama ekspresi masih ada di `VN_EKSPRESI_BELUM_ADA`, berkasnya tidak dicari sama
sekali, jadi langkah 3 wajib. Daftar ini ada supaya aplikasi tidak meminta gambar yang
belum ada setiap kali dibuka.

## 2. Fitur yang direncanakan

- **Profil Siswa** di Pengaturan: nama panggilan dan pilihan pemandu (sekarang bertanda "Segera hadir").
- **Efek suara** untuk tombol dan jawaban kuis (musik latar sudah ada).

## 3. Hal yang perlu diingat saat mengubah isi

- **Musik**: nama berkas dan judul lagu diatur di `MUSIK_LAGU` dalam `js/musik.js`.
  Huruf besar-kecil nama berkas harus persis sama.
- **Soal simulasi**: ada di `js/simulasiData.js`. Jika soal diganti, hasil simulasi lama
  yang tersimpan di perangkat murid otomatis diabaikan.
- **Logo**: enam ukuran ikon ada di `assets/icon/`. Jika logo diganti, semua ukurannya
  perlu dibuat ulang dari satu gambar induk.
- **Mode developer**: ketuk "Versi 1.0" di halaman Tentang tujuh kali, atau tambahkan
  `?dev=1` di akhir alamat.
