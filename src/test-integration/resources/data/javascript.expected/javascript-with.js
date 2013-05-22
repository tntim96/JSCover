if (! _$jscoverage['javascript-with.js']) {
  _$jscoverage['javascript-with.js'] = {};
  _$jscoverage['javascript-with.js'].lineData = [];
  _$jscoverage['javascript-with.js'].lineData[1] = 0;
  _$jscoverage['javascript-with.js'].lineData[2] = 0;
  _$jscoverage['javascript-with.js'].lineData[4] = 0;
  _$jscoverage['javascript-with.js'].lineData[5] = 0;
  _$jscoverage['javascript-with.js'].lineData[8] = 0;
  _$jscoverage['javascript-with.js'].lineData[9] = 0;
}
if (! _$jscoverage['javascript-with.js'].functionData) {
  _$jscoverage['javascript-with.js'].functionData = [];
  _$jscoverage['javascript-with.js'].functionData[0] = 0;
}
_$jscoverage['javascript-with.js'].lineData[1]++;
function f() {
  _$jscoverage['javascript-with.js'].functionData[0]++;
}
_$jscoverage['javascript-with.js'].lineData[2]++;
var x = {};
_$jscoverage['javascript-with.js'].lineData[4]++;
with (x) {
  _$jscoverage['javascript-with.js'].lineData[5]++;
  f();
}
_$jscoverage['javascript-with.js'].lineData[8]++;
with (x) {
  _$jscoverage['javascript-with.js'].lineData[9]++;
  f();
}
