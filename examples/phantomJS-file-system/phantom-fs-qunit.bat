rem Make sure phantomjs is on your execution PATH
PUSHD ..\..
phantomjs src/test/javascript/lib/PhantomJS/run-jscover-qunit.js doc/example-qunit/out/test/index.html target/phantom-jscover-qunit-fs
java -jar target/dist/JSCover-all.jar -gf doc/example-qunit/src target/phantom-jscover-qunit-fs
POPD