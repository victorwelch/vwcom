; $.myInfoImgObj = {};
;
; (function ($, window, document, undefined) {
    $.fn.myInfoImgPlugin = function () {
        /* Set internal "this" */
        var mySelf = this;

        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Private functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */


        /* ******************************************************************************** */
        /* ******************************************************************************** */
        /* BEGIN Public functions   
        /* ******************************************************************************** */
        /* ******************************************************************************** */

        var myResult = {
            /* ******************************************************************************** */
            /* Get Client Info                                                                  */
            /* ******************************************************************************** */
            init: function (options) {
                var settings = $.extend({
                    // These are the defaults.
                    isMsie: (/msie|trident/i.test(navigator.userAgent)),
                    jumbo1Id: 'jumbo1',
                    jumbo2Id: 'jumbo2',
                    jumbo1ContainerId: 'divBrdrContainer',
                    secCotainerId: 'secContainer',
                    infoImgId: 'divInfoImg'
                }, options);
                $.myInfoImgObj.myIsMsie = settings.isMsie;
                $.myInfoImgObj.myJumbo1Id = settings.jumbo1Id;
                $.myInfoImgObj.myJumbo2Id = settings.jumbo2Id;
                $.myInfoImgObj.jumbo1ContainerId = settings.jumbo1ContainerId;
                $.myInfoImgObj.secCotainerId = settings.secCotainerId;
                $.myInfoImgObj.myInfoImgId = settings.infoImgId;
                //
                return mySelf;
            },
            figSizer: function () {
                var $myf = $('#' + $.myInfoImgObj.myJumbo1Id);
                var width = parseInt($myf.width() * 0.75);
                var height = parseInt(width * 0.55);
                //$('#' + $.myInfoImgObj.myJumbo1Id).css({
                //    width: width,
                //    height: height
                //});
                $('#' + $.myInfoImgObj.secCotainerId).css({
                    width: width,
                    height: height
                });
                $('#' + $.myInfoImgObj.secCotainerId).closest('body');
                $('#' + $.myInfoImgObj.myInfoImgId).css({
                    width: width,
                    height: height
                });
                $($.myInfoImgObj.myInfoImgId).closest('body');
                //
                return mySelf;
            },
        };
        return myResult;
    };
})(jQuery, window, document);