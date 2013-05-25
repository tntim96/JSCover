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
      var coverage = _$jscoverage[file].lineData;

      var array = [];
      var length = coverage.length;
      for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
          value = 'null';
        }
        array.push(value);
      }

      json.push(jscoverage_quote(file) + ':{"lineData":[' + array.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    json = '{' + json.join(',') + '}';

    var request = createRequest();
    var url = '/jscoverage-store';
    if (dir) {
      url += '/' + encodeURIComponent(dir);
    }
    request.open('POST', url, false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(json);
    if (request.status === 200 || request.status === 201 || request.status === 204) {
      return request.responseText;
    }
    else {
      throw request.status;
    }
  };
}
function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '[]'
    }
    var array = [];
    var length = branchData.length;
    for (var line = 0; line < length; line++) {
        var branchDataObject = branchData[line];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = convertBranchDataConditionArrayToJSON(branchDataObject);
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return [];
    }
    var length = jsonObject.length;
    for (var line = 0; line < length; line++) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
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
      return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
    }
  }) + '"';
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
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
  _$jscoverage['test-simple.js'] = {};
  _$jscoverage['test-simple.js'].lineData = [];
  _$jscoverage['test-simple.js'].lineData[1] = 0;
  _$jscoverage['test-simple.js'].lineData[2] = 0;
  _$jscoverage['test-simple.js'].lineData[3] = 0;
}
if (! _$jscoverage['test-simple.js'].functionData) {
  _$jscoverage['test-simple.js'].functionData = [];
}
if (! _$jscoverage['test-simple.js'].branchData) {
  _$jscoverage['test-simple.js'].branchData = [];
}
_$jscoverage['test-simple.js'].lineData[1]++;
var x, y;
_$jscoverage['test-simple.js'].lineData[2]++;
x = 1;
_$jscoverage['test-simple.js'].lineData[3]++;
y = x * 2;
