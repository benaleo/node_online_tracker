// server.js - Server Express dan WebSocket
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Membuat aplikasi Express
const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.io dengan CORS
const io = new Server(server, {
    cors: {
        origin: '*', // Dalam produksi, ganti dengan domain asli Anda
        methods: ['GET', 'POST']
    }
});

// Middleware untuk static files
app.use(express.static(path.join(__dirname, 'public')));

// Menyimpan koneksi user yang aktif
const activeUsers = new Map();

// Konfigurasi Socket.io
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Ketika user terhubung, tambahkan ke daftar aktif
    socket.on('userActive', (userData) => {
        const userId = userData.userId || socket.id;
        const page = userData.page || 'unknown';

        activeUsers.set(socket.id, {
            userId: userId,
            page: page,
            connectedAt: new Date(),
            lastActivity: new Date(),
            ...userData
        });

        // Broadcast ke admin panel bahwa jumlah user berubah
        io.emit('userCountUpdate', {
            count: activeUsers.size,
            users: Array.from(activeUsers.values())
        });
    });

    // Update saat user berinteraksi atau pindah halaman
    socket.on('activity', (data) => {
        if (activeUsers.has(socket.id)) {
            const user = activeUsers.get(socket.id);
            activeUsers.set(socket.id, {
                ...user,
                lastActivity: new Date(),
                page: data.page || user.page,
                ...data
            });

            // Broadcast update aktivitas
            io.emit('userCountUpdate', {
                count: activeUsers.size,
                users: Array.from(activeUsers.values())
            });
        }
    });

    // Saat user disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        activeUsers.delete(socket.id);

        // Broadcast bahwa jumlah user berubah
        io.emit('userCountUpdate', {
            count: activeUsers.size,
            users: Array.from(activeUsers.values())
        });
    });
});

// Endpoint API untuk mendapatkan jumlah user aktif
app.get('/api/active-users', (req, res) => {
    res.json({
        count: activeUsers.size,
        users: Array.from(activeUsers.values())
    });
});

// Route untuk admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// EASTER EGG: Ketika endpoint ini diakses, semua user akan menerima surprise
app.get('/api/easter-egg', (req, res) => {
    io.emit('surprise', {
        message: '🎉 Surprise! Telah ditemukan easter egg!',
        animation: true,
        sound: true
    });
    res.json({ success: true, message: 'Easter egg diaktifkan untuk semua user!' });
});

// Port server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    // Easter egg console message yang tersembunyi
    console.log('\n\n🥚 Easter egg tersembunyi: akses /api/easter-egg untuk kejutan!\n\n');
});