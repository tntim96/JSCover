#Make sure phantomjs is on your execution PATH
cd ../..
phantomjs src/test/javascript/lib/PhantomJS/run-jscover-qunit-fs.js doc/example-qunit/out/test/index.html
java -jar target/dist/JSCover-all.jar -gf doc/example-qunit/src target/phantom-jscover-qunit-fs