(function () {
    // Parse script URL parameters
    const scriptTag = document.currentScript;
    const scriptUrl = new URL(scriptTag.src);
    const domain = scriptUrl.searchParams.get('domain') || window.location.host; // .host termasuk port, bukan .hostname
    const license = scriptUrl.searchParams.get('lisence') || 'no-license';

    // Load Socket.IO dynamically
    const socketScript = document.createElement('script');
    socketScript.src = 'https://tracker.epicgoods.my.id/socket.io/socket.io.js';
    socketScript.onload = initializeTracker;
    document.head.appendChild(socketScript);

    function initializeTracker() {
        // Connect to socket server
        const socket = io('https://tracker.epicgoods.my.id', {
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
        });
    }
})();