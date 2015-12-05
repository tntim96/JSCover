if (! _$jscoverage['ignore-simple.js']) {
  _$jscoverage['ignore-simple.js'] = {};
  _$jscoverage['ignore-simple.js'].lineData = [];
  _$jscoverage['ignore-simple.js'].lineData[1] = 0;
  _$jscoverage['ignore-simple.js'].lineData[3] = 0;
  _$jscoverage['ignore-simple.js'].lineData[4] = 0;
  _$jscoverage['ignore-simple.js'].lineData[8] = 0;
  _$jscoverage['ignore-simple.js'].lineData[9] = 0;
  _$jscoverage['ignore-simple.js'].lineData[12] = 0;
  _$jscoverage['ignore-simple.js'].lineData[15] = 0;
}
_$jscoverage['ignore-simple.js'].conditionals = [];
if (! _$jscoverage['ignore-simple.js'].functionData) {
  _$jscoverage['ignore-simple.js'].functionData = [];
  _$jscoverage['ignore-simple.js'].functionData[0] = 0;
}
_$jscoverage['ignore-simple.js'].lineData[1]++;
function createRequest() {
  _$jscoverage['ignore-simple.js'].functionData[0]++;
  _$jscoverage['ignore-simple.js'].lineData[3]++;
  if (window.XMLHttpRequest) {
    _$jscoverage['ignore-simple.js'].lineData[4]++;
    return new XMLHttpRequest();
  }
  _$jscoverage['ignore-simple.js'].lineData[8]++;
  if (window.ActiveXObject) {
    _$jscoverage['ignore-simple.js'].lineData[9]++;
    return new ActiveXObject('Msxml2.XMLHTTP');
  }
  _$jscoverage['ignore-simple.js'].lineData[12]++;
  throw 'no XMLHttpRequest implementation available';
}
_$jscoverage['ignore-simple.js'].lineData[15]++;
var request = createRequest();

if (!(window.XMLHttpRequest)) {
  _$jscoverage['ignore-simple.js'].conditionals[2] = 6;
}
if (!(window.ActiveXObject)) {
  _$jscoverage['ignore-simple.js'].conditionals[7] = 11;
}