if (!window.jscoverage_report) {
    window.jscoverage_report = function jscoverage_report(dir, callback, timeout) {
        var createRequest = function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        };

        json = jscoverage_serializeCoverageToJSON();

        var request = createRequest();
        var url = '/jscoverage-store';
        if (dir) {
            url += '/' + encodeURIComponent(dir);
        }
        request.open('POST', url, true);
        //console.log("Configuring async jsreport timeout");
        request.timeout = timeout || 120000;
        //console.log("Configuring async jsreport cb");
        request.onreadystatechange = function () {
            //console.log("jsreport cb called");
            if (request.readyState == 4 && callback) {
                callback(request);
            }
        };
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(json);
    };
}
