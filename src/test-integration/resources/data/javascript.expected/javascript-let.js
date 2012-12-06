if (! _$jscoverage['javascript-let.js']) {
  _$jscoverage['javascript-let.js'] = [];
  _$jscoverage['javascript-let.js'][5] = 0;
  _$jscoverage['javascript-let.js'][6] = 0;
  _$jscoverage['javascript-let.js'][11] = 0;
  _$jscoverage['javascript-let.js'][15] = 0;
  _$jscoverage['javascript-let.js'][16] = 0;
  _$jscoverage['javascript-let.js'][17] = 0;
  _$jscoverage['javascript-let.js'][20] = 0;
  _$jscoverage['javascript-let.js'][22] = 0;
  _$jscoverage['javascript-let.js'][23] = 0;
  _$jscoverage['javascript-let.js'][24] = 0;
  _$jscoverage['javascript-let.js'][26] = 0;
  _$jscoverage['javascript-let.js'][27] = 0;
  _$jscoverage['javascript-let.js'][28] = 0;
  _$jscoverage['javascript-let.js'][30] = 0;
  _$jscoverage['javascript-let.js'][33] = 0;
  _$jscoverage['javascript-let.js'][34] = 0;
  _$jscoverage['javascript-let.js'][35] = 0;
  _$jscoverage['javascript-let.js'][36] = 0;
  _$jscoverage['javascript-let.js'][37] = 0;
  _$jscoverage['javascript-let.js'][39] = 0;
  _$jscoverage['javascript-let.js'][42] = 0;
  _$jscoverage['javascript-let.js'][43] = 0;
  _$jscoverage['javascript-let.js'][44] = 0;
  _$jscoverage['javascript-let.js'][45] = 0;
  _$jscoverage['javascript-let.js'][46] = 0;
  _$jscoverage['javascript-let.js'][48] = 0;
  _$jscoverage['javascript-let.js'][51] = 0;
  _$jscoverage['javascript-let.js'][52] = 0;
  _$jscoverage['javascript-let.js'][55] = 0;
  _$jscoverage['javascript-let.js'][56] = 0;
  _$jscoverage['javascript-let.js'][60] = 0;
  _$jscoverage['javascript-let.js'][64] = 0;
  _$jscoverage['javascript-let.js'][65] = 0;
  _$jscoverage['javascript-let.js'][69] = 0;
  _$jscoverage['javascript-let.js'][70] = 0;
  _$jscoverage['javascript-let.js'][71] = 0;
  _$jscoverage['javascript-let.js'][74] = 0;
  _$jscoverage['javascript-let.js'][75] = 0;
  _$jscoverage['javascript-let.js'][76] = 0;
  _$jscoverage['javascript-let.js'][78] = 0;
  _$jscoverage['javascript-let.js'][79] = 0;
}
_$jscoverage['javascript-let.js'][5]++;
let (x = x + 10, y = 12) {
  _$jscoverage['javascript-let.js'][6]++;
  print(x + y + "\n");
}
_$jscoverage['javascript-let.js'][11]++;
print(let (x = x + 10, y = 12) x + y + "<br>\n");
_$jscoverage['javascript-let.js'][15]++;
if (x > y) {
  _$jscoverage['javascript-let.js'][16]++;
  let gamma = 12.7 + y;
  _$jscoverage['javascript-let.js'][17]++;
  i = gamma * x;
}
_$jscoverage['javascript-let.js'][20]++;
var list = document.getElementById("list");
_$jscoverage['javascript-let.js'][22]++;
for (var i = 1; i <= 5; i++) {
  _$jscoverage['javascript-let.js'][23]++;
  var item = document.createElement("LI");
  _$jscoverage['javascript-let.js'][24]++;
  item.appendChild(document.createTextNode("Item " + i));
  _$jscoverage['javascript-let.js'][26]++;
  let j = i;
  _$jscoverage['javascript-let.js'][27]++;
  item.onclick = function(ev) {
  _$jscoverage['javascript-let.js'][28]++;
  alert("Item " + j + " is clicked.");
};
  _$jscoverage['javascript-let.js'][30]++;
  list.appendChild(item);
}
_$jscoverage['javascript-let.js'][33]++;
function varTest() {
  _$jscoverage['javascript-let.js'][34]++;
  var x = 31;
  _$jscoverage['javascript-let.js'][35]++;
  if (true) {
    _$jscoverage['javascript-let.js'][36]++;
    var x = 71;
    _$jscoverage['javascript-let.js'][37]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'][39]++;
  alert(x);
}
_$jscoverage['javascript-let.js'][42]++;
function letTest() {
  _$jscoverage['javascript-let.js'][43]++;
  let x = 31;
  _$jscoverage['javascript-let.js'][44]++;
  if (true) {
    _$jscoverage['javascript-let.js'][45]++;
    let x = 71;
    _$jscoverage['javascript-let.js'][46]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'][48]++;
  alert(x);
}
_$jscoverage['javascript-let.js'][51]++;
function letTests() {
  _$jscoverage['javascript-let.js'][52]++;
  let x = 10;
  _$jscoverage['javascript-let.js'][55]++;
  let (x = x + 20)   {
    _$jscoverage['javascript-let.js'][56]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'][60]++;
  alert(let (x = x + 20) x);
  {
    _$jscoverage['javascript-let.js'][64]++;
    let x = x + 20;
    _$jscoverage['javascript-let.js'][65]++;
    alert(x);
  }
}
_$jscoverage['javascript-let.js'][69]++;
var x = 'global';
_$jscoverage['javascript-let.js'][70]++;
let x = 42;
_$jscoverage['javascript-let.js'][71]++;
document.write(this.x + "<br>\n");
_$jscoverage['javascript-let.js'][74]++;
var i = 0;
_$jscoverage['javascript-let.js'][75]++;
for (let i = i; i < 10; i++) {
  _$jscoverage['javascript-let.js'][76]++;
  document.write(i + "<br>\n");
}
_$jscoverage['javascript-let.js'][78]++;
for (let [name, value] in obj) {
  _$jscoverage['javascript-let.js'][79]++;
  document.write("Name: " + name + ", Value: " + value + "<br>\n");
}
