//
(function ($, window, document, undefined) {
  $.fn.ujQuiDndPlugin = function () {
    /* Set internal "this" */
    var mySelf = this;

    /* ******************************************************************************** */
    // Global prototypes
    //

    //
    /* ******************************************************************************** */
    /* ******************************************************************************** */
    /* BEGIN jQuery extensions
    /* ******************************************************************************** */
    /* ******************************************************************************** */
    //
    jQuery.fn.getHovered = function (coord) {
      var myRtn = null;
      for (let i = 0, iEnd = this.length; i < iEnd; i++) {
        if (vw$IsWithinRect(coord, vw$GetBoundingRect(this.eq(i)))) {
          myRtn = this.eq(i);
          break;
        }
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
      var rtnAllLiList;
      var isFirst = true;
      var tmpAllLiList = vw$GetGlobal('ulListInit').find('li:not(.moveBg');
      var idx;
      while ((idx = tmpAllLiList.loop()) > -1) {
        if (tmpAllLiList.eq(idx).css('display') == 'none') {
          tmpAllLiList.eq(idx).attr('displaynone', 'true');
        }
      }
      rtnAllLiList = tmpAllLiList.not('[displaynone]');
      return rtnAllLiList;
    };
    jQuery.fn.getAllLiList = function () {
      return vw$GetGlobal('ulListInit').find('li');
    };
    jQuery.fn.getDoneLiList = function () {
      var myRtn = vw$GetGlobal('ulListInit').find('li.' + vw$GetGlobal('onDoneClassLi'));
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
      uObj.ulListSortable = $().getUlList();
      //tolerance: "pointer",
      uObj.sortableObj = uObj.ulListSortable.sortable({
        connectWith: ".connectedSortable",
        cursor: "move",
        distance: 0,
        helper: "clone",
        placeholder: "ui-sortable-placeholder",
        tolerance: "intersect"
      }).disableSelection();
      uObj.sortableObj.on("sortstart", function (event, ui) {
        vw$GetGlobal('gContext').doMouseDown(event, ui);
      });

    };
    //
    var doMouseDown = function (ev, ui) {
      vw$SetGlobal('isBusy', true);
      //ev.preventDefault();
      //ev.stopPropagation();
      uObj.helper = ui.helper;
      uObj.helper.addClass('moveBg');
      uObj.indexObj = createIndexObjFactory();
      uObj.indexObj.init();
      var holderIdxObj = {
        liIdx: -1,
        ulIdx: -1
      };
      vw$SetGlobal('lastHolderIdxObj', holderIdxObj);
      uObj.sortableObj.on("sort", function (event, ui) {
        vw$GetGlobal('gContext').doMouseMove(event, ui);
      });
      uObj.sortableObj.on("sortbeforestop", function (event, ui) {
        vw$GetGlobal('gContext').doMouseUpStart(event, ui);
      });
      uObj.sortableObj.on("sortstop", function (event, ui) {
        vw$GetGlobal('gContext').doMouseUpDone(event, ui);
      });
      if (uObj.auto.isAutoOn) {
        uObj.sortableObj.on("sortchange", function (event, ui) {
          vw$GetGlobal('gContext').doItemChange(event, ui);
        });
      }
      vw$SetGlobal('isBusy', false);
      return true;
    };
    //
    var doMouseMove = function (ev, ui) {
      //
      function getHoveredLi(pHelperLi) {
        var rtnHoveredLi = null;
        var rect = vw$GetBoundingRect(pHelperLi);
        var y = (rect.top + rect.bottom) / 2;
        var x = rect.left;
        var coord = new vw$CoordDef(x, y);
        var allCtrLiList = $().getAllCtrLiList();
        rtnHoveredLi = allCtrLiList.getHovered(coord);
        if (!(rtnHoveredLi)) {
          x = (rect.left + rect.right) / 2;
          coord = new vw$CoordDef(x, y);
          rtnHoveredLi = allCtrLiList.getHovered(coord);
          if (!(rtnHoveredLi)) {
            x = rect.left;
            coord = new vw$CoordDef(x, y);
            rtnHoveredLi = allCtrLiList.getHovered(coord);
          }
        }
        return rtnHoveredLi;
      }
      //
      if (vw$SetGlobal('isBusy')) {
        return;
      } else {
        vw$SetGlobal('isBusy', true);
      }
      //ev.preventDefault();
      //ev.stopPropagation();
      var currHolderLi = ui.placeholder;
      var currHolderLiIdx = $().getAllCtrLiList().index(currHolderLi);
      var currHolderUl = currHolderLi.parent();
      var currHolderUlIdx = $().getUlList().index(currHolderUl);
      var currHolderIdxObj = {
        liIdx: currHolderLiIdx,
        ulIdx: currHolderUlIdx
      };
      var helperOffset1, helperOffset2;
      //
      if (uObj.auto.isAutoOn) {
        var helperLi = ui.helper;
        helperOffset1 = helperLi.offset();
        var helperUl = helperLi.parent();
        var helperUlIdx = $().getUlList().index(helperUl);
        var helperSortIdx = parseInt(helperLi.getSortNum()) - 1;
        if (helperSortIdx < 17) {
          if (helperUlIdx != 0) {
            $().getUlList().eq(0).append(helperLi);
          }
        }
        var newHolderLiIdx;
        var hoveredLi = getHoveredLi(helperLi);
        //
        if ((hoveredLi) && (!(hoveredLi.hasClass('ui-state-disabled')))) {
          newHolderLiIdx = $().getAllCtrLiList().index(hoveredLi);
          if (newHolderLiIdx != currHolderLiIdx) {
            if (newHolderLiIdx > currHolderLiIdx) {
              currHolderLi.insertAfter(hoveredLi);
            } else {
              currHolderLi.insertBefore(hoveredLi);
            }
            currHolderLi = $().getAllCtrLiList().filter('.ui-sortable-placeholder');
            currHolderLi.closest('body');
            ui.placeholder = currHolderLi;
            currHolderLiIdx = $().getAllLiList().index(currHolderLi);
            currHolderUl = currHolderLi.parent();
            currHolderUlIdx = $().getUlList().index(currHolderUl);
          }
          currHolderIdxObj = {
            liIdx: currHolderLiIdx,
            ulIdx: currHolderUlIdx
          };
        } else {
          currHolderIdxObj = vw$GetGlobal('lastHolderIdxObj');
          currHolderLi.insertBefore($().getAllCtrLiList().eq(currHolderIdxObj.liIdx));
        }
      }
      //
      var lastHolderIdxObj = vw$GetGlobal('lastHolderIdxObj');
      if (currHolderIdxObj.ulIdx > -1) {
        if (lastHolderIdxObj.ulIdx > -1) {
          if ((currHolderIdxObj.ulIdx != lastHolderIdxObj.ulIdx) ||
            (currHolderIdxObj.liIdx != lastHolderIdxObj.liIdx)) {
            uObj.indexObj.updateOnMove();
            vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
            uObj.sortableObj.sortable("refreshPositions");
          }
        } else {
          vw$SetGlobal('lastHolderIdxObj', currHolderIdxObj);
        }
      }
      if (uObj.auto.isAutoOn) {
        helperOffset2 = $().getAllLiList().filter('.moveBg').offset();
        if ((helperOffset1.top != helperOffset2.top) || (helperOffset1.left != helperOffset2.left)) {
          $().getAllLiList().filter('.moveBg').offset(helperOffset1);
        }
      }
      vw$SetGlobal('isBusy', false);
      return true;
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
            li.addClass(vw$GetGlobal('onDoneClassLi'));
            li.closest('ul').closest('body');
          }
        }
      };
      //
      indexObj.prototype.updateOnMove = function () {
        var kidx = 0;
        var ulList = $().getUlList();
        var allLiList = $().getAllLiList();
        while ((kidx = allLiList.loop()) > -1) {
          if (allLiList.eq(kidx).css('display') == 'none') {
            allLiList.eq(kidx).attr('displaynone', 'true');
          } else {
            allLiList.eq(kidx).removeAttr('displaynone');
          }
        }
        var doneLiList;
        var doneLi;
        var notDoneLiList;
        var liSortedIndex;
        var mirrorUlList;
        var mirrorAllLiList;
        var mirrorNotDoneLiList;
        var mirrorDoneLiList;
        //
        if (isErr()) {
          mirrorUlList = $().getUlList().clone();
          mirrorUlList.removeClass('connectedSortable').addClass('notConnected');
          mirrorDoneLiList = mirrorUlList.find('li.' + vw$GetGlobal('onDoneClassLi')).attr('class', '');
          mirrorDoneLiList.addClass('ui-state-default').addClass('ui-sortable-handle');
          doneLiList = ulList.find('li.' + vw$GetGlobal('onDoneClassLi'));
          while (doneLiList.length > 0) {
            mirrorAllLiList = (mirrorUlList.find('li').not('.moveBg')).not('[displaynone]');
            doneLi = doneLiList.eq(0);
            liSortedIndex = parseInt(doneLi.attr('allIndex'));
            mirrorAllLiList.eq(liSortedIndex).replaceWith(doneLi);
            doneLiList = ulList.find('li.' + vw$GetGlobal('onDoneClassLi'));
          }
          //
          mirrorNotDoneLiList = mirrorUlList.find('li').not('.' + vw$GetGlobal('onDoneClassLi'));
          notDoneLiList = ulList.find('li').not('.' + vw$GetGlobal('onDoneClassLi'));
          while ((kidx = notDoneLiList.loop()) > -1) {
            mirrorNotDoneLiList.eq(kidx).replaceWith(notDoneLiList.eq(kidx));
          }
          //
          ulList.find('li').remove();
          mirrorAllLiList = mirrorUlList.find('li');
          var isHelper, isHidden;
          var ctr = 0;
          while ((kidx = mirrorAllLiList.loop()) > -1) {
            isHelper = (mirrorAllLiList.eq(kidx).hasClass('moveBg'));
            isHidden = (mirrorAllLiList.eq(kidx).css('display') == 'none');
            if (ctr < 17) {
              ulList.eq(0).append(mirrorAllLiList.eq(kidx));
            } else if (ctr < 34) {
              ulList.eq(1).append(mirrorAllLiList.eq(kidx));
            } else {
              ulList.eq(2).append(mirrorAllLiList.eq(kidx));
            }
            if (!isHelper && !isHidden) {
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
          allLilist = $().getAllCtrLiList();
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
        if (isErr()) {
          if (fmUlIdx > toUlIdx) {
            liDoneList = ulList.eq(fmUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + ',li.moveBg');
            fmLi = ulList.eq(fmUlIdx).find('li').not(liDoneList).first();
            liDoneList = ulList.eq(toUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + 'li.moveBg');
            toLi = ulList.eq(toUlIdx).find('li').not(liDoneList).last();
            if (toLi.length > 0) {
              fmLi.insertAfter(toLi);
            } else {
              ulList.eq(toUlIdx).append(fmLi);
            }
          } else if (fmUlIdx < toUlIdx) {
            liDoneList = ulList.eq(fmUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + 'li.moveBg');
            fmLi = ulList.eq(fmUlIdx).find('li').not(liDoneList).last();
            liDoneList = ulList.eq(toUlIdx).find('li.' + vw$GetGlobal('onDoneClassLi') + ',li.moveBg');
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
            currSize = (ulList.eq(fidx).find('li').not('.moveBg')).not('[displaynone]').length;
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
    var doItemChange = function (ev, ui) {
      uObj.sortableObj.sortable("refreshPositions");
    };
    //

    /*** Mouseup event handler ***/
    var doMouseUpStart = function (ev, ui) {
      vw$SetGlobal('isBusy', true);
      vw$GetGlobal('gContext').liDroppedId = '#' + ui.item.attr('id');
    };
    var doMouseUpDone = function (ev, ui) {
      uObj.sortableObj.sortable('disable');
      uObj.droppedLi = $(vw$GetGlobal('gContext').liDroppedId);
      uObj.droppedLi.closest('ul').closest('div').closest('body');
      liFlash(uObj.droppedLi);
      setTimeout(function () {
        vw$SetGlobal('isBusy', false);
        uObj.sortableObj.sortable('enable');
      }, 250);

      function liFlash(_droppedLi) {
        liOn(_droppedLi);
        setTimeout(function () {
          liOff(_droppedLi);
        }, 150);

        function liOn(_dLi) {
          _dLi.removeClass('moveBg');
          _dLi.addClass('myFlashLi');
          if (_dLi.isLiOrdered()) {
            _dLi.unbind('mousedown', doMouseDown);
            var allLiIdx = _dLi.getAllLiIdx();
            uObj.indexObj.setDone(allLiIdx);
            _dLi.addClass(vw$GetGlobal('onDoneClassLi'));
          }
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
      var saveX, saveY;
      if (uObj.auto.isAutoOn) {
        if ((ev.type.toLowerCase().indexOf('mousemove') > -1) || (ev.type.toLowerCase().indexOf('mouseup') > -1)) {
          ev.pageX = uObj.auto.mouseXAbs;
          ev.pageY = uObj.auto.mouseYAbs;
          uObj.auto.sortable._mouseDrag(ev);
          uObj.auto.sortable = $.data(uObj.auto.btn.parent()[0], 'ui-sortable');
        }
      }
      return ev;
    };
    //
    var doDummyMouseMove = function (ev) {
      if (!($(ev.target).hasClass('moveBg'))) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }
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
        uObj: {},
        doMouseDown: {},
        doMouseMove: {},
        doMouseUpStart: {},
        doMouseUpDone: {},
        doItemChange: {},
        liDroppedId: ''
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
        this.context.doMouseMove = doMouseMove;
        this.context.doMouseUpStart = doMouseUpStart;
        this.context.doMouseUpDone = doMouseUpDone;
        this.context.doItemChange = doItemChange;

        vw$SetGlobal('gContext', this.context);
        //
        // Initialize the li's accidentally in sort order
        uObj.indexObj = new createIndexObjFactory();
        uObj.indexObj.init();
        //
        uObj.auto = {};
        uObj.auto.isAutoOn = false;
        uObj.auto.mouseX = 0;
        uObj.auto.mouseY = 0;
        uObj.auto.btn = {};
        uObj.auto.placeholder = {};
        uObj.auto.eventDummy = doDummyMouseMove;
        vw$SetGlobal('isBusy', false);
        //
        uObj.ulListSortable = {};
        uObj.sortableObj = {};
        myMakeUlDnd();
        //
        return mySelf;
      },
      auto: function () {
        uObj.auto.isAutoOn = true;
        //
        var autoFactory = function () {
          //         
          var autoObj = function () {
            this.intervalTimer = null;
            this.stepList = [];
            this.stepListAbs = [];
            this.allLiList = [];
            this.checkLiList = [];
            this.checkListLength = {};
            this.pos = {};
            this.destPos = {};
            this.destLiIdx = {};
            $('#divContainerCover').show();
            $('#divContainerCover').closest('body');
            $('#divContainerCover').css('pointer-events', 'none');
            $('#divContainerCover').css({
              'cursor': 'none'
            });
            this.calcSteps = function () {
              this.stepList = [];
              var x1 = parseInt(this.pos.left);
              var x2 = parseInt(this.destPos.left + 1);
              var y1 = parseInt(this.pos.top);
              var y2 = parseInt(this.destPos.top + 1);
              var newX, newY, steps;
              //* *********************************************
              //* y=mx+b; thus y=(x/(1/m))+b
              //* *** 
              //* Similarly, if m=(y2-y1)/(x2-x) then..
              //* let dxdy = (1/m), then  dxdy=(x2-x1)/(y2-y1);
              //* ***
              //* then we have y=(x/dxdy)+b, and b=y-(x/dxdy);
              //* ... and simmilarly x=(y-b)*dxdy;
              //* *********************************************
              var dx = (x2 - x1);
              var dy = (y2 - y1);
              var m = dy / dx;
              var b1 = y1 - m * x1;
              var b2 = y2 - m * x2;
              var b = parseInt((b1 + b2) / 2);
              //
              var isMoveByX = Math.abs(dx) > Math.abs(dy);
              //
              newX = x1;
              newY = y1;
              if (isMoveByX) {
                steps = parseInt(Math.abs(x2 - x1) / 20);
                for (let i = 0; i < steps; i++) {
                  newX = newX + 20;
                  newY = parseInt((m * newX) + b);
                  this.stepList.push(new vw$CoordDef(newX - x1, newY - y1));
                  this.stepListAbs.push(new vw$CoordDef(newX, newY));
                }
              } else {
                steps = parseInt(Math.abs(y2 - y1) / 20);
                for (let i = 0; i < steps; i++) {
                  newY = newY + 20;
                  newX = parseInt((newY - b) / m);
                  this.stepList.push(new vw$CoordDef(newX - x1, newY - y1));
                  this.stepListAbs.push(new vw$CoordDef(newX, newY));
                }
              }
              if ((newX != x2) || (newY != y2)) {
                this.stepList.push(new vw$CoordDef(x2 - x1, y2 - y1));
                this.stepListAbs.push(new vw$CoordDef(x2, y2));
              }
              uObj.auto.stepList = this.stepList;
              uObj.auto.stepListAbs = this.stepListAbs;
            };
          };
          autoObj.prototype.init = function () {
            this.autoCallBack();
          };
          autoObj.prototype.autoCallBack = function () {
            if (this.intervalTimer != null) {
              clearInterval(this.intervalTimer);
            }
            this.stepList = [];
            this.allLiList = $().getAllCtrLiList();
            this.checkLiList = this.allLiList.not($().getDoneLiList());
            this.checkListLength = this.checkLiList.length;
            var currLi, destLi;
            if (this.checkListLength > 0) {
              currLi = this.checkLiList.eq(0);
              uObj.auto.btn = currLi;
              uObj.auto.sortable = $.data(uObj.auto.btn.parent()[0], 'ui-sortable');
              this.pos = uObj.auto.btn.offset();
              uObj.auto.mouseX = this.pos.left;
              uObj.auto.mouseY = this.pos.top;
              this.destLiIdx = parseInt(currLi.attr('allIndex'));
              destLi = this.allLiList.eq(this.destLiIdx);
              this.destPos = destLi.offset();
              this.calcSteps();
              uObj.auto.btn.simulate('mousedown');
              uObj.auto.btn.closest('body');
              uObj.auto.placeholder = uObj.auto.btn.parent().find('li.ui-sortable-placeholder');
              uObj.auto.placeholder.closest('body');
              uObj.auto.firstStep = true;
              vw$SetGlobal('autoContext', this);
              this.intervalTimer = setInterval(this.autoStep, 150);
            } else {
              $('body').unbind('mousemove', uObj.auto.eventDummy);
              $('body').css({
                'cursor': 'default'
              });
              $('*').css({ 'cursor': 'default' });
              $('#divContainerCover').css('pointer-events', 'auto');
              $('#divContainerCover').hide();
            }
          };
          autoObj.prototype.autoStep = function () {
            if (vw$GetGlobal('isBusy')) {
              return;
            }
            if (uObj.auto.firstStep) {
              uObj.auto.firstStep = false;
            } else {
              uObj.sortableObj.sortable("refreshPositions");
            }
            uObj.auto.helper = $().getAllLiList().filter('.moveBg');
            var myContext = vw$GetGlobal('autoContext');
            var listLength = uObj.auto.stepList.length;
            var newCoord = new vw$CoordDef(uObj.auto.mouseX, uObj.auto.mouseY);
            if (listLength > 0) {
              newCoord = uObj.auto.stepList.shift();
              uObj.auto.mouseX = newCoord.x;
              uObj.auto.mouseY = newCoord.y;
              uObj.auto.helper.simulate('mousemove', {
                clientX: uObj.auto.mouseX,
                clientY: uObj.auto.mouseY
              });
            } else {
              var allCtrLiList = $().getAllCtrLiList();
              var destLi = allCtrLiList.filter('.ui-sortable-placeholder');
              var destLiIdx = allCtrLiList.index(destLi);
              if (destLiIdx != myContext.destLiIdx) {
                if (destLiIdx < myContext.destLiIdx) {
                  $().getAllCtrLiList().eq(destLiIdx).insertAfter($().getAllCtrLiList().eq(myContext.destLiIdx));
                } else {
                  $().getAllCtrLiListx().eq(destLiIdx).insertBefore($().getAllCtrLiList().eq(myContext.destLiIdx));
                }
                destLi = $().getAllCtrLiList().filter('.ui-sortable-placeholder');
                destLiIdx = $().getAllCtrLiList().index(destLi);
              }
              if (destLiIdx < myContext.destLiIdx) {
                newCoord.x = uObj.auto.mouseX;
                newCoord.y = uObj.auto.mouseY + 1;
                uObj.auto.stepList.push(newCoord);
              } else if (destLiIdx > myContext.destLiIdx) {
                newCoord.x = uObj.auto.mouseX;
                newCoord.y = uObj.auto.mouseY - 1;
                uObj.auto.stepList.push(newCoord);
              } else {
                uObj.auto.helper.parent().simulate('mouseup');
                clearInterval(myContext.intervalTimer);
                setTimeout(function () {
                  myContext.autoCallBack();
                }, 300);
              }
            }
          };
          //
          myRtn = new autoObj();
          return myRtn;
        };
        uObj.auto.obj = autoFactory();
        $('body').bind('mousemove', uObj.auto.eventDummy);
        $('body').css({
          'cursor': 'none'
        });
        $('*').css({ 'cursor': 'none' });
        uObj.auto.obj.init();
      }
    };
    return myResult;
  };
})(jQuery, window, document);
