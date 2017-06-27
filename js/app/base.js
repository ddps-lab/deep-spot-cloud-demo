/**
 * Created by kde713 on 2017. 5. 1..
 */

const BASE_URL = "https://j1kg8eg5p9.execute-api.us-east-1.amazonaws.com";



// for Responsive UI
$(window).on('resize', function () {
    if ($(window).width() > 768) $('#sidebar-collapse').collapse('show')
});
$(window).on('resize', function () {
    if ($(window).width() <= 767) $('#sidebar-collapse').collapse('hide')
});


// AJAX Loading Overlay
$(document).ajaxStart(function () {
    $.LoadingOverlay("show");
});
$(document).ajaxStop(function () {
    $.LoadingOverlay("hide");
});


// Utility - 긴 문자열 줄이기
function shortenString(org_string) {
    if (org_string.length > 15) {
        return org_string.substring(0, 15) + "...";
    }
    return org_string;
}