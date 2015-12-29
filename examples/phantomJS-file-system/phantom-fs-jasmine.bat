rem Make sure phantomjs is on your execution PATH
PUSHD ..\..
rem Instrument the JavaScript
java -jar target\dist\JSCover-all.jar -fs --no-branch --only-instrument-reg=/main/resources/jscoverage-branch.js --exclude=main/java --exclude-reg=test/java$ --exclude=test/resources --exclude=test-acceptance --exclude=test-integration src target\phantom-jscover-jasmine-fs
rem Run the tests
phantomjs src\test\javascript\lib\PhantomJS\run-jscover-jasmine2.js target/phantom-jscover-jasmine-fs/test/javascript/spec/suite.html target\phantom-jscover-jasmine-fs
rem Generate the report files
java -jar target\dist\JSCover-all.jar -gf target\phantom-jscover-jasmine-fs
POPD