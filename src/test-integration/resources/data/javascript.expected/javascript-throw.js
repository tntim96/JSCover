if (! _$jscoverage['javascript-throw.js']) {
  _$jscoverage['javascript-throw.js'] = [];
  _$jscoverage['javascript-throw.js'][1] = 0;
  _$jscoverage['javascript-throw.js'][2] = 0;
  _$jscoverage['javascript-throw.js'][5] = 0;
}
_$jscoverage['javascript-throw.js'].source = ["try {","  throw \"x\";","}","catch (e) {","  ;","}"];
_$jscoverage['javascript-throw.js'][1]++;
try {
  _$jscoverage['javascript-throw.js'][2]++;
  throw "x";
}catch (e) {
  _$jscoverage['javascript-throw.js'][5]++;
  ;
}
