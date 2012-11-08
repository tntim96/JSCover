if (! _$jscoverage['javascript-debugger.js']) {
  _$jscoverage['javascript-debugger.js'] = [];
  _$jscoverage['javascript-debugger.js'][1] = 0;
  _$jscoverage['javascript-debugger.js'][2] = 0;
  _$jscoverage['javascript-debugger.js'][5] = 0;
}
_$jscoverage['javascript-debugger.js'].source = ["try {","  f();","}","catch (e) {","  debugger;","}"];
_$jscoverage['javascript-debugger.js'][1]++;
try {
  _$jscoverage['javascript-debugger.js'][2]++;
  f();
}catch (e) {
  _$jscoverage['javascript-debugger.js'][5]++;
  debugger;
}
