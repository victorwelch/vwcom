//
(function ($, window, document, undefined) {
  $.fn.uTblDndPlugin = function () {
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
    jQuery.fn.getBounds = function () {
      var myRtn = null;
      var myTmp = [];
      for (let i = 0, iEnd = this.length; i < iEnd; i++) {
        myTmp.push(vw$GetBoundingRect(this.eq(i)));
      }
      if (myTmp.length > 0) { myRtn = myTmp; }
      return myRtn;
    };
    //
    jQuery.fn.getPos = function () {
      var myRtn = null;
      var myTmp = [];
      for (let i = 0, iEnd = this.length; i < iEnd; i++) {
        myTmp.push(vw$GetPosition(this.eq(i)));
      }
      if (thisLength > 0) { myRtn = myTmp; }
      return myRtn;
    };
    //
    jQuery.fn.createDragDiv = function () {
      function cssSet(myRect) {
        var wrapperRect = $(vw$GetGlobal('wrapperId')).getBounds()[0];
        vw$SetGlobal('wrapperRect', wrapperRect);
        var myRtn = {
          "position": "absolute",
          "top": (myRect.top - wrapperRect.top) + 'px',
          "left": (myRect.left - wrapperRect.left) + 'px',
          "height": myRect.height + 'px',
          "width": myRect.width + 'px',
          "cursor": 'move'
        };
        return myRtn;
      }
      var myDummy = {};
      var myRtn = null;
      var myTmp = null;
      var myCss = '';
      var mySortNum = '';
      var myNewDivOuter = {};
      var myNewDivInner = {};
      var myRect = {};
      var thisLength = this.length;
      if (thisLength == 1) {
        myNewDivInner = $('<div class="tg2 tg-zax"><div>');
        $(myNewDivInner).append(this.children('.tg-zax').children());
        myDummy = $(myNewDivInner).children();
        if (myDummy.length > 2) {
          $(myNewDivInner).children().first().remove();
        }
        //
        myNewDivOuter = $('<div id="trdiv" trdiv="1" class="' + vw$GetGlobal('onDragClassTr') + '" style="display:inline-block;"></div>');
        myCss = cssSet(vw$GetBoundingRect(this));
        $(myNewDivOuter).css(myCss);
        $(myNewDivOuter).append(myNewDivInner);
        //
        myTmp = $(vw$GetGlobal('wrapperId')).append(myNewDivOuter);
      }
      if (myTmp) { myRtn = myTmp.children('div').last(); }

      return myRtn;
    };
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
    jQuery.fn.getHoveredTbl = function (coord) {
      var tmpObj = null;
      var myRtn = null;
      if (this.is('table')) {
        tmpObj = this.getHovered(coord);
        if (tmpObj) {
          myRtn = {};
          myRtn.jObj = tmpObj;
          myRtn.index = this.index(myRtn.jObj);
        }
      }
      return myRtn;
    };
    //
    jQuery.fn.getHoveredRow = function (mouseCoord) {
      var myRtn = null;
      if (this.is('table')) {
        var tblRowList = $(this).find('tr');
        var filteredTblRowList = tblRowList.not('.' + vw$GetGlobal('onDoneClassTr'));
        var tblRow;
        if (filteredTblRowList.length > 0) {
          tblRow = filteredTblRowList.getHovered(mouseCoord);
        } else {
          tblRow = tblRowList.getHovered(mouseCoord);
        }
        var tblRowIdx = (tblRow) ? tblRowList.index(tblRow) : -1;
        var allRowIdx = -1;
        if (tblRowIdx > -1) {
          allRowIdx = tblRow.getAllRowIdx();
        }
        myRtn = {};
        myRtn.jObj = tblRow;
        myRtn.tblRowIndex = tblRowIdx;
        myRtn.allRowIndex = allRowIdx;
      }
      return myRtn;
    };
    //
    jQuery.fn.isTableFilled = function () {
      var myRtn = null;
      if (this.is('table')) {
        var rowList = this.find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')');
        myRtn = (rowList.length == 0);
      }
      return myRtn;
    };
    //
    jQuery.fn.isRowDone = function () {
      var myRtn = null;
      if (this.is('tr')) {
        myRtn = $(this).hasClass(vw$GetGlobal('onDoneClassTr'));
      }
      return myRtn;
    };
    //
    jQuery.fn.isRowOccupy = function () {
      var myRtn = null;
      if (this.is('tr')) {
        myRtn = $(this).hasClass(vw$GetGlobal('occupyClass'));
      }
      return myRtn;
    };
    //
    jQuery.fn.isRowOrdered = function () {
      myRtn = null;
      if (this.is('tr')) {
        var mySortNum = parseInt(this.attr('sortNum'));
        var myRowIdx = mySortNum - 1;
        var thisRowIdx = this.getAllRowIdx();
        myRtn = (myRowIdx == thisRowIdx);
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
      if (this.is('tr')) {
        if (this.hasAttr('sortNum')) {
          myRtn = this.attr('sortNum');
        } else {
          myRtn = parseInt(this.getAllRowIdx()) + 1;
          this.attr('sortNum', myRtn);
        }
      }
      return myRtn;
    };
    //
    jQuery.fn.getAllRowIdx = function () {
      var myRtn = null;
      if (this.is('tr')) {
        var allRowList = $().getAllRowList();
        var allRowIdx = allRowList.index(this);
        myRtn = allRowIdx;
      }
      return myRtn;
    };
    jQuery.fn.getTblRowIdx = function () {
      var myRtn = null;
      if (this.is('tr')) {
        var tbl = this.closest('table');
        var tblList = $().getTblList();
        var tblIdx = tblList.index(tbl);
        var tblRowIdx = $(tblList[tblIdx]).find('tr').index(this);
        myRtn = {};
        myRtn.tblIndex = tblIdx;
        myRtn.tblRowIndex = tblRowIdx;
      }
      return myRtn;
    };
    jQuery.fn.getAllRowList = function () {
      return vw$GetGlobal('tblListInit').find('tr');
    };
    jQuery.fn.getDoneRowList = function () {
      return vw$GetGlobal('tblListInit').find('tr.' + vw$GetGlobal('onDoneClassTr'));
    };
    jQuery.fn.getTblList = function () {
      return vw$GetGlobal('tblListInit');
    };
    /* ******************************************************************************** */
    /* ******************************************************************************** */
    /* BEGIN Private functions   
    /* ******************************************************************************** */
    /* ******************************************************************************** */
    /*** Hold config and state variables ***/
    var uDndTblList = {};
    var uObj = {};
    var uInfoObj = {};
    /*
    /*** Assign mousedown event to DnD buttons ***/
    var myMakeTblDnd = function () {
      //debugger;
      var allBtnList = $().getAllRowList().find('[dndbtn]');
      allBtnList.bind('mousedown', myMouseDown);
    };
    //
    var myMouseDown = function (ev) {
      vw$SetGlobal('isBusy', true);
      ev.preventDefault();
      ev.stopPropagation();
      ev = ifAuto(ev);
      uInfoObj = createInfoObjFactory();
      uInfoObj.init(this, ev);
      uObj.uInfoObj = uInfoObj;
      $('body').bind('mousemove', myMouseMove);
      $('body').bind('mouseup', myMouseUp);
      $('#myContainer').css('cursor', 'move');
      $('#myContainer').find('*').css('cursor', 'move');
      $(ev.target).css('cursor', 'move');
      vw$SetGlobal('isBusy', false);
      return false;
    };
    //
    var createIndexObjFactory = function () {
      var myRtn = null;
      var indexObj = function () {
        this.scoreBoard = [].setValues(50, false);
        this.mirrorTblListCopy = {};
      };
      indexObj.prototype.init = function () {
        var row;
        var allRowList = $().getAllRowList();
        for (let i = 0, iEnd = allRowList.length; i < iEnd; i++) {
          row = allRowList.eq(i);
          if ((row.isRowOrdered()) && (!this.isDone(i))) {
            this.setDone(i);
            row.find('[dndbtn]').first().unbind('mousedown', vw$GetGlobal('gContext').myMouseDown);
            row.find('[dndbtn]').removeAttr('dndbtn');
            row.find('div.stateDiv').removeClass('stateDiv').addClass('stateDivNoHover');
            row.addClass(vw$GetGlobal('onDoneClassTr'));
            row.closest('table').closest('body');
          }
        }
        for (let i = 0, iEnd = allRowList.length; i < iEnd; i++) {
          allRowList.eq(i).closest('table').closest('body');
        }

      };
      indexObj.prototype.updateOnMove = function () {
        var gContext = vw$GetGlobal('gContext');
        var doneRowList = $().getDoneRowList();
        var doneRow = {};
        var rowSortedIndex;
        var allRowList;
        //
        if (isErr()) {
          this.mirrorTblListCopy = vw$GetGlobal('mirrorTblList').clone();
          var mirrorAllRowList = this.mirrorTblListCopy.find('tr');
          var mirrorRow = {};
          for (let i = 0, iEnd = doneRowList.length; i < iEnd; i++) {
            doneRow = doneRowList.eq(i);
            rowSortedIndex = parseInt(doneRow.attr('allIndex'));
            mirrorRow = mirrorAllRowList.eq(rowSortedIndex);
            mirrorRow.replaceWith(doneRow);
          }
          //
          var notDoneRowList = $().getAllRowList().filter(':not(.' + vw$GetGlobal('onDoneClassTr') + ')');
          var mirrorNotRowList = this.mirrorTblListCopy.find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')');
          for (let i = 0, iEnd = notDoneRowList.length; i < iEnd; i++) {
            mirrorNotRowList.eq(i).replaceWith(notDoneRowList.eq(i));
          }
          //
          var tblList = $().getTblList();
          for (let i = 0, iEnd = tblList.length; i < iEnd; i++) {
            tblList.eq(i).html(this.mirrorTblListCopy.eq(i).html());
          }
          //
          allRowList = $().getAllRowList();
          for (let i = 0, iEnd = allRowList.length; i < iEnd; i++) {
            allRowList.eq(i).closest('table').closest('body');
          }
          tblList = $().getTblList();
          var myInfoObj = gContext.uObj.uInfoObj;
          var scrTblIdx = myInfoObj.ui.srcTbl.index;
          var destTblIdx = myInfoObj.ui.destTbl.index;
          myInfoObj.ui.srcTbl.jObj = tblList.eq(scrTblIdx);
          myInfoObj.ui.destTbl.jObj = tblList.eq(destTblIdx);
          //
          allRowList = $().getAllRowList();
          var rowIndex = myInfoObj.ui.destTbl.row.allIndex;
          myInfoObj.ui.destTbl.row.jObj = allRowList.eq(rowIndex);
          //
          var occupyJobj = allRowList.filter('.' + vw$GetGlobal('occupyClass'));
          var occupyIdx = allRowList.index(occupyJobj);
          myInfoObj.ui.occupy.jObj = occupyJobj;
          myInfoObj.ui.occupy.allIndex = occupyIdx;
          //
          var allBtnList = $().getTblList().find('[dndbtn]');
          allBtnList.unbind('mousedown', gContext.myMouseDown);
          allBtnList.bind('mousedown', gContext.myMouseDown);
        }
        function isErr() {
          myRtn = false;
          allRowList = $().getAllRowList();
          var doneRowIdx;
          for (let i = 0, iEnd = doneRowList.length; i < iEnd; i++) {
            doneRow = doneRowList.eq(i);
            doneRowIdx = allRowList.index(doneRow);
            rowSortedIndex = parseInt(doneRow.attr('allIndex'));
            if (doneRowIdx != rowSortedIndex) {
              myRtn = true;
              break;
            }
          }
          return myRtn;
        }
      };
      indexObj.prototype.updateOnDrop = function () {
        this.updateOnMove();
        var row;
        var allRowList = $().getAllRowList();
        for (let i = 0, iEnd = allRowList.length; i < iEnd; i++) {
          row = allRowList.eq(i);
          if ((row.isRowOrdered()) && (!this.isDone(i))) {
            this.setDone(i);
            row.find('[dndbtn]').first().unbind('mousedown', vw$GetGlobal('gContext').myMouseDown);
            row.find('[dndbtn]').removeAttr('dndbtn');
            row.find('div.stateDiv').removeClass('stateDiv').addClass('stateDivNoHover');
            row.addClass(vw$GetGlobal('onDoneClassTr'));
            row.closest('table').closest('body');
          }
        }
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
    var createMouseObjFactory = function () {
      var myRtn = null;
      var mouseObj = function () {
        this.offset = new vw$CoordDef();
        this.objOffset = new vw$RectDef();
        this.mouseCoord = new vw$RectDef();
        this.newCoord = new vw$CoordDef();
        this.oldCoord = new vw$CoordDef();
        this.isMovingDown = null;
      };
      mouseObj.prototype.isMoveY = function () { return (this.newCoord.y != this.oldCoord.y); };
      mouseObj.prototype.setMovingDown = function () {
        myRtn = false;
        if (this.isMoveY()) {
          myRtn = (this.newCoord.y > this.oldCoord.y) ? true : false;
        }
        this.isMovingDown = myRtn;
      };
      mouseObj.prototype.setNewCoord = function (ev) {
        var mousePos = vw$GetMouseCoords(ev);
        this.newCoord = mousePos;
        this.mouseCoord = mousePos;
        this.setMovingDown();
      };
      mouseObj.prototype.resetOldCoord = function () {
        this.oldCoord = this.newCoord;
      };
      mouseObj.prototype.initOldCoord = function (ev) {
        this.oldCoord = vw$GetMouseCoords(ev);
      };
      mouseObj.prototype.setOffset = function (dragObj, ev) {
        this.offset = vw$GetMouseOffset(dragObj, ev);
        this.objOffset = vw$GetObjOffset(dragObj, ev);
      };
      mouseObj.prototype.move = function (dragObj, ev) {
        this.setNewCoord(ev);
        //
        handleScroll(this);
        //
        this.dragObjCoord = new vw$CoordDef(
          (this.mouseCoord.x - vw$GetGlobal('wrapperRect').left + this.objOffset.left),
          (this.mouseCoord.y - vw$GetGlobal('wrapperRect').top + this.objOffset.top)
        );
        //
        var elemObj = dragObj[0];
        elemObj.style.top = this.dragObjCoord.y + 'px';
        elemObj.style.left = this.dragObjCoord.x + 'px';
        //
        return this.newCoord;
        //
        function handleScroll(thisObj) {
          //auto scroll the window
          var yOffset = window.pageYOffset;
          if (document.all) {
            // Windows version
            //yOffset=document.body.scrollTop;
            if (typeof document.compatMode !== typeof myUndefined &&
              document.compatMode != 'BackCompat') {
              yOffset = document.documentElement.scrollTop;
            } else if (typeof document.body !== typeof myUndefined) {
              yOffset = document.body.scrollTop;
            }
          }

          if (thisObj.newCoord.y - yOffset < uObj.scrollAmount) {
            window.scrollBy(0, -  uObj.scrollAmount);
          } else {
            var windowHeight = window.innerHeight ? window.innerHeight :
              document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
            if (windowHeight - (thisObj.newCoord.y - yOffset) < uObj.scrollAmount) {
              window.scrollBy(0, uObj.scrollAmount);
            }
          }
          //
        }
      };
      myRtn = new mouseObj();
      return myRtn;
    };
    var createInfoObjFactory = function () {
      var myRtn = null;
      var infoObj = function () {
        this.ui =
        {
          "srcTbl": {
            "jObj": {},
            "index": {},
            'savedRow': {}
          },
          "drag": {
            "jObj": {},
            "mouse": createMouseObjFactory()
          },
          "occupy": {
            "jObj": {},
            "tblIndex": {},
            "allIndex": {}
          },
          "destTbl": {
            "jObj": {},
            "index": {},
            "rowList": {},
            "rowListFirst": 0,
            "row": {},
            "isNewTbl": false,
            "isMoveRow": false
          },
        };
      };
      infoObj.prototype.init = function (button, ev) {
        //
        $(button).closest('tr').closest('table').closest('body');
        var myTbl = $(button).closest('table');
        myTbl.closest('body');
        var myTblIdx = uDndTblList.curr.index(myTbl);
        var myTblRowList = myTbl.find('tr');
        var myAllRowList = $().getAllRowList();
        //
        var myBtnSelRow = $(button).closest('tr');
        var myBtnSelRowSave = myBtnSelRow.clone();
        var myBtnSelRowIdx = myTblRowList.index(myBtnSelRow);
        var myAllRowIdx = myAllRowList.index(myBtnSelRow);
        //
        var myDragObj = myBtnSelRow.createDragDiv();
        myTblRowList = myTbl.find('tr');
        var myOccupyRow = myTblRowList.eq(myBtnSelRowIdx);
        //
        this.ui.srcTbl = {
          "jObj": myTbl,
          "index": myTblIdx,
          "rowList": myTblRowList,
          "savedRow": myBtnSelRowSave
        };
        this.ui.drag = {
          "jObj": myDragObj,
          "mouse": new createMouseObjFactory()
        };
        this.ui.occupy = {
          "jObj": myOccupyRow,
          "tblIndex": myBtnSelRowIdx,
          "allIndex": myAllRowIdx
        };
        this.ui.drag.mouse.setOffset(this.ui.drag.jObj, ev);
        this.ui.drag.mouse.setNewCoord(ev);
        this.ui.drag.mouse.initOldCoord(ev);
        //
        this.ui.drag.jObj.addClass(uObj.onDragClassTr);
        this.ui.occupy.jObj.addClass(vw$GetGlobal('occupyClass'));
        this.ui.occupy.jObj.attr('occupy', '1');
        //
        this.ui.indexObj = uObj.indexObj;
      };
      infoObj.prototype.moveMouse = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var locUtil = createUtilObjFactory();
        var thisObj = this;
        var myHoveredRowObj = {};
        var isNewDestTbl = false;
        var isMoveRow = false;
        var isHoveredRow = false;
        var myHoverCoord = this.ui.drag.mouse.move(this.ui.drag.jObj, ev);
        var myHoveredTblObj = uDndTblList.curr.getHoveredTbl(myHoverCoord);
        var isHoveredTbl = false;
        if (myHoveredTblObj) {
          if (
            (myHoveredTblObj.jObj) &&
            ((typeof myHoveredTblObj.index != typeof myUndefined) ? (myHoveredTblObj.index > -1) : false)
          ) {
            isHoveredTbl = true;
          }
        }
        if (isHoveredTbl) {
          myHoveredRowObj = myHoveredTblObj.jObj.getHoveredRow(this.ui.drag.mouse.newCoord);
          isHoveredRow = false;
          if (myHoveredRowObj) {
            if (
              (myHoveredRowObj.jObj) &&
              ((typeof myHoveredRowObj.tblRowIndex != typeof myUndefined) ? (myHoveredRowObj.tblRowIndex > -1) : false)
            ) {
              isHoveredRow = true;
            }
          }
          if (isHoveredRow) {
            if (!(myHoveredRowObj.jObj.hasClass(uObj.onDoneClassTr))) {
              isNewDestTbl = (myHoveredTblObj.index != this.ui.srcTbl.index) ? true : false;
              updateDest();
            }
            if (isMoveRow) {
              moveRow();
            }
          }
        }
        this.ui.drag.mouse.resetOldCoord();
        return;
        //
        function updateDest() {
          thisObj.ui.destTbl.jObj = myHoveredTblObj.jObj;
          thisObj.ui.destTbl.index = myHoveredTblObj.index;
          var myRowListLength = thisObj.ui.destTbl.jObj.find('tr');
          thisObj.ui.destTbl.row = {
            "jObj": myHoveredRowObj.jObj,
            "tblIndex": myHoveredRowObj.tblIndex,
            "allIndex": myHoveredRowObj.allIndex,
            "isFirst": (myHoveredRowObj.tblIndex == 0),
            "isLast": (myHoveredRowObj.tblIndex == (myRowListLength - 1))
          };
          if ((isNewDestTbl) || (myHoveredRowObj.tblIndex != thisObj.ui.occupy.tblIndex)) {
            isMoveRow = true;
          }
          thisObj.ui.destTbl.isNewTbl = isNewDestTbl;
          thisObj.ui.destTbl.isMoveRow = isMoveRow;
          return;
        }
        //
        function moveRow() {
          //
          var occupyObj = $().getAllRowList().filter('.' + vw$GetGlobal('occupyClass'));
          //
          if (thisObj.ui.destTbl.row.isLast) {
            occupyObj.insertAfter(thisObj.ui.destTbl.row.jObj);
          } else if (thisObj.ui.destTbl.row.isFirst) {
            occupyObj.insertBefore(thisObj.ui.destTbl.row.jObj);
          } else if (thisObj.ui.drag.mouse.isMovingDown) {
            occupyObj.insertAfter(thisObj.ui.destTbl.row.jObj);
          } else {
            occupyObj.insertBefore(thisObj.ui.destTbl.row.jObj);
          }
          //
          if (thisObj.ui.destTbl.isNewTbl) {
            //
            var allRowList = $().getAllRowList();
            var notDoneRowCount = allRowList.filter(':not(.' + vw$GetGlobal('onDoneClassTr') + ')').length;
            if (notDoneRowCount < 3) {
              var lastTr = thisObj.ui.destTbl.jObj.find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')').filter(':not(.' + vw$GetGlobal('occupyClass') + ')');
              var lastTrAllRowIndex = parseInt(lastTr.attr('allIndex'));
              var lastTrTblIndex = (lastTrAllRowIndex < 17) ? 0 : (lastTrAllRowIndex < 34) ? 1 : 2;
              var lastTrTbl = $().getTblList().eq(lastTrTblIndex);
              var lastTrTblRowIndex = lastTrAllRowIndex % 17;
              var lastDestTr = lastTrTbl.find('tr').eq(lastTrTblRowIndex);
              lastTr.insertBefore(lastDestTr);
            } else {
              //
              locUtil.fixTblSize();
            }
          }
          //
          thisObj.ui.indexObj.updateOnMove();
          //
          if (thisObj.ui.destTbl.isNewTbl) {
            thisObj.ui.srcTbl.jObj = thisObj.ui.destTbl.jObj;
            thisObj.ui.srcTbl.index = thisObj.ui.destTbl.index;
          }
          //
          thisObj.ui.occupy.jObj.closest('table').closest('body');
          var newRow = {};
          thisObj.ui.destTbl.jObj.closest('table').closest('body');
          newRow.jObj = thisObj.ui.occupy.jObj;
          newRow.tblIndex = newRow.jObj.getTblRowIdx().tblRowIndex;
          newRow.allIndex = newRow.jObj.getAllRowIdx();
          //
          thisObj.ui.occupy.jObj = newRow.jObj;
          thisObj.ui.occupy.tblIndex = newRow.tblIndex;
          thisObj.ui.occupy.allIndex = newRow.allIndex;
          //                       
          return;
        }
        //
      };
      myRtn = new infoObj();
      return myRtn;
    };
    //
    var createUtilObjFactory = function () {
      var myRtn = null;
      var utilObj = function () {
        var dummy = {};
      };
      //
      utilObj.prototype.fixTblSize = function () {
        var tblList = $().getTblList();
        var toTblIdx = -1;
        var fmTblIdx = -1;
        var fmRow, toRow;
        while (isErr()) {
          if (fmTblIdx > toTblIdx) {
            fmRow = tblList.eq(fmTblIdx).find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')').filter(':not(.' + vw$GetGlobal('occupyClass') + ')').first();
            toRow = tblList.eq(toTblIdx).find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')').filter(':not(.' + vw$GetGlobal('occupyClass') + ')').last();
            if (toRow.length > 0) {
              fmRow.insertAfter(toRow);
            } else {
              tblList.eq(toTblIdx).append(fmRow);
            }
          } else if (fmTblIdx < toTblIdx) {
            fmRow = tblList.eq(fmTblIdx).find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')').filter(':not(.' + vw$GetGlobal('occupyClass') + ')').last();
            toRow = tblList.eq(toTblIdx).find('tr:not(.' + vw$GetGlobal('onDoneClassTr') + ')').filter(':not(.' + vw$GetGlobal('occupyClass') + ')').first();
            if (toRow.length > 0) {
              fmRow.insertBefore(toRow);
            } else {
              tblList.eq(toTblIdx).prepend(fmRow);
            }
          }
        }
        function isErr() {
          toTblIdx = -1;
          fmTblIdx = -1;
          var myRtn = false;
          var currSize;
          var initSize;
          var smallCtr = 0;
          var bigCtr = 0;
          for (let i = 0, iEnd = tblList.length; i < iEnd; i++) {
            currSize = tblList.eq(i).find('tr').length;
            initSize = parseInt(tblList.eq(i).attr('tbllength'));
            if (currSize < initSize) {
              toTblIdx = i;
            } else if (currSize > initSize) {
              fmTblIdx = i;
            }
            if (toTblIdx > -1 && fmTblIdx > -1) {
              myRtn = true;
              break;
            }
          }
          return myRtn;
        }
      };
      //
      myRtn = new utilObj();
      return myRtn;
    };
    /*** Mousemove event handler ***/
    var myMouseMove = function (ev) {
      vw$SetGlobal('isBusy', true);
      ev.preventDefault();
      ev.stopPropagation();
      ev = ifAuto(ev);
      $(ev.target).css('cursor', 'move');
      uInfoObj.moveMouse(ev);
      vw$SetGlobal('isBusy', false);
      return false;
    };
    /*** Mouseup event handler ***/
    var myMouseUp = function (ev) {
      vw$SetGlobal('true');
      ev.preventDefault();
      ev.stopPropagation();
      ev = ifAuto(ev);
      occupyObj = $().getAllRowList().filter('.' + vw$GetGlobal('occupyClass'));
      //uObj.indexObj.updateOnMove();
      if (occupyObj) {
        uObj.droppedRow = uInfoObj.ui.srcTbl.savedRow;
        occupyObj.replaceWith(uObj.droppedRow);
        uObj.droppedRow.closest('table').closest('body');
        uInfoObj.ui.drag.jObj.remove();
        //uObj.indexObj.updateOnMove();
        rowFlash();
        $('body').unbind('mousemove', myMouseMove);
        $('body').unbind('mouseup', myMouseUp);
        $('#myContainer').css('cursor', 'default');
        $('#myContainer').find('*').css('cursor', 'default');
        $('#myContainer').find("[dndbtn]").css("cursor", "pointer");
      }
      $().getAllRowList().find("[dndbtn]").unbind('mousedown', myMouseDown);
      $().getAllRowList().find("[dndbtn]").bind('mousedown', myMouseDown);
      setTimeout(function () { vw$SetGlobal('isBusy', false); }, 500);
      function rowFlash() {
        rowOn();
        setTimeout(function () { rowOff(); }, 125);
        function rowOn() {
          uObj.droppedRow.addClass('myFlashTr');
          if (uObj.droppedRow.isRowOrdered()) {
            uObj.droppedRow.find('[dndbtn]').first().unbind('mousedown', myMouseDown);
            uObj.droppedRow.find('[dndbtn]').removeAttr('dndbtn');
            var allRowIdx = uObj.droppedRow.getAllRowIdx();
            uObj.indexObj.setDone(allRowIdx);
            uObj.droppedRow.find('div.stateDiv').removeClass('stateDiv').addClass('stateDivNoHover');
          }
        }
        function rowOff() {
          if ((typeof uInfoObj != typeof undefined) && (uInfoObj)) {
            uObj.droppedRow.removeClass('myFlashTr');
            uObj.indexObj.updateOnDrop();
            if (uObj.droppedRow.isRowOrdered()) {
              uObj.droppedRow.addClass(uObj.onDoneClassTr);
              var myDestTbl = uObj.droppedRow.closest('table');
              if (myDestTbl.isTableFilled()) {
                //Remove filled table from list
                var idx = uDndTblList.curr.index(myDestTbl);
                uDndTblList.curr = uDndTblList.curr.removeFromList(idx);
              }
            }
          }
          if (uDndTblList.init.find('tr:not(.' + uObj.onDoneClassTr + ')').length < 1) {
            setTimeout(function () { uObj.onDoneFunction(); }, 1500);
          }
        }
      }
    };
    //
    var ifAuto = function (ev) {
      if (uObj.auto.isAutoOn) {
        ev.pageX = uObj.auto.mouseX;
        ev.pageY = uObj.auto.mouseY;
      }
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
        myMouseDown: this.myMouseDown
      },
      init: function (options) {
        var settings = $.extend({
          // These are the defaults.
          canvasId: 'myRow1',
          onDragClassTr: 'myDragTr',
          onDoneClassTr: 'myDoneTr',
          onDoneFunction: function () { },
          scrollAmount: 150
        }, options);
        uDndTblList.curr = mySelf;
        uDndTblList.init = mySelf;
        vw$SetGlobal('tblListInit', uDndTblList.init);
        uInfoObj = createInfoObjFactory();

        var wrapperId = settings.canvasId.startsWith('#') ? settings.canvasId : '#' + settings.canvasId;
        if (settings.canvasId) { vw$SetGlobal('wrapperId', wrapperId); }

        if (settings.onDragClassTr) {
          uObj.onDragClassTr = settings.onDragClassTr;
          vw$SetGlobal('onDragClassTr', settings.onDragClassTr);
        }
        if (settings.onDoneClassTr) {
          uObj.onDoneClassTr = settings.onDoneClassTr;
          vw$SetGlobal('onDoneClassTr', settings.onDoneClassTr);
        }
        if (settings.scrollAmount) {
          uObj.scrollAmount = settings.scrollAmount;
          vw$SetGlobal('scrollAmount', settings.scrollAmount);
        }
        if (settings.onDoneFunction) {
          uObj.onDoneFunction = settings.onDoneFunction;
          vw$SetGlobal('onDoneFunction', settings.onDoneFunction);
        }
        if (settings.mirrorTables) {
          uObj.mirrorTblList = settings.mirrorTables;
          vw$SetGlobal('mirrorTblList', settings.mirrorTables);
        }
        //
        vw$SetGlobal('occupyClass', 'myOccupy');
        //
        this.context.uObj = uObj;
        this.context.myMouseDown = myMouseDown;
        vw$SetGlobal('gContext', this.context);
        //
        // Initialize the rows accidentally in sort order
        uObj.indexObj = new createIndexObjFactory();
        uObj.indexObj.init();
        //dummy = null;
        //
        uObj.auto = {};
        uObj.auto.isAutoOn = false;
        uObj.auto.mouseX = 0;
        uObj.auto.mouseY = 0;
        vw$SetGlobal('isBusy', false);
        //
        myMakeTblDnd();
        //
        return mySelf;
      },
      auto: function () {
        uObj.auto.isAutoOn = true;
        //
        var autoFactory = function () {
          var myRtn = null;
          var autoObj = function () {
            this.intervalTimer = null;
            this.stepList = [];
            this.allRowList = [];
            this.checkRowList = [];
            this.checkListLength = {};
            this.btn = {};
            this.pos = {};
            this.destPos = {};
            this.destRowIdx = {};
            $('#divContainerCover').css('pointer-events', 'none');
            $('#divContainerCover').show();
            this.calcSteps = function () {
              this.stepList = [];
              var x1 = this.pos.left;
              var x2 = this.destPos.left + 5;
              var y1 = this.pos.top;
              var y2 = this.destPos.top + 5;
              //this.stepList.push(new vw$CoordDef(x2, y2));
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
              var dxdy = (x2 - x1) / (y2 - y1);
              var b = y1 - (x1 / dxdy);
              //*
              var isMoveByX = Math.abs(x2 - x1) > Math.abs(y2 - y1);
              //*
              newX = x1;
              newY = y1;
              if (isMoveByX) {
                steps = parseInt(Math.abs(x2 - x1) / 50);
                for (let i = 0; i < steps; i++) {
                  newX = newX + 50;
                  newY = parseInt((newX / dxdy) + b) + 5;
                  this.stepList.push(new vw$CoordDef(newX, newY));
                }
              } else {
                steps = parseInt(Math.abs(y2 - y1) / 50);
                for (let i = 0; i < steps; i++) {
                  newY = newY + 50;
                  newX = parseInt((newY - b) * dxdy) + 3;
                  this.stepList.push(new vw$CoordDef(newX, newY));
                }

              }
              if ((newX != x2) || (newY != y2)) {
                this.stepList.push(new vw$CoordDef(x2, y2));
              }
              uObj.auto.stepList = this.stepList;
            };
          };
          autoObj.prototype.init = function () {
            //uObj.auto.callBackContext = this;     
            this.autoCallBack();
          };
          autoObj.prototype.autoCallBack = function () {
            if (this.intervalTimer != null) {
              clearInterval(this.intervalTimer);
            }
            this.stepList = [];
            this.allRowList = uDndTblList.init.find('tr');
            this.checkRowList = uDndTblList.curr.find('tr:not(.' + uObj.onDoneClassTr + ')');
            this.checkListLength = this.checkRowList.length;
            var currRow, destRow;
            if (this.checkListLength > 0) {
              currRow = this.checkRowList.eq(0);
              this.btn = currRow.find('[dndbtn]').first();
              this.pos = this.btn.offset();
              uObj.auto.mouseX = this.pos.left + 7;
              uObj.auto.mouseY = this.pos.top + 9;
              this.destRowIdx = parseInt(currRow.attr('allIndex'));
              destRow = this.allRowList.eq(this.destRowIdx);
              this.destPos = destRow.offset();
              this.calcSteps();
              this.btn.trigger('mousedown');
              vw$SetGlobal('autoContext', this);
              this.intervalTimer = setInterval(this.autoStep, 150);
            } else {
              $('#divContainerCover').css('pointer-events', 'auto');
              $('#divContainerCover').hide();
            }
          };
          autoObj.prototype.autoStep = function () {
            if (vw$GetGlobal('isBusy')) {
              return;
            }
            var myContext = vw$GetGlobal('autoContext');
            var listLength = uObj.auto.stepList.length;
            var newCoord = new vw$CoordDef(uObj.auto.mouseX, uObj.auto.mouseY);
            if (listLength > 0) {
              newCoord = uObj.auto.stepList.shift();
              uObj.auto.mouseX = newCoord.x;
              uObj.auto.mouseY = newCoord.y;
              $('body').trigger('mousemove');
            } else {
              var allRowList = $().getAllRowList();
              var destRow = allRowList.filter('.' + vw$GetGlobal('occupyClass'));
              var destRowIdx = allRowList.index(destRow);
              if (destRowIdx < myContext.destRowIdx) {
                newCoord.x = uObj.auto.mouseX;
                newCoord.y = uObj.auto.mouseY + 5;
                uObj.auto.stepList.push(newCoord);
              } else if (destRowIdx > myContext.destRowIdx) {
                newCoord.x = uObj.auto.mouseX;
                newCoord.y = uObj.auto.mouseY - 10;
                uObj.auto.stepList.push(newCoord);
              } else {
                $('body').trigger('mouseup');
                clearInterval(myContext.intervalTimer);
                setTimeout(function () { myContext.autoCallBack(); }, 1000);
              }
            }
          };
          //
          myRtn = new autoObj();
          return myRtn;
        }
        //
        this.myAutoObj = autoFactory();
        //$('*').css('cursor,none')
        this.myAutoObj.init();
        //$('*').css('cursor,default')
      }
    };
    return myResult;
  };
})(jQuery, window, document);		
