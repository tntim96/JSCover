if (! window.jscoverage_report) {
  window.jscoverage_report = function jscoverage_report(dir, callback, timeout) {
    var createRequest = function () {
      if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
    };

    json = jscoverage_serializeCoverageToJSON();

    var async = !!callback;
    var request = createRequest();
    var url = '/jscoverage-store';
    if (dir) {
      url += '/' + encodeURIComponent(dir);
    }
    request.open('POST', url, async);
    if (async) {
        //console.log("Configuring async jsreport timeout");
        request.timeout = timeout || 120000;
        //console.log("Configuring async jsreport cb");
        request.onreadystatechange = function() {
            //console.log("jsreport cb called");
            if (request.readyState == 4) {
                if (request.status === 200 || request.status === 201 || request.status === 204) {
                    //console.log("...success");
                    callback(true, request.responseText);
                } else {
                    //console.log("...failure");
                    callback(false, request.status);
                }
            }
        };
    }
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(json);
    if (async) {
        return "async";
    }
    if (request.status === 200 || request.status === 201 || request.status === 204) {
      return request.responseText;
    } else {
      throw request.status;
    }
  };
}
