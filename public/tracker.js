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

        // Handle Easter egg event
        socket.on('surprise', (message) => {
            console.log('[Tracker] Received Easter egg message:', message);
            
            // Create surprise container if it doesn't exist
            let surpriseContainer = document.getElementById('tracker-surprise');
            if (!surpriseContainer) {
                surpriseContainer = document.createElement('div');
                surpriseContainer.id = 'tracker-surprise';
                surpriseContainer.style.position = 'fixed';
                surpriseContainer.style.top = '50%';
                surpriseContainer.style.left = '50%';
                surpriseContainer.style.transform = 'translate(-50%, -50%)';
                surpriseContainer.style.zIndex = '9999';
                surpriseContainer.style.textAlign = 'center';
                surpriseContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                surpriseContainer.style.color = '#fff';
                surpriseContainer.style.padding = '20px';
                surpriseContainer.style.borderRadius = '10px';
                surpriseContainer.style.animation = 'surpriseAnimation 0.5s ease-out';
                document.body.appendChild(surpriseContainer);
            }

            // Update and show the message
            surpriseContainer.innerHTML = `
                <h2 style="margin: 0 0 10px 0;">${message.message}</h2>
                ${message.animation ? '<div class="surprise-animation"></div>' : ''}
            `;
            
            // Add animation if specified
            if (message.animation) {
                const animationDiv = document.querySelector('.surprise-animation');
                animationDiv.style.display = 'inline-block';
                animationDiv.style.width = '50px';
                animationDiv.style.height = '50px';
                animationDiv.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path fill=\"#fff\" d=\"M12 2L2 7l1.41 1.41L12 4.83l8.59 8.58L22 7z\"/></svg>")';
                animationDiv.style.backgroundSize = 'contain';
                animationDiv.style.animation = 'surpriseAnimation 1s infinite';
            }

            // Add sound if specified
            if (message.sound) {
                const audio = new Audio('/sounds/surprise.mp3');
                audio.play();
            }

            // Remove the message after 5 seconds
            setTimeout(() => {
                surpriseContainer.remove();
            }, 5000);
        });
    }
})();