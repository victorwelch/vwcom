Array.prototype.initIndex = function () {
    this.idx = 0;
    this.idxEnd = this.length;
};
Array.prototype.nullIndex = function () {
    this.idx = null;
    this.idxEnd = null;
};
Array.prototype.loop = function () {
    if (!(this.idx) || !(this.idxEnd)) { this.initIndex(); }
    if (this.idx < this.idxEnd) {
        this.i = this.idx;
        this.idx++; return true;
    } else {
        this.nullIndex(); return false;
    }
};
//
jQuery.fn.initIndex = function () {
    this.idx = 0;
    this.idxEnd = this.length;
};
jQuery.fn.nullIndex = function () {
    this.idx = null;
    this.idxEnd = null;
};
jQuery.fn.loop = function () {
    if (!(this.idx) || !(this.idxEnd)) { this.initIndex(); }
    if (this.idx < this.iEnd) {
        this.i = this.idx;
        this.idx++; return true;
    } else {
        this.nullIndex(); return false;
    }
};
//
jQuery.fn.formEncodedToObj = function () {
    var myRtn = null;
    if (this.is('form')) {
        var tmpList = this.serializeArray();
        var rtnObj = {};
        var idx = 0;
        while (tmpList.loop()) {
            idx = tmpList.i;
            rtnObj[tmpList[idx].name] = tmpList[idx].value;
        }
        myRtn = rtnObj;
    }
    return myRtn;
};
//
var vw$SetGlobal = function (name, value) {
    window[name] = value;
};
var vw$GetGlobal = function (name) {
    return window[name];
};
//
var vw$RectDef = function (top, right, bottom, left, width, height) {
    this.top = (top) ? top : 0;
    this.right = (right) ? right : 0;
    this.bottom = (bottom) ? bottom : 0;
    this.left = (left) ? left : 0;
    this.width = (width) ? width : 0;
    this.height = (height) ? height : 0;
};
//
var vw$CoordDef = function (x, y) {
    this.x = (x) ? x : 0;
    this.y = (y) ? y : 0;
};
//    
var vw$GetBoundingRect = function (myElemArg) {
    var getWindow = function (elem) {
        var myRtn;
        if ($.isWindow(elem)) { //If elem is a window, return elem
            myRtn = elem;
        } else {
            if (elem.nodeType === 9) { // node Type 9 is a document root node
                myRtn = elem.defaultView || elem.parentWindow; //Return whichever is not null
            } else {
                myRtn = false;
            }
        }
        return myRtn;
    };

    var myRtnRect = new vw$RectDef();
    var elem;
    var jSelector;

    if (typeof myElemArg.length != typeof myUndefined) {
        elem = myElemArg[0];
        jSelector = myElemArg;
    } else {
        elem = myElemArg;
        jSelector = $(elem);
    }

    var doc = elem.ownerDocument;
    var docElem = doc.documentElement;
    var box;

    // Make sure we're not dealing with a disconnected DOM node
    if (!$.contains(docElem, elem)) {
        return myRtnRect;
    }

    // Make modern browsers wicked fast
    if (elem.getBoundingClientRect) {
        // This is derived from the internals of jQuery.fn.offset
        try {
            box = elem.getBoundingClientRect();
        } catch (e) {
            // OldIE throws an exception when trying to get a client rect for an element
            // that hasn't been rendered, or isn't in the DOM.
            // For consistency, return a 0 rect.
        }

        if (!box) {
            return myRtnRect;
        }

        // TODO needs a unit test to verify the returned rect always has the same properties (i.e. bottom, right)
        // If the rect has no area, it needs no further processing
        if (box.right === box.left &&
            box.top === box.bottom) {
            return myRtnRect;
        }

        // Handles some quirks in the oldIE box model, including some bizarre behavior around the starting coordinates.
        var win = getWindow(doc);

        myRtnRect.top = box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0);
        myRtnRect.left = box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0);

        myRtnRect.width = box.right - box.left;
        myRtnRect.height = box.bottom - box.top;
    } else {
        // Support ancient browsers by falling back to jQuery.outerWidth/Height()
        var isDisplayNone;
        if (typeof elem.css != typeof myUndefined) {
            isDisplayNone = (elem.css("display") === "none");
        } else {
            isDisplayNone = ($(elem).css("display") === "none");
        }
        if (isDisplayNone) {
            return myRtnRect;
        }

        var myOffset = jSelector.offset();
        myRtnRect.top = myOffset.top;
        myRtnRect.left = myOffset.left;

        myRtnRect.width = jSelector.outerWidth();
        myRtnRect.height = jSelector.outerHeight();
    }

    myRtnRect.bottom = myRtnRect.top + myRtnRect.height;
    myRtnRect.right = myRtnRect.left + myRtnRect.width;

    return myRtnRect;
};
//
var vw$GetPosition = function (myElemArg) {
    var myRect = vw$GetBoundingRect(myElemArg);
    return new vw$CoordDef(myRect.left, myRect.Top);
};
//
var vw$GetMouseCoords = function (ev) {
    var x = {}, y = {};
    if (ev.pageX || ev.pageY) {
        x = ev.pageX;
        y = ev.pageY;
    }
    else {
        x = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
        y = ev.clientY + document.body.scrollTop - document.body.clientTop;
    }
    return new vw$CoordDef(x, y);
};
//
var vw$GetMouseOffset = function (target, ev) {
    ev = ev || window.event;
    var elemRect = vw$GetBoundingRect(target);
    var mousePos = vw$GetMouseCoords(ev);
    var mouseAdj = new vw$CoordDef(
        mousePos.x - elemRect.left,
        mousePos.y - elemRect.top
    );
    return mouseAdj;
};
//
var vw$GetObjOffset = function (target, ev) {
    ev = ev || window.event;
    var elemRect = vw$GetBoundingRect(target);
    var mousePos = vw$GetMouseCoords(ev);
    var mouseAdj = new vw$RectDef(
        (elemRect.top - 1) - mousePos.y,
        (elemRect.right + 1) - mousePos.x,
        (elemRect.bottom + 1) - mousePos.y,
        (elemRect.left - 1) - mousePos.x,
        elemRect.width,
        elemRect.height
    );
    return mouseAdj;
};
//
var vw$IsWithinRect = function (pos, rect) {
    //alert(pos.x+'>='+rect.left+': '+(pos.x>=rect.left)+',\n '+
    //      pos.x+'<='+rect.right+': '+(pos.x<=rect.right)+',\n '+
    //      pos.y+'>='+rect.top+': '+(pos.y>=rect.top)+',\n '+
    //      pos.y+'<='+rect.bottom+': '+(pos.y<=rect.bottom));
    var myRtn = false;
    if (
        (pos.x >= rect.left) &&
        (pos.x <= rect.right) &&
        (pos.y >= rect.top) &&
        (pos.y <= rect.bottom)
    ) {
        myRtn = true;
    }
    return myRtn;
};
//
var vw$TimerFormat = function (value) {
    return hr(value) + ':' + min(value) + ':' + secdotmm(value);
    //
    function secdotmm(value) {
        var tmpValue = (value / 1000) % 60;
        var tmpStr = tmpValue + '';
        var tmpList = tmpStr.split('.');
        var sec = ('00' + tmpList[0]).substr(-2, 2);
        var tmpdotmm = tmpList.length > 1 ? tmpList[1] : '';
        var mm = (tmpdotmm + '000').substr(0, 3);
        return sec + '.' + mm;
    }
    function min(value) {
        var tmpValue = parseInt(((value / 1000) / 60) % 60);
        var tmpStr = tmpValue + '';
        var min = ('00' + tmpStr).substr(-2, 2);
        return min;
    }
    function hr(value) {
        var tmpValue = parseInt(((value / 1000) / 60) / 60);
        var tmpStr = tmpValue + '';
        var hr = tmpStr.length > 1 ? tmpStr : ('00' + tmpStr).substr(-2, 2);
        return hr;
    }
};
//
var vw$TimerFactory = function () {
    var myRtn = null;
    var timerObj = function () {
        this.startDtm = null;
        this.intervalTimer = null;
        this.eventHandler = null;
        this.stopDtm = null;
        this.stopDiffDtm = null;
        this.stopDiffStr = null;
        this.interval = 250;
    };
    timerObj.prototype.start = function () {
        if (this.startDtm == null && this.eventHandler != null) {
            this.startDtm = Date.now();
            this.intervalTimer = setInterval(this.eventHandler, this.interval);
        }
    };
    timerObj.prototype.getTime = function () {
        if (this.startDtm == null) {
            this.startDtm = Date.now();
        }
        var diffDtm = Date.now() - this.startDtm;
        return vw$TimerFormat(diffDtm);
    };
    timerObj.prototype.stop = function () {
        this.stopDtm = Date.now();
        clearInterval(this.intervalTimer);
        this.stopDiffDtm = this.stopDtm - this.startDtm;
        this.stopDiffStr = vw$TimerFormat(this.stopDiffDtm);
    };
    myRtn = new timerObj();
    return myRtn;
};


