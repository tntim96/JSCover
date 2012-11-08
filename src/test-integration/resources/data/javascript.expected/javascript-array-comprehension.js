if (! _$jscoverage['javascript-array-comprehension.js']) {
  _$jscoverage['javascript-array-comprehension.js'] = [];
  _$jscoverage['javascript-array-comprehension.js'][3] = 0;
  _$jscoverage['javascript-array-comprehension.js'][4] = 0;
  _$jscoverage['javascript-array-comprehension.js'][5] = 0;
  _$jscoverage['javascript-array-comprehension.js'][8] = 0;
  _$jscoverage['javascript-array-comprehension.js'][9] = 0;
  _$jscoverage['javascript-array-comprehension.js'][12] = 0;
  _$jscoverage['javascript-array-comprehension.js'][14] = 0;
}
_$jscoverage['javascript-array-comprehension.js'].source = ["// https://developer.mozilla.org/en/New_in_JavaScript_1.7","","function range(begin, end) {","  for (let i = begin; i &lt; end; ++i) {","    yield i;","  }","}","var ten_squares = [i * i for each (i in range(0, 10))];","var evens = [i for each (i in range(0, 21)) if (i % 2 == 0)];","","// test optimization","var optimized = [i for each (i in x) if (0)];","","[i for each (a in x) for each (b in y)]"];
_$jscoverage['javascript-array-comprehension.js'][3]++;
function range(begin, end) {
  _$jscoverage['javascript-array-comprehension.js'][4]++;
  for (let i = begin; i < end; ++i) {
    _$jscoverage['javascript-array-comprehension.js'][5]++;
yield i;
  }
}
_$jscoverage['javascript-array-comprehension.js'][8]++;
var ten_squares = [i * i for each (i in range(0, 10))];
_$jscoverage['javascript-array-comprehension.js'][9]++;
var evens = [i for each (i in range(0, 21)) if (i % 2 == 0)];
_$jscoverage['javascript-array-comprehension.js'][12]++;
var optimized = [i for each (i in x) if (0)];
_$jscoverage['javascript-array-comprehension.js'][14]++;
[i for each (a in x) for each (b in y)];
