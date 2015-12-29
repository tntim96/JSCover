cd ../..
java -jar target/dist/JSCover-all.jar -ws --document-root=doc/example-qunit/src --report-dir=target/phantom-server --no-instrument=test
#java -jar target/dist/JSCover-all.jar -ws --report-dir=target/phantom-server-jasmine --no-branch --only-instrument-reg=/src/main/resources/jscoverage-branch.js