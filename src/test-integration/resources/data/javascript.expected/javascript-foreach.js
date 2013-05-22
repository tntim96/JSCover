if (! _$jscoverage['javascript-foreach.js']) {
  _$jscoverage['javascript-foreach.js'] = {};
  _$jscoverage['javascript-foreach.js'].lineData = [];
  _$jscoverage['javascript-foreach.js'].lineData[6] = 0;
  _$jscoverage['javascript-foreach.js'].lineData[7] = 0;
}
if (! _$jscoverage['javascript-foreach.js'].functionData) {
  _$jscoverage['javascript-foreach.js'].functionData = [];
}
_$jscoverage['javascript-foreach.js'].lineData[6]++;
for each (var item in obj) {
  _$jscoverage['javascript-foreach.js'].lineData[7]++;
  sum += item;
}
