rem java -jar target\dist\JSCover-all.jar -ws --document-root=doc/example-qunit/src --report-dir=target/qunit --no-instrument=test
rem java -cp target/dist/JSCover-all.jar jscover.report.Main --merge target/qunit /doc/example-report-yui3/ target/merged
rem java -cp target/dist/JSCover-all.jar jscover.report.Main --format=LCOV target/yui3 c:/js/yui3
rem java -jar target\dist\JSCover-all.jar -ws --document-root=c:/js/yui3 --report-dir=target/yui3 --no-instrument=src/test
rem java -jar target\dist\JSCover.jar -ws --document-root=doc/example --report-dir=target
java -jar target\dist\JSCover-all.jar -ws --document-root=doc/example --report-dir=target