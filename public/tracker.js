// public/tracker.js (versi development)

(function() {
    function _0x91f8() {
        const _0x2d6850 = ['https://tracker.epicgoods.my.id', '1108186bNTDkZ', 'leave', 'host', 'message', 'get', 'onload', 'log', 'license_error', '6660291KMnKUR', '7JCRRMq', 'src', 'title', 'appendChild', 'beforeunload', 'emit', 'addEventListener', 'userAgent', 'pageview', '[Tracker]\x20Pageview\x20sent\x20for\x20', 'pathname', '256975MAtQiA', '9335470WRJffj', '2yHaUDL', '1561242BAjwUC', 'referrer', '1000lpFVnS', '44kvwYTx', '[Tracker]\x20Leave\x20event\x20sent\x20for\x20', '3995994JSnQgr', 'searchParams', 'head', 'createElement', 'location', '71091IbXKxY'];
        _0x91f8 = function() { return _0x2d6850; };
        return _0x91f8();
    }

    function _0x3ba8(_0x484b11, _0x2b12ae) {
        const _0x91f8d4 = _0x91f8();
        return _0x3ba8 = function(_0x3ba880, _0x59740b) {
            _0x3ba880 = _0x3ba880 - 0x13b;
            let _0x5aa610 = _0x91f8d4[_0x3ba880];
            return _0x5aa610;
        }, _0x3ba8(_0x484b11, _0x2b12ae);
    }

    (function(_0x271c72, _0x47cb99) {
        const _0x4e516f = _0x3ba8,
              _0xe4fb26 = _0x271c72();
        while (!![]) {
            try {
                const _0x596429 = parseInt(_0x4e516f(0x159))/0x1*(parseInt(_0x4e516f(0x143))/0x2)+parseInt(_0x4e516f(0x13c))/0x3+parseInt(_0x4e516f(0x15d))/0x4*(parseInt(_0x4e516f(0x157))/0x5)+parseInt(_0x4e516f(0x15a))/0x6*(parseInt(_0x4e516f(0x14c))/0x7)+-parseInt(_0x4e516f(0x15c))/0x8*(parseInt(_0x4e516f(0x141))/0x9)+-parseInt(_0x4e516f(0x158))/0xa+-parseInt(_0x4e516f(0x14b))/0xb;
                if(_0x596429 === _0x47cb99) break;
                else _0xe4fb26['push'](_0xe4fb26['shift']());
            } catch(_0x53920e) {
                _0xe4fb26['push'](_0xe4fb26['shift']());
            }
        }
    })(_0x91f8, 0xb4805);

    (function() {
        const _0x30ccd8 = _0x3ba8,
              _0x1e9880 = window[_0x30ccd8(0x140)]['hostname'] === 'localhost' ? 'http://localhost:5000' : _0x30ccd8(0x142),
              _0x57d72e = document['currentScript'],
              _0x4d5280 = new URL(_0x57d72e[_0x30ccd8(0x14d)]),
              _0x230c30 = _0x4d5280[_0x30ccd8(0x13d)][_0x30ccd8(0x147)]('domain') || window[_0x30ccd8(0x140)][_0x30ccd8(0x145)],
              _0x5126c7 = _0x4d5280[_0x30ccd8(0x13d)][_0x30ccd8(0x147)]('lisence') || 'no-license',
              _0x58f510 = document[_0x30ccd8(0x13f)]('script');
        _0x58f510[_0x30ccd8(0x14d)] = _0x1e9880 + '/socket.io/socket.io.js';
        _0x58f510[_0x30ccd8(0x148)] = _0x2cc35c;
        document[_0x30ccd8(0x13e)][_0x30ccd8(0x14f)](_0x58f510);

        function _0x2cc35c() {
            const _0x380db8 = _0x30ccd8,
                  _0x16f264 = io(_0x1e9880, {'query': {'domain': _0x230c30, 'license': _0x5126c7, 'path': window[_0x380db8(0x140)]['pathname'], 'referrer': document[_0x380db8(0x15b)], 'title': document['title'], 'userAgent': navigator[_0x380db8(0x153)]}});
            _0x16f264['on']('connect', () => {
                const _0x46f3f8 = _0x380db8;
                console[_0x46f3f8(0x149)]('[Tracker]\x20Connected\x20to\x20tracking\x20server');
            });
            _0x16f264['on'](_0x380db8(0x14a), _0x224521 => {
                const _0x32e5cf = _0x380db8;
                console['error']('[Tracker]\x20License\x20error:\x20' + _0x224521[_0x32e5cf(0x146)]);
            });
            _0x16f264['on']('disconnect', () => {
                const _0x3453e8 = _0x380db8;
                console[_0x3453e8(0x149)]('[Tracker]\x20Disconnected\x20from\x20tracking\x20server');
            });
            _0x16f264['on'](_0x380db8(0x151), _0x3626ad => {
                const _0x380db8 = _0x30ccd8;
                _0x16f264[_0x380db8(0x151)](_0x380db8(0x154), {'domain': _0x230c30, 'license': _0x5126c7, 'path': window[_0x380db8(0x140)][_0x380db8(0x156)], 'referrer': document['referrer'], 'title': document[_0x380db8(0x14e)], 'timestamp': new Date()['toISOString']()});
                console[_0x380db8(0x149)]('[Tracker]\x20Pageview\x20sent\x20for\x20' + window[_0x380db8(0x140)][_0x380db8(0x156)]);
            });
            _0x16f264['on'](_0x380db8(0x151), _0x3453e8 => {
                const _0x380db8 = _0x30ccd8;
                _0x16f264[_0x380db8(0x151)](_0x380db8(0x144), {'domain': _0x230c30, 'license': _0x5126c7, 'path': window['location'][_0x380db8(0x156)]});
                console[_0x380db8(0x149)]('[Tracker]\x20Leave\x20event\x20sent\x20for\x20' + window[_0x380db8(0x140)][_0x380db8(0x156)]);
            });
        }
    })();
})();