if (! _$jscoverage['javascript-generator.js']) {
  _$jscoverage['javascript-generator.js'] = {};
  _$jscoverage['javascript-generator.js'].lineData = [];
  _$jscoverage['javascript-generator.js'].lineData[3] = 0;
  _$jscoverage['javascript-generator.js'].lineData[4] = 0;
  _$jscoverage['javascript-generator.js'].lineData[5] = 0;
  _$jscoverage['javascript-generator.js'].lineData[6] = 0;
  _$jscoverage['javascript-generator.js'].lineData[7] = 0;
  _$jscoverage['javascript-generator.js'].lineData[8] = 0;
  _$jscoverage['javascript-generator.js'].lineData[9] = 0;
}
if (! _$jscoverage['javascript-generator.js'].functionData) {
  _$jscoverage['javascript-generator.js'].functionData = [];
  _$jscoverage['javascript-generator.js'].functionData[0] = 0;
}
_$jscoverage['javascript-generator.js'].lineData[3]++;
function fib() {
  _$jscoverage['javascript-generator.js'].functionData[0]++;
  _$jscoverage['javascript-generator.js'].lineData[4]++;
  var i = 0, j = 1;
  _$jscoverage['javascript-generator.js'].lineData[5]++;
  while (true) {
    _$jscoverage['javascript-generator.js'].lineData[6]++;
yield i;
    _$jscoverage['javascript-generator.js'].lineData[7]++;
    var t = i;
    _$jscoverage['javascript-generator.js'].lineData[8]++;
    i = j;
    _$jscoverage['javascript-generator.js'].lineData[9]++;
    j += t;
  }
}
