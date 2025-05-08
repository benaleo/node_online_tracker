// server.js - Server Express dan WebSocket
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

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
const url = new URL(import.meta.url);
let pathName = url.pathname;

if (process.platform === 'win32' && pathName.startsWith('/')) {
    pathName = pathName.substring(1);
}

const publicPath = path.join(path.dirname(pathName), 'public');
app.use(express.static(publicPath));

// Menyimpan koneksi user yang aktif
const activeUsers = new Map();
const activeDomains = {};

function getActiveStats() {
    return {
        domains: activeDomains,
        totalUsers: Object.values(activeDomains).reduce((sum, domain) => sum + domain.users, 0)
    };
}


// Validasi license
function validateLicense(license, domain) {
    if (process.env.NODE_ENV === 'development') {
        return true; // Izinkan semua untuk development
    }

    // Untuk production
    const validLicenses = {
        'abc': ['kanban-simple-ashy.vercel.app', 'localhost:5173', 'localhost:5000'],
        'premium': ['*']
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
        io.emit('userCountUpdate', getActiveStats());
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
        io.emit('userCountUpdate', getActiveStats());
    });
});

// Endpoint API untuk mendapatkan jumlah user aktif
app.get('/api/active-users', (req, res) => {
    const stats = getActiveStats();
    res.json({
        count: stats.totalUsers,
        domains: stats.domains
    });
});

// Route untuk admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(publicPath, 'admin.html'));
});

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
    // Easter egg console message yang tersembunyi
    console.log('\n\n🥚 Easter egg tersembunyi: akses /api/easter-egg untuk kejutan!\n\n');
});