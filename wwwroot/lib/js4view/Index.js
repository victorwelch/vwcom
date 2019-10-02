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
    //*** Get Cube Init Function ***
    var myPageInit = function () {
        $('#wrap').show();
        $().myCubeCarouselPlugin().cubeInit();
        $(window).focus($().myCubeCarouselPlugin().onWinFocus);
        $(window).blur($().myCubeCarouselPlugin().onWinBlur);
        $('#' + $.myCubeObj.btnManual).click($.myFuncObj.manualOnClick);
        $('#' + $.myCubeObj.btnManual).closest('body');
        $('#' + $.myCubeObj.btnTabCollapse).click($.myFuncObj.onClickTabCollapse);
        $('#' + $.myCubeObj.btnTabCollapse).closest('body');
        $('#' + $.myCubeObj.btnTabExpand).click($.myFuncObj.onClickTabExpand);
        $('#' + $.myCubeObj.btnTabExpand).closest('body');
        $('#' + $.myCubeObj.jumbo1ContainerId).show().children('div').show()
        $('#' + $.myCubeObj.jumbo1ContainerId).closest('body');
        $('#' + $.myCubeObj.myJumbo1Id).children('div').fadeIn(3500);
        $('#' + $.myCubeObj.myJumbo1Id).closest('body');
        $().myCubeCarouselPlugin().figSizer();
        $().myCommonPlugin().colInit();
        $().myCommonPlugin().footerSetter();
        setTimeout(function () {
            $().myCubeCarouselPlugin().cubeStart();
            $('#divSplash').fadeOut(3000, function () { });
            doResize();
        }, 500);
    };
    //***************************
    //*** Get Cube Image List ***
    var myUrl = myUtil.myHelper.mySetUrlPath('api/utilInfo/1');
    $.ajaxSetup({
        async: true
    });
    var jqxhr = $.get(
        myUrl,
        '',
        function (data, status, xhr) {
            myUtil.myImgArray = data;
            myPageInit();
        },
        'json'
    )
        //.done(function (data, status, xhr) {
        //    alert("second success");
        //    debugger;
        //})
        .fail(function (data, status, xhr) {
            console.log("Error retrieiving image list from: " + myUrl);
        })
        //.always(function (data, status, xhr) {
        //    alert("finished");
        //    debugger;
        //})
        ;
    //var myUserInfoObject = $().myUtilPlugin().clientDetectAll();
});
//* On Resize
$(window).resize(function () {
    doResize();
});
doResize = function () {
    var myWidth = $('body').outerWidth();
    if (myWidth > 767) {
        $('div.myNavbar').removeClass('myNoBottomBorder');
        $('div.myNavbar').closest('body');
    } else {
        $('div.myNavbar').addClass('myNoBottomBorder');
        $('div.myNavbar').closest('body');
    }
    $().myCubeCarouselPlugin().figSizer();
    $().myCommonPlugin().footerResizer();
};