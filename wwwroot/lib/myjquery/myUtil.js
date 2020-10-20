var myUtil = myUtil || {};
//
myUtil.myImgArray = [];
myUtil.myJsonVar = {};
myUtil.myHtmlList = [];
//
myUtil.myGetBaseUrl = function () {
    return document.baseURI;
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


