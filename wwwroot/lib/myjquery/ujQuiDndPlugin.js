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
                var allLiIdx = allLiList.index(checkLi);
                myRtn = allLiIdx;
            }
            return myRtn;
        };
        jQuery.fn.getAllCtrLiIdx = function () {
            var myRtn = null;
            if (this.is('li')) {
                var checkLi = this;
                var allLiList = $().getAllCtrLiList();
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
        jQuery.fn.getAllCtrLiList = function () {
            return vw$GetGlobal('ulListInit').find('li:not(.ui-sortable-helper)');
        };
        jQuery.fn.getAllLiList = function () {
            return vw$GetGlobal('ulListInit').find('li');
        };
        jQuery.fn.getDoneLiList = function () {
            var myRtn = vw$GetGlobal('ulListInit').find('li.'+vw$GetGlobal('onDoneClassLi'));
            return myRtn;
        };
        jQuery.fn.getUlList = function () {
            return vw$GetGlobal('ulListInit');
        };
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /*** Hold config and state variables ***/
        var uDndUlList = {};
        var uObj = {};
        var uIdx = {};
        /*
        /*** Assign mousedown event to DnD buttons ***/
        var myMakeUlDnd = function () {
            var ulList = $().getUlList();
            ulList.sortable({
                connectWith: ".connectedSortable",
                placeholder: "ui-sortable-placeholder"
            }).disableSelection();
            $().getAllLiList().bind('mousedown', doMouseDown);
        };
        //
        var doMouseDown = function (e) {
            if (vw$SetGlobal('isBusy')) {
                return;
            } else {
                vw$SetGlobal('isBusy', true);
            }
            uObj.indexObj = createIndexObjFactory();
            uObj.indexObj.init();
            var holderIdxObj = { liIdx: -1, ulIdx: -1 };
            vw$SetGlobal('lastHolderIdxObj', holderIdxObj);
            $(this).css('cursor', 'move');
            $(this).addClass('moveBg');
            $(this).bind('mouseup', doMouseUp);
            $(this).bind('mousemove', doMouseMove);
            $('body').bind('mousemove', doMouseMove);
            $('#myContainer').css('cursor', 'move');
            $('#myContainer').find('*').css('cursor', 'move');
            $(this).css('cursor', 'move');
            vw$SetGlobal('isBusy', false);
        };
        //
        var doMouseMove = function (ev) {
            if (vw$SetGlobal('isBusy')) {
                return;
            } else {
                vw$SetGlobal('isBusy', true);
            }
            var allLiList = $().getAllLiList();
            var currHolderLi = allLiList.filter('li.ui-sortable-placeholder').first();
            var currHolderUl = currHolderLi.parent();
            var currHolderLiIdx = allLiList.index(currHolderLi);
            var currHolderUlIdx = $().getUlList().index(currHolderUl);
            var currHolderIdxObj = { liIdx: currHolderLiIdx, ulIdx: currHolderUlIdx };
            var lastHolderIdxObj = vw$GetGlobal('lastHolderIdxObj');
            if (currHolderIdxObj.ulIdx > -1) {
                if (lastHolderIdxObj.ulIdx > -1) {
                    if ((currHolderIdxObj.ulIdx != lastHolderIdxObj.ulIdx) ||
                        (currHolderIdxObj.liIdx != lastHolderIdxObj.liIdx)) {
                        uObj.indexObj.updateOnMove();
                        vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
                    }
                } else {
                    vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
                }
            }
            vw$SetGlobal('isBusy', false);
        };
        //
        var createIndexObjFactory = function () {
            var myRtn = null;
            var indexObj = function () {
                this.scoreBoard = [].setValues(50, false);
            };
            //
            indexObj.prototype.init = function () {
                var li;
                var allLiList = $().getAllLiList();
                var oIdx;
                while ((oIdx = allLiList.loop()) > -1) {
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

            };
            //
            indexObj.prototype.updateOnDrop = function () {
                this.updateOnMove();
                var li;
                var allLiList = $().getAllLiList();
                var oIdx;
                while ((oIdx = allLiList.loop()) > -1) {
                    li = allLiList.eq(oIdx);
                    if ((li.isLiOrdered()) && (!this.isDone(oIdx))) {
                        this.setDone(oIdx);
                        li.unbind('mousedown', vw$GetGlobal('gContext').doMouseDown);
                        li.addClass(vw$GetGlobal('onDoneClassLi'));
                        li.closest('ul').closest('body');
                    }
                }
            };
            //
            indexObj.prototype.updateOnMove = function () {
                var ulList = $().getUlList();
                var allLiList = $().getAllLiList();
                var doneLiList;
                var doneLi;
                var helperLi;
                var notDoneLiList;
                var liSortedIndex;
                var kidx = 0;
                var mirrorUlList;
                var mirrorAllLiList;
                var mirrorNotDoneLiList;
                var mirrorDoneLiList; 
                //
                if (isErr()) {
                    mirrorUlList = $().getUlList().clone();
                    mirrorUlList.removeClass('connectedSortable').addClass('notConnected');
                    mirrorUlList.find('li:not(li.ui-sortable-helper)').attr('class', '');
                    mirrorUlList.find('li').addClass('ui-state-default').addClass('ui-sortable-handle');
                    doneLiList = ulList.find('li.' + vw$GetGlobal('onDoneClassLi'));
                    while (doneLiList.length > 0) {
                        mirrorAllLiList = mirrorUlList.find('li:not(li.ui-sortable-helper)');
                        doneLi = doneLiList.eq(0);
                        liSortedIndex = parseInt(doneLi.attr('allIndex'));
                        mirrorAllLiList.eq(liSortedIndex).replaceWith(doneLi);
                        doneLiList = ulList.find('li.' + vw$GetGlobal('onDoneClassLi'));
                    }
                    //
                    mirrorNotDoneLiList = mirrorUlList.find('li');
                    mirrorDoneLiList = mirrorNotDoneLiList.filter('li.' + vw$GetGlobal('onDoneClassLi'));
                    mirrorNotDoneLiList = mirrorNotDoneLiList.not(mirrorDoneLiList);
                    //
                    //
                    notDoneLiList = ulList.find('li');
                    while ((kidx = notDoneLiList.loop()) > -1) {
                        mirrorNotDoneLiList.eq(kidx).replaceWith(notDoneLiList.eq(kidx));
                    }
                    //
                    ulList.find('li').remove();
                    mirrorAllLiList = mirrorUlList.find('li');
                    var isHelper;
                    var ctr = 0;
                    while ((kidx = mirrorAllLiList.loop()) > -1) {
                        isHelper = (mirrorAllLiList.eq(kidx).hasClass('ui-sortable-helper'));
                        if (ctr < 17) {
                            ulList.eq(0).append(mirrorAllLiList.eq(kidx));
                        } else if (ctr < 34) {
                            ulList.eq(1).append(mirrorAllLiList.eq(kidx));
                        } else {
                            ulList.eq(2).append(mirrorAllLiList.eq(kidx));
                        }
                        if (!isHelper) {
                            ctr++;
                        }
                    }
                    //
                    allLiList = $().getAllLiList();
                    while ((kidx = allLiList.loop()) > -1) {
                        allLiList.eq(kidx).closest('ul').closest('body');
                    }
                    //
                    mirrorUlList.remove();
                }
                //
                this.fixUlSize();
                //
                function isErr() {
                    myRtn = false;
                    allLiList = $().getAllLiList().not('li.ui-sortable-helper');
                    var myDoneLiList = $().getDoneLiList(); 
                    var doneLiIdx;
                    while ((kidx = myDoneLiList.loop()) > -1) {
                        doneLi = myDoneLiList.eq(kidx);
                        doneLiIdx = allLiList.index(doneLi);
                        liSortedIndex = parseInt(doneLi.attr('allIndex'));
                        if (doneLiIdx != liSortedIndex) {
                            myRtn = true;
                            break;
                        }
                    }
                    return myRtn;
                }
            };
            //
            indexObj.prototype.fixUlSize = function () {
                var ulList = $().getUlList();
                var toUlIdx = -1;
                var fmUlIdx = -1;
                var liDoneList;
                var fmLi, toLi;
                while (isErr()) {
                    if (fmUlIdx > toUlIdx) {
                        liDoneList = ulList.eq(fmUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + ',li.ui-sortable-helper');
                        fmLi = ulList.eq(fmUlIdx).find('li').not(liDoneList).first();
                        liDoneList = ulList.eq(toUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + 'li.ui-sortable-helper');
                        toLi = ulList.eq(toUlIdx).find('li').not(liDoneList).last();
                        if (toLi.length > 0) {
                            fmLi.insertAfter(toLi);
                        } else {
                            ulList.eq(toUlIdx).append(fmLi);
                        }
                    } else if (fmUlIdx < toUlIdx) {
                        liDoneList = ulList.eq(fmUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + 'li.ui-sortable-helper');
                        fmLi = ulList.eq(fmUlIdx).find('li').not(liDoneList).last();
                        liDoneList = ulList.eq(toUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + ',li.ui-sortable-helper');
                        toLi = ulList.eq(toUlIdx).find('li').not(liDoneList).first();
                        if (toLi.length > 0) {
                            fmLi.insertBefore(toLi);
                        } else {
                            ulList.eq(toUlIdx).prepend(fmLi);
                        }
                    }
                }
                //
                function isErr() {
                    toUlIdx = -1;
                    fmUlIdx = -1;
                    var myRtn = false;
                    var currSize;
                    var initSize;
                    var fidx = 0;
                    while ((fidx = ulList.loop()) > -1) {
                        currSize = ulList.eq(fidx).find('li:not(ui-sortable-helper)').length;
                        initSize = parseInt(ulList.eq(fidx).attr('ullength'));
                        if (currSize < initSize) {
                            toUlIdx = fidx;
                        } else if (currSize > initSize) {
                            fmUlIdx = fidx;
                        }
                        if (toUlIdx > -1 && fmUlIdx > -1) {
                            ulList.nullIndex();
                            myRtn = true;
                            break;
                        }
                    }
                    return myRtn;
                }
            };
            //
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
            if (vw$SetGlobal('isBusy')) {
                return;
            } else {
                vw$SetGlobal('isBusy', true);
            }
            var droppedLi = $(this);
            vw$SetGlobal('isBusy', true);
            ev = ifAuto(ev);
            setTimeout(function () {
                doMouseUpWait(droppedLi);
            },100);
        };
        var doMouseUpWait = function (pDroppedLi) {
            pDroppedLi.closest('ul').closest('div').closest('body');
            liFlash(pDroppedLi);
            pDroppedLi.unbind('mousemove', doMouseMove);
            $('body').unbind('mousemove', doMouseMove);
            $('#myContainer').css('cursor', 'default');
            $('#myContainer').find('*').css('cursor', 'default');
            $('#myContainer').find("ul.connectedSortable").children('li').css("cursor", "pointer");

            setTimeout(function () {
                vw$SetGlobal('isBusy', false);
            }, 250);

            function liFlash(_droppedLi) {
                liOn(_droppedLi);
                setTimeout(function () {
                    liOff(_droppedLi);
                }, 150);

                function liOn(_dLi) {
                    _dLi.removeClass('moveBg');
                    if (_dLi.isLiOrdered()) {
                        _dLi.unbind('mousedown', doMouseDown);
                        var allLiIdx = _dLi.getAllLiIdx();
                        uObj.indexObj.setDone(allLiIdx);
                        _dLi.addClass(vw$GetGlobal('onDoneClassLi'));
                    }
                    _dLi.addClass('myFlashLi');
                    _dLi.closest('ul').closest('div').closest('body');
                }

                function liOff(_dLi) {
                    _dLi.removeClass('myFlashLi');
                    _dLi.closest('ul').closest('div').closest('body');
                    uObj.indexObj.updateOnDrop();
                    if (uDndUlList.init.find('li:not(.' + uObj.onDoneClassLi + ')').length < 1) {
                        setTimeout(function () {
                            uObj.onDoneFunction();
                        }, 1500);
                    }
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
                uDndUlList.curr = mySelf;
                uDndUlList.init = mySelf;
                vw$SetGlobal('ulListInit', uDndUlList.init);

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
