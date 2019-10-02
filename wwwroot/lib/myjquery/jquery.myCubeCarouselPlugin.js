; $.myCubeObj = new Object();
; $.myFuncObj = new Object();
;
; (function ($, window, document, undefined) {
    $.fn.myCubeCarouselPlugin = function () {
        /* Set internal "this" */
        var mySelf = this;

        /* Define Image List Object */
        var imgFileListObj = function () {
            this.list = new Array($.myCubeObj.myPicLimit);
            this.listIdx = 0;
            this.addImageToCarousel = function (imgUrl) {
                var myCimg = new Object();
                myCimg.isUpOrDown = '';
                myCimg.bgSrc = imgUrl;
                myCimg.isLoaded = false;
                myCimg.img = new Image();
                myCimg.img.onload = $.myFuncObj.imgOnLoadCallback;
                myCimg.img.id = this.listIdx;
                if (this.isValid(this.listIdx)) {
                    this.list[this.listIdx++] = myCimg;
                }
            };
            this.setImageToCarousel = function (idx, imgUrl) {
                var myCimg = new Object();
                myCimg.isUpOrDown = '';
                myCimg.bgSrc = imgUrl;
                myCimg.isLoaded = false;
                myCimg.img = new Image();
                myCimg.img.onload = $.myFuncObj.imgOnLoadCallback;
                myCimg.img.id = idx;
                this.list[idx] = myCimg;
            };
            this.isValid = function (idx) {
                if ((idx < 0) || (idx > $.myCubeObj.myPicLimit - 1)) {
                    return false;
                }
                return true;
            };
            this.isDefined = function (idx) {
                if ((this.list[idx] === undefined) || (!this.isValid(idx))) {
                    return false;
                }
                return true;
            };
            this.get = function (idx) {
                if (this.isDefined(idx)) {
                    return this.list[idx];
                } else {
                    if (this.isValid(idx)) {
                        this.setImageToCarousel(
                            idx,
                            myUtil.myHelper.mySetUrlPath($.myCubeObj.myImgFileList[idx])
                        );
                        return this.list[idx];
                    } else {
                        return null;
                    }
                }
            };
        };

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        var onClickTabCollapse = function () {
            // Disable Auto
            if ($.myCubeObj.myAuto.isAuto) {
                window.clearInterval($.myCubeObj.myAuto.intervalId);
                $.myCubeObj.myAuto.isTimerSet = false;
                $.myCubeObj.myAuto.intervalId = null;
            }
            //
            $('#' + $.myCubeObj.jumbo1ContainerId).find('div,section').hide();
            $('#' + $.myCubeObj.jumbo1ContainerId).hide();
            $('#' + $.myCubeObj.myJumbo2Id).show().find('div').show();
            $('#' + $.myCubeObj.myJumbo2Id).closest('body');
            $().myCommonPlugin().footerResizer();
        };
        var onClickTabExpand = function () {
            $('#' + $.myCubeObj.myJumbo2Id).find('div').hide();
            $('#' + $.myCubeObj.myJumbo2Id).hide();
            $('#' + $.myCubeObj.jumbo1ContainerId).show().find('div').show();
            $('#' + $.myCubeObj.jumbo1ContainerId).closest('body');
            $('#' + $.myCubeObj.myJumbo1Id).children('section').show();
            $('#' + $.myCubeObj.myJumbo1Id).closest('body');
            // Disable Auto
            window.clearInterval($.myCubeObj.myAuto.intervalId);
            $.myCubeObj.myAuto.isTimerSet = false;
            $.myCubeObj.myAuto.intervalId = null;
            // Enable Auto
            if ($.myCubeObj.myAuto.isAuto && !($.myCubeObj.myAuto.isTimerSet)) {
                if (!$.myCubeObj.myIsMsie) {
                    $.myFuncObj.myRotateUpHandler();
                }
                $.myCubeObj.myAuto.intervalId = setInterval($.myFuncObj.myRotateUpHandler, 3000);
                $.myCubeObj.myAuto.isTimerSet = true;
            }
            //
            $().myCubeCarouselPlugin().figSizer();
            $().myCommonPlugin().footerResizer();
        };
        var imgOnLoadCallback = function () {
            var id = $(this).prop('id');
            // image is now loaded and in cache...
            var i = parseInt(id);
            $.myCubeObj.myImgFileListObj.list[i].isLoaded = true;
            if ($.myCubeObj.myFigLoadCtr > 0) {
                $.myCubeObj.myFigLoadCtr = $.myCubeObj.myFigLoadCtr - 1;
                if (!($.myCubeObj.myFigLoadCtr > 0)) {
                    if ($.myCubeObj.myImgFileListObj.list[i].isUpOrDown === 'up') {
                        $.myFuncObj.myRotateUpComplete();
                    } else {
                        $.myFuncObj.myRotateDownComplete();
                    }
                }
            }
        };
        var myBlock = function () {
            $.myCubeObj.isBlocked = true;
            $.each($.myCubeObj.blockIds, function (idx, strval) {
                $('#' + strval).toggleClass('myNoCursor');
                $('#' + strval).prop("disabled", true);
            });
        };
        var myAllow = function () {
            $.myCubeObj.isBlocked = false;
            $.each($.myCubeObj.blockIds, function (idx, strval) {
                $('#' + strval).toggleClass('myNoCursor');
                $('#' + strval).prop("disabled", false);
            });
        };
        var myRotateUpAutoHandler = function () {
            if ($.myCubeObj.isBlocked) {
                return false;
            }
            $.myFuncObj.myBlock();
            $.myFuncObj.myRotateUpInit();
            setTimeout($.myFuncObj.myAllow, 500);
            return false;
        };
        var myRotateUpHandler = function () {
            if ($.myCubeObj.isBlocked) {
                return false;
            }
            $.myFuncObj.myBlock();
            $.myFuncObj.myRotateUpInit();
            setTimeout($.myFuncObj.myAllow, 2000);
            return false;
        };
        var myRotateDownHandler = function () {
            if ($.myCubeObj.isBlocked) {
                return false;
            }
            $.myFuncObj.myBlock();
            $.myFuncObj.myRotateDownInit();
            setTimeout($.myFuncObj.myAllow, 2000);
            return false;
        };
        var firstRotate = function () {
            $.myCubeObj.myAuto.isFirstTime = false;
            if (!$.myCubeObj.myIsMsie) {
                $.myFuncObj.myRotateUpAutoHandler();
            }
            if ($.myCubeObj.myAuto.isAuto && !($.myCubeObj.myAuto.isTimerSet)) {
                $.myCubeObj.myAuto.intervalId = setInterval($.myFuncObj.myRotateUpAutoHandler, 3000);
                $.myCubeObj.myAuto.isTimerSet = true;
            }
        };
        var autoOnClick = function () {
            $.myFuncObj.myBlock();

            $('#' + $.myCubeObj.btnManual).removeClass($.myCubeObj.btnSetClass).addClass($.myCubeObj.btnClearClass);
            $('#' + $.myCubeObj.btnManual).click($.myFuncObj.manualOnClick);
            $('#' + $.myCubeObj.btnManual).prop("disabled", false);

            $('#' + $.myCubeObj.btnAuto).removeClass($.myCubeObj.btnClearClass).addClass($.myCubeObj.btnSetClass).addClass($.myCubeObj.noCursorClass);
            $('#' + $.myCubeObj.btnAuto).off("click");
            $('#' + $.myCubeObj.btnAuto).prop("disabled", true);

            $('#' + $.myCubeObj.trRotateMode).css("border-bottom", "1px solid black");
            $('#' + $.myCubeObj.trAutoManual).css("border-bottom", "none");
            $('#' + $.myCubeObj.trManual).css("visibility", "hidden");
            $('#' + $.myCubeObj.trManual).css("display", "none");

            $.each($.myCubeObj.tdRotateIds, function (idx, strval) {
                $('#' + strval).css("visibility", "hidden");
            });
            $.each([$.myCubeObj.btnRotateDown, $.myCubeObj.btnRotateUp], function (idx, strval) {
                $('#' + strval).off("click");
                $('#' + strval).prop("disabled", true);
            });
            $.myCubeObj.myAuto.isAuto = true;
            setTimeout($.myFuncObj.firstRotate, 4500);
            $.myFuncObj.myAllow();
            $().myCommonPlugin().footerResizer();
        };
        var manualOnClick = function () {
            $.myFuncObj.myBlock();

            window.clearInterval($.myCubeObj.myAuto.intervalId);
            $.myCubeObj.myAuto.isAuto = false;
            $.myCubeObj.myAuto.isTimerSet = false;
            $.myCubeObj.myAuto.intervalId = null;

            $('#' + $.myCubeObj.btnAuto).removeClass($.myCubeObj.btnSetClass).addClass($.myCubeObj.btnClearClass);
            $('#' + $.myCubeObj.btnAuto).click($.myFuncObj.autoOnClick);
            $('#' + $.myCubeObj.btnAuto).prop("disabled", false);

            $('#' + $.myCubeObj.btnManual).removeClass($.myCubeObj.btnClearClass).addClass($.myCubeObj.btnSetClass).addClass($.myCubeObj.noCursorClass);
            $('#' + $.myCubeObj.btnManual).off("click");
            $('#' + $.myCubeObj.btnManual).prop("disabled", true);

            $('#' + $.myCubeObj.trRotateMode).css("border-bottom", "none");
            $('#' + $.myCubeObj.trAutoManual).css("border-bottom", "1px solid black");
            $('#' + $.myCubeObj.trManual).css("display", "table-row");
            $('#' + $.myCubeObj.trManual).css("visibility", "visible");

            $.each($.myCubeObj.tdRotateIds, function (idx, strval) {
                $('#' + strval).css("visibility", "visible");
            });
            $.each([$.myCubeObj.btnRotateDown, $.myCubeObj.btnRotateUp], function (idx, strval) {
                $('#' + strval).prop("disabled", false);
            });
            $('#' + $.myCubeObj.btnRotateDown).click($.myFuncObj.myRotateDownHandler);
            $('#' + $.myCubeObj.btnRotateUp).click($.myFuncObj.myRotateUpHandler);
            $.myFuncObj.myAllow();
            $().myCommonPlugin().footerResizer();
        };
        var myRotateUpInit = function () {
            // Set 'back' face background image
            var myQuickArray = new Array();
            // Checks everything if already loaded
            for (var i = 0; i < 4; i++) {
                var idx = (($.myCubeObj.myBgFrontCtr + i) % $.myCubeObj.myPicLimit);
                if (!($.myCubeObj.myImgFileListObj.get(idx).isLoaded)) {
                    myQuickArray.push(idx);
                }
            }
            // if something not loaded, go ahead and load
            // ...it will cause a call back re: 'onload' 
            $.myCubeObj.myFigLoadCtr = myQuickArray.length;
            if (myQuickArray.length > 0) {
                for (var j = 0; j < myQuickArray.length; j++) {
                    // indicates we are rotating up
                    $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].isUpOrDown = 'up';
                    // this will load the image and fire the 'onload' event when done...
                    $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].img.src = $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].bgSrc;
                }
            } else {
                $.myFuncObj.myRotateUpComplete();
            }
        };
        var myRotateUpComplete = function () {
            var isDone = false;
            for (var i = 0; i < 4; i++) {
                var idx = (($.myCubeObj.myBgFrontCtr + i) % $.myCubeObj.myPicLimit);
                if (!($.myCubeObj.myImgFileListObj.get(idx).isLoaded)) {
                    setTimeout($.myFuncObj.myRotateUpInit(), 5);
                    isDone = true;
                    break;
                }
            }
            if (isDone) { return; }
            var myBgUpCtr = ($.myCubeObj.myBgFrontCtr + 2) % $.myCubeObj.myPicLimit;
            var myNewBg = $.myCubeObj.myImgFileListObj.get(myBgUpCtr).bgSrc;
            var myFig = $.myCubeObj.myFaceArray[2];
            if ($.myCubeObj.myIsMsie) {
                // ********* ie ONLY *********** //
                $(myFig).css(
                    {
                        'background': 'url(' + myNewBg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center'
                    }
                );
                // Rotate cube
                var frontToTop = $.myCubeObj.myFaceArray[0];
                var bottomToFront = $.myCubeObj.myFaceArray[1];
                var backToBottom = $.myCubeObj.myFaceArray[2];
                var topToBack = $.myCubeObj.myFaceArray[3];
                while ($(frontToTop).hasClass('ieHidden')) { $(frontToTop).removeClass('ieHidden'); }
                while ($(bottomToFront).hasClass('ieHidden')) { $(bottomToFront).removeClass('ieHidden'); }
                if (!($(backToBottom).hasClass('ieHidden'))) { $(backToBottom).addClass('ieHidden'); }
                if (!($(topToBack).hasClass('ieHidden'))) { $(topToBack).addClass('ieHidden'); }
                $(topToBack).removeClass('ieOnTop').addClass('ieOnBack');
                $(backToBottom).removeClass('ieOnBack').addClass('ieOnBottom');
                $(frontToTop).removeClass('ieOnFront').addClass('ieOnTop');
                $(bottomToFront).removeClass('ieOnBottom').addClass('ieOnFront');
                setTimeout(function () {
                    if (!($(frontToTop).hasClass('ieHidden'))) { $(frontToTop).addClass('ieHidden'); }
                }, 2010);
            } else {
                // ********* NOT ie *********** //
                $(myFig).css(
                    {
                        'background': 'url(' + myNewBg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center'
                    }
                );
                // Rotate cube
                $.myCubeObj.myQtrRotate = ($.myCubeObj.myQtrRotate + 90);
                $($.myCubeObj.myCubeId).css("-webkit-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("-moz-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("-o-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");

            }
            // Transform id of faces in array
            for (i = 0; i < 4; i++) {
                $.myCubeObj.myTransformArray[(4 + (i - 1)) % 4] = $.myCubeObj.myFaceArray[i];
            }
            for (i = 0; i < 4; i++) {
                $.myCubeObj.myFaceArray[i] = $.myCubeObj.myTransformArray[i];
            }
            // Increment
            $.myCubeObj.myBgFrontCtr = ($.myCubeObj.myBgFrontCtr + 1) % $.myCubeObj.myPicLimit;
        };
        var myRotateDownInit = function () {
            // Set 'back' face background image
            var myQuickArray = new Array();
            // Check if everything already loaded
            for (var i = -2; i < 4; i++) {
                var idx = (($.myCubeObj.myPicLimit + ($.myCubeObj.myBgFrontCtr + i)) % $.myCubeObj.myPicLimit);
                if (!($.myCubeObj.myImgFileListObj.get(idx).isLoaded)) {
                    myQuickArray.push(idx);
                }
            }
            // if something not loaded, go ahead and load
            // ...it will cause a call back re: 'onload' 
            $.myCubeObj.myFigLoadCtr = myQuickArray.length;
            if (myQuickArray.length > 0) {
                for (var j = 0; j < myQuickArray.length; j++) {
                    // indicates we are rotating up
                    $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].isUpOrDown = 'down';
                    // this will load the image and fire the 'onload' event when done...
                    $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].img.src = $.myCubeObj.myImgFileListObj.list[myQuickArray[j]].bgSrc;
                }
            } else {
                $.myFuncObj.myRotateDownComplete();
            }
        };
        var myRotateDownComplete = function () {
            var isDone = false;
            for (var i = -2; i < 4; i++) {
                var idx = (($.myCubeObj.myPicLimit + ($.myCubeObj.myBgFrontCtr + i)) % $.myCubeObj.myPicLimit);
                if (!($.myCubeObj.myImgFileListObj.get(idx).isLoaded)) {
                    setTimeout($.myFuncObj.myRotateDownInit(), 5);
                    isDone = true;
                    break;
                }
            }
            if (isDone) { return; }
            // Set 'back' face background image			
            var myBgDwnCtr = ($.myCubeObj.myPicLimit + ($.myCubeObj.myBgFrontCtr - 2)) % $.myCubeObj.myPicLimit;
            var myNewBg = $.myCubeObj.myImgFileListObj.get(myBgDwnCtr).bgSrc;
            var myFig = $.myCubeObj.myFaceArray[2];
            if ($.myCubeObj.myIsMsie) {
                // ********* ie ONLY *********** //	
                $(myFig).css(
                    {
                        'background': 'url(' + myNewBg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center',
                        'background-size': 'cover'
                    }
                );
                // Rotate cube			
                var frontToBottom = $.myCubeObj.myFaceArray[0];
                var bottomToBack = $.myCubeObj.myFaceArray[1];
                var backToTop = $.myCubeObj.myFaceArray[2];
                var topToFront = $.myCubeObj.myFaceArray[3];
                while ($(topToFront).hasClass('ieHidden')) { $(topToFront).removeClass('ieHidden'); }
                while ($(frontToBottom).hasClass('ieHidden')) { $(frontToBottom).removeClass('ieHidden'); }
                if (!($(backToTop).hasClass('ieHidden'))) { $(backToTop).addClass('ieHidden'); }
                if (!($(bottomToBack).hasClass('ieHidden'))) { $(bottomToBack).addClass('ieHidden'); }
                $(bottomToBack).removeClass('ieOnBottom').addClass('ieOnBack');
                $(backToTop).removeClass('ieOnBack').addClass('ieOnTop');
                $(topToFront).removeClass('ieOnTop').addClass('ieOnFront');
                $(frontToBottom).removeClass('ieOnFront').addClass('ieOnBottom');
                setTimeout(function () {
                    if (!($(frontToBottom).hasClass('ieHidden'))) { $(frontToBottom).addClass('ieHidden'); }
                }, 2010);
            } else {
                // ********* NOT ie *********** //				
                $(myFig).css(
                    {
                        'background': 'url(' + myNewBg + ')',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center',
                        'background-size': 'cover'
                    }
                );
                // Rotate cube				
                $.myCubeObj.myQtrRotate = ($.myCubeObj.myQtrRotate - 90);
                $($.myCubeObj.myCubeId).css("-webkit-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("-moz-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("-o-transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
                $($.myCubeObj.myCubeId).css("transform", "translateZ(-137.5px) rotateX(" + $.myCubeObj.myQtrRotate + "deg )");
            }
            // Transform id of faces in array				
            for (i = 0; i < 4; i++) {
                $.myCubeObj.myTransformArray[(i + 1) % 4] = $.myCubeObj.myFaceArray[i];
            }
            for (i = 0; i < 4; i++) {
                $.myCubeObj.myFaceArray[i] = $.myCubeObj.myTransformArray[i];
            }
            // Increment
            $.myCubeObj.myBgFrontCtr = ($.myCubeObj.myPicLimit + ($.myCubeObj.myBgFrontCtr - 1)) % $.myCubeObj.myPicLimit;
        };

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Public functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */

        var myResult = {
            /* ******************************************************************************** */
            /* Get Client Info                                                                  */
            /* ******************************************************************************** */
            cubeInit: function (options) {
                var settings = $.extend({
                    // These are the defaults.
                    isMsie: (/msie|trident/i.test(navigator.userAgent)),
                    picLimit: -1,
                    jumbo1Id: 'jumbo1',
                    jumbo2Id: 'jumbo2',
                    jumbo1ContainerId: 'divBrdrContainer',
                    secCotainerId: 'secContainer',
                    ieCubeId: 'ieCube',
                    ieFigFrontId: 'ieFigFront',
                    ieFigBottomId: 'ieFigBottom',
                    ieFigBackId: 'ieFigBack',
                    ieFigTopId: 'ieFigTop',
                    ieOnFrontClass: 'ieOnFront',
                    ieOnBottomClass: 'ieOnBottom',
                    ieOnBackClass: 'ieOnBack',
                    ieOnTopClass: 'ieOnTop',
                    divCubeId: 'divCube',
                    figFrontId: 'figFront',
                    figBottomId: 'figBottom',
                    figBackId: 'figBack',
                    figTopId: 'figTop',
                    divCubeClass: 'show-front',
                    onFrontClass: 'front',
                    onBottomClass: 'bottom',
                    onBackClass: 'back',
                    onTopClass: 'top',
                    divAutoManId: 'divAutoMan',
                    blockIds: ['spnRotateUp', 'spnRotateDown', 'spnAuto', 'spnManual', 'divTabCollapse00'],
                    isAuto: true,
                    btnManual: 'spnManual',
                    btnAuto: 'spnAuto',
                    trRotateMode: 'trRotateMode',
                    trAutoManual: 'trAutoManual',
                    trManual: 'trManual',
                    tdRotateIds: ['tdRotateUp', 'tdRotateDown'],
                    btnRotateDown: 'spnRotateDown',
                    btnRotateUp: 'spnRotateUp',
                    btnClearClass: 'myBtnClear',
                    btnSetClass: 'myBtnSet',
                    noCursorClass: 'myNoCursor',
                    btnTabCollapse: 'divTabCollapse00',
                    btnTabExpand: 'divTabExpand00',
                    imgFileList: myUtil.myImgArray
                }, options);
                $.myCubeObj.myIsMsie = settings.isMsie;
                $.myCubeObj.myPicLimit = (settings.picLimit > 0) ? settings.picLimit : myUtil.myImgArray.length;
                $.myCubeObj.myJumbo1Id = settings.jumbo1Id;
                $.myCubeObj.myJumbo2Id = settings.jumbo2Id;
                $.myCubeObj.jumbo1ContainerId = settings.jumbo1ContainerId;
                $.myCubeObj.secCotainerId = settings.secCotainerId;
                /* ie */
                $.myCubeObj.ieCubeId = settings.ieCubeId;
                $.myCubeObj.ieFigFrontId = settings.ieFigFrontId;
                $.myCubeObj.ieFigBottomId = settings.ieFigBottomId;
                $.myCubeObj.ieFigBackId = settings.ieFigBackId;
                $.myCubeObj.ieFigTopId = settings.ieFigTopId;
                $.myCubeObj.ieOnFrontClass = settings.ieOnFrontClass;
                $.myCubeObj.ieOnBottomClass = settings.ieOnBottomClass;
                $.myCubeObj.ieOnBackClass = settings.ieOnBackClass;
                $.myCubeObj.ieOnTopClass = settings.ieOnTopClass;
                /* non-ie */
                $.myCubeObj.divCubeId = settings.divCubeId;
                $.myCubeObj.figFrontId = settings.figFrontId;
                $.myCubeObj.figBottomId = settings.figBottomId;
                $.myCubeObj.figBackId = settings.figBackId;
                $.myCubeObj.figTopId = settings.figTopId;
                $.myCubeObj.divCubeClass = settings.divCubeClass;
                $.myCubeObj.onFrontClass = settings.onFrontClass;
                $.myCubeObj.onBottomClass = settings.onBottomClass;
                $.myCubeObj.onBackClass = settings.onBackClass;
                $.myCubeObj.onTopClass = settings.onTopClass;

                $.myCubeObj.divAutoManId = settings.divAutoManId;
                $.myCubeObj.blockIds = new Array();
                $.myCubeObj.blockIds = settings.blockIds;
                $.myCubeObj.myAuto = new Object;
                $.myCubeObj.myAuto.isAuto = settings.isAuto;
                $.myCubeObj.myAuto.isFirstTime = true;
                $.myCubeObj.myAuto.isTimerSet = false;
                $.myCubeObj.myAuto.intervalId = null;

                $.myCubeObj.btnManual = settings.btnManual;
                $.myCubeObj.btnAuto = settings.btnAuto;
                $.myCubeObj.trRotateMode = settings.trRotateMode;
                $.myCubeObj.trAutoManual = settings.trAutoManual;
                $.myCubeObj.trManual = settings.trManual;
                $.myCubeObj.tdRotateIds = settings.tdRotateIds;
                $.myCubeObj.btnRotateDown = settings.btnRotateDown;
                $.myCubeObj.btnRotateUp = settings.btnRotateUp;
                $.myCubeObj.btnClearClass = settings.btnClearClass;
                $.myCubeObj.btnSetClass = settings.btnSetClass;
                $.myCubeObj.noCursorClass = settings.noCursorClass;
                $.myCubeObj.btnTabCollapse = settings.btnTabCollapse;
                $.myCubeObj.btnTabExpand = settings.btnTabExpand;

                $.myCubeObj.myFaceArray = new Array();
                if ($.myCubeObj.myIsMsie) {
                    $.myCubeObj.myAppend =
                        '<div id="' + $.myCubeObj.ieCubeId + '">' +
                        '<figure id="' + $.myCubeObj.ieFigFrontId + '" class="' + $.myCubeObj.ieOnFrontClass + '" imgid="0"></figure>' +
                        '<figure id="' + $.myCubeObj.ieFigBottomId + '" class="' + $.myCubeObj.ieOnBottomClass + '"  imgid="1"></figure>' +
                        '<figure id="' + $.myCubeObj.ieFigBackId + '" class="' + $.myCubeObj.ieOnBackClass + '" imgid="2"></figure>' +
                        '<figure id="' + $.myCubeObj.ieFigTopId + '" class="' + $.myCubeObj.ieOnTopClass + '" imgid="3"></figure>' +
                        '</div>';
                    $.myCubeObj.myFaceArray.push('#' + $.myCubeObj.ieFigFrontId);
                    $.myCubeObj.myFaceArray.push('#' + $.myCubeObj.ieFigBottomId);
                    $.myCubeObj.myFaceArray.push('#' + $.myCubeObj.ieFigBackId);
                    $.myCubeObj.myFaceArray.push('#' + $.myCubeObj.ieFigTopId);
                    $.myCubeObj.myCubeId = '#' + $.myCubeObj.ieCubeId;
                } else {
                    $.myCubeObj.myAppend =
                        '<div id="' + $.myCubeObj.divCubeId + '" class="' + $.myCubeObj.divCubeClass + '">' +
                        '<figure id="' + $.myCubeObj.figFrontId + '" class="' + $.myCubeObj.onFrontClass + '" imgid="0"></figure>' +
                        '<figure id="' + $.myCubeObj.figBottomId + '" class="' + $.myCubeObj.onBottomClass + '" imgid="1"></figure>' +
                        '<figure id="' + $.myCubeObj.figBackId + '" class="' + $.myCubeObj.onBackClass + '" imgid="2"></figure>' +
                        '<figure class="right"></figure>' +
                        '<figure class="left"></figure>' +
                        '<figure id="' + $.myCubeObj.figTopId + '" class="' + $.myCubeObj.onTopClass + '" imgid="3"></figure>' +
                        '</div>';
                    $.myCubeObj.myFaceArray.push('#' + settings.figFrontId);
                    $.myCubeObj.myFaceArray.push('#' + settings.figBottomId);
                    $.myCubeObj.myFaceArray.push('#' + settings.figBackId);
                    $.myCubeObj.myFaceArray.push('#' + settings.figTopId);
                    $.myCubeObj.myCubeId = '#' + settings.divCubeId;
                }
                $('#' + $.myCubeObj.secCotainerId).append($.myCubeObj.myAppend);
                $('#' + $.myCubeObj.secCotainerId).closest('body');

                $.myCubeObj.myTransformArray = new Array();
                $.myCubeObj.myTransformArray.push('');
                $.myCubeObj.myTransformArray.push('');
                $.myCubeObj.myTransformArray.push('');
                $.myCubeObj.myTransformArray.push('');
                $.myCubeObj.myBgFrontCtr = 0;
                $.myCubeObj.myQtrRotate = 0;
                $.myCubeObj.isBlocked = false;

                $.myFuncObj.myBlock = myBlock;
                $.myFuncObj.myAllow = myAllow;
                $.myFuncObj.imgOnLoadCallback = imgOnLoadCallback;
                $.myFuncObj.myRotateUpAutoHandler = myRotateUpAutoHandler;
                $.myFuncObj.myRotateUpHandler = myRotateUpHandler;
                $.myFuncObj.myRotateDownHandler = myRotateDownHandler;
                $.myFuncObj.firstRotate = firstRotate;
                $.myFuncObj.autoOnClick = autoOnClick;
                $.myFuncObj.manualOnClick = manualOnClick;
                $.myFuncObj.myRotateUpInit = myRotateUpInit;
                $.myFuncObj.myRotateUpComplete = myRotateUpComplete;
                $.myFuncObj.myRotateDownInit = myRotateDownInit;
                $.myFuncObj.myRotateDownComplete = myRotateDownComplete;
                $.myFuncObj.onClickTabCollapse = onClickTabCollapse;
                $.myFuncObj.onClickTabExpand = onClickTabExpand;

                $.myCubeObj.myImgFileList = settings.imgFileList;
                $.myCubeObj.myImgFileListObj = new imgFileListObj();
                $.myCubeObj.myFacesCount = ($.myCubeObj.myPicLimit < 4) ? 4 : $.myCubeObj.myPicLimit;
                for (var i = 0; i < $.myCubeObj.myFacesCount; i++) {
                    $.myCubeObj.myImgFileListObj.addImageToCarousel(
                        myUtil.myHelper.mySetUrlPath($.myCubeObj.myImgFileList[i])
                    );
                }
                $.myCubeObj.myFigLoadCtr = 0;
                //
                return mySelf;
            },
            figSizer: function () {
                var $myf = $('#' + $.myCubeObj.myJumbo1Id);
                $('#' + $.myCubeObj.secCotainerId).css({
                    width: $myf.width(),
                    height: $myf.height()
                });
                $('#' + $.myCubeObj.secCotainerId).closest('body');
                $($.myCubeObj.myCubeId).css({
                    'width': $myf.width(),
                    'height': $myf.height()
                });
                $($.myCubeObj.myCubeId).closest('body');
                $($.myCubeObj.myCubeId).children().css({
                    'width': $.myCubeObj.myIsMsie ? $myf.width() * (1009 / 1100) : $myf.width(),
                    'height': $.myCubeObj.myIsMsie ? $myf.height() * (254 / 275) : $myf.height(),
                    'background-repeat': 'no-repeat',
                    'background-position': 'center center',
                    'background-size': 'cover'
                });
                $($.myCubeObj.myCubeId).children().closest('body');
                //
                return mySelf;
            },
            onWinFocus: function () {
                if ((!(($.myCubeObj.myAuto.isFirstTime) || (typeof $.myCubeObj.myAuto.isFirstTime === typeof undefined)))) {
                    if ($.myCubeObj.myAuto.isAuto && !($.myCubeObj.myAuto.isTimerSet)) {
                        if (!$.myCubeObj.myIsMsie) {
                            $.myFuncObj.myRotateUpHandler();
                        }
                        $.myCubeObj.myAuto.intervalId = setInterval($.myFuncObj.myRotateUpHandler, 3000);
                        $.myCubeObj.myAuto.isTimerSet = true;
                    }
                }
            },
            onWinBlur: function () {
                if ($.myCubeObj.myAuto.isAuto) {
                    window.clearInterval($.myCubeObj.myAuto.intervalId);
                    $.myCubeObj.myAuto.isTimerSet = false;
                    $.myCubeObj.myAuto.intervalId = null;
                }
            },
            cubeStart: function () {
                $($.myCubeObj.btnManual).click($.myFuncObj.manualOnClick);

                if ($.myCubeObj.myAuto.isAuto && !($.myCubeObj.myAuto.isTimerSet)) {
                    setTimeout($.myFuncObj.firstRotate, 3500);
                }
                //
                return mySelf;
            }
        };
        return myResult;
    };
})(jQuery, window, document);; $.myCommonGlobal = {};

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
        }
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