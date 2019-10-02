﻿/*! skinny.js v0.1.0 | Copyright 2013 Vistaprint | vistaprint.github.io/SkinnyJS/LICENSE 
http://vistaprint.github.io/SkinnyJS/download-builder.html?modules=jquery.clientRect,jquery.contentSize,jquery.cookies*/

(function ($) {

    // Expose support flag. Aids in unit testing.
    $.support.getBoundingClientRect = "getBoundingClientRect" in document.documentElement;

    // Gets the window containing the specified element.
    function getWindow(elem) {
        return $.isWindow(elem) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }

    // Returns a rect for the first element in the jQuery object.
    $.fn.clientRect = function () {
        var rect = {
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            bottom: 0,
            right: 0
        };

        if (this.length === 0) {
            return rect;
        }

        var elem = this[0];
        var doc = elem.ownerDocument;
        var docElem = doc.documentElement;
        var box;

        // Make sure we're not dealing with a disconnected DOM node
        if (!$.contains(docElem, elem)) {
            return rect;
        }

        // Make modern browsers wicked fast
        if ($.support.getBoundingClientRect) {
            // This is derived from the internals of jQuery.fn.offset
            try {
                box = elem.getBoundingClientRect();
            } catch (e) {
                // OldIE throws an exception when trying to get a client rect for an element
                // that hasn't been rendered, or isn't in the DOM.
                // For consistency, return a 0 rect.
            }

            if (!box) {
                return rect;
            }

            // TODO needs a unit test to verify the returned rect always has the same properties (i.e. bottom, right)
            // If the rect has no area, it needs no further processing
            if (box.right === box.left &&
                box.top === box.bottom) {
                return rect;
            }

            // Handles some quirks in the oldIE box model, including some bizarre behavior around the starting coordinates.
            var win = getWindow(doc);

            rect.top = box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0);
            rect.left = box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0);

            rect.width = box.right - box.left;
            rect.height = box.bottom - box.top;
        } else {
            // Support ancient browsers by falling back to jQuery.outerWidth/Height()
            if (this.css("display") === "none") {
                return rect;
            }

            rect = this.offset();
            rect.width = this.outerWidth();
            rect.height = this.outerHeight();
        }

        rect.bottom = rect.top + rect.height;
        rect.right = rect.left + rect.width;

        return rect;
    };

})(jQuery);
;/// <reference path="jquery.clientRect.js" />

