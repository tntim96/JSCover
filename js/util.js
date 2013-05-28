var lastSlashIndex = document.location.href.lastIndexOf('/');
var page = document.location.href.substring(lastSlashIndex+1);
var qsIndex = page.indexOf("?");
if (qsIndex != -1) {
    page = page.substring(0, qsIndex);
}
if (page !== "" && page.indexOf('index.html') !== 0) {
    var newPath = document.location.href.substring(0,lastSlashIndex) + '/index.html?page=' + page;
    document.location.href = newPath;
}