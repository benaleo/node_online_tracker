// public/tracker.js (versi development)

(function() {
    // Tentukan base URL berdasarkan environment
    const BASE_URL = window.location.hostname === 'localhost' ?
        'http://localhost:5000' : 'https://tracker.epicgoods.my.id';

    // Parse script URL parameters
    const scriptTag = document.currentScript;
    const scriptUrl = new URL(scriptTag.src);
    const domain = scriptUrl.searchParams.get('domain') || window.location.host;
    const license = scriptUrl.searchParams.get('lisence') || 'no-license';

    // Load Socket.IO dynamically
    const socketScript = document.createElement('script');
    socketScript.src = `${BASE_URL}/socket.io/socket.io.js`;
    socketScript.onload = initializeTracker;
    document.head.appendChild(socketScript);

    function initializeTracker() {
        // Connect to socket server
        const socket = io(BASE_URL, {
            query: {
                domain: domain,
                license: license,
                path: window.location.pathname,
                referrer: document.referrer,
                title: document.title,
                userAgent: navigator.userAgent
            }
        });

        // Track page navigation
        const trackPageView = () => {
            socket.emit('pageview', {
                domain: domain,
                license: license,
                path: window.location.pathname,
                referrer: document.referrer,
                title: document.title,
                timestamp: new Date().toISOString()
            });

            console.log(`[Tracker] Pageview sent for ${domain}${window.location.pathname}`);
        };

        // Track initial page load
        trackPageView();

        // Track page changes (for SPA)
        let lastPath = window.location.pathname;
        setInterval(() => {
            if (lastPath !== window.location.pathname) {
                lastPath = window.location.pathname;
                trackPageView();
            }
        }, 1000);

        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            socket.emit('leave', {
                domain: domain,
                license: license,
                path: window.location.pathname
            });
            console.log(`[Tracker] Leave event sent for ${domain}${window.location.pathname}`);
        });

        // Add development logging
        socket.on('connect', () => {
            console.log('[Tracker] Connected to tracking server');
        });

        socket.on('license_error', (data) => {
            console.error(`[Tracker] License error: ${data.message}`);
        });

        socket.on('disconnect', () => {
            console.log('[Tracker] Disconnected from tracking server');
        });
    }
})();