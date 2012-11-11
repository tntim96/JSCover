if (! window.jscoverage_report) {
  window.jscoverage_report = function jscoverage_report(dir) {
    var createRequest = function () {
      if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
      }
    };

    var pad = function (s) {
      return '0000'.substr(s.length) + s;
    };

    var json = [];
    for (var file in _$jscoverage) {
      var coverage = _$jscoverage[file];
      if (file === 'branchData')
          continue;

      var array = [];
      var length = coverage.length;
      for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
          value = 'null';
        }
        array.push(value);
      }

      var source = coverage.source;
      var lines = [];
      length = source.length;
      for (var line = 0; line < length; line++) {
        lines.push(jscoverage_quote(source[line]));
      }

      json.push(jscoverage_quote(file) + ':{"coverage":[' + array.join(',') + '],"source":[' + lines.join(',')
          + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage.branchData[file]) + '}');
    }
    json = '{' + json.join(',') + '}';

    var request = createRequest();
    var url = '/jscoverage-store';
    if (dir) {
      url += '/' + encodeURIComponent(dir);
    }
    request.open('POST', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Content-Length', json.length.toString());
    request.send(json);
    if (request.status === 200 || request.status === 201 || request.status === 204) {
      return request.responseText;
    }
    else {
      throw request.status;
    }
  };
}
