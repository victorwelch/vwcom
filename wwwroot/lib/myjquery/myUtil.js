var myUtil = myUtil || {};
//
myUtil.myImgArray = [];
myUtil.myJsonVar = {};
myUtil.myHtmlList = [];
//
myUtil.myGetBaseUrl = function () {
    var myUrlParts = window.location.href.split('/');
    if (myUrlParts.length > 3) {
        myUrlParts.splice(3, myUrlParts.length - 3);
    }
    return myUrlParts.join('/');
};
//
var myUtilUrlHelper = function () {
    this.myBaseUrl = myUtil.myGetBaseUrl();
    this.myUrl = {};
    this.mySetUrlPath = function (myPath) {
        this.myUrl = (myPath.startsWith('/')) ? this.myBaseUrl + myPath : this.myBaseUrl + '/' + myPath;
        return this.myUrl;
    };
};
//
myUtil.myHelper = new myUtilUrlHelper();


