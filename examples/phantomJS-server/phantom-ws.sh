#Make sure phantomjs is on your execution PATH
cd ../..
phantomjs src/test/javascript/lib/PhantomJS/run-jscover-qunit.js http://localhost:8080/test/index.html
#phantomjs src/test/javascript/lib/PhantomJS/run-jscover-jasmine2.js http://localhost:8080/src/test/javascript/spec/suite.html