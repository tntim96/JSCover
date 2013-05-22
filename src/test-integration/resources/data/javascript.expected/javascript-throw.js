if (! _$jscoverage['javascript-throw.js']) {
  _$jscoverage['javascript-throw.js'] = {};
  _$jscoverage['javascript-throw.js'].lineData = [];
  _$jscoverage['javascript-throw.js'].lineData[1] = 0;
  _$jscoverage['javascript-throw.js'].lineData[2] = 0;
  _$jscoverage['javascript-throw.js'].lineData[5] = 0;
}
if (! _$jscoverage['javascript-throw.js'].functionData) {
  _$jscoverage['javascript-throw.js'].functionData = [];
}
_$jscoverage['javascript-throw.js'].lineData[1]++;
try {
  _$jscoverage['javascript-throw.js'].lineData[2]++;
  throw "x";
}catch (e) {
  _$jscoverage['javascript-throw.js'].lineData[5]++;
  ;
}
