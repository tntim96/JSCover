This directory has two examples.
 
The script `phantom-fs-qunit` runs QUnit tests on some already instrumented JavaScript and stores the JSON
coverage results in `<JSCover-root>/target/phantom-jscover-qunit-fs/jscoverage.json`.
It then generates the JSCover report files needed to view the results.

The script `phantom-fs-jasmine` first instruments the JavaScript, then runs Jasmine tests and stores the JSON
coverage results in `<JSCover-root>/target/phantom-jscover-jasmine-fs/jscoverage.json`.
It then generates the JSCover report files needed to view the results.

See the documentation at:
 - http://tntim96.github.io/JSCover/manual/manual.xml#fileSystemSave
 - http://tntim96.github.io/JSCover/manual/manual.xml#automatingPhantomJS