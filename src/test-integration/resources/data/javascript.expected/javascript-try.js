if (! _$jscoverage['javascript-try.js']) {
  _$jscoverage['javascript-try.js'] = {};
  _$jscoverage['javascript-try.js'].lineData = [];
  _$jscoverage['javascript-try.js'].lineData[1] = 0;
  _$jscoverage['javascript-try.js'].lineData[3] = 0;
  _$jscoverage['javascript-try.js'].lineData[4] = 0;
  _$jscoverage['javascript-try.js'].lineData[7] = 0;
  _$jscoverage['javascript-try.js'].lineData[10] = 0;
  _$jscoverage['javascript-try.js'].lineData[11] = 0;
  _$jscoverage['javascript-try.js'].lineData[14] = 0;
  _$jscoverage['javascript-try.js'].lineData[17] = 0;
  _$jscoverage['javascript-try.js'].lineData[18] = 0;
  _$jscoverage['javascript-try.js'].lineData[21] = 0;
  _$jscoverage['javascript-try.js'].lineData[24] = 0;
  _$jscoverage['javascript-try.js'].lineData[25] = 0;
  _$jscoverage['javascript-try.js'].lineData[28] = 0;
  _$jscoverage['javascript-try.js'].lineData[31] = 0;
}
if (! _$jscoverage['javascript-try.js'].functionData) {
  _$jscoverage['javascript-try.js'].functionData = [];
  _$jscoverage['javascript-try.js'].functionData[0] = 0;
}
_$jscoverage['javascript-try.js'].lineData[1]++;
function f() {
  _$jscoverage['javascript-try.js'].functionData[0]++;
}
_$jscoverage['javascript-try.js'].lineData[3]++;
try {
  _$jscoverage['javascript-try.js'].lineData[4]++;
  f();
}catch (e) {
  _$jscoverage['javascript-try.js'].lineData[7]++;
  f();
}
_$jscoverage['javascript-try.js'].lineData[10]++;
try {
  _$jscoverage['javascript-try.js'].lineData[11]++;
  f();
}catch (e if e instanceof E) {
  _$jscoverage['javascript-try.js'].lineData[14]++;
  f();
}
_$jscoverage['javascript-try.js'].lineData[17]++;
try {
  _$jscoverage['javascript-try.js'].lineData[18]++;
  f();
} finally {
  _$jscoverage['javascript-try.js'].lineData[21]++;
  f();
}
_$jscoverage['javascript-try.js'].lineData[24]++;
try {
  _$jscoverage['javascript-try.js'].lineData[25]++;
  f();
}catch (e) {
  _$jscoverage['javascript-try.js'].lineData[28]++;
  f();
}
 finally {
  _$jscoverage['javascript-try.js'].lineData[31]++;
  f();
}
