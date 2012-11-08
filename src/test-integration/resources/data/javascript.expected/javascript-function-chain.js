if (! _$jscoverage['javascript-function-chain.js']) {
  _$jscoverage['javascript-function-chain.js'] = [];
  _$jscoverage['javascript-function-chain.js'][2] = 0;
  _$jscoverage['javascript-function-chain.js'][5] = 0;
  _$jscoverage['javascript-function-chain.js'][9] = 0;
}
_$jscoverage['javascript-function-chain.js'].source = ["","someObject","    .mouseenter(","    function() {","        x++;","    }",").click(","    function() {","        x--;","    }",");"];
_$jscoverage['javascript-function-chain.js'][2]++;
someObject.mouseenter(function() {
  _$jscoverage['javascript-function-chain.js'][5]++;
  x++;
}).click(function() {
  _$jscoverage['javascript-function-chain.js'][9]++;
  x--;
});
