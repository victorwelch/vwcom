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
//
var doSend = function () {
    var myJsonObj = {
        id: 1,
        subject: $('#VwSubject').val(),
        message: $('#VwMessage').val(),
    };
    $('#divVwSubjectErr').attr("notshow", "true").hide();
    $('#divVwMessageErr').attr("notshow", "true").hide();
    var isVwSubjectErr = (myJsonObj.subject.toString().trim().length < 1);
    var isVwMessageErr = (myJsonObj.message.toString().trim().length < 1);
    if (isVwSubjectErr) {
        $('#divVwSubjectErr').show().removeAttr('notshow');
    }
    if (isVwMessageErr) {
        $('#divVwMessageErr').show().removeAttr('notshow');
    }
    if (!(isVwSubjectErr || isVwMessageErr)) {
        $('#VwSubject').val('');
        $('#VwMessage').val('');
        var myDivChild = $('#divWait').clone();
        myDivChild.attr('id', 'divCloneWait');
        var myNewParentDiv = $('#divCol1Wrap');
        myDivChild.appendTo(myNewParentDiv);
      myDivChild.show().removeAttr('notshow');
      debugger;
        doPostEmailSend(myJsonObj);
    }
    $().myCommonPlugin().footerResizer();
};
//* Get Ejs templates
var doPostEmailSend = function (myData) {
    //var myUrl = myUtil.myHelper.mySetUrlPath('api/utilInfo/emailSend');
    var myUrl = myUtil.myHelper.mySetUrlPath('api/utilInfo');
    var jqxhr = $.post(
        myUrl,
        JSON.stringify(myData),
        function (data, status, xhr) {
            doEmailSuccess(data, status);
        },
        'json'
    )
        //.done(function (data, status, xhr) {
        //    alert("second success");
        //    debugger;
        //})
        .fail(function (data, status, xhr) {
            doEmailError(data, status);
            //console.log("Error retrieiving Json string from: " + myUrl);
        })
        //.always(function (data, status, xhr) {
        //    alert("finished");
        //    debugger;
        //})
        ;

};
var doEmailSuccess = function (data, status) {
    myUtil.myJsonVar = {};
    myUtil.myJsonVar.data = data;
    myUtil.myJsonVar.status = status;
    $('#divCloneWait').hide().remove();
    $('#divEmailInput').attr('notshow', 'true').hide();
    $('#divSuccess').show().removeAttr('notshow');
    $().myCommonPlugin().footerResizer();
};
var doEmailError = function (data, status) {
    myUtil.myJsonVar = {};
    myUtil.myJsonVar.data = data;
    myUtil.myJsonVar.status = status;
    $('#divCloneWait').hide().remove();
    $('#divEmailInput').attr('notshow', 'true').hide();
    $('#spErrText').text(data.responseText);
    $('#divFail').show().removeAttr('notshow');
    $().myCommonPlugin().footerResizer();
};
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
    $('#divSplash').fadeOut(2000);
    //var myUserInfoObject = $().myUtilPlugin().clientDetectAll();
});
//* On Resize
$(window).resize(function () {
    doResize();
});
//* Resize function
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
//* Email reset
var doEmailReset = function () {
    $('#divSuccess').attr('notshow', 'true').hide();
    $('#divFail').attr('notshow', 'true').hide();
    $('#divEmailInput').show().removeAttr('notshow');
    $().myCommonPlugin().footerResizer();
};
//* On click handler
var clickHandler = function (ev) {
    switch (ev.currentTarget.id) {
        case 'aSendEmail':
            doSend();
            break;
        case 'aSendAnother':
            doEmailReset();
            break;
        case 'aTryAgain':
            doEmailReset();
            break;
        default:
            break;
    }
    return false;
};
