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

// Validasi license
function validateLicense(license, domain) {
    const validLicenses = {
        'abc': ['kanban-simple-ashy.vercel.app', 'localhost:5173', 'localhost'],
        'premium': ['*'] // Wildcard untuk semua domain
    };

    if (!validLicenses[license]) return false;
    return validLicenses[license].includes('*') || validLicenses[license].includes(domain);
}

// Socket.IO connection handler
io.on('connection', (socket) => {
    const domain = socket.handshake.query.domain;
    const license = socket.handshake.query.license;

    // Validate license
    const isValid = validateLicense(license, domain);

    if (!isValid) {
        console.log(`Invalid license: ${license} for domain: ${domain}`);
        socket.emit('license_error', { message: 'Invalid license for this domain' });
        return;
    }

    console.log(`New connection from domain: ${domain} with license: ${license}`);

    // Add domain to active tracking if needed
    if (!activeDomains[domain]) {
        activeDomains[domain] = {
            users: 0,
            pages: {}
        };
    }

    // Pageview tracking
    socket.on('pageview', (data) => {
        // Process pageview with domain and license info
        const { path } = data;

        // Increment users on this page for this domain
        if (!activeDomains[domain].pages[path]) {
            activeDomains[domain].pages[path] = 0;
        }
        activeDomains[domain].pages[path]++;
        activeDomains[domain].users++;

        // Broadcast updated stats
        io.emit('stats_update', getActiveStats());
    });

    // User leaving
    socket.on('leave', (data) => {
        const { path } = data;

        if (activeDomains[domain] && activeDomains[domain].pages[path]) {
            activeDomains[domain].pages[path]--;
            activeDomains[domain].users--;

            // Clean up if needed
            if (activeDomains[domain].pages[path] <= 0) {
                delete activeDomains[domain].pages[path];
            }

            if (activeDomains[domain].users <= 0) {
                delete activeDomains[domain];
            }
        }

        // Broadcast updated stats
        io.emit('stats_update', getActiveStats());
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