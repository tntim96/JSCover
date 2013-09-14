rem Make sure phantomjs is on your execution PATH
PUSHD ..\..
phantomjs src\test\javascript\lib\PhantomJS\run-jscover-qunit-fs.js doc/example-qunit/out/test/index.html
POPD