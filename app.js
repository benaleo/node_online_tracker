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

// Helper function to generate a unique user ID based on IP and userAgent
function generateUserId(socket) {
    const ip = socket.handshake.address;
    const userAgent = socket.handshake.query.userAgent || 'unknown';
    return `${ip}-${userAgent.substring(0, 20)}`; // Using first part of userAgent to avoid too long IDs
}

function getActiveStats() {
    return {
        domains: activeDomains,
        totalUsers: Object.values(activeDomains).reduce((sum, domain) => sum + domain.userIds?.size || 0, 0)
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
    const path = socket.handshake.query.path || '/';
    
    // Skip connections with undefined domain
    if (!domain || domain === 'undefined') {
        return;
    }

    // Validate license
    const isValid = validateLicense(license, domain);

    if (!isValid) {
        console.log(`Invalid license: ${license} for domain: ${domain}`);
        socket.emit('license_error', { message: 'Invalid license for this domain' });
        return;
    }

    // Generate a unique user ID based on IP and user agent
    const userId = generateUserId(socket);
    const connectionTime = new Date().toISOString();
    
    console.log(`New connection from domain: ${domain} with license: ${license}, path: ${path}, userId: ${userId}`);

    // Add domain to active tracking if needed
    if (!activeDomains[domain]) {
        activeDomains[domain] = {
            users: 0,
            pages: {},
            userIds: new Set(),
            userDetails: {}
        };
    }
    
    // Store user details
    if (!activeDomains[domain].userDetails[userId]) {
        // Only set connection time for new users
        activeDomains[domain].userDetails[userId] = {
            userId: userId.substring(0, 10), // Truncate userId for display
            domain: domain,
            page: path,
            connectedAt: connectionTime,
            lastActivity: connectionTime
        };
        
        activeDomains[domain].userIds.add(userId);
        activeDomains[domain].users = activeDomains[domain].userIds.size;
        
        // Update connected clients immediately
        io.emit('userCountUpdate', getActiveStats());
    } else {
        // Just update the path and last activity for existing users
        activeDomains[domain].userDetails[userId].page = path;
        activeDomains[domain].userDetails[userId].lastActivity = new Date().toISOString();
    }

    // Pageview tracking
    socket.on('pageview', (data) => {
        // Process pageview with domain and license info
        const { path } = data;
        const userId = generateUserId(socket);

        // Update page tracking
        if (!activeDomains[domain].pages[path]) {
            activeDomains[domain].pages[path] = 0;
        }
        
        // Update user details
        if (activeDomains[domain].userDetails[userId]) {
            // Update page for existing user
            const oldPage = activeDomains[domain].userDetails[userId].page;
            
            // Decrement old page count if it exists
            if (oldPage && activeDomains[domain].pages[oldPage] > 0) {
                activeDomains[domain].pages[oldPage]--;
            }
            
            // Update user details
            activeDomains[domain].userDetails[userId].page = path;
            activeDomains[domain].userDetails[userId].lastActivity = new Date().toISOString();
        }
        
        // Increment new page count
        activeDomains[domain].pages[path]++;

        // Broadcast updated stats
        io.emit('userCountUpdate', getActiveStats());
    });

    // User leaving
    socket.on('leave', (data) => {
        const userId = generateUserId(socket);
        
        if (activeDomains[domain]) {
            // Get current page of the user
            const userPage = activeDomains[domain].userDetails[userId]?.page;
            
            // Decrement page count
            if (userPage && activeDomains[domain].pages[userPage]) {
                activeDomains[domain].pages[userPage]--;
                
                // Clean up if needed
                if (activeDomains[domain].pages[userPage] <= 0) {
                    delete activeDomains[domain].pages[userPage];
                }
            }
            
            // Remove user from domain
            if (userId && activeDomains[domain].userIds) {
                activeDomains[domain].userIds.delete(userId);
                delete activeDomains[domain].userDetails[userId];
                activeDomains[domain].users = activeDomains[domain].userIds.size;
            }
            
            // Clean up domain if needed
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
    
    // Create a list of all users from all domains
    const allUsers = [];
    Object.entries(stats.domains || {}).forEach(([domain, domainData]) => {
        if (domainData.userDetails) {
            Object.values(domainData.userDetails).forEach(user => {
                allUsers.push(user);
            });
        }
    });
    
    res.json({
        count: stats.totalUsers,
        domains: stats.domains,
        users: allUsers
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