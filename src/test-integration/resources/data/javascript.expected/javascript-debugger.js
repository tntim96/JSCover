if (! _$jscoverage['javascript-debugger.js']) {
  _$jscoverage['javascript-debugger.js'] = {};
  _$jscoverage['javascript-debugger.js'].lineData = [];
  _$jscoverage['javascript-debugger.js'].lineData[1] = 0;
  _$jscoverage['javascript-debugger.js'].lineData[2] = 0;
  _$jscoverage['javascript-debugger.js'].lineData[5] = 0;
}
_$jscoverage['javascript-debugger.js'].lineData[1]++;
try {
  _$jscoverage['javascript-debugger.js'].lineData[2]++;
  f();
}catch (e) {
  _$jscoverage['javascript-debugger.js'].lineData[5]++;
  debugger;
}
