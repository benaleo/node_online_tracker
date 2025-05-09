(function() {
    var _0x1a87=["\x68\x6F\x73\x74\x6E\x61\x6D\x65","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x6C\x6F\x63\x61\x6C\x68\x6F\x73\x74","\x68\x74\x74\x70\x3A\x2F\x2F\x6C\x6F\x63\x61\x6C\x68\x6F\x73\x74\x3A\x35\x30\x30\x30","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x74\x72\x61\x63\x6B\x65\x72\x2E\x65\x70\x69\x63\x67\x6F\x6F\x64\x73\x2E\x6D\x79\x2E\x69\x64","\x63\x75\x72\x72\x65\x6E\x74\x53\x63\x72\x69\x70\x74","\x73\x72\x63","\x73\x65\x61\x72\x63\x68\x50\x61\x72\x61\x6D\x73","\x67\x65\x74","\x64\x6F\x6D\x61\x69\x6E","\x68\x6F\x73\x74","\x6C\x69\x73\x65\x6E\x63\x65","\x6E\x6F\x2D\x6C\x69\x63\x65\x6E\x73\x65","\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74","\x73\x63\x72\x69\x70\x74","\x2F\x73\x6F\x63\x6B\x65\x74\x2E\x69\x6F\x2F\x73\x6F\x63\x6B\x65\x74\x2E\x69\x6F\x2E\x6A\x73","\x6F\x6E\x6C\x6F\x61\x64","\x68\x65\x61\x64","\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64","\x70\x61\x74\x68\x6E\x61\x6D\x65","\x72\x65\x66\x65\x72\x72\x65\x72","\x74\x69\x74\x6C\x65","\x75\x73\x65\x72\x41\x67\x65\x6E\x74","\x63\x6F\x6E\x6E\x65\x63\x74","\x6C\x6F\x67","\x5B\x54\x72\x61\x63\x6B\x65\x72\x5D\x20\x43\x6F\x6E\x6E\x65\x63\x74\x65\x64\x20\x74\x6F\x20\x74\x72\x61\x63\x6B\x69\x6E\x67\x20\x73\x65\x72\x76\x65\x72","\x6C\x69\x63\x65\x6E\x73\x65\x5F\x65\x72\x72\x6F\x72","\x65\x72\x72\x6F\x72","\x5B\x54\x72\x61\x63\x6B\x65\x72\x5D\x20\x4C\x69\x63\x65\x6E\x73\x65\x20\x65\x72\x72\x6F\x72\x3A\x20","\x6D\x65\x73\x73\x61\x67\x65","\x64\x69\x73\x63\x6F\x6E\x6E\x65\x63\x74","\x5B\x54\x72\x61\x63\x6B\x65\x72\x5D\x20\x44\x69\x73\x63\x6F\x6E\x6E\x65\x63\x74\x65\x64\x20\x66\x72\x6F\x6D\x20\x74\x72\x61\x63\x6B\x69\x6E\x67\x20\x73\x65\x72\x76\x65\x72","\x70\x61\x67\x65\x76\x69\x65\x77","\x65\x6D\x69\x74","\x74\x6F\x49\x53\x4F\x53\x74\x72\x69\x6E\x67","\x5B\x54\x72\x61\x63\x6B\x65\x72\x5D\x20\x50\x61\x67\x65\x76\x69\x65\x77\x20\x73\x65\x6E\x74\x20\x66\x6F\x72\x20","\x73\x65\x74\x49\x6E\x74\x65\x72\x76\x61\x6C","\x62\x65\x66\x6F\x72\x65\x75\x6E\x6C\x6F\x61\x64","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6C\x65\x61\x76\x65","\x5B\x54\x72\x61\x63\x6B\x65\x72\x5D\x20\x4C\x65\x61\x76\x65\x20\x65\x76\x65\x6E\x74\x20\x73\x65\x6E\x74\x20\x66\x6F\x72\x20"];
    
    // Determine base URL based on environment
    const _0x4e81e9=window[_0x1a87[1]][_0x1a87[0]]===_0x1a87[2]?
        _0x1a87[3]:_0x1a87[4];
    
    // Parse script URL parameters
    const _0x5eaf49=document[_0x1a87[5]];
    const _0x5cb5e3= new URL(_0x5eaf49[_0x1a87[6]]);
    const _0x3b0077=_0x5cb5e3[_0x1a87[7]][_0x1a87[8]](_0x1a87[9])|| window[_0x1a87[1]][_0x1a87[10]];
    const _0x3cfcc2=_0x5cb5e3[_0x1a87[7]][_0x1a87[8]](_0x1a87[11])|| _0x1a87[12];
    
    // Load Socket.IO dynamically
    const _0x24f60b=document[_0x1a87[13]](_0x1a87[14]);
    _0x24f60b[_0x1a87[6]]= `${_0x4e81e9}${_0x1a87[15]}`;
    _0x24f60b[_0x1a87[16]]= _0x1f8c45;
    document[_0x1a87[17]][_0x1a87[18]](_0x24f60b);
    
    function _0x1f8c45(){
        // Connect to socket server
        const _0x27fa31=io(_0x4e81e9,{
            query:{
                domain:_0x3b0077,
                license:_0x3cfcc2,
                path:window[_0x1a87[1]][_0x1a87[19]],
                referrer:document[_0x1a87[20]],
                title:document[_0x1a87[21]],
                userAgent:navigator[_0x1a87[22]]
            }
        });
        
        // Add event handlers
        _0x27fa31["on"](_0x1a87[23],()=>{
            console[_0x1a87[24]](_0x1a87[25]);
        });
        
        _0x27fa31["on"](_0x1a87[26],(_0x3b7a93)=>{
            console[_0x1a87[27]](`${_0x1a87[28]}${_0x3b7a93[_0x1a87[29]]}`);
        });
        
        _0x27fa31["on"](_0x1a87[30],()=>{
            console[_0x1a87[24]](_0x1a87[31]);
        });
        
        // Track page navigation - Core function
        const _0x49d8bc=()=>{
            _0x27fa31[_0x1a87[33]](_0x1a87[32],{
                domain:_0x3b0077,
                license:_0x3cfcc2,
                path:window[_0x1a87[1]][_0x1a87[19]],
                referrer:document[_0x1a87[20]],
                title:document[_0x1a87[21]],
                timestamp: new Date()[_0x1a87[34]]()
            });
            
            console[_0x1a87[24]](`${_0x1a87[35]}${_0x3b0077}${window[_0x1a87[1]][_0x1a87[19]]}`);
        };
        
        // Track initial page load
        _0x49d8bc();
        
        // Track page changes (for SPA) - This is the key part for tracking path changes
        let _0x2c6139=window[_0x1a87[1]][_0x1a87[19]];
        setInterval(()=>{
            if(_0x2c6139!== window[_0x1a87[1]][_0x1a87[19]]){
                _0x2c6139= window[_0x1a87[1]][_0x1a87[19]];
                _0x49d8bc();
            }
        },1000);
        
        // Track when user leaves
        window[_0x1a87[38]](_0x1a87[37],()=>{
            _0x27fa31[_0x1a87[33]](_0x1a87[39],{
                domain:_0x3b0077,
                license:_0x3cfcc2,
                path:window[_0x1a87[1]][_0x1a87[19]]
            });
            
            console[_0x1a87[24]](`${_0x1a87[40]}${_0x3b0077}${window[_0x1a87[1]][_0x1a87[19]]}`);
        });
    }
})();