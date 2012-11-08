if (! _$jscoverage['javascript-with.js']) {
  _$jscoverage['javascript-with.js'] = [];
  _$jscoverage['javascript-with.js'][1] = 0;
  _$jscoverage['javascript-with.js'][2] = 0;
  _$jscoverage['javascript-with.js'][4] = 0;
  _$jscoverage['javascript-with.js'][5] = 0;
  _$jscoverage['javascript-with.js'][8] = 0;
  _$jscoverage['javascript-with.js'][9] = 0;
}
_$jscoverage['javascript-with.js'].source = ["function f() {}","var x = {};","","with (x) {","  f();","}","","with (x)","  f();"];
_$jscoverage['javascript-with.js'][1]++;
function f() {
}
_$jscoverage['javascript-with.js'][2]++;
var x = {};
_$jscoverage['javascript-with.js'][4]++;
with (x) {
  _$jscoverage['javascript-with.js'][5]++;
  f();
}
_$jscoverage['javascript-with.js'][8]++;
with (x) {
  _$jscoverage['javascript-with.js'][9]++;
  f();
}
