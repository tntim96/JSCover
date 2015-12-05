if (! _$jscoverage['ignore.js']) {
  _$jscoverage['ignore.js'] = {};
  _$jscoverage['ignore.js'].lineData = [];
  _$jscoverage['ignore.js'].lineData[1] = 0;
  _$jscoverage['ignore.js'].lineData[3] = 0;
  _$jscoverage['ignore.js'].lineData[4] = 0;
  _$jscoverage['ignore.js'].lineData[6] = 0;
  _$jscoverage['ignore.js'].lineData[7] = 0;
  _$jscoverage['ignore.js'].lineData[10] = 0;
  _$jscoverage['ignore.js'].lineData[14] = 0;
  _$jscoverage['ignore.js'].lineData[16] = 0;
  _$jscoverage['ignore.js'].lineData[17] = 0;
  _$jscoverage['ignore.js'].lineData[22] = 0;
  _$jscoverage['ignore.js'].lineData[23] = 0;
  _$jscoverage['ignore.js'].lineData[27] = 0;
  _$jscoverage['ignore.js'].lineData[32] = 0;
  _$jscoverage['ignore.js'].lineData[34] = 0;
  _$jscoverage['ignore.js'].lineData[35] = 0;
  _$jscoverage['ignore.js'].lineData[37] = 0;
  _$jscoverage['ignore.js'].lineData[38] = 0;
  _$jscoverage['ignore.js'].lineData[42] = 0;
  _$jscoverage['ignore.js'].lineData[43] = 0;
  _$jscoverage['ignore.js'].lineData[44] = 0;
}
_$jscoverage['ignore.js'].conditionals = [];
if (! _$jscoverage['ignore.js'].functionData) {
  _$jscoverage['ignore.js'].functionData = [];
  _$jscoverage['ignore.js'].functionData[0] = 0;
  _$jscoverage['ignore.js'].functionData[1] = 0;
  _$jscoverage['ignore.js'].functionData[2] = 0;
}
_$jscoverage['ignore.js'].lineData[1]++;
function createRequest() {
  _$jscoverage['ignore.js'].functionData[0]++;
  _$jscoverage['ignore.js'].lineData[3]++;
  if (window.XMLHttpRequest) {
    _$jscoverage['ignore.js'].conditionals[6] = 11;
    _$jscoverage['ignore.js'].lineData[4]++;
    return new XMLHttpRequest();
  } else {
    _$jscoverage['ignore.js'].conditionals[4] = 5;
    _$jscoverage['ignore.js'].lineData[6]++;
    if (window.ActiveXObject) {
      _$jscoverage['ignore.js'].conditionals[9] = 11;
      _$jscoverage['ignore.js'].lineData[7]++;
      return new ActiveXObject('Msxml2.XMLHTTP');
    } else {
      _$jscoverage['ignore.js'].conditionals[7] = 8;
      _$jscoverage['ignore.js'].lineData[10]++;
      throw 'no XMLHttpRequest implementation available';
    }
  }
}
_$jscoverage['ignore.js'].lineData[14]++;
function createRequest2() {
  _$jscoverage['ignore.js'].functionData[1]++;
  _$jscoverage['ignore.js'].lineData[16]++;
  if (window.XMLHttpRequest) {
    _$jscoverage['ignore.js'].lineData[17]++;
    return new XMLHttpRequest();
  } else {
    _$jscoverage['ignore.js'].conditionals[17] = 18;
  }
  _$jscoverage['ignore.js'].lineData[22]++;
  if (window.ActiveXObject) {
    _$jscoverage['ignore.js'].lineData[23]++;
    return new ActiveXObject('Msxml2.XMLHTTP');
  } else {
    _$jscoverage['ignore.js'].conditionals[23] = 24;
  }
  _$jscoverage['ignore.js'].lineData[27]++;
  throw 'no XMLHttpRequest implementation available';
}
_$jscoverage['ignore.js'].lineData[32]++;
function log(s) {
  _$jscoverage['ignore.js'].functionData[2]++;
  _$jscoverage['ignore.js'].lineData[34]++;
  if (window.console && window.console.log) {
    _$jscoverage['ignore.js'].conditionals[37] = 39;
    _$jscoverage['ignore.js'].lineData[35]++;
    console.log(s);
  } else {
    _$jscoverage['ignore.js'].conditionals[35] = 36;
    _$jscoverage['ignore.js'].lineData[37]++;
    if (window.opera && window.opera.postError) {
      _$jscoverage['ignore.js'].lineData[38]++;
      opera.postError(s);
    } else {
      _$jscoverage['ignore.js'].conditionals[38] = 39;
    }
  }
}
_$jscoverage['ignore.js'].lineData[42]++;
var request = createRequest();
_$jscoverage['ignore.js'].lineData[43]++;
var request2 = createRequest2();
_$jscoverage['ignore.js'].lineData[44]++;
log('created requests');

if (!(! window.XMLHttpRequest)) {
  _$jscoverage['ignore.js'].conditionals[20] = 29;
}
if (!(0)) {
  _$jscoverage['ignore.js'].conditionals[26] = 28;
}
