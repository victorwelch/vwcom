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
    //******************************
    //*** Init Functions         ***
    $().myInfoImgPlugin().init();
    $('#' + $.myInfoImgObj.jumbo1ContainerId).show().children('div').show();
    $('#' + $.myInfoImgObj.jumbo1ContainerId).closest('body');
    $('#' + $.myInfoImgObj.myJumbo1Id).children('div').fadeIn(3500);
    $('#' + $.myInfoImgObj.myJumbo1Id).closest('body');
    $().myInfoImgPlugin().figSizer();
    $().myCommonPlugin().colInit({
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
        }
        ]
    });
    $().myCommonPlugin().footerSetter();
    doResize();
    //var myUserInfoObject = $().myUtilPlugin().clientDetectAll();
    $('#divSplash').fadeOut(2000);
});
//* On Resize
$(window).resize(function () {
    doResize();
});
//* Resize funciton
var doResize = function () {
    var myWidth = $('body').outerWidth();
    if (myWidth > 767) {
        $('div.myNavbar').removeClass('myNoBottomBorder');
        $('div.myNavbar').closest('body');
    } else {
        //alert('2: '+myWidth);
        $('div.myNavbar').addClass('myNoBottomBorder');
        $('div.myNavbar').closest('body');
    }
    $().myCommonPlugin().footerResizer();
    $().myInfoImgPlugin().figSizer();
};