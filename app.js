// server.js - Server Express dan WebSocket
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import dotenv from "dotenv";
import "./config/database.js";
import PendingMessage from "./models/PendingMessage.js";
import { Users } from "./config/database.js";

dotenv.config();

// Membuat aplikasi Express
const app = express();
const server = http.createServer(app);

// Inisialisasi Socket.io dengan CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Dalam produksi, ganti dengan domain asli Anda
    methods: ["GET", "POST"],
  },
});

// Middleware untuk static files
const url = new URL(import.meta.url);
let pathName = url.pathname;

if (process.platform === "win32" && pathName.startsWith("/")) {
  pathName = pathName.substring(1);
}

const publicPath = path.join(path.dirname(pathName), "public");
app.use(express.static(publicPath));

// Menyimpan koneksi user yang aktif
const activeUsers = new Map();
const activeDomains = {};

// Helper function to generate a unique user ID based on IP and userAgent
function generateUserId(socket) {
  // Get the real IP address from request headers
  const ip =
    socket.handshake.headers["x-forwarded-for"] ||
    socket.handshake.headers["x-real-ip"] ||
    socket.handshake.address;
  console.log("Real IP:", ip);
  const userId = `${ip}`; // Using first part of userAgent to avoid too long IDs
  console.log("User ID:", userId);
  return userId;
}

// Helper function to generate user Agent
function generateUserAgent(socket) {
  const userAgent = socket.handshake.query.userAgent || "unknown";
  return userAgent;
}

function getActiveStats() {
  return {
    domains: activeDomains,
    totalUsers: Object.values(activeDomains).reduce(
      (sum, domain) => sum + domain.userIds?.size || 0,
      0
    ),
  };
}

// Validasi license
let errMessageNotValid = "";
async function validateLicense(license, domain) {
  if (process.env.NODE_ENV === "development" || license === "premium") {
    return true; // Izinkan semua untuk development
  }

  try {
    const user = await Users.validateLicense(license, domain);

    if (!user) {
      errMessageNotValid = "No user found for domain: " + domain;
      console.log("Invalid license: " + errMessageNotValid);
      return false;
    }

    if (!user.isValid) {
      errMessageNotValid = "User is not valid for domain: " + domain;
      console.log("Invalid license: " + errMessageNotValid);
      return false;
    }

    if (user.validUntil < new Date()) {
      errMessageNotValid = "License has expired for domain: " + domain;
      console.log("Invalid license: " + errMessageNotValid);
      return false;
    }

    console.log("License validation successful for domain:", domain);
    return true;
  } catch (error) {
    console.error("Error validating license:", error);
    return false;
  }
}

// Socket.IO connection handler
io.on("connection", async (socket) => {
  try {
    const domain = socket.handshake.query.domain;
    const license = socket.handshake.query.license;
    const path = socket.handshake.query.path || "/";

    // Skip connections with undefined domain
    if (!domain || domain === "undefined") {
      return;
    }

    // Validate license
    const isValid = await validateLicense(license, domain);

    if (!isValid) {
      console.log(`Invalid license: ${license} for domain: ${domain}`);
      socket.emit("license_error", {
        message: errMessageNotValid,
      });
      socket.disconnect(true);
      return;
    }

    // Generate a unique user ID based on IP and user agent
    const userId = generateUserId(socket);
    const userAgent = generateUserAgent(socket);
    const connectionTime = new Date().toISOString();

    console.log(
      `New connection from domain: ${domain} with license: ${license}, path: ${path}, userId: ${userId}`
    );

    // Add domain to active tracking if needed
    if (!activeDomains[domain]) {
      activeDomains[domain] = {
        users: 0,
        pages: {},
        userIds: new Set(),
        userDetails: {},
      };
    }

    // Store user details
    if (!activeDomains[domain].userDetails[userId]) {
      // Only set connection time for new users
      activeDomains[domain].userDetails[userId] = {
        userId: userId, // Truncate userId for display
        domain: domain,
        page: path,
        connectedAt: connectionTime,
        lastActivity: connectionTime,
        userAgent: userAgent,
      };

      activeDomains[domain].userIds.add(userId);
      activeDomains[domain].users = activeDomains[domain].userIds.size;

      // Update connected clients immediately
      io.emit("userCountUpdate", getActiveStats());
    } else {
      // Just update the path and last activity for existing users
      activeDomains[domain].userDetails[userId].page = path;
      activeDomains[domain].userDetails[userId].lastActivity =
        new Date().toISOString();
    }

    // Pageview tracking
    socket.on("pageview", (data) => {
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
        activeDomains[domain].userDetails[userId].lastActivity =
          new Date().toISOString();
      }

      // Increment new page count
      activeDomains[domain].pages[path]++;

      // Broadcast updated stats
      io.emit("userCountUpdate", getActiveStats());
    });

    // User leaving
    socket.on("leave", (data) => {
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
      io.emit("userCountUpdate", getActiveStats());
    });
  } catch (error) {
    console.error("Error handling socket connection:", error);
    socket.emit("license_error", {
      message: "Invalid license for this domain",
    });
  }
});

// Endpoint API untuk mendapatkan jumlah user aktif
app.get("/api/active-users", (req, res) => {
  const stats = getActiveStats();

  // Create a list of all users from all domains
  const allUsers = [];
  Object.entries(stats.domains || {}).forEach(([domain, domainData]) => {
    if (domainData.userDetails) {
      Object.values(domainData.userDetails).forEach((user) => {
        allUsers.push(user);
      });
    }
  });

  res.json({
    count: stats.totalUsers,
    domains: stats.domains,
    users: allUsers,
  });
});

// Route untuk admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(publicPath, "admin.html"));
});

// Route untuk halaman utama
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Helper function to save pending message
async function savePendingMessage(userId, message) {
  try {
    await PendingMessage.create({
      userId,
      message,
    });
    return true;
  } catch (error) {
    console.error("Error saving pending message:", error);
    return false;
  }
}

// Helper function to get and mark pending messages as sent
async function getAndMarkPendingMessages(userId) {
  try {
    const pendingMessages = await PendingMessage.findAll({
      where: {
        userId,
        sentAt: null,
      },
    });

    // Mark messages as sent
    const now = new Date();
    await Promise.all(
      pendingMessages.map((msg) => msg.update({ sentAt: now }))
    );

    return pendingMessages;
  } catch (error) {
    console.error("Error getting pending messages:", error);
    return [];
  }
}

app.get("/api/easter-egg", async (req, res) => {
  const message = {
    message: "🎉 Surprise! Telah ditemukan easter egg!",
    animation: true,
    sound: true,
  };

  // Emit to all connected users
  io.emit("surprise", message);

  // Save pending messages for all active users
  const activeUsersArray = Array.from(activeUsers.values());
  const pendingPromises = activeUsersArray.map((user) =>
    savePendingMessage(user.userId, message)
  );

  await Promise.all(pendingPromises);

  res.json({
    success: true,
    message: "Easter egg diaktifkan untuk semua user!",
  });
});

// Port server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  // Easter egg console message yang tersembunyi
  console.log(
    "\n\n🥚 Easter egg tersembunyi: akses /api/easter-egg untuk kejutan!\n\n"
  );
});
