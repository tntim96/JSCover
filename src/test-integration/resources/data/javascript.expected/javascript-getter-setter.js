if (! _$jscoverage['javascript-getter-setter.js']) {
  _$jscoverage['javascript-getter-setter.js'] = [];
  _$jscoverage['javascript-getter-setter.js'][1] = 0;
  _$jscoverage['javascript-getter-setter.js'][4] = 0;
  _$jscoverage['javascript-getter-setter.js'][7] = 0;
  _$jscoverage['javascript-getter-setter.js'][11] = 0;
  _$jscoverage['javascript-getter-setter.js'][14] = 0;
  _$jscoverage['javascript-getter-setter.js'][17] = 0;
}
_$jscoverage['javascript-getter-setter.js'].source = ["var o = {","  _x: 123,","  get x() {","    return this._x;","  },","  set x(value) {","    this._x = value;","  }","};","","o = {","  _x: 123,","  get get_x() {","    return this._x;","  },","  set set_x(value) {","    this._x = value;","  }","};"];
_$jscoverage['javascript-getter-setter.js'][1]++;
var o = {
  _x: 123, 
  get x() {
    _$jscoverage['javascript-getter-setter.js'][4]++;
    return this._x;
  }
, 
  set x(value) {
    _$jscoverage['javascript-getter-setter.js'][7]++;
    this._x = value;
  }
};
_$jscoverage['javascript-getter-setter.js'][11]++;
o = {
  _x: 123, 
  get get_x() {
    _$jscoverage['javascript-getter-setter.js'][14]++;
    return this._x;
  }
, 
  set set_x(value) {
    _$jscoverage['javascript-getter-setter.js'][17]++;
    this._x = value;
  }
};
