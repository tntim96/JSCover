cd ../..
#java -jar target/dist/JSCover-all.jar -ws --document-root=../yui3 --report-dir=doc/example-report-yui3 --no-instrument=src/test
java -jar target/dist/JSCover-all.jar -ws --document-root=doc/example --report-dir=target/example-server
