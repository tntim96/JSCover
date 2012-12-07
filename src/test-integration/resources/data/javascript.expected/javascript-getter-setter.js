if (! _$jscoverage['javascript-getter-setter.js']) {
  _$jscoverage['javascript-getter-setter.js'] = {};
  _$jscoverage['javascript-getter-setter.js'].lineData = [];
  _$jscoverage['javascript-getter-setter.js'].lineData[1] = 0;
  _$jscoverage['javascript-getter-setter.js'].lineData[4] = 0;
  _$jscoverage['javascript-getter-setter.js'].lineData[7] = 0;
  _$jscoverage['javascript-getter-setter.js'].lineData[11] = 0;
  _$jscoverage['javascript-getter-setter.js'].lineData[14] = 0;
  _$jscoverage['javascript-getter-setter.js'].lineData[17] = 0;
}
_$jscoverage['javascript-getter-setter.js'].lineData[1]++;
var o = {
  _x: 123, 
  get x() {
    _$jscoverage['javascript-getter-setter.js'].lineData[4]++;
    return this._x;
  }
, 
  set x(value) {
    _$jscoverage['javascript-getter-setter.js'].lineData[7]++;
    this._x = value;
  }
};
_$jscoverage['javascript-getter-setter.js'].lineData[11]++;
o = {
  _x: 123, 
  get get_x() {
    _$jscoverage['javascript-getter-setter.js'].lineData[14]++;
    return this._x;
  }
, 
  set set_x(value) {
    _$jscoverage['javascript-getter-setter.js'].lineData[17]++;
    this._x = value;
  }
};
