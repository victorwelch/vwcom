; $.myCommonGlobal = {};

; (function ($, window, document, undefined) {
    $.fn.myCommonPlugin = function () {
        /* Set internal "this" */
        var mySelf = this;

        /* Set boolean in jQuery.Support collection          */
        /* 'true' if browser supports getBoundingClientRect" */
        $.support.getBoundingClientRect = "getBoundingClientRect" in document.documentElement;

        /* ********************************************************************************  */
        /* BEGIN Private functions                                                           */
        var getWindow = function (elem) {
            return $.isWindow(elem) ?   //if element is a Window then return elem
                elem :                      // else
                elem.nodeType === 9 ?       //if element node Type == 9 (a document root node) then
                    elem.defaultView || elem.parentWindow :  // return whichever is not null -- that is, parentWindow is for ie
                    false;                                      // else, return false
        };
        var myClientRect = function () {
            var mySelector = (arguments.length > 0) ? arguments[0] : mySelf;
            var rect = {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                bottom: 0,
                right: 0
            };
            if (mySelector.length === 0) {
                return rect;
            }

            var elem = mySelector[0];
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
                if (mySelector.css("display") === "none") {
                    return rect;
                }

                rect = mySelector.offset();
                rect.width = mySelector.outerWidth();
                rect.height = mySelector.outerHeight();
            }

            rect.bottom = rect.top + rect.height;
            rect.right = rect.left + rect.width;

            return rect;
        };
        var mySetColHeight = function (_pEl) {
            let myColHeightAdj = _pEl.heightAdj + 'px';
            let myColHeightFullList = _pEl.heightFull + 'px';
            myColHeightFullList += ',' + myColHeightFullList + ',' + myColHeightFullList;
            $(_pEl.spacerDivId).css('height', myColHeightAdj).show();
            $(_pEl.spacerImgId).css('height', myColHeightAdj).show();
            $(_pEl.spacerImgId).closest('body');
            $(_pEl.divWrapId).css('height,min-height,max-height', myColHeightFullList);
            $(_pEl.divWrapId).closest('.myRow');
            $(_pEl.divWrapId).closest('body');
        };
        var myAdjCols = function () {
            let myFooterTop = myClientRect($($.myCommonGlobal.myFooterId)).top;
            let myListLength = $.myCommonGlobal.myColIdListLength;
            let myWrapRect = {};
            for (i = 0; i < myListLength; i++) {
                myWrapRect = myClientRect($($.myCommonGlobal.myColIdList[i].divWrapId));
                $.myCommonGlobal.myColIdList[i].heightAdj = (myFooterTop - myWrapRect.bottom);
                $.myCommonGlobal.myColIdList[i].heightFull = (myFooterTop - myWrapRect.top);
                mySetColHeight(
                    $.myCommonGlobal.myColIdList[i]
                );
            }
            $($.myCommonGlobal.myFooterId).css('bottom', '0px');
            $($.myCommonGlobal.myFooterId).closest('body');
            myFooterTop = myClientRect($($.myCommonGlobal.myFooterId)).top;
            let myColMaxBot = myClientRect($($.myCommonGlobal.myRowId)).bottom;
            let myNegAdj = (myFooterTop - myColMaxBot);
            if (myNegAdj < 0) {
                for (j = 0; j < myListLength; j++) {
                    $.myCommonGlobal.myColIdList[j].heightAdj += myNegAdj;
                    $.myCommonGlobal.myColIdList[j].heightFull += myNegAdj;
                    mySetColHeight(
                        $.myCommonGlobal.myColIdList[j]
                    );
                }
            }
            $($.myCommonGlobal.myFooterId).css('bottom', '0px');
            $($.myCommonGlobal.myFooterId).closest('body');
        };
        var myFooterCommon = function () {
            $($.myCommonGlobal.myRowId).show().find('*:not([notshow])').show();
            $($.myCommonGlobal.myRowId).closest('body');
            $($.myCommonGlobal.myFooterId).css('bottom', '0px');
            $($.myCommonGlobal.myFooterId).closest('body');
            var isSideBySide = myIsSideBySide();
            if (isSideBySide) {
                myAdjCols();
            }
            //
            $($.myCommonGlobal.myFooterId).css('bottom', '0px');
            $($.myCommonGlobal.myFooterId).closest('body');
            var myColMaxBot = myClientRect($($.myCommonGlobal.myRowId)).bottom;
            var myFooterRect = myClientRect($($.myCommonGlobal.myFooterId));
            var myFooterTop = myFooterRect.top;
            if (myColMaxBot > myFooterTop) {
                let myAdj = myColMaxBot - myFooterTop;
                let myBodyHeight = myClientRect($('body').first()).height;//***//
                let myAdjBodyHeight = (myBodyHeight + myAdj) + 'px';
                $('body').css('height', myAdjBodyHeight);
                $('body').css('min-height', myAdjBodyHeight);
                $('body').closest('html');
                $($.myCommonGlobal.myFooterId).css('bottom', '0px');
                $($.myCommonGlobal.myFooterId).closest('body');
                if (isSideBySide) {
                    myAdjCols();
                }
            } else {
                let myBodyHeight = myClientRect($('body').first()).height;
                let myTargetBodyHeight = myColMaxBot + myClientRect($($.myCommonGlobal.myFooterId)).height;
                if (myBodyHeight > myTargetBodyHeight) {
                    let myAdjBodyHeight = myTargetBodyHeight + 'px';
                    $('body').css('height', myAdjBodyHeight);
                    $('body').css('min-height', myAdjBodyHeight);
                }
            }
        };
        var myIsSideBySide = function () {
            var myRtn = true;
            let last = $.myCommonGlobal.myColIdListLength - 1;
            if (last > 0) {
                let zeroLeft = myClientRect($($.myCommonGlobal.myColIdList[0].Id)).left;
                let lastLeft = myClientRect($($.myCommonGlobal.myColIdList[last].Id)).left;
                if ((lastLeft - zeroLeft) < 1) {
                    myRtn = false;
                }
            }
            return myRtn;
        };
        var myDoFooterSet = function () {
            $('body').closest('html');
            $.myCommonGlobal.oldIsSideBySide = myIsSideBySide();
            myFooterCommon();
        };
        var myDoFooterResize = function () {
            $('body').closest('html');
            var isColModeSwitch = false;
            var isSideBySide = myIsSideBySide();
            if (($.myCommonGlobal.oldIsSideBySide === false) && (isSideBySide === true)) {
                isColModeSwitch = true;
            }
            $.myCommonGlobal.oldIsSideBySide = isSideBySide;
            for (i = 0; i < $.myCommonGlobal.myColIdListLength; i++) {
                $($.myCommonGlobal.myColIdList[i].spacerDivId).css('height', '0px').find('*').css('height', '0px');
                $($.myCommonGlobal.myColIdList[i].spacerDivId).children().hide();
                $($.myCommonGlobal.myColIdList[i].spacerDivId).hide();
                $($.myCommonGlobal.myColIdList[i].spacerImgId).closest('body');
            }
            $($.myCommonGlobal.myRowId).find('*').hide();
            $($.myCommonGlobal.myRowId).hide();
            $($.myCommonGlobal.myRowId).closest('body');
            $('body').closest('html');
            if (isColModeSwitch) {
                let viewportHeight = $(window).height();
                $('body').css('height', viewportHeight + 'px');
                $('body').css('min-height', viewportHeight + 'px');
            }
            myFooterCommon();
        };
        /* END Private functions                                                             */
        /* ********************************************************************************  */

        /* ********************************************************************************  */
        /* BEGIN Public functions                                                            */
        var myResult = {
            colInit: function (options) {
                var settings = $.extend({
                    // These are the defaults.
                    footerId: '#footer',
                    rowId: '#myRow',
                    colIdList: [
                        {
                            'Id': '#col1',
                            'divWrapId': '#divCol1Wrap',
                            'spacerDivId': '#spacerdiv1',
                            'spacerImgId': '#spacerimg1'
                        },
                        {
                            'Id': '#col2',
                            'divWrapId': '#divCol2Wrap',
                            'spacerDivId': '#spacerdiv2',
                            'spacerImgId': '#spacerimg2'
                        },
                        {
                            'Id': '#col3',
                            'divWrapId': '#divCol3Wrap',
                            'spacerDivId': '#spacerdiv3',
                            'spacerImgId': '#spacerimg3'
                        }
                    ]
                }, options);
                $.myCommonGlobal.myFooterId = settings.footerId;
                $.myCommonGlobal.myRowId = settings.rowId;
                $.myCommonGlobal.myColIdList = settings.colIdList;
                $.myCommonGlobal.oldIsSideBySide = {};
                $.myCommonGlobal.myColIdListLength = $.myCommonGlobal.myColIdList.length;
            },
            clientRect: function () {
                return myClientRect();
            },
            footerResizer: function () {
                myDoFooterResize();
            },
            footerSetter: function () {
                myDoFooterSet();
            }
        };
        return myResult;
    };
})(jQuery, window, document);
