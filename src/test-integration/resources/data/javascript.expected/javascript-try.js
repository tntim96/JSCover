if (! _$jscoverage['javascript-try.js']) {
  _$jscoverage['javascript-try.js'] = [];
  _$jscoverage['javascript-try.js'][1] = 0;
  _$jscoverage['javascript-try.js'][3] = 0;
  _$jscoverage['javascript-try.js'][4] = 0;
  _$jscoverage['javascript-try.js'][7] = 0;
  _$jscoverage['javascript-try.js'][10] = 0;
  _$jscoverage['javascript-try.js'][11] = 0;
  _$jscoverage['javascript-try.js'][14] = 0;
  _$jscoverage['javascript-try.js'][17] = 0;
  _$jscoverage['javascript-try.js'][18] = 0;
  _$jscoverage['javascript-try.js'][21] = 0;
  _$jscoverage['javascript-try.js'][24] = 0;
  _$jscoverage['javascript-try.js'][25] = 0;
  _$jscoverage['javascript-try.js'][28] = 0;
  _$jscoverage['javascript-try.js'][31] = 0;
}
_$jscoverage['javascript-try.js'].source = ["function f() {}","","try {","  f();","}","catch (e) {","  f();","}","","try {","  f();","}","catch (e if e instanceof E) {","  f();","}","","try {","  f();","}","finally {","  f();","}","","try {","  f();","}","catch (e) {","  f();","}","finally {","  f();","}"];
_$jscoverage['javascript-try.js'][1]++;
function f() {
}
_$jscoverage['javascript-try.js'][3]++;
try {
  _$jscoverage['javascript-try.js'][4]++;
  f();
}catch (e) {
  _$jscoverage['javascript-try.js'][7]++;
  f();
}
_$jscoverage['javascript-try.js'][10]++;
try {
  _$jscoverage['javascript-try.js'][11]++;
  f();
}catch (e if e instanceof E) {
  _$jscoverage['javascript-try.js'][14]++;
  f();
}
_$jscoverage['javascript-try.js'][17]++;
try {
  _$jscoverage['javascript-try.js'][18]++;
  f();
} finally {
  _$jscoverage['javascript-try.js'][21]++;
  f();
}
_$jscoverage['javascript-try.js'][24]++;
try {
  _$jscoverage['javascript-try.js'][25]++;
  f();
}catch (e) {
  _$jscoverage['javascript-try.js'][28]++;
  f();
}
 finally {
  _$jscoverage['javascript-try.js'][31]++;
  f();
}
