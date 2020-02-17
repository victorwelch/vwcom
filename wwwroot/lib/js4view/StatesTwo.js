// *** Google Analystics ***
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-135382660-4');
// *** End: Google Analystics ***
//* On Ready
$(document).ready(function () {
  //
});
//* On Load
$(window).on('load', function () {
  $('#wrap').show();
  //******************************
  //*** Init Functions         ***
  $('#divInstrContainer').children().show();
  $('#divInstrInner').children().show();
  $().myCommonPlugin().colInit({
    footerId: '#footer',
    rowId: '#myRow0',
    colIdList: [{
      'Id': '#col0',
      'divWrapId': '#divCol0Wrap',
      'spacerDivId': '#spacerdiv0',
      'spacerImgId': '#spacerimg0'
    }]
  });
  $().myCommonPlugin().footerSetter();
  doResize();
  //$('#divSplash').fadeOut(2000,function () {});
  $('#divSplash').fadeOut(2000);
});
//* On Resize
$(window).resize(function () {
  doResize();
});
//* Resize funciton
doResize = function () {
  var myWidth = $('body').outerWidth();
  if (myWidth > 767) {
    $('div.myNavbar').removeClass('myNoBottomBorder');
    $('div.myNavbar').closest('body');
  } else {
    //alert('2: '+myWidth);
    $('div.myNavbar').addClass('myNoBottomBorder');
    $('div.myNavbar').closest('body');
    if (myWidth < 720) {
      var newVideoWidth = parseInt(0.89 * myWidth);
      var newVideoHeight = parseInt(0.65 * newVideoWidth);
      $('#videoCtrl').attr("width", newVideoWidth);
      $('#videoCtrl').attr("height", newVideoHeight);
    }
  }
  $().myCommonPlugin().footerResizer();
};
//* Get States Data
doGetStates = function () {
  var myUrl = myUtil.myHelper.mySetUrlPath('api/utilInfo/3');
  $.ajaxSetup({
    async: true
  });
  var jqxhr = $.get(
    myUrl,
    '',
    function (data, status, xhr) {
      myUtil.myJsonVar = {};
      myUtil.myJsonVar.data = data;
      console.log("Data: " + JSON.stringify(myUtil.myJsonVar));
      doGetTemplates();
    },
    'json'
  )
    //.done(function (data, status, xhr) {
    //    alert("second success");
    //    debugger;
    //})
    .fail(function (data, status, xhr) {
      console.log("Error retrieiving Json string from: " + myUrl);
    })
    //.always(function (data, status, xhr) {
    //    alert("finished");
    //    debugger;
    //})
    ;
};
//* Get Ejs templates
doGetTemplates = function () {
  var myUrl = myUtil.myHelper.mySetUrlPath('api/utilInfo/4');
  var jqxhr = $.get(
    myUrl,
    '',
    function (data, status, xhr) {
      myUtil.myJsonVar.templateList = data;
      console.log("Templates: " + JSON.stringify(myUtil.myJsonVar.templateList));
      doRenderStatesHtml();
    },
    'json'
  )
    //.done(function (data, status, xhr) {
    //    alert("second success");
    //    debugger;
    //})
    .fail(function (data, status, xhr) {
      console.log("Error retrieiving Json string from: " + myUrl);
    })
    //.always(function (data, status, xhr) {
    //    alert("finished");
    //    debugger;
    //})
    ;

};
//* Render States Data;
doRenderStatesHtml = function () {
  myUtil.myHtmlList = [];
  for (var i = 0, iL = myUtil.myJsonVar.templateList.length; i < iL; i++) {
    myUtil.myHtmlList.push(ejs.render(myUtil.myJsonVar.templateList[i], myUtil.myJsonVar.data));
  }
  doAppendStatesHtml();
};
//* Append States Html
var myTimerObj;
var myDoneFunction;
var myjQuiDnd;
doAppendStatesHtml = function () {
  $('#divCol1Wrap').html(myUtil.myHtmlList[0]);
  $('#divCol2Wrap').html(myUtil.myHtmlList[1]);
  $('#divCol3Wrap').html(myUtil.myHtmlList[2]);
  myTimerObj = vw$TimerFactory();
  myTimerObj.eventHandler = function () {
    $('#divDummy').html(myTimerObj.getTime());
  };
  //
  myjQuiDnd = $('#myRow1').find('ul.connectedSortable').ujQuiDndPlugin();
  myjQuiDnd.init({
    onDoneFunction: doDone,
    mirrorUls: $('#divHiddenWorkSpace').find('ul.notConnected')
  });
  //
  $('#myRowScore').show().removeAttr('notshow');
  $('#myRow1').show().removeAttr('notshow');
  $('#myRow1').children().show().removeAttr('notshow');
  $('#myRow0').attr("notshow", "true").hide();
  $().myCommonPlugin().colInit({
    footerId: '#footer',
    rowId: '#myRow1',
    colIdList: [{
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
  });
  //
  myTimerObj.start();
  //
  doResize();
};
//
doDone = function () {
  myTimerObj.stop();
  $('#aNewGame').parent().css('opacity', '');
  $('#aAutoSort').parent().css('opacity', '');
};
//* On click handler
clickHandler = function (ev) {
  switch (ev.currentTarget.id) {
    case 'aViewVideo':
      $('#divNoteContainer').attr("notshow", "true").hide();
      $('#divAnimInstr').show().removeAttr('notshow');
      $('#trVideoButton').attr("notshow", "true").hide();
      doResize();
      break;
    case 'aStartGame':
      doGetStates();
      break;
    case 'aNewGame':
      //
      if (myTimerObj) {
        myTimerObj.stop();
      }
      //
      $('#divDummy').html('00:00:00.000');
      doGetStates();
      break;
    case 'aAutoSort':
      $('#aNewGame').parent().css('opacity', '0.5');
      $('#aAutoSort').parent().css('opacity', '0.5');
      doAutoSort();
      break;
    default:
      break;
  }
  return false;
};
//
doAutoSort = function () {
  if (myjQuiDnd) {
    myjQuiDnd.auto();
  }
};
