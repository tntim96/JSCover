if (! _$jscoverage['javascript-destructuring.js']) {
  _$jscoverage['javascript-destructuring.js'] = [];
  _$jscoverage['javascript-destructuring.js'][3] = 0;
  _$jscoverage['javascript-destructuring.js'][5] = 0;
  _$jscoverage['javascript-destructuring.js'][6] = 0;
  _$jscoverage['javascript-destructuring.js'][8] = 0;
  _$jscoverage['javascript-destructuring.js'][10] = 0;
  _$jscoverage['javascript-destructuring.js'][11] = 0;
  _$jscoverage['javascript-destructuring.js'][12] = 0;
  _$jscoverage['javascript-destructuring.js'][15] = 0;
  _$jscoverage['javascript-destructuring.js'][16] = 0;
  _$jscoverage['javascript-destructuring.js'][17] = 0;
  _$jscoverage['javascript-destructuring.js'][20] = 0;
  _$jscoverage['javascript-destructuring.js'][21] = 0;
  _$jscoverage['javascript-destructuring.js'][23] = 0;
  _$jscoverage['javascript-destructuring.js'][24] = 0;
  _$jscoverage['javascript-destructuring.js'][25] = 0;
  _$jscoverage['javascript-destructuring.js'][26] = 0;
  _$jscoverage['javascript-destructuring.js'][27] = 0;
  _$jscoverage['javascript-destructuring.js'][30] = 0;
  _$jscoverage['javascript-destructuring.js'][31] = 0;
  _$jscoverage['javascript-destructuring.js'][32] = 0;
  _$jscoverage['javascript-destructuring.js'][35] = 0;
  _$jscoverage['javascript-destructuring.js'][37] = 0;
  _$jscoverage['javascript-destructuring.js'][38] = 0;
  _$jscoverage['javascript-destructuring.js'][39] = 0;
  _$jscoverage['javascript-destructuring.js'][40] = 0;
  _$jscoverage['javascript-destructuring.js'][41] = 0;
}
_$jscoverage['javascript-destructuring.js'].source = ["// https://developer.mozilla.org/en/New_in_JavaScript_1.7","","[a, b] = [b, a];","","function f() {","  return [1, 2];","}","[a, b] = f();","","for (let [name, value] in Iterator(obj)) {","  print(name);","  print(value);","}","","for each (let {name: n, family: { father: f } } in people) {","  print(n);","  print(f);","}","","var [a, , b] = f();","[,,,] = f();","","function g() {","  var parsedURL = /^(\\w+)\\:\\/\\/([^\\/]+)\\/(.*)$/.exec(url);","  if (!parsedURL)","    return null;","  var [, protocol, fullhost, fullpath] = parsedURL;","}","","function h(a, [b, c], {foo: d, 'bar': e}) {","  f();","  g();","}","","x = function([a, b]) a + b;","","({x: x0, y: y0}) = point;","var {x: x0, y: y0} = point;","let ({x: x0, y: y0} = point) {","  print(x0);","  print(y0);","}"];
_$jscoverage['javascript-destructuring.js'][3]++;
[a, b] = [b, a];
_$jscoverage['javascript-destructuring.js'][5]++;
function f() {
  _$jscoverage['javascript-destructuring.js'][6]++;
  return [1, 2];
}
_$jscoverage['javascript-destructuring.js'][8]++;
[a, b] = f();
_$jscoverage['javascript-destructuring.js'][10]++;
for (let [name, value] in Iterator(obj)) {
  _$jscoverage['javascript-destructuring.js'][11]++;
  print(name);
  _$jscoverage['javascript-destructuring.js'][12]++;
  print(value);
}
_$jscoverage['javascript-destructuring.js'][15]++;
for each (let {
  name: n, 
  family: {
  father: f}} in people) {
  _$jscoverage['javascript-destructuring.js'][16]++;
  print(n);
  _$jscoverage['javascript-destructuring.js'][17]++;
  print(f);
}
_$jscoverage['javascript-destructuring.js'][20]++;
var [a, , b] = f();
_$jscoverage['javascript-destructuring.js'][21]++;
[, , ,] = f();
_$jscoverage['javascript-destructuring.js'][23]++;
function g() {
  _$jscoverage['javascript-destructuring.js'][24]++;
  var parsedURL = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
  _$jscoverage['javascript-destructuring.js'][25]++;
  if (!parsedURL) {
    _$jscoverage['javascript-destructuring.js'][26]++;
    return null;
  }
  _$jscoverage['javascript-destructuring.js'][27]++;
  var [, protocol, fullhost, fullpath] = parsedURL;
}
_$jscoverage['javascript-destructuring.js'][30]++;
function h(a, [b, c], {
  foo: d, 
  'bar': e}) {
  _$jscoverage['javascript-destructuring.js'][31]++;
  f();
  _$jscoverage['javascript-destructuring.js'][32]++;
  g();
}
_$jscoverage['javascript-destructuring.js'][35]++;
x = function([a, b]) a + b;
_$jscoverage['javascript-destructuring.js'][37]++;
({
  x: x0, 
  y: y0}) = point;
_$jscoverage['javascript-destructuring.js'][38]++;
var {
  x: x0, 
  y: y0} = point;
_$jscoverage['javascript-destructuring.js'][39]++;
let ({
  x: x0, 
  y: y0} = point) {
  _$jscoverage['javascript-destructuring.js'][40]++;
  print(x0);
  _$jscoverage['javascript-destructuring.js'][41]++;
  print(y0);
}
