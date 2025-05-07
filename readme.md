# Realtime User Tracker dengan Easter Egg

Aplikasi ini memungkinkan Anda untuk melacak pengguna yang aktif di website Anda secara realtime menggunakan WebSocket. Juga termasuk Easter Egg tersembunyi yang akan membuat tim Anda tersenyum!

## Fitur

- Pelacakan pengunjung website secara realtime
- Dashboard admin untuk melihat statistik pengguna
- Easter Egg tersembunyi yang bisa ditemukan oleh pengguna
- Easter Egg tersembunyi untuk admin

## Instalasi

1. Pastikan Node.js dan npm sudah terinstal di sistem Anda
2. Clone repository ini atau download file-file yang disediakan
3. Buat struktur folder sebagai berikut:
   ```
   realtime-user-tracker/
   ├── app.js
   ├── package.json
   ├── public/
   │   ├── index.html
   │   └── admin.html
   ```
4. Install dependency dengan menjalankan:
   ```bash
   npm install
   ```
5. Jalankan server:
   ```bash
   npm start
   ```
6. Server akan berjalan di http://localhost:3000

## Cara Penggunaan

### Integrasi ke Website Anda

1. Copy kode dari file `public/index.html` dan sesuaikan dengan website Anda
2. Yang penting untuk dipertahankan adalah bagian script Socket.io dan fungsi tracking

```html
<!-- Socket.io client -->
<script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
<script>
  // Koneksi ke server - ganti URL dengan URL server Anda
  const socket = io('http://localhost:3000');
  
  // Fungsi untuk mendapatkan user ID
  function getUserId() {
    // Implementasi Anda...
  }
  
  // Kirim data user ketika halaman dimuat
  window.addEventListener('load', () => {
    socket.emit('userActive', {
      userId: getUserId(),
      page: window.location.pathname,
      // Data lainnya...
    });
  });
  
  // Kirim update aktivitas secara periodik
  setInterval(() => {
    socket.emit('activity', {
      page: window.location.pathname,
      // Data lainnya...
    });
  }, 30000); // Update setiap 30 detik
</script>
```

### Mengakses Admin Panel

Admin panel tersedia di http://localhost:3000/admin

## Easter Eggs Tersembunyi

### Easter Egg untuk Pengguna

Pengguna dapat menemukan Easter Egg dengan:
1. Memasukkan kode Konami: ↑ ↑ ↓ ↓ ← → ← → B A
2. Atau melalui API endpoint `/api/easter-egg` (hanya untuk admin)

### Easter Egg untuk Admin

Admin dapat menemukan Easter Egg tersembunyi dengan:
1. Memasukkan kode Konami: ↑ ↑ ↓ ↓ ← → ← → B A di halaman admin
2. Mengklik "tombol rahasia" di pojok kanan bawah sebanyak 5 kali

## Kustomisasi

### Mengubah Pesan Easter Egg

Edit file `app.js` untuk mengubah pesan Easter Egg:

```javascript
app.get('/api/easter-egg', (req, res) => {
  io.emit('surprise', { 
    message: 'Pesan kustom Anda di sini!',
    animation: true,
    sound: true
  });
  res.json({ success: true, message: 'Easter egg diaktifkan untuk semua user!' });
});
```

### Menambahkan Fitur Tambahan

Anda dapat mengembangkan aplikasi ini dengan:
1. Menambahkan autentikasi untuk halaman admin
2. Menyimpan data pengguna ke database
3. Menambahkan lebih banyak Easter Egg kreatif
4. Menambahkan fitur analitik yang lebih detail

## Troubleshooting

**Masalah koneksi WebSocket:**
- Pastikan Socket.io server dan client menggunakan versi yang kompatibel
- Periksa apakah ada masalah CORS dengan mengubah konfigurasi di `app.js`

**Server tidak berjalan:**
- Periksa apakah port 3000 sudah digunakan oleh aplikasi lain
- Ubah port di file `app.js` jika diperlukan

## Lisensi

MIT