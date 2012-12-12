rem java -jar target\dist\JSCover-all.jar -ws --branch --document-root=doc/example-qunit/src --report-dir=target/qunit --no-instrument=test
rem java -cp target/dist/JSCover-all.jar jscover.report.Main --merge target/qunit /doc/example-report-yui3/ target/merged
rem java -jar target\dist\JSCover-all.jar -ws --branch --document-root=../yui3 --report-dir=target --no-instrument=src/test
rem java -jar target\dist\JSCover.jar -ws --branch --document-root=doc/example --report-dir=target
java -jar target\dist\JSCover-all.jar -ws --branch --document-root=doc/example --report-dir=target