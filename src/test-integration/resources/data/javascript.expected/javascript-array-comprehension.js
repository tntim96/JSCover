if (! _$jscoverage['javascript-array-comprehension.js']) {
  _$jscoverage['javascript-array-comprehension.js'] = {};
  _$jscoverage['javascript-array-comprehension.js'].lineData = [];
  _$jscoverage['javascript-array-comprehension.js'].lineData[3] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[4] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[5] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[8] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[9] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[12] = 0;
  _$jscoverage['javascript-array-comprehension.js'].lineData[14] = 0;
}
if (! _$jscoverage['javascript-array-comprehension.js'].functionData) {
  _$jscoverage['javascript-array-comprehension.js'].functionData = [];
  _$jscoverage['javascript-array-comprehension.js'].functionData[0] = 0;
}
_$jscoverage['javascript-array-comprehension.js'].lineData[3]++;
function range(begin, end) {
  _$jscoverage['javascript-array-comprehension.js'].functionData[0]++;
  _$jscoverage['javascript-array-comprehension.js'].lineData[4]++;
  for (let i = begin; i < end; ++i) {
    _$jscoverage['javascript-array-comprehension.js'].lineData[5]++;
yield i;
  }
}
_$jscoverage['javascript-array-comprehension.js'].lineData[8]++;
var ten_squares = [i * i for each (i in range(0, 10))];
_$jscoverage['javascript-array-comprehension.js'].lineData[9]++;
var evens = [i for each (i in range(0, 21)) if (i % 2 == 0)];
_$jscoverage['javascript-array-comprehension.js'].lineData[12]++;
var optimized = [i for each (i in x) if (0)];
_$jscoverage['javascript-array-comprehension.js'].lineData[14]++;
[i for each (a in x) for each (b in y)];
