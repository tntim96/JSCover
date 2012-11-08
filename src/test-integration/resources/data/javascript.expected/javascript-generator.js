if (! _$jscoverage['javascript-generator.js']) {
  _$jscoverage['javascript-generator.js'] = [];
  _$jscoverage['javascript-generator.js'][3] = 0;
  _$jscoverage['javascript-generator.js'][4] = 0;
  _$jscoverage['javascript-generator.js'][5] = 0;
  _$jscoverage['javascript-generator.js'][6] = 0;
  _$jscoverage['javascript-generator.js'][7] = 0;
  _$jscoverage['javascript-generator.js'][8] = 0;
  _$jscoverage['javascript-generator.js'][9] = 0;
}
_$jscoverage['javascript-generator.js'].source = ["// https://developer.mozilla.org/en/New_in_JavaScript_1.7","","function fib() {","  var i = 0, j = 1;","  while (true) {","    yield i;","    var t = i;","    i = j;","    j += t;","  }","}"];
_$jscoverage['javascript-generator.js'][3]++;
function fib() {
  _$jscoverage['javascript-generator.js'][4]++;
  var i = 0, j = 1;
  _$jscoverage['javascript-generator.js'][5]++;
  while (true) {
    _$jscoverage['javascript-generator.js'][6]++;
yield i;
    _$jscoverage['javascript-generator.js'][7]++;
    var t = i;
    _$jscoverage['javascript-generator.js'][8]++;
    i = j;
    _$jscoverage['javascript-generator.js'][9]++;
    j += t;
  }
}
