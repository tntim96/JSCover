PUSHD ..\..
rem java -jar target\dist\JSCover.jar -fs --no-instrument=test doc/example-qunit/src doc/example-qunit/out
rem java -jar target\dist\JSCover-all.jar -fs --no-instrument=src/ --exclude-reg=.*\.git.* --no-instrument=build/selector-css2/selector-css2-coverage.js c:/js/yui3 target/yui3fs
java -jar target\dist\JSCover-all.jar -fs doc/example target/example-fs
POPD
