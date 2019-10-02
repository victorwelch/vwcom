(function ($, window, document, undefined) {
    $.fn.myUtilPlugin = function () {
        var mySelf = this;

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */

        /* ******************************************************************************** */
        /* Browser Detect                                                                   */
        /* ******************************************************************************** */
        var myGeo = new Object();
        var myInitGeoLocation = function () {
            //debugger;
            myGeo.isComplete = false;
            navigator.geolocation.getCurrentPosition(geoLocationQueryHandler);
        };
        var pullCityStateCountryZip = function (geoAddr) {
            //debugger;
            myGeo.isComplete = true;
        };
        var geoLocationQueryHandler = function (posit) {
            //debugger;
            myGeo.lat = posit.coords.latitude;
            myGeo.long = posit.coords.longitude;
            //*** Test Location
            //gMyLat = 47.389136;
            //gMyLong = 8.548121;
            let myUrl = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + myGeo.lat + ',' + myGeo.long + '&sensor=true';
            $.ajaxSetup({ async: true });
            var jqxhr = $.get(
                myUrl,
                '',
                function (data, status, xhr) {
                    myGeo.isSuccess = true;
                    pullCityStateCountryZip(data);
                },
                'json'
            )
                .fail(function (data, status, xhr) {
                    myGeo.isSuccess = false;
                    myGeo.isComplete = true;
                    //alert("Error retrieiving data!");
                })
                ;

        };
        var browserDetect = function (ua) {
            var t = true;

            function getFirstMatch(regex) {
                var match = ua.match(regex);
                return (match && match.length > 1 && match[1]) || '';
            }

            function getSecondMatch(regex) {
                var match = ua.match(regex);
                return (match && match.length > 1 && match[2]) || '';
            }

            var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
                , likeAndroid = /like android/i.test(ua)
                , android = !likeAndroid && /android/i.test(ua)
                , nexusMobile = /nexus\s*[0-6]\s*/i.test(ua)
                , nexusTablet = !nexusMobile && /nexus\s*[0-9]+/i.test(ua)
                , chromeos = /CrOS/.test(ua)
                , silk = /silk/i.test(ua)
                , sailfish = /sailfish/i.test(ua)
                , tizen = /tizen/i.test(ua)
                , webos = /(web|hpw)os/i.test(ua)
                , windowsphone = /windows phone/i.test(ua)
                , samsungBrowser = /SamsungBrowser/i.test(ua)
                , windows = !windowsphone && /windows/i.test(ua)
                , mac = !iosdevice && !silk && /macintosh/i.test(ua)
                , linux = !android && !sailfish && !tizen && !webos && /linux/i.test(ua)
                , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
                , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
                , tablet = /tablet/i.test(ua)
                , mobile = !tablet && /[^-]mobi/i.test(ua)
                , xbox = /xbox/i.test(ua)
                , result;

            if (/opera/i.test(ua)) {
                //  an old Opera
                result = {
                    name: 'Opera'
                    , opera: t
                    , version: versionIdentifier || getFirstMatch(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
                };
            } else if (/opr|opios/i.test(ua)) {
                // a new Opera
                result = {
                    name: 'Opera'
                    , opera: t
                    , version: getFirstMatch(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || versionIdentifier
                };
            }
            else if (/SamsungBrowser/i.test(ua)) {
                result = {
                    name: 'Samsung Internet for Android'
                    , samsungBrowser: t
                    , version: versionIdentifier || getFirstMatch(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
                };
            }
            else if (/coast/i.test(ua)) {
                result = {
                    name: 'Opera Coast'
                    , coast: t
                    , version: versionIdentifier || getFirstMatch(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
                };
            }
            else if (/yabrowser/i.test(ua)) {
                result = {
                    name: 'Yandex Browser'
                    , yandexbrowser: t
                    , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
                };
            }
            else if (/ucbrowser/i.test(ua)) {
                result = {
                    name: 'UC Browser'
                    , ucbrowser: t
                    , version: getFirstMatch(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
                };
            }
            else if (/mxios/i.test(ua)) {
                result = {
                    name: 'Maxthon'
                    , maxthon: t
                    , version: getFirstMatch(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
                };
            }
            else if (/epiphany/i.test(ua)) {
                result = {
                    name: 'Epiphany'
                    , epiphany: t
                    , version: getFirstMatch(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
                };
            }
            else if (/puffin/i.test(ua)) {
                result = {
                    name: 'Puffin'
                    , puffin: t
                    , version: getFirstMatch(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
                };
            }
            else if (/sleipnir/i.test(ua)) {
                result = {
                    name: 'Sleipnir'
                    , sleipnir: t
                    , version: getFirstMatch(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
                };
            }
            else if (/k-meleon/i.test(ua)) {
                result = {
                    name: 'K-Meleon'
                    , kMeleon: t
                    , version: getFirstMatch(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
                };
            }
            else if (windowsphone) {
                result = {
                    name: 'Windows Phone'
                    , windowsphone: t
                };
                if (edgeVersion) {
                    result.msedge = t;
                    result.version = edgeVersion;
                }
                else {
                    result.msie = t;
                    result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i);
                }
            }
            else if (/msie|trident/i.test(ua)) {
                result = {
                    name: 'Internet Explorer'
                    , msie: t
                    , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
                };
            } else if (chromeos) {
                result = {
                    name: 'Chrome'
                    , chromeos: t
                    , chromeBook: t
                    , chrome: t
                    , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
                };
            } else if (/chrome.+? edge/i.test(ua)) {
                result = {
                    name: 'Microsoft Edge'
                    , msedge: t
                    , version: edgeVersion
                };
            }
            else if (/vivaldi/i.test(ua)) {
                result = {
                    name: 'Vivaldi'
                    , vivaldi: t
                    , version: getFirstMatch(/vivaldi\/(\d+(\.\d+)?)/i) || versionIdentifier
                };
            }
            else if (sailfish) {
                result = {
                    name: 'Sailfish'
                    , sailfish: t
                    , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
                };
            }
            else if (/seamonkey\//i.test(ua)) {
                result = {
                    name: 'SeaMonkey'
                    , seamonkey: t
                    , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
                };
            }
            else if (/firefox|iceweasel|fxios/i.test(ua)) {
                result = {
                    name: 'Firefox'
                    , firefox: t
                    , version: getFirstMatch(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
                };
                if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
                    result.firefoxos = t;
                }
            }
            else if (silk) {
                result = {
                    name: 'Amazon Silk'
                    , silk: t
                    , version: getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
                };
            }
            else if (/phantom/i.test(ua)) {
                result = {
                    name: 'PhantomJS'
                    , phantom: t
                    , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
                };
            }
            else if (/slimerjs/i.test(ua)) {
                result = {
                    name: 'SlimerJS'
                    , slimer: t
                    , version: getFirstMatch(/slimerjs\/(\d+(\.\d+)?)/i)
                };
            }
            else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
                result = {
                    name: 'BlackBerry'
                    , blackberry: t
                    , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
                };
            }
            else if (webos) {
                result = {
                    name: 'WebOS'
                    , webos: t
                    , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
                };
                /touchpad\//i.test(ua) && (result.touchpad = t);
            }
            else if (/bada/i.test(ua)) {
                result = {
                    name: 'Bada'
                    , bada: t
                    , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
                };
            }
            else if (tizen) {
                result = {
                    name: 'Tizen'
                    , tizen: t
                    , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
                };
            }
            else if (/qupzilla/i.test(ua)) {
                result = {
                    name: 'QupZilla'
                    , qupzilla: t
                    , version: getFirstMatch(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || versionIdentifier
                };
            }
            else if (/chromium/i.test(ua)) {
                result = {
                    name: 'Chromium'
                    , chromium: t
                    , version: getFirstMatch(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || versionIdentifier
                };
            }
            else if (/chrome|crios|crmo/i.test(ua)) {
                result = {
                    name: 'Chrome'
                    , chrome: t
                    , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
                };
            }
            else if (android) {
                result = {
                    name: 'Android'
                    , version: versionIdentifier
                };
            }
            else if (/safari|applewebkit/i.test(ua)) {
                result = {
                    name: 'Safari'
                    , safari: t
                };
                if (versionIdentifier) {
                    result.version = versionIdentifier;
                }
            }
            else if (iosdevice) {
                result = {
                    name: iosdevice === 'iphone' ? 'iPhone' : iosdevice === 'ipad' ? 'iPad' : 'iPod'
                };
                // WTF: version is not part of user agent in web apps
                if (versionIdentifier) {
                    result.version = versionIdentifier;
                }
            }
            else if (/googlebot/i.test(ua)) {
                result = {
                    name: 'Googlebot'
                    , googlebot: t
                    , version: getFirstMatch(/googlebot\/(\d+(\.\d+))/i) || versionIdentifier
                };
            }
            else {
                result = {
                    name: getFirstMatch(/^(.*)\/(.*) /),
                    version: getSecondMatch(/^(.*)\/(.*) /)
                };
            }

            // set webkit or gecko flag for browsers based on these engines
            if (!result.msedge && /(apple)?webkit/i.test(ua)) {
                if (/(apple)?webkit\/537\.36/i.test(ua)) {
                    result.name = result.name || "Blink";
                    result.blink = t;
                } else {
                    result.name = result.name || "Webkit";
                    result.webkit = t;
                }
                if (!result.version && versionIdentifier) {
                    result.version = versionIdentifier;
                }
            } else if (!result.opera && /gecko\//i.test(ua)) {
                result.name = result.name || "Gecko";
                result.gecko = t;
                result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i);
            }

            // set OS flags for platforms that have multiple browsers
            if (!result.windowsphone && !result.msedge && (android || result.silk)) {
                result.android = t;
            } else if (!result.windowsphone && !result.msedge && iosdevice) {
                result[iosdevice] = t;
                result.ios = t;
            } else if (mac) {
                result.mac = t;
            } else if (xbox) {
                result.xbox = t;
            } else if (windows) {
                result.windows = t;
            } else if (linux) {
                result.linux = t;
            }

            function getWindowsVersion(s) {
                switch (s) {
                    case 'NT': return 'NT';
                    case 'XP': return 'XP';
                    case 'NT 5.0': return '2000';
                    case 'NT 5.1': return 'XP';
                    case 'NT 5.2': return '2003';
                    case 'NT 6.0': return 'Vista';
                    case 'NT 6.1': return '7';
                    case 'NT 6.2': return '8';
                    case 'NT 6.3': return '8.1';
                    case 'NT 10.0': return '10';
                    default: return undefined;
                }
            }

            // OS version extraction
            var osVersion = '';
            if (result.windows) {
                osVersion = getWindowsVersion(getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i));
            } else if (result.windowsphone) {
                osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
            } else if (result.mac) {
                osVersion = getFirstMatch(/Mac OS X (\d+([_\.\s]\d+)*)/i);
                osVersion = osVersion.replace(/[_\s]/g, '.');
            } else if (iosdevice) {
                osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
                osVersion = osVersion.replace(/[_\s]/g, '.');
            } else if (android) {
                osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
            } else if (result.webos) {
                osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
            } else if (result.blackberry) {
                osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
            } else if (result.bada) {
                osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
            } else if (result.tizen) {
                osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
            }
            if (osVersion) {
                result.osversion = osVersion;
            }

            // device type extraction
            var osMajorVersion = !result.windows && osVersion.split('.')[0];
            if (
                tablet
                || nexusTablet
                || iosdevice === 'ipad'
                || (android && (osMajorVersion === 3 || (osMajorVersion >= 4 && !mobile)))
                || result.silk
            ) {
                result.tablet = t;
            } else if (
                mobile
                || iosdevice === 'iphone'
                || iosdevice === 'ipod'
                || android
                || nexusMobile
                || result.blackberry
                || result.webos
                || result.bada
            ) {
                result.mobile = t;
            }

            // Graded Browser Support
            // http://developer.yahoo.com/yui/articles/gbs
            if (result.msedge ||
                (result.msie && result.version >= 10) ||
                (result.yandexbrowser && result.version >= 15) ||
                (result.vivaldi && result.version >= 1.0) ||
                (result.chrome && result.version >= 20) ||
                (result.samsungBrowser && result.version >= 4) ||
                (result.firefox && result.version >= 20.0) ||
                (result.safari && result.version >= 6) ||
                (result.opera && result.version >= 10.0) ||
                (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
                (result.blackberry && result.version >= 10.1)
                || (result.chromium && result.version >= 20)
            ) {
                result.a = t;
            }
            else if ((result.msie && result.version < 10) ||
                (result.chrome && result.version < 20) ||
                (result.firefox && result.version < 20.0) ||
                (result.safari && result.version < 6) ||
                (result.opera && result.version < 10.0) ||
                (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
                || (result.chromium && result.version < 20)
            ) {
                result.c = t;
            } else result.x = t;

            result.mobile =
                /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(ua) ||
                /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));

            return result;
        };

        /* ******************************************************************************** */
        /* Client Sniffer                                                                   */
        /* ******************************************************************************** */
        var clientSniffer = function (ua) {
            var mySniff = {
                browser: {
                    fullName: '',
                    name: '',
                    version: '',
                    majorVersion: null,
                    minorVersion: null,
                    patchVersion: null,
                    engine: ''
                },
                os: {
                    fullName: '',
                    name: '',
                    version: '',
                    versionName: '',
                    versionAltNames: [],
                    majorVersion: null,
                    minorVersion: null,
                    patchVersion: null
                },
                features: {
                    bw: false,
                    mobile: false,
                    tv: false,
                    proxy: false
                }
            },
                data = {
                    browser: [
                        // Sailfish
                        {
                            test: ['SailfishBrowser'],
                            browser: {
                                fullName: 'Sailfish Browser',
                                name: 'sailfishbrowser',
                                engine: 'gecko',
                                $version: {
                                    search: 'SailfishBrowser/'
                                }
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Edge
                        {
                            test: ['Edge/'],
                            browser: {
                                fullName: 'Edge',
                                name: 'edge',
                                engine: 'edgehtml',
                                $version: {
                                    search: 'Edge/'
                                }
                            }
                        },
                        // IE
                        {
                            test: ['MSIE'],
                            browser: {
                                fullName: 'Internet Explorer',
                                name: 'ie',
                                engine: 'trident',
                                $version: {
                                    search: 'MSIE '
                                }
                            }
                        },
                        // IE 11+
                        {
                            test: ['Trident'],
                            browser: {
                                fullName: 'Internet Explorer',
                                name: 'ie',
                                engine: 'trident',
                                $version: {
                                    search: 'rv:'
                                }
                            }
                        },
                        // Opera 15+
                        {
                            test: ['OPR/'],
                            browser: {
                                fullName: 'Opera',
                                name: 'opera',
                                engine: 'webkit',
                                $version: {
                                    search: 'OPR/'
                                }
                            }
                        },
                        // Chrome
                        {
                            test: ['Chrome'],
                            browser: {
                                fullName: 'Chrome',
                                name: 'chrome',
                                engine: 'webkit',
                                $version: {
                                    search: 'Chrome/'
                                }
                            }
                        },
                        // Firefox
                        {
                            test: ['Firefox'],
                            browser: {
                                fullName: 'Firefox',
                                name: 'firefox',
                                engine: 'gecko',
                                $version: {
                                    search: 'Firefox/'
                                }
                            }
                        },
                        // Nokia Browser (not Nokia Xpress)
                        {
                            test: ['NokiaBrowser'],
                            browser: {
                                fullName: 'Nokia Browser',
                                name: 'nokiabrowser',
                                engine: 'webkit',
                                $version: {
                                    search: 'NokiaBrowser/'
                                }
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Opera Mini Presto
                        {
                            test: ['Opera Mini', 'Presto'],
                            browser: {
                                fullName: 'Opera Mini',
                                name: 'operamini',
                                engine: 'presto',
                                $version: {
                                    search: 'Version/'
                                }
                            },
                            features: {
                                mobile: true,
                                proxy: true
                            }
                        },
                        // Opera Mini Webkit - future proof
                        {
                            test: ['Opera Mini', 'WebKit'],
                            browser: {
                                fullName: 'Opera Mini',
                                name: 'operamini',
                                engine: 'webkit'
                            },
                            features: {
                                mobile: true,
                                proxy: true
                            }
                        },
                        // Opera
                        {
                            test: ['Opera'],
                            browser: {
                                fullName: 'Opera',
                                name: 'opera',
                                engine: 'presto',
                                $version: {
                                    search: 'Version/'
                                }
                            }
                        },
                        // Ovi Browser = Nokia Xpress
                        {
                            test: ['OviBrowser'],
                            browser: {
                                fullName: 'Ovi Browser',
                                name: 'ovi',
                                engine: 'gecko',
                                $version: {
                                    search: 'OviBrowser/'
                                }
                            },
                            features: {
                                mobile: true,
                                proxy: true
                            }
                        },
                        // iOS Chrome
                        {
                            test: ['CriOS/'],
                            browser: {
                                fullName: 'Chrome',
                                name: 'chrome',
                                engine: 'webkit',
                                $version: {
                                    search: 'CriOS/'
                                }
                            }
                        },
                        // Opera Coast
                        {
                            test: ['Coast/'],
                            browser: {
                                fullName: 'Opera Coast',
                                name: 'coast',
                                engine: 'webkit',
                                $version: {
                                    search: 'Coast/'
                                }
                            }
                        },
                        // Safari
                        {
                            test: ['Safari', 'Version/', /(iPhone|iPod|iPad|Macintosh|Windows)/],
                            browser: {
                                fullName: 'Safari',
                                name: 'safari',
                                engine: 'webkit',
                                $version: {
                                    search: 'Version/'
                                }
                            }
                        },
                        // some other webkit browser
                        {
                            test: ['WebKit'],
                            browser: {
                                engine: 'webkit'
                            }
                        },
                        // some other gecko browser
                        {
                            test: ['Gecko/'],
                            browser: {
                                engine: 'gecko'
                            }
                        }
                    ],
                    os: [
                        // Sailfish
                        {
                            test: ['Sailfish'],
                            os: {
                                fullName: 'Sailfish OS',
                                name: 'sailfish'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Windows Phone
                        {
                            test: ['Windows Phone'],
                            os: {
                                fullName: 'Windows Phone',
                                name: 'winphone',
                                $version: {
                                    search: 'Windows Phone '
                                }
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Windows
                        {
                            test: ['Windows'],
                            os: {
                                fullName: 'Windows',
                                name: 'win',
                                $version: {
                                    search: 'Windows NT ',
                                    names: {
                                        '10.0': '10',
                                        '6.3': '8.1',
                                        '6.2': '8',
                                        '6.1': '7',
                                        '6.0': 'Vista',
                                        '5.2': 'XP',
                                        '5.1': 'XP',
                                        '5.01': '2000',
                                        '5.0': '2000'
                                    },
                                    altNames: {
                                        '5.2': ['Server 2003']
                                    }
                                }
                            }
                        },
                        // Mac OS X
                        {
                            test: ['Macintosh', 'OS X 10'],
                            os: {
                                fullName: 'Mac OS X',
                                name: 'osx',
                                $version: {
                                    search: /OS X /,
                                    names: {
                                        '10.6': 'Snow Leopard',
                                        '10.7': 'Lion',
                                        '10.8': 'Mountain Lion',
                                        '10.9': 'Mavericks',
                                        '10.10': 'Yosemite',
                                        '10.11': 'El Capitan'
                                    }
                                }
                            }
                        },
                        // Ubuntu
                        {
                            test: ['Ubuntu'],
                            os: {
                                fullName: 'Ubuntu',
                                name: 'ubuntu'
                            }
                        },
                        // Fedora
                        {
                            test: ['Fedora'],
                            os: {
                                fullName: 'Fedora',
                                name: 'fedora',
                                $version: {
                                    search: 'Fedora/',
                                    names: {
                                        '20': 'Heisenbug',
                                        '19': 'Schrödinger\'s Cat',
                                        '18': 'Spherical Cow',
                                        '17': 'Beefy Miracle',
                                        '16': 'Verne',
                                        '15': 'Lovelock',
                                        '14': 'Laughlin',
                                        '13': 'Goddard',
                                        '12': 'Constantine',
                                        '11': 'Leonidas',
                                        '10': 'Cambridge',
                                        '9': 'Sulphur',
                                        '8': 'Werewolf',
                                        '7': 'Moonshine'
                                    }
                                }
                            }
                        },
                        // Kindle
                        {
                            test: ['Kindle'],
                            os: {
                                fullName: 'Kindle',
                                name: 'kindle',
                                $version: {
                                    search: 'Kindle/'
                                }
                            },
                            features: {
                                bw: true,
                                mobile: true
                            }
                        },
                        // BlackBerry
                        {
                            test: [/(BlackBerry|BB\d+)/],
                            os: {
                                fullName: 'BlackBerry',
                                name: 'blackberry',
                                $version: {
                                    search: 'Version/'
                                }
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Symbian
                        {
                            test: ['Symbian'],
                            os: {
                                fullName: 'Symbian',
                                name: 'symbian'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Symbian
                        {
                            test: ['Series40'],
                            os: {
                                fullName: 'Symbian',
                                name: 'symbian'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // PS Vita
                        {
                            test: ['PlayStation Vita'],
                            os: {
                                fullName: 'PlayStation Vita',
                                name: 'psvita'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // PlayStation
                        {
                            test: [/playstation/i],
                            os: {
                                fullName: 'PlayStation',
                                name: 'playstation',
                                $version: {
                                    search: /playstation\s/i
                                }
                            },
                            features: {
                                tv: true
                            }
                        },
                        // Nintendo DSi
                        {
                            test: ['Nintendo DSi'],
                            os: {
                                fullName: 'Nintendo DSi',
                                name: 'dsi'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // New Nintendo 3DS
                        {
                            test: ['New Nintendo 3DS'],
                            os: {
                                fullName: 'New Nintendo 3DS',
                                name: 'n3ds'
                            },
                            browser: {
                                engine: 'webkit'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Nintendo 3DS
                        {
                            test: ['Nintendo 3DS'],
                            os: {
                                fullName: 'Nintendo 3DS',
                                name: '3ds'
                            },
                            browser: {
                                engine: 'webkit'
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // Viera smart tv
                        {
                            test: ['Viera'],
                            os: {
                                fullName: 'Viera',
                                name: 'viera'
                            },
                            browser: {
                                engine: 'webkit'
                            },
                            features: {
                                tv: true
                            }
                        },
                        // Sony smart tv
                        {
                            test: ['SonyDTV'],
                            features: {
                                tv: true
                            }
                        },
                        // Android
                        {
                            test: ['Android'],
                            os: {
                                fullName: 'Android',
                                name: 'android',
                                $version: {
                                    search: 'Android '
                                }
                            },
                            features: {
                                mobile: true
                            }
                        },
                        // iOS
                        {
                            test: [/iPhone|iPod|iPad/],
                            os: {
                                fullName: 'iOS',
                                name: 'ios',
                                $version: {
                                    search: 'OS '
                                }
                            },
                            features: {
                                mobile: true
                            }
                        }
                    ],
                    features: [
                        {
                            test: [/mobile/i],
                            features: {
                                mobile: true
                            }
                        },
                        {
                            test: [/smart-{0,1}tv/i],
                            features: {
                                tv: true
                            }
                        }
                    ]
                };

            //return initial sniff state in case no ua string passed
            if (!ua) return mySniff;

            function init() {
                for (var i in data) {
                    test(data[i]);
                }
            }

            function test(obj) {
                for (var i = 0; i < obj.length; i++) {
                    var test = true;

                    for (var j = 0; j < obj[i].test.length; j++) {
                        if (obj[i].test[j] instanceof RegExp) {
                            if (!obj[i].test[j].test(ua)) {
                                test = false;
                                break;
                            }
                        }
                        else {
                            if (ua.indexOf(obj[i].test[j]) === -1) {
                                test = false;
                                break;
                            }
                        }
                    }

                    if (test) {
                        apply(obj[i]);
                        break;
                    }
                }
            }

            function apply(obj) {
                for (var i in data) {
                    if (data.hasOwnProperty(i) && obj[i]) {
                        if (obj[i].$version) {
                            var version = getVersion(obj[i].$version.search);

                            if (version) {
                                var semverArr = version.split('.'),
                                    versionNames = obj[i].$version.names,
                                    versionAltNames = obj[i].$version.altNames;

                                obj[i].version = version;

                                if (semverArr[0]) obj[i].majorVersion = parseInt(semverArr[0]);
                                if (semverArr[1]) obj[i].minorVersion = parseInt(semverArr[1]);
                                if (semverArr[2]) obj[i].patchVersion = parseInt(semverArr[2]);

                                if (versionNames) {
                                    var versionName,
                                        versionNameArr = [];

                                    for (var j = 0; j < semverArr.length; j++) {
                                        versionNameArr.push(semverArr[j]);
                                        versionName = versionNameArr.join('.');
                                        if (versionNames[versionName]) {
                                            obj[i].versionName = versionNames[versionName];
                                        }
                                        if (versionAltNames && versionAltNames[versionName]) {
                                            obj[i].versionAltNames = versionAltNames[versionName];
                                        }
                                    }
                                }
                            }
                        }

                        for (var prop in obj[i]) {
                            if (obj[i].hasOwnProperty(prop) && prop[0] !== '$') mySniff[i][prop] = obj[i][prop];
                        }
                    }
                }
            }

            function getVersion(search) {
                var searchString;

                if (search instanceof RegExp) {
                    searchString = (ua.match(search) || [])[0];

                    if (!searchString) return;
                }
                else {
                    searchString = search;
                }

                var index = ua.indexOf(searchString),
                    substring;

                if (index === -1) return;

                substring = ua.substring(index + searchString.length);
                regexpResult = /^(\d+(\.|_)){0,2}\d+/.exec(substring);

                if (!regexpResult) return;

                return regexpResult[0].replace(/_/g, '.');
            }

            init();

            return mySniff;
        };

        /* ******************************************************************************** */
        /* More client info                                                                 */
        /* ******************************************************************************** */
        var clientInfoUtil = function (ua) {
            var nVer = navigator.appVersion;
            var nAgt = ua;
            var myClientInfo = new Object();

            // screen
            myClientInfo.screenSize = new Object();
            if (window.screen.width) {
                width = (window.screen.width) ? window.screen.width : '';
                height = (window.screen.height) ? window.screen.height : '';
                myClientInfo.screenSize.width = width;
                myClientInfo.screenSize.height = height;
            }
            myClientInfo.window = new Object();
            myClientInfo.document = new Object();
            myClientInfo.window.height = $(window).height();   // returns height of browser viewport
            myClientInfo.document.height = $(document).height(); // returns height of HTML document
            myClientInfo.window.width = $(window).width();   // returns width of browser viewport
            myClientInfo.document.width = $(document).width(); // returns width of HTML document

            // cookie
            myClientInfo.cookieEnabled = (window.navigator.cookieEnabled) ? true : false;

            if (window.navigator.cookieEnabled === undefined && !myClientInfo.cookieEnabled) {
                document.cookie = 'testcookie';
                myClientInfo.cookieEnabled = (document.cookie.indexOf('testcookie') !== -1) ? true : false;
            }

            // system
            myClientInfo.osVersion = new Object;
            myClientInfo.os = new Object;

            var clientStrings = [
                { s: 'Windows 3.11', r: /Win16/ },
                { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
                { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
                { s: 'Windows 98', r: /(Windows 98|Win98)/ },
                { s: 'Windows CE', r: /Windows CE/ },
                { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
                { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
                { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
                { s: 'Windows Vista', r: /Windows NT 6.0/ },
                { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
                { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
                { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
                { s: 'Windows 10', r: /(Windows 10|Windows NT 10)/ },
                { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
                { s: 'Windows ME', r: /Windows ME/ },
                { s: 'Android', r: /Android/ },
                { s: 'Open BSD', r: /OpenBSD/ },
                { s: 'Sun OS', r: /SunOS/ },
                { s: 'Linux', r: /(Linux|X11)/ },
                { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
                { s: 'Mac OS X', r: /Mac OS X/ },
                { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
                { s: 'QNX', r: /QNX/ },
                { s: 'UNIX', r: /UNIX/ },
                { s: 'BeOS', r: /BeOS/ },
                { s: 'OS/2', r: /OS\/2/ },
                { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
            ];
            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    myClientInfo.os = cs.s;
                    break;
                }
            }

            if (/Windows/.test(myClientInfo.os)) {
                myClientInfo.osVersion = /Windows (.*)/.exec(myClientInfo.os)[1];
                myClientInfo.os = 'Windows';
            } else {
                switch (myClientInfo.os) {
                    case 'Mac OS X':
                        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'Android':
                        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'iOS':
                        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                        break;
                }
            }

            // Plugins
            // flash (you'll need to include swfobject)
            /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
            myClientInfo.flashVersion = 'no check';
            if (!(google.swfobject === undefined)) {
                var fv = google.swfobject.getFlashPlayerVersion();
                if (fv.major > 0) {
                    myClientInfo.flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
                }
                else {
                    myClientInfo.flashVersion = 'unknown';
                }
            }
            myClientInfo.plugins = new Array();
            if (window.navigator.plugins.length > 0) {
                for (var i = 0; i < window.navigator.plugins.length; i++) {
                    myClientInfo.plugins.push(navigator.plugins[i].name);
                }
            }

            // platform
            myClientInfo.platform = new Object();
            myClientInfo.platform = navigator.platform;

            return myClientInfo;
        };
        /* ******************************************************************************** */
        /* Feature Detect                                                                   */
        /* ******************************************************************************** */
        var featureCategoryList =
        {
            hashchange: 'HTML5 Feature', history: 'HTML5 Feature', audio: 'HTML5 Feature', webaudio: 'HTML5 Feature', speechrecognition: 'HTML5 Feature', speechsynthesis: 'HTML5 Feature',
            video: 'HTML5 Feature', videoloop: 'HTML5 Feature', videopreload: 'HTML5 Feature', input: 'HTML5 Feature', fileinput: 'HTML5 Feature', formattribute: 'HTML5 Feature',
            capture: 'HTML5 Feature', fileinputdirectory: 'HTML5 Feature', inputformaction: 'HTML5 Feature', inputformenctype: 'HTML5 Feature', inputformmethod: 'HTML5 Feature',
            inputformtarget: 'HTML5 Feature', localizednumber: 'HTML5 Feature', inputsearchevent: 'HTML5 Feature', requestautocomplete: 'HTML5 Feature', inputtypes: 'HTML5 Feature',
            postmessage: 'HTML5 Feature', webworkers: 'HTML5 Feature', blobworkers: 'HTML5 Feature', dataworkers: 'HTML5 Feature', sharedworkers: 'HTML5 Feature', transferables: 'HTML5 Feature',
            classlist: 'HTML5 Feature', createelementattrs: 'HTML5 Feature', dataset: 'HTML5 Feature', documentfragment: 'HTML5 Feature', hidden: 'HTML5 Feature', microdata: 'HTML5 Feature',
            mutationobserver: 'HTML5 Feature', bdi: 'HTML5 Feature', datalistelem: 'HTML5 Feature', details: 'HTML5 Feature', outputelem: 'HTML5 Feature', progressbar: 'HTML5 Feature',
            meter: 'HTML5 Feature', picture: 'HTML5 Feature', ruby: 'HTML5 Feature', time: 'HTML5 Feature', track: 'HTML5 Feature', texttrackapi: 'HTML5 Feature', template: 'HTML5 Feature',
            unknownelements: 'HTML5 Feature', textareamaxlength: 'HTML5 Feature', queryselector: 'HTML5 Feature', matchmedia: 'HTML5 Feature', htmlimports: 'HTML5 Feature',
            webanimations: 'HTML5 Feature', vibrate: 'HTML5 Feature',
            cssall: 'CSS Feature', cssanimations: 'CSS Feature', appearance: 'CSS Feature', backdropfilter: 'CSS Feature', backgroundblendmode: 'CSS Feature', backgroundcliptext: 'CSS Feature',
            bgpositionshorthand: 'CSS Feature', bgpositionxy: 'CSS Feature', bgrepeatround: 'CSS Feature', bgrepeatspace: 'CSS Feature', backgroundsize: 'CSS Feature', bgsizecover: 'CSS Feature',
            borderimage: 'CSS Feature', borderradius: 'CSS Feature', boxshadow: 'CSS Feature', boxsizing: 'CSS Feature', checked: 'CSS Feature', csschunit: 'CSS Feature', csscolumns: 'CSS Feature',
            csscalc: 'CSS Feature', cssvwunit: 'CSS Feature', cubicbezierrange: 'CSS Feature', displayrunin: 'CSS Feature', displaytable: 'CSS Feature', ellipsis: 'CSS Feature', cssescape: 'CSS Feature',
            cssexunit: 'CSS Feature', cssfilters: 'CSS Feature', fontface: 'CSS Feature', flexbox: 'CSS Feature', flexboxlegacy: 'CSS Feature', flexboxtweener: 'CSS Feature', flexwrap: 'CSS Feature',
            generatedcontent: 'CSS Feature', cssgradients: 'CSS Feature', hsla: 'CSS Feature', rgba: 'CSS Feature', cssinvalid: 'CSS Feature', lastchild: 'CSS Feature', cssmask: 'CSS Feature',
            mediaqueries: 'CSS Feature', multiplebgs: 'CSS Feature', nthchild: 'CSS Feature', objectfit: 'CSS Feature', opacity: 'CSS Feature', overflowscrolling: 'CSS Feature',
            csspointerevents: 'CSS Feature', csspositionsticky: 'CSS Feature', cssreflections: 'CSS Feature', regions: 'CSS Feature', cssremunit: 'CSS Feature', cssresize: 'CSS Feature',
            cssscrollbar: 'CSS Feature', scrollsnappoints: 'CSS Feature', shapes: 'CSS Feature', siblinggeneral: 'CSS Feature', subpixelfont: 'CSS Feature', supports: 'CSS Feature',
            target: 'CSS Feature', textalignlast: 'CSS Feature', textshadow: 'CSS Feature', csstransforms: 'CSS Feature', csstransforms3d: 'CSS Feature', preserve3d: 'CSS Feature',
            csstransitions: 'CSS Feature', userselect: 'CSS Feature', cssvalid: 'CSS Feature', cssvhunit: 'CSS Feature', cssvmaxunit: 'CSS Feature', cssvminunit: 'CSS Feature',
            willchange: 'CSS Feature', wrapflow: 'CSS Feature', hairline: 'CSS Feature', csspseudoanimations: 'CSS Feature', csspseudotransitions: 'CSS Feature',
            canvas: 'Graphics Feature', canvastext: 'Graphics Feature', emoji: 'Graphics Feature', todataurljpeg: 'Graphics Feature', todataurlpng: 'Graphics Feature', todataurlwebp: 'Graphics Feature',
            canvasblending: 'Graphics Feature', canvaswinding: 'Graphics Feature', webgl: 'Graphics Feature', webglextensions: 'Graphics Feature', svg: 'Graphics Feature', inlinesvg: 'Graphics Feature',
            svgasimg: 'Graphics Feature', svgclippaths: 'Graphics Feature', smil: 'Graphics Feature', svgforeignobject: 'Graphics Feature', svgfilters: 'Graphics Feature', jpeg2000: 'Graphics Feature',
            jpegxr: 'Graphics Feature', apng: 'Graphics Feature', imgcrossorigin: 'Graphics Feature', sizes: 'Graphics Feature', srcset: 'Graphics Feature', webp: 'Graphics Feature',
            webpalpha: 'Graphics Feature', webpanimation: 'Graphics Feature', webplossless: 'Graphics Feature',
            sessionstorage: 'Storage Feature', localstorage: 'Storage Feature', websqldatabase: 'Storage Feature', indexeddb: 'Storage Feature', indexeddbblob: 'Storage Feature',
            applicationcache: 'Storage Feature',
            strictmode: 'ECMAScript Feature', es5array: 'ECMAScript Feature', es5date: 'ECMAScript Feature', es5function: 'ECMAScript Feature', es5object: 'ECMAScript Feature',
            es5string: 'ECMAScript Feature', es5syntax: 'ECMAScript Feature', es5undefined: 'ECMAScript Feature', es6array: 'ECMAScript Feature', es6collections: 'ECMAScript Feature',
            es6math: 'ECMAScript Feature', es6number: 'ECMAScript Feature', es6object: 'ECMAScript Feature', es6string: 'ECMAScript Feature', generators: 'ECMAScript Feature',
            contains: 'ECMAScript Feature', promises: 'ECMAScript Feature', websockets: 'Network Feature',
            websocketsbinary: 'Network Feature', peerconnection: 'Network Feature', datachannel: 'Network Feature', getusermedia: 'Network Feature', xhr2: 'Network Feature',
            xhrresponsetype: 'Network Feature', xhrresponsetypearraybuffer: 'Network Feature', xhrresponsetypeblob: 'Network Feature', xhrresponsetypedocument: 'Network Feature',
            xhrresponsetypejson: 'Network Feature', xhrresponsetypetext: 'Network Feature', lowbandwidth: 'Network Feature', eventsource: 'Network Feature', fetch: 'Network Feature',
            beacon: 'Network Feature', serviceworker: 'Network Feature', xdomainrequest: 'Network Feature',
            geolocation: 'Miscellaneous', touchevents: 'Miscellaneous', forcetouch: 'Miscellaneous', adownload: 'Miscellaneous', batteryapi: 'Miscellaneous', lowbattery: 'Miscellaneous',
            blobconstructor: 'Miscellaneous', contenteditable: 'Miscellaneous', contextmenu: 'Miscellaneous', cookies: 'Miscellaneous', cors: 'Miscellaneous', customprotocolhandler: 'Miscellaneous',
            typedarrays: 'Miscellaneous', dataview: 'Miscellaneous', eventlistener: 'Miscellaneous', devicemotion: 'Miscellaneous', deviceorientation: 'Miscellaneous',
            customevent: 'Miscellaneous', oninput: 'Miscellaneous', exiforientation: 'Miscellaneous', filereader: 'Miscellaneous', filesystem: 'Miscellaneous', fullscreen: 'Miscellaneous',
            gamepads: 'Miscellaneous', ie8compat: 'Miscellaneous', sandbox: 'Miscellaneous', seamless: 'Miscellaneous', srcdoc: 'Miscellaneous', json: 'Miscellaneous', olreversed: 'Miscellaneous',
            mathml: 'Miscellaneous', notification: 'Miscellaneous', performance: 'Miscellaneous', pointerlock: 'Miscellaneous', quotamanagement: 'Miscellaneous',
            requestanimationframe: 'Miscellaneous', scriptasync: 'Miscellaneous', scriptdefer: 'Miscellaneous', stylescoped: 'Miscellaneous', unicode: 'Miscellaneous',
            unicoderange: 'Miscellaneous', datauri: 'Miscellaneous', bloburls: 'Miscellaneous', urlparser: 'Miscellaneous', userdata: 'Miscellaneous', webintents: 'Miscellaneous',
            framed: 'Miscellaneous', ambientlight: 'Miscellaneous', atobbtoa: 'Miscellaneous', crypto: 'Miscellaneous', getrandomvalues: 'Miscellaneous', dart: 'Miscellaneous',
            hiddenscroll: 'Miscellaneous', intl: 'Miscellaneous', ligatures: 'Miscellaneous', pagevisibility: 'Miscellaneous', proximity: 'Miscellaneous', templatestrings: 'Miscellaneous',
            ml: 'Miscellaneous'
        };

        var featureList = function (myModernizr) {
            var myTestObj = new Array();
            var myCategory = new String();
            $.each(myModernizr, function (key, value) {
                var myItemObj;
                myCategory = (featureCategoryList[key] === undefined) ? 'New' : featureCategoryList[key];
                if (typeof value === 'boolean') {
                    myItemObj = new Object();
                    myItemObj.category = myCategory;
                    myItemObj.Id = key.valueOf();
                    myItemObj.value = value.valueOf().toString();
                    myTestObj.push(myItemObj);
                } else if (typeof value === 'object') {
                    let nameId = key.valueOf() + '.';
                    if (typeof value.valueOf() === 'boolean') {
                        myItemObj = new Object();
                        myItemObj.category = myCategory;
                        myItemObj.Id = key.valueOf();
                        myItemObj.value = value.valueOf().toString();
                        myTestObj.push(myItemObj);
                    }
                    //for (var p in value) {
                    //	if (value.hasOwnProperty(p)) {
                    //		alert(p+', '+value[p].valueOf());
                    //	}
                    //}					
                    $.each(value, function (subKey, subValue) {
                        var mySubItemObj = new Object();
                        mySubItemObj.category = myCategory;
                        mySubItemObj.Id = nameId + subKey.valueOf();
                        mySubItemObj.value = subValue.valueOf().toString();
                        myTestObj.push(mySubItemObj);
                    });
                }
            });
            return myTestObj;
        };
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* END Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Public functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */

        var myResult = {
            /* ******************************************************************************** */
            /* Get Client Info                                                                  */
            /* ******************************************************************************** */
            clientDetectAll: function () {
                var myLocalResult = new Object();
                var myClient = new Object();
                var myUserAgent = navigator.userAgent || navigator.vendor || window.opera;

                //isMsie
                myClient.isMsie = (/msie|trident/i.test(myUserAgent));

                // browser
                // myClient.browser = new Object();
                myClient.browser = new browserDetect(myUserAgent);

                // client (same thing as browser, just getting all info)
                //myClient.client = new Object();
                myClient.client = new clientSniffer(myUserAgent);

                // more info
                //myClient.clientInfo = new Object();
                myClient.clientInfo = new clientInfoUtil(myUserAgent);

                //feature detect
                if (!(Modernizr === undefined)) {
                    if (Modernizr.geolocation) {
                        myInitGeoLocation();
                    }
                    myClient.features = new featureList(Modernizr);
                } else {
                    myClient.features = new Array();
                }

                //Return useful properties
                myLocalResult.browserGrade = myClient.browser.a ? 'a' : (myClient.browser.c ? 'c' : (myClient.browser.x ? 'x' : 'undefined'));
                myLocalResult.browserEngine = myClient.client.browser.engine;
                myLocalResult.browserName = myClient.client.browser.fullName;
                myLocalResult.browserVersion = myClient.client.browser.version;
                myLocalResult.isMobileDevice = (myClient.client.features.mobile || myClient.browser.mobile) ? 'true' : 'false';
                myLocalResult.isMobileProxy = myClient.client.features.proxy.toString();
                myLocalResult.isMobileTvDevice = myClient.client.features.tv.toString();
                myLocalResult.OsName = myClient.client.os.fullName;
                myLocalResult.OsMajorVersion = myClient.client.os.majorVersion.toString();
                myLocalResult.OsMinorVersion = myClient.client.os.minorVersion.toString();
                myLocalResult.isCookieEnabled = myClient.clientInfo.cookieEnabled.toString();
                myLocalResult.documentHeight = myClient.clientInfo.document.height.toString();
                myLocalResult.documentWidth = myClient.clientInfo.document.width.toString();
                myLocalResult.flashVersion = myClient.clientInfo.flashVersion;
                myLocalResult.platform = myClient.clientInfo.platform;
                myLocalResult.plugins = myClient.clientInfo.plugins;
                myLocalResult.screenSizeHeight = myClient.clientInfo.screenSize.height.toString();
                myLocalResult.screenSizeWidth = myClient.clientInfo.screenSize.width.toString();
                myLocalResult.windowHeight = myClient.clientInfo.window.height.toString();
                myLocalResult.windowWidth = myClient.clientInfo.window.width.toString();
                myLocalResult.featureList = myClient.features;
                return myLocalResult;
            }

            /* Client's Info                  */
            /* *****************************  */
        };
        return myResult;

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* END Public functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */
    };
})(jQuery, window, document);
