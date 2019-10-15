//
(function ($, window, document, undefined) {
    $.fn.ujQuiDndPlugin = function () {
        /* Set internal "this" */
        var mySelf = this;

        /* ******************************************************************************** */
        // Global prototyeps
        //

        //
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN jQuery extensions
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        //
        jQuery.fn.isUlFilled = function () {
            var myRtn = null;
            if (this.is('ul')) {
                var liList = this.find('li:not(.' + vw$GetGlobal('onDoneClassLi') + ')');
                myRtn = (liList.length == 0);
            }
            return myRtn;
        };
        //
        jQuery.fn.isLiDone = function () {
            var myRtn = null;
            if (this.is('li')) {
                myRtn = $(this).hasClass(vw$GetGlobal('onDoneClassLi'));
            }
            return myRtn;
        };
        //
        jQuery.fn.isLiOrdered = function () {
            myRtn = null;
            if (this.is('li')) {
                var mySortNum = parseInt(this.attr('sortNum'));
                var myLiIdx = mySortNum - 1;
                var thisLiIdx = this.getAllLiIdx();
                myRtn = (myLiIdx == thisLiIdx);
            }
            return myRtn;
        };
        //
        jQuery.fn.removeFromList = function (idx) {
            var newList = $();
            if (this.length > 1) {
                newList = this.not(this.eq(idx));
            }
            return newList;
        };
        //
        jQuery.fn.hasAttr = function (attrName) {
            var val = this.attr(attrName);
            return (val) ? true : false;
        };
        //
        jQuery.fn.getSortNum = function () {
            var myRtn = null;
            if (this.is('li')) {
                if (this.hasAttr('sortNum')) {
                    myRtn = this.attr('sortNum');
                } else {
                    myRtn = parseInt(this.getAllLiIdx()) + 1;
                    this.attr('sortNum', myRtn);
                }
            }
            return myRtn;
        };
        //
        jQuery.fn.getAllLiIdx = function () {
            var myRtn = null;
            if (this.is('li')) {
                var checkLi = this;
                var allLiList = $().getAllLiList();
                //if (this.hasClass('ui-sortable-helper')) {
                //    checkLi = allLiList.filter('li.ui-sortable-placeholder').first();
                //}
                var allLiIdx = allLiList.index(checkLi);
                myRtn = allLiIdx;
            }
            return myRtn;
        };
        jQuery.fn.getUlLiIdx = function () {
            var myRtn = null;
            if (this.is('li')) {
                var ul = this.closest('ul');
                var ulList = $().getUlList();
                var ulIdx = ulList.index(ul);
                var ulLiIdx = $(ulList[ulIdx]).find('li').index(this);
                myRtn = {};
                myRtn.ulIndex = ulIdx;
                myRtn.ulLiIndex = ulLiIdx;
            }
            return myRtn;
        };
        jQuery.fn.getAllLiList = function () {
            return vw$GetGlobal('ulList').find('li');
        };
        jQuery.fn.getDoneLiList = function () {
            return vw$GetGlobal('ulList').find('li.' + vw$GetGlobal('onDoneClassLi')+',li.ui-sortable-placeholder,li.moveBg');
        };
        jQuery.fn.getUlList = function () {
            return vw$GetGlobal('ulList');
        };
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /*** Hold config and state variables ***/
        var uDndUlList = {};
        var uObj = {};
        /*
        /*** Assign mousedown event to DnD buttons ***/
        var myMakeUlDnd = function () {
            var ulList = $().getUlList();
            ulList.sortable({
                connectWith: ".connectedSortable",
                placeholder: "ui-state-highlight"
            }).disableSelection();
            $().getAllLiList().bind('mousedown', doMouseDown);
        };
        //
        var doMouseDown = function (e) {
            uObj.indexObj = createIndexObjFactory();
            uObj.indexObj.init();
            uObj.allIndex = $(this).attr('allIndex');
            var holderIdxObj = { liIdx: -1, ulIdx: -1 };
            vw$SetGlobal('lastHolderIdxObj', holderIdxObj);
            $(this).css('cursor', 'move');
            $(this).addClass('moveBg');
            $(this).bind('mouseup', doMouseUp);
            $('body').bind('mouseup', doMouseUp);
            $(this).bind('mousemove', doMouseMove);
            $('#myContainer').css('cursor', 'move');
            $('#myContainer').find('*').css('cursor', 'move');
            $(this).css('cursor', 'move');
        };
        //
        var doMouseMove = function (ev) {
            var allLiList = $().getAllLiList();
            var currHolderLi = allLiList.filter('li.ui-sortable-placeholder').first();
            var currHolderUl = currHolderLi.parent();
            var currHolderLiIdx = allLiList.index(currHolderLi);
            var currHolderUlIdx = $().getUlList().index(currHolderUl)
            var currHolderIdxObj = { liIdx: currHolderLiIdx, ulIdx: currHolderUlIdx };
            var lastHolderIdxObj = vw$GetGlobal('lastHolderIdxObj');
            if (currHolderIdxObj.ulIdx > -1) {
                if (lastHolderIdxObj.ulIdx > -1) {
                    if (currHolderIdxObj.ulIdx != lastHolderIdxObj.ulIdx) {
                        uObj.indexObj.updateOnMove();
                        vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
                    }
                } else {
                    vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
                }
            }

        };
        //
        var createIndexObjFactory = function () {
            var myRtn = null;
            var indexObj = function () {
                this.currHolderIdx = 0;
                this.scoreBoard = [].setValues(50, false);
                this.mirrorCopyUlList = {};
            };
            indexObj.prototype.init = function (holderIdx) {
                if (holderIdx) { this.currHolderId = holderIdx; }
                var li;
                var allLiList = $().getAllLiList();
                var oIdx;
                while ((oIdx=allLiList.loop())>-1) {
                    li = allLiList.eq(oIdx);
                    if ((li.isLiOrdered()) && (!this.isDone(oIdx))) {
                        this.setDone(oIdx);
                        li.unbind('mousedown', vw$GetGlobal('gContext').doMouseDown);
                        li.addClass(vw$GetGlobal('onDoneClassLi'));
                        li.closest('ul').closest('body');
                    }
                }
                while ((oIdx = allLiList.loop()) > -1) {
                    allLiList.eq(oIdx).closest('ul').closest('body');
                }
                this.updateMirror();
            };
            indexObj.prototype.updateMirror = function () {
                var ulList = vw$GetGlobal('ulList');
                var ulMirrorList = vw$GetGlobal('mirrorUlList');
                var iidx = 0;
                var jidx = 0
                while ((iidx = ulMirrorList.loop()) > -1) {
                    ulMirrorList.eq(iidx).find('li').remove();
                    ulListList = ulList.eq(iidx).find('li');
                    while((jidx = ulListList.loop()) > -1) {
                        ulMirrorList.eq(iidx).append(ulListList.eq(jidx).clone());
                    }
                    ulMirrorList.eq(iidx).removeClass('connectedSortable').addClass('notConnected');
                    ulMirrorList.eq(iidx).find('li').removeClass('ui-sortable-handle');
                };
            }
            indexObj.prototype.updateOnMove = function () {
                this.updateMirror();
                var doneLiList = $().getDoneLiList();
                var doneLi = {};
                this.mirrorCopyUlList = vw$GetGlobal('mirrorUlList').clone();
                var mirrorCopyLi = {};
                var liSortedIndex;
                var liUlCopyMirrorIndex;
                var mIdx;
                while ((mIdx = doneLiList.loop()) > -1) {
                    doneLi = doneLiList.eq(mIdx);
                    if (doneLi.hasClass('ui-sortable-placeholder') ||
                        doneLi.hasClass('ui-sortable-helper') ||
                        doneLi.hasClass('moveBg')) {
                          liSortedIndex = doneLi.getAllLiIdx();
                    } else {
                        liSortedIndex = parseInt(doneLi.attr('allIndex'));
                    }
                    //
                    if (liSortedIndex < 17) {
                        liUlCopyMirrorIndex = liSortedIndex;
                        mirrorCopyLi = this.mirrorCopyUlList.eq(0).find('li').eq(liUlCopyMirrorIndex);
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(doneLi);
                        } else {
                            this.mirrorCopyUlList.eq(0).append(doneLi);
                        }
                    } else if (liSortedIndex < 34) {
                        liUlCopyMirrorIndex = liSortedIndex - 17;
                        mirrorCopyLi = this.mirrorCopyUlList.eq(1).find('li').eq(liUlCopyMirrorIndex);
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(doneLi);
                        } else {
                            this.mirrorCopyUlList.eq(1).append(doneLi);
                        }
                    } else {
                        liUlCopyMirrorIndex = liSortedIndex - 34;
                        mirrorCopyLi = this.mirrorCopyUlList.eq(2).find('li').eq(liUlCopyMirrorIndex);
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(doneLi);
                        } else {
                            this.mirrorCopyUlList.eq(2).append(doneLi);
                        }
                    }
                }
                //
                var mirrorCopyUlLiNotDoneList = [];
                var tempList;
                while ((mIdx = this.mirrorCopyUlList.loop()) > -1) {
                    var tempList = this.mirrorCopyUlList.eq(mIdx).find('li');
                    tempList = tempList.filter(':not(.' + vw$GetGlobal('onDoneClassLi') + ')');
                    tempList = tempList.filter(':not(.ui-sortable-placeholder)');
                    tempList = tempList.filter(':not(.ui-sortable-helper)');
                    mirrorCopyUlLiNotDoneList.push(tempList);
                }
                var notDoneLi = {};
                var notDoneLiList = $().getAllLiList().not($().getDoneLiList());
                while ((mIdx = notDoneLiList.loop()) > -1) {
                    notDoneLi = notDoneLiList.eq(mIdx);
                    if (mIdx < 17) {
                        mirrorCopyLi = mirrorCopyUlLiNotDoneList[0].first();
                        mirrorCopyUlLiNotDoneList[0] = mirrorCopyUlLiNotDoneList[0].not(':first');
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(notDoneLi);
                        } else {
                            this.mirrorCopyUlList.eq(0).append(notDoneLi);
                        }
                    } else if (mIdx < 34) {
                        mirrorCopyLi = mirrorCopyUlLiNotDoneList[1].first();
                        mirrorCopyUlLiNotDoneList[1] = mirrorCopyUlLiNotDoneList[1].not(':first');
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(notDoneLi);
                        } else {
                            this.mirrorCopyUlList.eq(1).append(notDoneLi);
                        }
                    } else {
                        mirrorCopyLi = mirrorCopyUlLiNotDoneList[2].first();
                        mirrorCopyUlLiNotDoneList[2] = mirrorCopyUlLiNotDoneList[2].not(':first');
                        if (mirrorCopyLi.is('li')) {
                            mirrorCopyLi.replaceWith(notDoneLi);
                        } else {
                            this.mirrorCopyUlList.eq(2).append(notDoneLi);
                        }
                    }
                }
                //
                var ulList = $().getUlList();
                var ulMirrorCopyLiList = this.mirrorCopyUlList.find('li');
                var ctr = 0;
                var isHelper = false;
                while ((mIdx = ulMirrorCopyLiList.loop()) > -1) {
                    mirrorLiCopy = ulMirrorCopyLiList.eq(mIdx);
                    isHelper = mirrorLiCopy.hasClass('moveBg') || mirrorLiCopy.hasClass('ui-sortable-helper');
                    if (ctr < 17) {
                        ulList.eq(0).append(ulMirrorCopyLiList.eq(mIdx));
                    } else if (ctr < 34) {
                        ulList.eq(1).append(ulMirrorCopyLiList.eq(mIdx));
                    } else {
                        ulList.eq(2).append(ulMirrorCopyLiList.eq(mIdx));
                    }
                    if (!isHelper) {
                        ctr++;
                    }
                }
                //
                var allLiList = $().getAllLiList();
                while ((mIdx=allLiList.loop())>-1) {
                    allLiList.eq(mIdx).closest('ul').closest('body');
                }
                //
                this.updateMirror(); 
            }
            indexObj.prototype.updateOnDrop = function () {
                this.updateOnMove();
                var li;
                var allLiList = $().getAllLiList();
                var oIdx;
                while ((oIdx=allLiList.loop())>-1) {
                    li = allLiList.eq(oIdx);
                    if ((li.isLiOrdered()) && (!this.isDone(oIdx))) {
                        this.setDone(oIdx);
                        li.unbind('mousedown', vw$GetGlobal('gContext').doMouseDown);
                        li.addClass(vw$GetGlobal('onDoneClassLi'));
                        li.closest('ul').closest('body');
                    }
                }
                //
            };
            indexObj.prototype.setDone = function (idx) {
                this.scoreBoard[idx] = true;
            };
            indexObj.prototype.isDone = function (idx) {
                return (this.scoreBoard[idx]) ? true : false;
            };
            //
            myRtn = new indexObj();
            return myRtn;
        };
        //                

        /*** Mouseup event handler ***/
        var doMouseUp = function (ev) {
            droppedLi = $(this);
            droppedLi.css('cursor', 'default');
            vw$SetGlobal('isBusy', true);
            ev = ifAuto(ev);
            liFlash();
            $('body').unbind('mousemove', doMouseMove);
            $('body').unbind('mouseup', doMouseUp);
            $('#myContainer').css('cursor', 'default');
            $('#myContainer').find('*').css('cursor', 'default');
            var notDoneLiList = $().getAllLiList().not($().getDoneLiList());
            notDoneLiList.css("cursor", "pointer");
            setTimeout(function () { vw$SetGlobal('isBusy', false); }, 500);
            function liFlash() {
                liOn();
                setTimeout(function () { liOff(); }, 250);
                function liOn() {
                    droppedLi.removeClass('moveBg');
                    //if (droppedLi.isLiOrdered()) {
                    //    droppedLi.unbind('mousedown', doMouseDown);
                    //    var allLiIdx = droppedLi.getAllLiIdx();
                    //    uObj.indexObj.setDone(allLiIdx);
                    //    droppedLi.addClass(vw$GetGlobal('onDoneClassLi'));
                    //}
                    droppedLi.addClass('myFlashLi');
                    //uObj.indexObj.updateOnMove();
                }
                function liOff() {
                    droppedLi.removeClass('myFlashLi');
                    uObj.indexObj.updateOnDrop();
                    //if (droppedLi.isLiOrdered()) {
                    //    var myDestUl = droppedLi.closest('ul');
                    //}
                    //if (vw$GetGlobal('ulList').find('li:not(.' + uObj.onDoneClassLi + ')').length < 1) {
                    //    setTimeout(function () { uObj.onDoneFunction(); }, 1500);
                    //}
                }
            }
        };
        //
        var ifAuto = function (ev) {
            //if (uObj.auto.isAutoOn) {
            //ev.pageX = uObj.auto.mouseX;
            //ev.pageY = uObj.auto.mouseY;
            //}
            return ev;
        };
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Public functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        var myResult = {
            /* ******************************************************************************** */
            /* Get Client Info                               */
            /* ******************************************************************************** */
            context: {
                uObj: this.uObj,
                doMouseDown: this.doMouseDown
            },
            init: function (options) {
                var settings = $.extend({
                    // These are the defaults.
                    onDoneClassLi: 'ui-state-disabled',
                    onDoneFunction: function () { },
                    scrollAmount: 150
                }, options);
                uDndUlList = mySelf;
                vw$SetGlobal('ulList', uDndUlList);

                if (settings.onDoneClassLi) {
                    uObj.onDoneClassLi = settings.onDoneClassLi;
                    vw$SetGlobal('onDoneClassLi', settings.onDoneClassLi);
                }
                if (settings.scrollAmount) {
                    uObj.scrollAmount = settings.scrollAmount;
                    vw$SetGlobal('scrollAmount', settings.scrollAmount);
                }
                if (settings.onDoneFunction) {
                    uObj.onDoneFunction = settings.onDoneFunction;
                    vw$SetGlobal('onDoneFunction', settings.onDoneFunction);
                }
                if (settings.mirrorUls) {
                    uObj.mirrorUlList = settings.mirrorUls;
                    vw$SetGlobal('mirrorUlList', settings.mirrorUls);
                }
                //
                //
                this.context.uObj = uObj;
                this.context.doMouseDown = doMouseDown;
                vw$SetGlobal('gContext', this.context);
                //
                // Initialize the li's accidentally in sort order
                uObj.indexObj = new createIndexObjFactory();
                uObj.indexObj.init();
                //dummy = null;
                //
                //uObj.auto = {};
                //uObj.auto.isAutoOn = false;
                //uObj.auto.mouseX = 0;
                //uObj.auto.mouseY = 0;
                vw$SetGlobal('isBusy', false);
                //
                myMakeUlDnd();
                //
                return mySelf;
            }
            //},
            //auto: function () {
            //    uObj.auto.isAutoOn = true;
            //    //
            //    var autoFactory = function () {
            //        var myRtn = null;
            //        var autoObj = function () {
            //            this.intervalTimer = null;
            //            this.stepList = [];
            //            this.allLiList = [];
            //            this.checkLiList = [];
            //            this.checkListLength = {};
            //            this.btn = {};
            //            this.pos = {};
            //            this.destPos = {};
            //            this.destLiIdx = {};
            //            $('#divContainerCover').css('pointer-events', 'none');
            //            $('#divContainerCover').show();
            //            this.calcSteps = function () {
            //                this.stepList = [];
            //                var x1 = this.pos.left;
            //                var x2 = this.destPos.left + 5;
            //                var y1 = this.pos.top;
            //                var y2 = this.destPos.top + 5;
            //                //this.stepList.push(new vw$CoordDef(x2, y2));
            //                var newX, neonDoneClassLiwY, steps;
            //                //* *********************************************
            //                //* y=mx+b; thus y=(x/(1/m))+b
            //                //* *** 
            //                //* Similarly, if m=(y2-y1)/(x2-x) then..
            //                //* let dxdy = (1/m), then  dxdy=(x2-x1)/(y2-y1);
            //                //* ***
            //                //* then we have y=(x/dxdy)+b, and b=y-(x/dxdy);
            //                //* ... and simmilarly x=(y-b)*dxdy;
            //                //* *********************************************
            //                var dxdy = (x2 - x1) / (y2 - y1);
            //                var b = y1 - (x1 / dxdy);
            //                //*
            //                var isMoveByX = Math.abs(x2 - x1) > Math.abs(y2 - y1);
            //                //*
            //                newX = x1;
            //                newY = y1;
            //                if (isMoveByX) {
            //                    steps = parseInt(Math.abs(x2 - x1) / 50);
            //                    for (let i = 0; i < steps; i++) {
            //                        newX = newX + 50;
            //                        newY = parseInt((newX / dxdy) + b) + 5;
            //                        this.stepList.push(new vw$CoordDef(newX, newY));
            //                    }
            //                } else {
            //                    steps = parseInt(Math.abs(y2 - y1) / 50);
            //                    for (let i = 0; i < steps; i++) {
            //                        newY = newY + 50;
            //                        newX = parseInt((newY - b) * dxdy) + 3;
            //                        this.stepList.push(new vw$CoordDef(newX, newY));
            //                    }
            //                }
            //                if ((newX != x2) || (newY != y2)) {
            //                    this.stepList.push(new vw$CoordDef(x2, y2));
            //                }
            //                uObj.auto.stepList = this.stepList;
            //            };
            //        };
            //        autoObj.prototype.init = function () {
            //            //uObj.auto.callBackContext = this;     
            //            this.autoCallBack();
            //        };
            //        autoObj.prototype.autoCallBack = function () {
            //            if (this.intervalTimer != null) {
            //                clearInterval(this.intervalTimer);
            //            }
            //            this.stepList = [];
            //            this.allLiList = uDndUlList.init.find('li');
            //            this.checkLiList = uDndUlList.curr.find('li:not(.' + uObj.onDoneClassLi + ')');
            //            this.checkListLength = this.checkLiList.length;
            //            var currLi, destLi;
            //            if (this.checkListLength > 0) {
            //                currLi = this.checkLiList.eq(0);
            //                this.btn = currLi.find('[dndbtn]').first();
            //                this.pos = this.btn.offset();
            //                uObj.auto.mouseX = this.pos.left + 7;
            //                uObj.auto.mouseY = this.pos.top + 9;
            //                this.destLiIdx = parseInt(currLi.attr('allIndex'));
            //                destLi = this.allLiList.eq(this.destLiIdx);
            //                this.destPos = destLi.offset();
            //                this.calcSteps();
            //                this.btn.trigger('mousedown');
            //                vw$SetGlobal('autoContext', this);
            //                this.intervalTimer = setInterval(this.autoStep, 150);
            //            } else {
            //                $('#divContainerCover').css('pointer-events', 'auto');
            //                $('#divContainerCover').hide();
            //            }
            //        };
            //        autoObj.prototype.autoStep = function () {
            //            if (vw$GetGlobal('isBusy')) {
            //                return;
            //            }
            //            var myContext = vw$GetGlobal('autoContext');
            //            var listLength = uObj.auto.stepList.length;
            //            var newCoord = new vw$CoordDef(uObj.auto.mouseX, uObj.auto.mouseY);
            //            if (listLength > 0) {
            //                newCoord = uObj.auto.stepList.shift();
            //                uObj.auto.mouseX = newCoord.x;
            //                uObj.auto.mouseY = newCoord.y;
            //                $('body').trigger('mousemove');
            //            } else {
            //                var allLiList = $().getAllLiList();
            //                var destLi = allLiList.filter('.' + vw$GetGlobal('occupyClass'));
            //                var destLiIdx = allLiList.index(destLi);
            //                if (destLiIdx < myContext.destLiIdx) {
            //                    newCoord.x = uObj.auto.mouseX;
            //                    newCoord.y = uObj.auto.mouseY + 5;
            //                    uObj.auto.stepList.push(newCoord);
            //                } else if (destLiIdx > myContext.destLiIdx) {
            //                    newCoord.x = uObj.auto.mouseX;
            //                    newCoord.y = uObj.auto.mouseY - 10;
            //                    uObj.auto.stepList.push(newCoord);
            //                } else {
            //                    $('body').trigger('mouseup');
            //                    clearInterval(myContext.intervalTimer);
            //                    setTimeout(function () { myContext.autoCallBack(); }, 1000);
            //                }
            //            }
            //        };
            //        //
            //        myRtn = new autoObj();
            //        return myRtn;
            //    }
            //    //
            //    this.myAutoObj = autoFactory();
            //    this.myAutoObj.init();
            //}
        };
        return myResult;
    };
})(jQuery, window, document);		
