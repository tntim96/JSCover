if (! _$jscoverage['javascript-generator-expression.js']) {
  _$jscoverage['javascript-generator-expression.js'] = {};
  _$jscoverage['javascript-generator-expression.js'].lineData = [];
  _$jscoverage['javascript-generator-expression.js'].lineData[3] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[4] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[5] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[6] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[9] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[12] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[13] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[14] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[16] = 0;
  _$jscoverage['javascript-generator-expression.js'].lineData[18] = 0;
}
if (! _$jscoverage['javascript-generator-expression.js'].functionData) {
  _$jscoverage['javascript-generator-expression.js'].functionData = [];
  _$jscoverage['javascript-generator-expression.js'].functionData[0] = 0;
}
_$jscoverage['javascript-generator-expression.js'].lineData[3]++;
let it = (i + 3 for (i in someObj));
_$jscoverage['javascript-generator-expression.js'].lineData[4]++;
try {
  _$jscoverage['javascript-generator-expression.js'].lineData[5]++;
  while (true) {
    _$jscoverage['javascript-generator-expression.js'].lineData[6]++;
    document.write(it.next() + "<br>\n");
  }
}catch (err if err instanceof StopIteration) {
  _$jscoverage['javascript-generator-expression.js'].lineData[9]++;
  document.write("End of record.<br>\n");
}
_$jscoverage['javascript-generator-expression.js'].lineData[12]++;
function handleResults(results) {
  _$jscoverage['javascript-generator-expression.js'].functionData[0]++;
  _$jscoverage['javascript-generator-expression.js'].lineData[13]++;
  for (let i in results) {
    _$jscoverage['javascript-generator-expression.js'].lineData[14]++;
    ;
  }
}
_$jscoverage['javascript-generator-expression.js'].lineData[16]++;
handleResults((i for (i in obj) if (i > 3)));
_$jscoverage['javascript-generator-expression.js'].lineData[18]++;
it = (1 for (a in x) for (b in y));
