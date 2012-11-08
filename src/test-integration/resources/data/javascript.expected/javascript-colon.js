if (! _$jscoverage['javascript-colon.js']) {
  _$jscoverage['javascript-colon.js'] = [];
  _$jscoverage['javascript-colon.js'][1] = 0;
  _$jscoverage['javascript-colon.js'][2] = 0;
  _$jscoverage['javascript-colon.js'][4] = 0;
  _$jscoverage['javascript-colon.js'][5] = 0;
  _$jscoverage['javascript-colon.js'][6] = 0;
}
_$jscoverage['javascript-colon.js'].source = ["x:","  y = 0;","","y: {","  let y = 1;","  print(y);","}"];
x:
  {
    _$jscoverage['javascript-colon.js'][1]++;
    _$jscoverage['javascript-colon.js'][2]++;
    y = 0;
  }
y:
  {
    _$jscoverage['javascript-colon.js'][4]++;
    {
      _$jscoverage['javascript-colon.js'][5]++;
      let y = 1;
      _$jscoverage['javascript-colon.js'][6]++;
      print(y);
    }
  }