(function ($) {

    var addMargin = function (node, styleProp, rectProp, rect) {
        var margin = parseInt($(node).css(styleProp), 10);
        if (margin) {
            rect[rectProp] += margin;
        }
    };

    // Size gets continuously populated as this recurses through the DOM, building the max size of the page.
    var gatherSize = function (size, node, includeChildrenOnly, includeWidth, includeHeight) {
        var rect;

        // Only look at elements
        if (node.nodeType !== 1) {
            return;
        }

        if (!includeChildrenOnly) {
            try {
                rect = $(node).clientRect();
            } catch (ex) {
                // Couldn't get the size, so let's just return.
                return;
            }

            //if the node is not rendered, don't factor in its size
            if (rect.height === 0 && rect.width === 0) {
                return;
            }

            if (node.tagName === "BODY") {
                addMargin(node, "marginRight", "right", rect);
                addMargin(node, "marginBottom", "bottom", rect);
            }

            if (includeHeight) {
                size.height = Math.max(rect.bottom, size.height);
            }

            if (includeWidth) {
                size.width = Math.max(rect.right, size.width);
            }

            // If the node is a vertical scrolling container, don't look at its children for the purposes of calculating height
            if ($(node).css("overflowX") !== "visible" &&
                ($(node).css("height") !== "auto" || $(node).css("maxHeight") !== "none")) {
                includeHeight = false;
            }

            // If the node is a horizontal scrolling container, don't look at its children for the purposes of calculating width
            if ($(node).css("overflowY") !== "visible" &&
                ($(node).css("width") !== "auto" || $(node).css("maxWidth") !== "none")) {
                includeWidth = false;
            }

            // Optimization- if we don't need to measure any children, stop recursing.
            if (!includeHeight && !includeWidth) {
                return;
            }
        }

        // Recurse
        if (node.tagName !== "OBJECT") {
            var len = node.childNodes.length;
            for (var i = 0; i < len; i++) {
                gatherSize(size, node.childNodes[i], false, includeWidth, includeHeight);
            }
        }
    };

    // Returns the height and width of the total page: the total scrolling size.
    $.fn.contentSize = function (excludeScrollbars) {
        var el = this[0];

        if (!el) {
            throw new Error("Element required");
        }

        // If el is a window or a document, pay attention to excludeScrollbars
        // doc will be null if el is not a window or document
        var doc = el.document || (el.documentElement ? el : (el.tagName === "BODY" ? el.ownerDocument : null));

        //Exclude scrollbars- browsers don't offer any way to ignore the scrollbar
        //when calculating content dimensions, so just hide/restore

        var currentOverflow;
        if (excludeScrollbars && doc) {
            currentOverflow = doc.documentElement.style.overflow;
            doc.documentElement.style.overflow = "hidden";
        }

        var size = {
            width: 0,
            height: 0
        };
        var startingNode = doc ? doc.body : el;
        var includeChildrenOnly = false;

        if (startingNode.tagName === "BODY") {
            includeChildrenOnly = true;
        }

        gatherSize(size, doc ? doc.body : el, includeChildrenOnly, true, true);

        if (excludeScrollbars && doc) {
            doc.documentElement.style.overflow = currentOverflow;
        }

        return size;
    };

})(jQuery);
; (function ($) {

    $.cookies = {};

    // Encodes a cookie text value, making sure to replace %20 with +
    // and + with %2b. This is done because %20 gets lost going to the
    // server.
    // @param {string} sText The text to encode.
    // @return {string} The encoded text.
    var _cookieEncode = function (sText) {
        if (!sText) {
            return "";
        } else {
            sText = sText.toString();
        }

        // first urlencode
        sText = encodeURIComponent(sText);

        // then replace + and space
        sText = sText.replace(/\+/gi, "%2B").replace(/\%20/gi, "+");

        // return the text
        return sText;
    };

    // Decodes a cookie text value, making sure to replace + with %20
    // and %2b with +. This undoes _cookieEncode().
    // @param {string} sText The text to decode.
    // @return {string} The decoded text.
    var _cookieDecode = function (sText) {
        if (!sText) {
            return "";
        } else {
            sText = sText.toString();
        }

        // first replace + and space
        sText = sText.replace(/\+/gi, "%20").replace(/\%2B/gi, "+");

        // now urldecode
        try {
            return decodeURIComponent(sText);
        } catch (ex) {
            // If URI decoding fails, it is probably because another library wrote to a cookie value
            // without URI encoding. Certain types of values can fail (i.e. "%u", which is a malformed unicode escape sequence)
            return sText;
        }

    };

    var _defaultPermanentDate = function () {
        var d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d.toUTCString();
    };

    var _defaults = {
        domain: null,
        path: "/",
        permanentDate: _defaultPermanentDate(),
        watcher: $.noop
    };

    var _settings = _defaults;

    $.cookies.setDefaults = function (settings) {
        _settings = $.extend({}, _defaults, settings);
    };

    var _getDefault = function (key, overrideValue) {
        if (overrideValue) {
            return overrideValue;
        }

        return _settings[key];
    };

    // Runs a test to determine if cookies are enabled on the browser.
    // @return {boolean} True if cookies are enabled, false if not.
    $.cookies.enabled = function () {
        $.cookies.set("cookietest", "value");
        if ($.cookies.get("cookietest") === "value") {
            $.cookies.remove("cookietest");
            return true;
        } else {
            return false;
        }
    };

    // Gets a cookie or sub-cookie value.
    // @param {string} name The name of the cookie
    // @param {string} subCookie Optional. The sub-cookie value to get
    // @return {string} or {object} (if the cookie contains subvalues)
    $.cookies.get = function (name, /* optional */ subCookie) {
        var cookies = new Cookies();
        var cookie = cookies[name];
        if (cookie) {
            if (subCookie) {
                if (cookie.subCookies) {
                    return cookie.subCookies[subCookie] || null;
                }

                return null;
            }

            if (cookie.subCookies) {
                return cookie.subCookies;
            } else {
                return cookie.value || "";
            }
        }

        return null;
    };

    // Sets a cookie value.
    // @param {string} or {object} nameOrData The name of the cookie or an object containing the arguments.
    // @param {string} or {object} value The value to set. Either a single value or an object of key value pairs.
    // @param {string} domain (Optional) The domain in which to store the cookie. Uses the default domain if not specified.
    // @param {Boolean} permanent (Optional) Indicates the cookie should be permanent. False by default.
    // @param {Boolean} clearExistingSubCookies (Optional) If true, all sub-cookoies will be erased before writing new ones. False by default.
    $.cookies.set = function (nameOrData, value, domain, permanent, clearExistingSubCookies) {
        var name = nameOrData;
        var path;

        if (typeof (nameOrData) === "object") {
            name = nameOrData.name;
            value = nameOrData.value;
            domain = nameOrData.domain;
            permanent = nameOrData.permanent;
            path = nameOrData.path;
            clearExistingSubCookies = nameOrData.clearExistingSubCookies || nameOrData.clearExisting;
        }

        // value may be a map of subvalues.
        var subCookies;
        if (typeof (value) === "object" && value !== null) {
            subCookies = value;
            value = null;
        }

        // Check for an existing cookie. If not, create it.
        var cookie = (new Cookies())[name];
        if (!cookie) {
            cookie = new Cookie();
            cookie.name = name;
        }

        cookie.value = value;

        if (subCookies) {
            if (clearExistingSubCookies || !cookie.subCookies) {
                cookie.subCookies = subCookies;
            } else {
                // Subcookies should be merged into the existing ones.
                for (var subCookie in subCookies) {
                    if (subCookies.hasOwnProperty(subCookie)) {
                        cookie.subCookies[subCookie] = subCookies[subCookie];
                    }
                }
            }
        }

        cookie.domain = _getDefault("domain", domain);
        cookie.path = _getDefault("path", path);
        cookie.isPermanent = !!permanent;

        cookie.save();
    };

    // Deletes the cookie with the specified name.
    // @param {string} sName The name of the cookie to delete.
    $.cookies.remove = function (name, domain, path) {
        var cookie = _cookieEncode(name) + "=a; path=" + _getDefault("path", path) + "; expires=Wed, 17 Jan 1979 07:01:00 GMT";

        domain = _getDefault("domain", domain);
        if (domain) {
            cookie += "; domain=" + domain;
        }

        _settings.watcher(cookie);

        document.cookie = cookie;
    };

    // @class Represents a collection of cookies stored in the browser.
    // Exposes the cookies as a dictionary of cookie names and cookie objects.
    var Cookies = function () {
        var me = this;
        var cookie = document.cookie.toString();
        var cookieArray = cookie.split(";");

        var iLen = cookieArray.length;
        for (var i = 0; i < iLen; i++) {
            var oCookie = new Cookie();
            oCookie.parse(cookieArray[i]);
            if (oCookie.name) {
                me[oCookie.name] = oCookie;
            }
        }
    };

    // @class Represents a cookie. Contains a value or a subvalues collection.
    // @constructor
    var Cookie = function () {
        var me = this;

        // The name of the cookie
        this.name = null;

        // A collection of sub-values for the cookie. Null if there is a single value
        this.subCookies = null;


        // The value of the cookie. Null if there is a collection of sub-values
        this.value = null;


        // The domain of the cookie. If null, the default domain is used.
        this.domain = null;

        // The path of the cookie. If null, the default path / is used.
        this.path = null;

        // Indicates the cookie persists on users machines
        this.isPermanent = false;

        var _validateName = function () {
            if (!me.name) {
                throw new Error("Cookie: Cookie name is null.");
            }
        };


        // Gets the cookie as a serialized string
        // @return {String}
        this.serialize = function () {
            _validateName();

            var cookie = _cookieEncode(me.name) + "=" + _getEncodedValue();

            cookie += "; path=" + _getDefault("path", this.path);

            var domain = _getDefault("domain", me.domain);
            if (domain) {
                cookie += "; domain=" + domain;
            }

            if (me.isPermanent) {
                cookie += "; expires=" + _getDefault("permanentDate");
            }

            return cookie;
        };


        // Saves the value of the cookie- commits it to the browser's cookies.
        this.save = function () {
            _validateName();

            var cookie = me.serialize();
            _settings.watcher(cookie);

            document.cookie = cookie;
        };


        // Takes the encoded value of the cookie as it is stored on disk, and populates the object with it.
        // @param {string} sUnparsedValue The encoded cookie data
        this.parse = function (sUnparsedValue) {
            if (!sUnparsedValue) {
                return;
            }

            //trim the raw string off the leading and trailing spaces
            sUnparsedValue = sUnparsedValue.replace(/^\s*(.*?)\s*$/, "$1");

            //The name of the cookie is the value before the first "="
            var iPosEquals = sUnparsedValue.indexOf("=");
            if (iPosEquals <= 0) {
                return;
            }

            me.name = _cookieDecode(sUnparsedValue.substr(0, iPosEquals));

            var sValue = sUnparsedValue.substr(iPosEquals + 1);
            if (sValue.indexOf("=") === -1) {
                me.value = _cookieDecode(sValue);
                return;
            }

            me.subCookies = {};

            var aSubCookies = sValue.split("&");
            var iLen = aSubCookies.length;
            for (var i = 0; i < iLen; i++) {
                var aSubCookie = aSubCookies[i].split("=");
                if (aSubCookie.length !== 2) {
                    me.subCookies = null;
                    return;
                } else {
                    me.subCookies[_cookieDecode(aSubCookie[0])] = _cookieDecode(aSubCookie[1]);
                }
            }
        };


        // Gets the encoded value of the cookie (handles subcookies too).
        var _getEncodedValue = function () {
            if (me.subCookies) {
                var aOut = [];
                for (var sSub in me.subCookies) {
                    aOut.push(_cookieEncode(sSub) + "=" + _cookieEncode(me.subCookies[sSub]));
                }
                return aOut.join("&");
            } else {
                return _cookieEncode(me.value);
            }
        };


    };

})(jQuery);
