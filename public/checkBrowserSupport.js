// https://ionicframework.com/docs/reference/browser-support

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/ false || !!document.documentMode;
if (isIE) {
    document.body.innerHTML =
        "<div style='font-family: sans-serif; font-size: 24px; line-height: 32px; color: #239398; text-align: center; padding: 40px'>" +
        "Ihr Browser wird leider nicht unterstützt." +
        "<p style='font-size: 10px'>" +
        window.navigator.userAgent +
        "</p>" +
        "</div>";
}
