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

    var quote = function (s) {
      return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
        case '\b':
          return '\\b';
        case '\f':
          return '\\f';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '\t':
          return '\\t';
        // IE doesn't support this
        /*
        case '\v':
          return '\\v';
        */
        case '"':
          return '\\"';
        case '\\':
          return '\\\\';
        default:
          return '\\u' + pad(c.charCodeAt(0).toString(16));
        }
      }) + '"';
    };

    var json = [];
    for (var file in _$jscoverage) {
      var coverage = _$jscoverage[file];

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
        lines.push(quote(source[line]));
      }

      json.push(quote(file) + ':{"coverage":[' + array.join(',') + '],"source":[' + lines.join(',') + ']}');
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
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['test-simple.js']) {
  _$jscoverage['test-simple.js'] = [];
  _$jscoverage['test-simple.js'][1] = 0;
  _$jscoverage['test-simple.js'][2] = 0;
  _$jscoverage['test-simple.js'][3] = 0;
}
_$jscoverage['test-simple.js'].source = ["var x, y;","x = 1;","y = x * 2;"];
_$jscoverage['test-simple.js'][1]++;
var x, y;
_$jscoverage['test-simple.js'][2]++;
x = 1;
_$jscoverage['test-simple.js'][3]++;
y = x * 2;
