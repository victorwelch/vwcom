// *** Google Analystics ***
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-135382660-4');
// *** End: Google Analystics ***
//
// *********************
var stationIdx = 0;
var fmStationList = [
  "88.1", "88.3", "88.5", "88.7", "88.9", "89.1", "89.3", "89.5", "89.7", "89.9", "90.1", "90.3", "90.5", "90.7", "90.9", "91.1",
  "91.3", "91.5", "91.7", "91.9", "92.1", "92.3", "92.5", "92.7", "92.9", "93.1", "93.3", "93.5", "93.7", "93.9", "94.1", "94.3",
  "94.5", "94.7", "94.9", "95.1", "95.3", "95.5", "95.7", "95.9", "96.1", "96.3", "96.5", "96.7", "96.9", "97.1", "97.3", "97.5",
  "97.7", "97.9", "98.1", "98.3", "98.5", "98.7", "98.9", "99.1", "99.3", "99.5", "99.7", "99.9", "100.1", "100.3", "100.5", "100.7",
  "100.9", "101.1", "101.3", "101.5", "101.7", "101.9", "102.1", "102.3", "102.5", "102.7", "102.9", "103.1", "103.3", "103.5", "103.7", "103.9",
  "104.1", "104.3", "104.5", "104.7", "104.9", "105.1", "105.3", "105.5", "105.7", "105.9", "106.1", "106.3", "106.5", "106.7", "106.9", "107.1",
  "107.3", "107.5", "107.7", "107.9"
];
var amStationList = [
  "540", "550", "560", "570", "580", "590", "600", "610", "620", "630", "640", "650", "660", "670", "680", "690", "700", "710", "720", "730",
  "740", "750", "760", "770", "780", "790", "800", "810", "820", "830", "840", "850", "860", "870", "880", "890", "900", "910", "920", "930",
  "940", "950", "960", "970", "980", "990", "1000", "1010", "1020", "1030", "1040", "1050", "1060", "1070", "1080", "1090", "1100", "1110", "1120", "1130",
  "1140", "1150", "1160", "1170", "1180", "1190", "1200", "1210", "1220", "1230", "1240", "1250", "1260", "1270", "1280", "1290", "1300", "1310", "1320", "1330",
  "1340", "1350", "1360", "1370", "1380", "1390", "1400", "1410", "1420", "1430", "1440", "1450", "1460", "1470", "1480", "1490", "1500", "1510", "1520", "1530",
  "1540", "1550", "1560", "1570", "1580", "1590", "1600"
];
//
var dialVol = {};
var dialTune = {};
var szWidth = 0;
var szDial = { "wheel": 0, "knob": 0 };
// *********************
var isNewDialSize = function () {
  debugger;
  var szNewDial = {"wheel":0,"knob":0}
  var szNewWidth = $('body').outerWidth();
  var isNewDial = false;
  if (szNewWidth != szWidth) {
    szWidth = szNewWidth;
    switch (true) {
      case ($('.isMaxWidth575').css('float') == 'right'):
        szNewDial.wheel = 60;
        szNewDial.knob = 27;
        break;
      case ($('.isMinWidth576').css('float') == 'right'):
        szNewDial.wheel = 95;
        szNewDial.knob = 40;
        break;
      case ($('.isMinWidth768').css('float') == 'right'):
        szNewDial.wheel = 120;
        szNewDial.knob = 50;
        break;
      default:
        szNewDial.wheel = 142;
        szNewDial.knob = 60;
    }
    var isNewDial = (szNewDial.wheel != szDial.wheel);
    if (isNewDial) {
      szDial = szNewDial;
    }
  }
  return isNewDial;
}
// *********************
var doMouseMoveVolDial = function(evt) {
  var r = evt.target.rotation;
  if (r > 0) {
    var isPwrOnStep = ($('#containerVol').attr("pwr") == "off");
    if (isPwrOnStep) {
      $('#containerVol').attr("pwr", 'on');
      $('#pwrOnLight').show();
      $('#fmBandBtn').attr("bandBtnState", 'on');
      $('#fmBandBtn').addClass('bandBtnStateOn');
      $('#stationDisplay').show();
      $('#stationDisplay').find('span').text(window.fmStationList[window.stationIdx % 100]);
    }
    switch (true) {
      case (r < 45):
        $('#vol1').show();
        $('#vol2').hide();
        $('#vol3').hide();
        $('#vol4').hide();
        $('#vol5').hide();
        $('#vol6').hide();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 45 && r < 90):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').hide();
        $('#vol4').hide();
        $('#vol5').hide();
        $('#vol6').hide();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 90 && r < 135):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').hide();
        $('#vol5').hide();
        $('#vol6').hide();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 135 && r < 180):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').show();
        $('#vol5').hide();
        $('#vol6').hide();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 180 && r < 225):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').show();
        $('#vol5').show();
        $('#vol6').hide();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 225 && r < 270):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').show();
        $('#vol5').show();
        $('#vol6').show();
        $('#vol7').hide();
        $('#vol8').hide();
        break;
      case (r >= 270 && r < 315):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').show();
        $('#vol5').show();
        $('#vol6').show();
        $('#vol7').show();
        $('#vol8').hide();
        break;
      case (r >= 315):
        $('#vol1').show();
        $('#vol2').show();
        $('#vol3').show();
        $('#vol4').show();
        $('#vol5').show();
        $('#vol6').show();
        $('#vol7').show();
        $('#vol8').show();
        break;
    }
  } else {
    $('#containerVol').attr("pwr", 'off');
    $('#pwrOnLight').hide();
    $('#stationDisplay').hide();
    $('#vol1').hide();
    $('#vol2').hide();
    $('#vol3').hide();
    $('#vol4').hide();
    $('#vol5').hide();
    $('#vol6').hide();
    $('#vol7').hide();
    $('#vol8').hide();
    $('#bandSelect').children().removeClass('bandBtnStateOn').removeClass('bandBtnHoverOn').addClass('bandBtn').attr("bandBtnState", 'off');
  }
};
//***************
var doMouseMoveTuneDial = function(evt) {
  var rNewDial = evt.target.rotation;
  var rModNewDial = rNewDial % 360;
  if (rModNewDial < 0) { rModNewDial = 360 + rModNewDial }
  var isFm = ($('#fmBandBtn').attr("bandBtnState") == "on");
  var isAm = ($('#amBandBtn').attr("bandBtnState") == "on");
  if (isFm) {
    stationIdx = Math.round(rModNewDial / 3.6) % 100;
    $('#stationDisplay').find('span').html(window.fmStationList[stationIdx]);
  } else if (isAm) {
    stationIdx = Math.round(rModNewDial / 3.36) % 107;
    $('#stationDisplay').find('span').html(window.amStationList[stationIdx]);
  }
}
//
var dialVol;
var dialTune;
// *** ********************* *** //
// *** On Ready              *** //
// *** ********************* *** //
$(document).ready(
  function () {
    isNewDialSize();
    $('#wheelVol').removeAttr('_jogdial_');
    $('#wheelVol').empty();
    $('#wheelVol').closest('body');
    $('#wheelTune').removeAttr('_jogdial_');
    $('#wheelTune').empty();
    $('#wheelTune').closest('body');
    debugger;
    dialVol = JogDial(
      document.getElementById('wheelVol'), {
      wheelSize: szDial.wheel+'px',
      knobSize: szDial.knob +'px',
      minDegree: 0,
      maxDegree: 360,
      degreeStartAt: 0
    }
    ).on('mousemove', function (evt) {
      doMouseMoveVolDial(evt);
    });
    //
    $('#wheelTune').empty();
    dialTune = JogDial(
      document.getElementById('wheelTune'), {
      wheelSize: szDial.wheel + 'px',
      knobSize: szDial.knob + 'px',
      minDegree: -3600,
      maxDegree: 3600,
      degreeStartAt: 0
    }
    ).on('mousemove', function (evt) {
      doMouseMoveTuneDial(evt);
    });
    $('.bandBtn').on(
      'mouseover',
      function (event) {
        var isPwrOn = $('#containerVol').attr("pwr") == 'on';
        var isBandOff = ($(this).attr("bandBtnState") == 'off');
        if (isPwrOn && isBandOff) {
          $(this).removeClass('bandBtn').addClass('bandBtnHoverOn');
        }
      }
    );
    $('.bandBtn').on(
      'mouseout',
      function (event) {
        var isPwrOn = $('#containerVol').attr("pwr") == 'on';
        var isBandOff = ($(this).attr("bandBtnState") == 'off');
        if (isPwrOn && isBandOff) {
          $(this).removeClass('bandBtnHoverOn').addClass('bandBtn');
        }
      }
    );
    $('.bandBtn').on(
      'click',
      function (event) {
        var isPwrOn = $('#containerVol').attr("pwr") == 'on';
        var isBandOff = ($(this).attr("bandBtnState") == 'off');
        if (isPwrOn && isBandOff) {
          if ($(event.currentTarget).attr('id').indexOf('fmBand') > -1) {
            $('#amBandBtn').attr("bandBtnState", 'off');
            $('#amBandBtn').removeClass('bandBtnStateOn').removeClass('bandBtnHoverOn').addClass('bandBtn');
            $('#fmBandBtn').attr("bandBtnState", 'on');
            $('#fmBandBtn').addClass('bandBtnStateOn');
            stationIdx = (stationIdx > 99) ? 99 : stationIdx;
            $('#stationDisplay').find('span').html(window.fmStationList[stationIdx]);
          } else if ($(event.currentTarget).attr('id').indexOf('amBand') > -1) {
            $('#fmBandBtn').attr("bandBtnState", 'off');
            $('#fmBandBtn').removeClass('bandBtnStateOn').removeClass('bandBtnHoverOn').addClass('bandBtn');
            $('#amBandBtn').attr("bandBtnState", 'on');
            $('#amBandBtn').addClass('bandBtnStateOn');
            //stationIdx = stationIdx % 107; <-- not nescessary, just for doc purposes 
            $('#stationDisplay').find('span').html(window.amStationList[stationIdx]);
          }
        }
      }
    );
  }
);
// *********************
var isVolOnList = [
  { "id": '#vol1', 'isShow': false },
  { "id": '#vol2', 'isShow': false },
  { "id": '#vol3', 'isShow': false },
  { "id": '#vol4', 'isShow': false },
  { "id": '#vol5', 'isShow': false },
  { "id": '#vol6', 'isShow': false },
  { "id": '#vol7', 'isShow': false },
  { "id": '#vol8', 'isShow': false }
];
// *** ********************* *** //
// *** On Load               *** //
// *** ********************* *** //
$(window).on('load', function () {
  $('#wrap').show();
  $('#divInstrContainer').children().show();
  $('#divInstrInner').children().show();
  //******************************
  //*** Init Functions         ***
  //
  $().myCommonPlugin().colInit({
    footerId: '#footer',
    rowId: '#myRow0',
    colIdList: [
      {
        'Id': '#col0',
        'divWrapId': '#divCol0Wrap',
        'spacerDivId': '#spacerdiv0',
        'spacerImgId': '#spacerimg0'
      }
    ]
  });
  $().myCommonPlugin().footerSetter();
  //Reverse unwanted "show's"
    $('#pwrOnLight').hide();
    $('#stationDisplay').hide();
    while ((idx = isVolOnList.loop()) > -1) {
      $(isVolOnList[idx].id).hide();
    }
    //
  doResize();
  $('#divSplash').fadeOut(2000);
});
//* On Resize
$(window).resize(function () {
  doResize();
});
//* Resize funciton
doResize = function () {
  if (isNewDialSize()) {
    $('#wheelVol').removeAttr('_jogdial_');
    $('#wheelVol').empty();
    $('#wheelVol').closest('body');
    $('#wheelTune').removeAttr('_jogdial_');
    $('#wheelTune').empty();
    $('#wheelTune').closest('body');
    dialVol = JogDial(
      document.getElementById('wheelVol'), {
      wheelSize: szDial.wheel + 'px',
      knobSize: szDial.knob + 'px',
      minDegree: 0,
      maxDegree: 360,
      degreeStartAt: 0
    }
    ).on('mousemove', function (evt) {
      doMouseMoveVolDial(evt);
    });
    //
    dialTune = JogDial(
      document.getElementById('wheelTune'), {
      wheelSize: szDial.wheel + 'px',
      knobSize: szDial.knob + 'px',
      minDegree: -3600,
      maxDegree: 3600,
      degreeStartAt: 0
    }
    ).on('mousemove', function (evt) {
      doMouseMoveTuneDial(evt);
    });
  }
  var myWidth = szWidth;
  if (myWidth > 767) {
    $('div.myNavbar').removeClass('myNoBottomBorder');
    $('div.myNavbar').closest('body');
  }
  else {
    //alert('2: '+myWidth);
    $('div.myNavbar').addClass('myNoBottomBorder');
    $('div.myNavbar').closest('body');
  }
  var isPwrOn = (!$('#pwrOnLight').is(':hidden'));
  var idx;
  if (isPwrOn) {
    while ((idx = isVolOnList.loop()) > -1) {
      isVolOnList[idx].isShow = (!$(isVolOnList[idx].id).is(':hidden'))
    }
  }
  $().myCommonPlugin().footerResizer();
  if (isPwrOn) {
    $('#pwrOnLight').show();
    $('#stationDisplay').show();
    while ((idx = isVolOnList.loop()) > -1) {
      if (isVolOnList[idx].isShow) {
        $(isVolOnList[idx].id).show();
      } else {
        $(isVolOnList[idx].id).hide();
      }
    }
  } else {
    $('#pwrOnLight').hide();
    $('#stationDisplay').hide();
    while ((idx = isVolOnList.loop()) > -1) {
        $(isVolOnList[idx].id).hide();
    }
  }
}
