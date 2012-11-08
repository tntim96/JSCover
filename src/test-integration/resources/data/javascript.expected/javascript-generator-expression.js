if (! _$jscoverage['javascript-generator-expression.js']) {
  _$jscoverage['javascript-generator-expression.js'] = [];
  _$jscoverage['javascript-generator-expression.js'][3] = 0;
  _$jscoverage['javascript-generator-expression.js'][4] = 0;
  _$jscoverage['javascript-generator-expression.js'][5] = 0;
  _$jscoverage['javascript-generator-expression.js'][6] = 0;
  _$jscoverage['javascript-generator-expression.js'][9] = 0;
  _$jscoverage['javascript-generator-expression.js'][12] = 0;
  _$jscoverage['javascript-generator-expression.js'][13] = 0;
  _$jscoverage['javascript-generator-expression.js'][14] = 0;
  _$jscoverage['javascript-generator-expression.js'][16] = 0;
  _$jscoverage['javascript-generator-expression.js'][18] = 0;
}
_$jscoverage['javascript-generator-expression.js'].source = ["// https://developer.mozilla.org/en/New_in_JavaScript_1.8","","let it = (i + 3 for (i in someObj));","try {","  while (true) {","    document.write(it.next() + \"&lt;br&gt;\\n\");","  }","} catch (err if err instanceof StopIteration) {","  document.write(\"End of record.&lt;br&gt;\\n\");","}","","function handleResults( results ) {","  for ( let i in results )","    ;","}","handleResults( i for ( i in obj ) if ( i &gt; 3 ) );","","it = (1 for(a in x) for(b in y));"];
_$jscoverage['javascript-generator-expression.js'][3]++;
let it = (i + 3 for (i in someObj));
_$jscoverage['javascript-generator-expression.js'][4]++;
try {
  _$jscoverage['javascript-generator-expression.js'][5]++;
  while (true) {
    _$jscoverage['javascript-generator-expression.js'][6]++;
    document.write(it.next() + "<br>\n");
  }
}catch (err if err instanceof StopIteration) {
  _$jscoverage['javascript-generator-expression.js'][9]++;
  document.write("End of record.<br>\n");
}
_$jscoverage['javascript-generator-expression.js'][12]++;
function handleResults(results) {
  _$jscoverage['javascript-generator-expression.js'][13]++;
  for (let i in results) {
    _$jscoverage['javascript-generator-expression.js'][14]++;
    ;
  }
}
_$jscoverage['javascript-generator-expression.js'][16]++;
handleResults((i for (i in obj) if (i > 3)));
_$jscoverage['javascript-generator-expression.js'][18]++;
it = (1 for (a in x) for (b in y));
