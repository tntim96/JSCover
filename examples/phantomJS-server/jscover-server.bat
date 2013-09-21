PUSHD ..\..
java -jar target\dist\JSCover-all.jar -ws --document-root=doc/example-qunit/src --report-dir=target/phantom-server --no-instrument=test
POPD