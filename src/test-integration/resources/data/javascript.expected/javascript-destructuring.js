if (! _$jscoverage['javascript-destructuring.js']) {
  _$jscoverage['javascript-destructuring.js'] = {};
  _$jscoverage['javascript-destructuring.js'].lineData = [];
  _$jscoverage['javascript-destructuring.js'].lineData[3] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[5] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[6] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[8] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[10] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[11] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[12] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[15] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[16] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[17] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[20] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[21] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[23] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[24] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[25] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[26] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[27] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[30] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[31] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[32] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[35] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[37] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[38] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[39] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[40] = 0;
  _$jscoverage['javascript-destructuring.js'].lineData[41] = 0;
}
if (! _$jscoverage['javascript-destructuring.js'].functionData) {
  _$jscoverage['javascript-destructuring.js'].functionData = [];
  _$jscoverage['javascript-destructuring.js'].functionData[0] = 0;
  _$jscoverage['javascript-destructuring.js'].functionData[1] = 0;
  _$jscoverage['javascript-destructuring.js'].functionData[2] = 0;
  _$jscoverage['javascript-destructuring.js'].functionData[3] = 0;
}
_$jscoverage['javascript-destructuring.js'].lineData[3]++;
[a, b] = [b, a];
_$jscoverage['javascript-destructuring.js'].lineData[5]++;
function f() {
  _$jscoverage['javascript-destructuring.js'].functionData[0]++;
  _$jscoverage['javascript-destructuring.js'].lineData[6]++;
  return [1, 2];
}
_$jscoverage['javascript-destructuring.js'].lineData[8]++;
[a, b] = f();
_$jscoverage['javascript-destructuring.js'].lineData[10]++;
for (let [name, value] in Iterator(obj)) {
  _$jscoverage['javascript-destructuring.js'].lineData[11]++;
  print(name);
  _$jscoverage['javascript-destructuring.js'].lineData[12]++;
  print(value);
}
_$jscoverage['javascript-destructuring.js'].lineData[15]++;
for each (let {
  name: n, 
  family: {
  father: f}} in people) {
  _$jscoverage['javascript-destructuring.js'].lineData[16]++;
  print(n);
  _$jscoverage['javascript-destructuring.js'].lineData[17]++;
  print(f);
}
_$jscoverage['javascript-destructuring.js'].lineData[20]++;
var [a, , b] = f();
_$jscoverage['javascript-destructuring.js'].lineData[21]++;
[, , ,] = f();
_$jscoverage['javascript-destructuring.js'].lineData[23]++;
function g() {
  _$jscoverage['javascript-destructuring.js'].functionData[1]++;
  _$jscoverage['javascript-destructuring.js'].lineData[24]++;
  var parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
  _$jscoverage['javascript-destructuring.js'].lineData[25]++;
  if (!parsedURL) {
    _$jscoverage['javascript-destructuring.js'].lineData[26]++;
    return null;
  }
  _$jscoverage['javascript-destructuring.js'].lineData[27]++;
  var [, protocol, fullhost, fullpath] = parsedURL;
}
_$jscoverage['javascript-destructuring.js'].lineData[30]++;
function h(a, [b, c], {
  foo: d, 
  'bar': e}) {
  _$jscoverage['javascript-destructuring.js'].functionData[2]++;
  _$jscoverage['javascript-destructuring.js'].lineData[31]++;
  f();
  _$jscoverage['javascript-destructuring.js'].lineData[32]++;
  g();
}
_$jscoverage['javascript-destructuring.js'].lineData[35]++;
x = function([a, b]) a + b;
_$jscoverage['javascript-destructuring.js'].lineData[37]++;
({
  x: x0, 
  y: y0}) = point;
_$jscoverage['javascript-destructuring.js'].lineData[38]++;
var {
  x: x0, 
  y: y0} = point;
_$jscoverage['javascript-destructuring.js'].lineData[39]++;
let ({
  x: x0, 
  y: y0} = point) {
  _$jscoverage['javascript-destructuring.js'].lineData[40]++;
  print(x0);
  _$jscoverage['javascript-destructuring.js'].lineData[41]++;
  print(y0);
}
