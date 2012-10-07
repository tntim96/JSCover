if (! _$jscoverage['@PREFIX@script.js']) {
  _$jscoverage['@PREFIX@script.js'] = [];
  _$jscoverage['@PREFIX@script.js'][1] = 0;
  _$jscoverage['@PREFIX@script.js'][4] = 0;
  _$jscoverage['@PREFIX@script.js'][5] = 0;
}
_$jscoverage['@PREFIX@script.js'].source = ["alert(\"hello\");","","// test formatting &amp;lt; &amp;gt; &amp;amp;","if ('a' &lt; 'b' &amp;&amp; 'a' &gt; 'b') {","  alert(\"?\");","}"];
_$jscoverage['@PREFIX@script.js'][1]++;
alert("hello");
_$jscoverage['@PREFIX@script.js'][4]++;
if ((("a" < "b") && ("a" > "b"))) {
  _$jscoverage['@PREFIX@script.js'][5]++;
  alert("?");
}
