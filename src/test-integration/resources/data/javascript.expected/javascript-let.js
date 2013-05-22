if (! _$jscoverage['javascript-let.js']) {
  _$jscoverage['javascript-let.js'] = {};
  _$jscoverage['javascript-let.js'].lineData = [];
  _$jscoverage['javascript-let.js'].lineData[5] = 0;
  _$jscoverage['javascript-let.js'].lineData[6] = 0;
  _$jscoverage['javascript-let.js'].lineData[11] = 0;
  _$jscoverage['javascript-let.js'].lineData[15] = 0;
  _$jscoverage['javascript-let.js'].lineData[16] = 0;
  _$jscoverage['javascript-let.js'].lineData[17] = 0;
  _$jscoverage['javascript-let.js'].lineData[20] = 0;
  _$jscoverage['javascript-let.js'].lineData[22] = 0;
  _$jscoverage['javascript-let.js'].lineData[23] = 0;
  _$jscoverage['javascript-let.js'].lineData[24] = 0;
  _$jscoverage['javascript-let.js'].lineData[26] = 0;
  _$jscoverage['javascript-let.js'].lineData[27] = 0;
  _$jscoverage['javascript-let.js'].lineData[28] = 0;
  _$jscoverage['javascript-let.js'].lineData[30] = 0;
  _$jscoverage['javascript-let.js'].lineData[33] = 0;
  _$jscoverage['javascript-let.js'].lineData[34] = 0;
  _$jscoverage['javascript-let.js'].lineData[35] = 0;
  _$jscoverage['javascript-let.js'].lineData[36] = 0;
  _$jscoverage['javascript-let.js'].lineData[37] = 0;
  _$jscoverage['javascript-let.js'].lineData[39] = 0;
  _$jscoverage['javascript-let.js'].lineData[42] = 0;
  _$jscoverage['javascript-let.js'].lineData[43] = 0;
  _$jscoverage['javascript-let.js'].lineData[44] = 0;
  _$jscoverage['javascript-let.js'].lineData[45] = 0;
  _$jscoverage['javascript-let.js'].lineData[46] = 0;
  _$jscoverage['javascript-let.js'].lineData[48] = 0;
  _$jscoverage['javascript-let.js'].lineData[51] = 0;
  _$jscoverage['javascript-let.js'].lineData[52] = 0;
  _$jscoverage['javascript-let.js'].lineData[55] = 0;
  _$jscoverage['javascript-let.js'].lineData[56] = 0;
  _$jscoverage['javascript-let.js'].lineData[60] = 0;
  _$jscoverage['javascript-let.js'].lineData[64] = 0;
  _$jscoverage['javascript-let.js'].lineData[65] = 0;
  _$jscoverage['javascript-let.js'].lineData[69] = 0;
  _$jscoverage['javascript-let.js'].lineData[70] = 0;
  _$jscoverage['javascript-let.js'].lineData[71] = 0;
  _$jscoverage['javascript-let.js'].lineData[74] = 0;
  _$jscoverage['javascript-let.js'].lineData[75] = 0;
  _$jscoverage['javascript-let.js'].lineData[76] = 0;
  _$jscoverage['javascript-let.js'].lineData[78] = 0;
  _$jscoverage['javascript-let.js'].lineData[79] = 0;
}
if (! _$jscoverage['javascript-let.js'].functionData) {
  _$jscoverage['javascript-let.js'].functionData = [];
  _$jscoverage['javascript-let.js'].functionData[0] = 0;
  _$jscoverage['javascript-let.js'].functionData[1] = 0;
  _$jscoverage['javascript-let.js'].functionData[2] = 0;
  _$jscoverage['javascript-let.js'].functionData[3] = 0;
}
_$jscoverage['javascript-let.js'].lineData[5]++;
let (x = x + 10, y = 12) {
  _$jscoverage['javascript-let.js'].lineData[6]++;
  print(x + y + "\n");
}
_$jscoverage['javascript-let.js'].lineData[11]++;
print(let (x = x + 10, y = 12) x + y + "<br>\n");
_$jscoverage['javascript-let.js'].lineData[15]++;
if (x > y) {
  _$jscoverage['javascript-let.js'].lineData[16]++;
  let gamma = 12.7 + y;
  _$jscoverage['javascript-let.js'].lineData[17]++;
  i = gamma * x;
}
_$jscoverage['javascript-let.js'].lineData[20]++;
var list = document.getElementById("list");
_$jscoverage['javascript-let.js'].lineData[22]++;
for (var i = 1; i <= 5; i++) {
  _$jscoverage['javascript-let.js'].lineData[23]++;
  var item = document.createElement("LI");
  _$jscoverage['javascript-let.js'].lineData[24]++;
  item.appendChild(document.createTextNode("Item " + i));
  _$jscoverage['javascript-let.js'].lineData[26]++;
  let j = i;
  _$jscoverage['javascript-let.js'].lineData[27]++;
  item.onclick = function(ev) {
  _$jscoverage['javascript-let.js'].functionData[0]++;
  _$jscoverage['javascript-let.js'].lineData[28]++;
  alert("Item " + j + " is clicked.");
};
  _$jscoverage['javascript-let.js'].lineData[30]++;
  list.appendChild(item);
}
_$jscoverage['javascript-let.js'].lineData[33]++;
function varTest() {
  _$jscoverage['javascript-let.js'].functionData[1]++;
  _$jscoverage['javascript-let.js'].lineData[34]++;
  var x = 31;
  _$jscoverage['javascript-let.js'].lineData[35]++;
  if (true) {
    _$jscoverage['javascript-let.js'].lineData[36]++;
    var x = 71;
    _$jscoverage['javascript-let.js'].lineData[37]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'].lineData[39]++;
  alert(x);
}
_$jscoverage['javascript-let.js'].lineData[42]++;
function letTest() {
  _$jscoverage['javascript-let.js'].functionData[2]++;
  _$jscoverage['javascript-let.js'].lineData[43]++;
  let x = 31;
  _$jscoverage['javascript-let.js'].lineData[44]++;
  if (true) {
    _$jscoverage['javascript-let.js'].lineData[45]++;
    let x = 71;
    _$jscoverage['javascript-let.js'].lineData[46]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'].lineData[48]++;
  alert(x);
}
_$jscoverage['javascript-let.js'].lineData[51]++;
function letTests() {
  _$jscoverage['javascript-let.js'].functionData[3]++;
  _$jscoverage['javascript-let.js'].lineData[52]++;
  let x = 10;
  _$jscoverage['javascript-let.js'].lineData[55]++;
  let (x = x + 20)   {
    _$jscoverage['javascript-let.js'].lineData[56]++;
    alert(x);
  }
  _$jscoverage['javascript-let.js'].lineData[60]++;
  alert(let (x = x + 20) x);
  {
    _$jscoverage['javascript-let.js'].lineData[64]++;
    let x = x + 20;
    _$jscoverage['javascript-let.js'].lineData[65]++;
    alert(x);
  }
}
_$jscoverage['javascript-let.js'].lineData[69]++;
var x = 'global';
_$jscoverage['javascript-let.js'].lineData[70]++;
let x = 42;
_$jscoverage['javascript-let.js'].lineData[71]++;
document.write(this.x + "<br>\n");
_$jscoverage['javascript-let.js'].lineData[74]++;
var i = 0;
_$jscoverage['javascript-let.js'].lineData[75]++;
for (let i = i; i < 10; i++) {
  _$jscoverage['javascript-let.js'].lineData[76]++;
  document.write(i + "<br>\n");
}
_$jscoverage['javascript-let.js'].lineData[78]++;
for (let [name, value] in obj) {
  _$jscoverage['javascript-let.js'].lineData[79]++;
  document.write("Name: " + name + ", Value: " + value + "<br>\n");
}
