2.0.19 / 2023-??-??
==================
  * Upgrade closure-compiler v20230502 to v20230802
  * Update documentation and manual for Java 11
  * Internal: HtmlUnit 2.70.0 to 3.5.0, Mockito 5.3.1 to 5.5.0, JaCoCo 0.8.10 to 0.8.11

2.0.18 / 2023-05-07
==================
  * Update documentation and samples

2.0.17 / 2023-05-06
==================
  * Java 11 to align with closure-compiler
  * Upgrade closure-compiler v20220601 to v20230502
  * Internal: HtmlUnit 2.66.0 to 2.70.0, Mockito 4.8.1 to 5.3.1, JaCoCo 0.8.8 to 0.8.10

2.0.16 / 2022-11-02
==================
  * Fix instruments in lit-html template (https://github.com/tntim96/JSCover/issues/311)
  * Fix "this" is undefined in header.js in strict mode (https://github.com/tntim96/JSCover/issues/293)
  * Upgrade closure-compiler v20220405 to v20220601, gson 2.9.0 to 2.10
  * Internal: HtmlUnit 2.61.0 to 2.66.0, Mockito 4.5.1 to 4.8.1

2.0.15 / 2022-04-27
==================
  * Fix instrument function after comma in assignment (https://github.com/tntim96/JSCover/issues/303)
  * Fix selenium-ide.html in localStorage-file-system example (https://github.com/tntim96/JSCover/issues/312)
  * Upgrade closure-compiler v20220202 to v20220405, gson 2.8.9 to 2.9.0
  * Internal: HtmlUnit 2.58.0 to 2.61.0, Mockito 4.3.1 to 4.5.1, JaCoCo 0.8.7 to 0.8.8

2.0.14 / 2022-01-15
==================
  * IllegalStateException: FUNCTION when arrow function is used (https://github.com/tntim96/JSCover/issues/310)
  * Upgrade closure-compiler v20211006 to v20220202
  * Internal: HtmlUnit 2.54.0 to 2.58.0, Mockito 4.0.0 to 4.3.1, Rhino 1.7.13 to 1.7.14
  
 2.0.13 / 2021-11-06
==================
  * 404 with large query headers (https://github.com/tntim96/JSCover/issues/308)
  * Fix eval('this') handling (https://github.com/tntim96/JSCover/issues/268)
  * Upgrade closure-compiler v20210601 to v20211006
  * Upgrade GSON 2.8.7 to 2.8.9
  * Internal: HtmlUnit 2.51.0 to 2.54.0, Mockito 3.11.2 to 4.0.0, Jasmine 3.8.0 to 3.9.0

2.0.12 / 2021-07-17
==================
  * Proxy Server: Get request is not ending \r\n (https://github.com/tntim96/JSCover/issues/302)
  * Upgrade closure-compiler v20210202 to v20210601
  * Upgrade GSON 2.8.6 to 2.8.7
  * Update all pages links to github.io
  * Internal: JUnit 4.13.1 tp 4.13.2, Mockito 3.7.7 to 3.11.2, HtmlUnit 2.47.1 to 2.51.0, Jasmine 3.7.1 to 3.8.0, JaCoCo 0.8.6 to 0.8.7

2.0.11 / 2021-02-12
==================
  * Upgrade closure-compiler v20200628 to v20210202
  * Add GSON dependency, com.google.code.gson:gson:2.8.6, removed from closure-compiler
  * Internal: HtmlUnit 2.42 to 2.47.1, Mockito 3.2.4 to 3.7.7, Rhino 1.7.12 to 1.7.13, JaCoCo 0.8.5 to 0.8.6, Jasmine 3.5.0 to 3.7.1, JUnit 4.13 tp 4.13.1

2.0.10 / 2020-07-17
==================
  * Replace 'eval' with 'JSON.parse' (https://github.com/tntim96/JSCover/issues/290)
  * Upgrade closure-compiler v20200101 to v20200628, Rhino 1.7.11 to 1.7.12
  * Internal: HtmlUnit 2.36 to 2.42.0, Mockito 3.2.4 to 3.4.2
  * Replace deprecated Maven Ant Tasks with Maven Artifact Resolver Ant Tasks (https://github.com/tntim96/JSCover/issues/285)

2.0.9 / 2020-01-10
==================
  * Add support for for...of (https://github.com/tntim96/JSCover/issues/276)
  * Don't instrument for..of loop code (https://github.com/tntim96/JSCover/issues/279)
  * Should not instrument between return of function (https://github.com/tntim96/JSCover/issues/280)
  * Should not instrument inside for...in (https://github.com/tntim96/JSCover/issues/281)
  * Upgrade closure-compiler v20190618 to v20200101
  * Internal: Mockito 2.28.2 to 3.2.4, HtmlUnit 2.35 to 2.36.0, Jacoco 0.8.4 to 0.8.5, Jasmine 3.4.0 to 3.5.0, JUnit 4.12 to 4.13

2.0.8 / 2019-06-22
==================
  * Upgrade closure-compiler v20181210 to v20190618, Rhino 1.7.10 to 1.7.11
  * Instrumentation added in class body (https://github.com/tntim96/JSCover/issues/275)
  * Internal: Mockito 2.23.4 to 2.28.2, HtmlUnit 2.30 to 2.35.0, Upgrade Jasmine 3.3.0 to 3.4.0

2.0.7 / 2019-01-01
==================
  * Upgrade closure-compiler v20180506 to v20181210
  * Internal: Mockito 2.18.3 to 2.23.4, HtmlUnit 2.31 to 2.33, Upgrade Jasmine 3.1.0 to 3.3.0
  * Internal: Swap from Cobertura to Jacoco for coverage

2.0.6 / 2018-05-28
==================
  * Add GNU classpath exception to license (https://github.com/tntim96/JSCover/issues/271)
  * Upgrade closure-compiler v20180204 to v20180506
  * Bump JS language in from ECMASCRIPT8 to ES_NEXT 
  * Internal: Mockito 2.18.0 to 2.18.3, HtmlUnit 2.30 to 2.31

2.0.5 / 2018-04-11
==================
  * Upgrade closure-compiler v20180204 to v20180402
  * Internal: HtmlUnit 2.29 to 2.30, Upgrade Jasmine 3.0.0 to 3.1.0, Mockito 2.15.0 to 2.18

2.0.4 / 2018-02-17
==================
  * Upgrade closure-compiler v20171023 to v20180204 
  * Internal: Upgrade HtmlUnit 2.27 to 2.29, Mockito 2.11.0 to 2.15, Jasmine 2.8.0 to 3.0.0

2.0.3 / 2017-11-05
==================
  * Fix instrumentation fn declaration in new operator (https://github.com/tntim96/JSCover/issues/265)
  * Upgrade closure-compiler v20170626 to v20171023 
  * Internal: Upgrade Jasmine 2.7.0 to 2.8.0, Mockito 2.8.47 to 2.11.0

2.0.2 / 2017-08-05
==================
  * Fix instrumentation for ES6 class members (https://github.com/tntim96/JSCover/issues/261)
  * Fix instrumentation for array definition across lines (https://github.com/tntim96/JSCover/issues/260)
  * Internal: Upgrade Jasmine 2.6.4 to 2.7.0

2.0.1 / 2017-07-23
==================
  * Convert JSON merger from Mozilla Rhino to Google GSON (https://github.com/tntim96/JSCover/issues/258)

2.0.0 / 2017-07-16
==================
  * Replace Rhino AST engine with Closure Compiler (https://github.com/tntim96/JSCover/issues/255)
  * Internal: Upgrade HtmlUnit 2.24 to 2.27, Mockito 2.7.5 to 2.8.47, Jasmine 2.5.2 to 2.6.4

This is a major upgrade of the AST engine. The only visible changes should be the options for `--js-version` have
changed, as well as the default language level. See the [manual](http://tntim96.github.io/JSCover/manual/manual.xml)
for details.

1.1.0 / 2017-02-12
==================
  * Remove conditional source from JSON (https://github.com/tntim96/JSCover/issues/244)
  * Wrong 'position' values (https://github.com/tntim96/JSCover/issues/243)
  * Minor API modifications to assist with Maven plugins
  * Internal: Upgrade HtmlUnit 2.23 to 2.24, Mockito 2.3.30 to 2.7.5

1.0.25 / 2016-12-13
==================
  * Missing instrumentation in a 'if' in 'case' statement (https://github.com/tntim96/JSCover/issues/241)
  * Poor performance when used together with systemjs 0.19.37 (https://github.com/tntim96/JSCover/issues/235)
  * Source Error Message Not Cleared When Displaying New Source (https://github.com/tntim96/JSCover/issues/234)
  * **Remove deprecated Synchronous XMLHttpRequest**<sup>1</sup> (https://github.com/tntim96/JSCover/issues/232)
  * Add asynchronous option to jscoverage_report() (https://github.com/tntim96/JSCover/issues/227)
  * Internal: Upgrade HtmlUnit 2.20 to 2.23, Jasmine 2.4.1 to 2.5.2, Mockito 1.10.19 to 2.3.30

1 - This means calls to `jscoverage_report` will need to pass in a call-back to indicate when the function has completed. See the [documentation](http://tntim96.github.io/JSCover/manual/manual.xml#automatingWebDriver) for more details.

1.0.24 / 2016-04-04
==================
  * Upgrade to Rhino 1.7.7.1
  * Improve Logic To Determine Inverted Mode (https://github.com/tntim96/JSCover/issues/223)
  * Don't Switch To Inverted Mode If There's A Query String (https://github.com/tntim96/JSCover/issues/222)
  * Fix NullPointerException when Logger is removed while looping (https://github.com/tntim96/JSCover/pull/225)
  * Internal: Upgrade HtmlUnit 2.19 to 2.20

1.0.23 / 2016-01-03
==================
  * Fix `isCoalesce` for return statements (https://github.com/tntim96/JSCover/issues/219)
  * Allow sorting by all columns (https://github.com/tntim96/JSCover/issues/193)
  * Provide a column with Missing statements (count) (https://github.com/tntim96/JSCover/issues/192)
  * Add option to generate JSCover report files (https://github.com/tntim96/JSCover/issues/215)
  * Fix undefined reportError error in `jscoverage.js` (https://github.com/tntim96/JSCover/issues/214)
  * Limit IE restrictions to IE7 and below
  * Upgrade Jasmine 2.3.4 to 2.4.1 and update run-jscover-jasmine2.js
  * Internal: Upgrade HtmlUnit 2.18 to 2.19

1.0.22 / 2015-09-15
==================
  * Improve proxy logging (https://github.com/tntim96/JSCover/issues/210)
  * Internal: Minor API modifications to assist with Maven plugin

1.0.21 / 2015-08-23
==================
  * Make js (-fs option) code instrumentation multithreaded (https://github.com/tntim96/JSCover/issues/209)
  * Include Empty Case Statements In Coverage (https://github.com/tntim96/JSCover/issues/202)
  * NPE when showing help for '-io' option (https://github.com/tntim96/JSCover/issues/205)
  * Fix syntax error caused by branch traversing instrumented nodes (https://github.com/tntim96/JSCover/issues/208)
  * Handle statements in switch case better in compressed files (https://github.com/tntim96/JSCover/issues/208)
  * Add CLI option for testing regular expressions (https://github.com/tntim96/JSCover/issues/206)
  * Update samples to use latest JSCover, Underscore, QUnit and YUI3
  * Internal: Upgrade HtmlUnit 2.18

1.0.20 / 2015-07-11
==================
  * Add `--include-unloaded-js` for file mode (https://github.com/tntim96/JSCover/issues/199)
  * Add `--isolate-browser` to avoid automatically combining coverage (https://github.com/tntim96/JSCover/issues/197)
  * Update documentation for `-io` option
  * Internal: Upgrade HtmlUnit 2.17

1.0.19 / 2015-06-18
==================
  * Upgrade to Rhino 1.7.7 with initial ES6 support (https://github.com/mozilla/rhino/issues?q=milestone%3A%22Release+1.7.7%22+is%3Aclosed)
  * Internal: Upgrade to Jasmine 2.3.4, HtmlUnit 2.16

1.0.18 / 2015-04-18
==================
  * Swap back to official Rhino release 1.7.6 with merged fixes
  * Set minimum Java version to 1.6
  * Fix web-server generated paths (https://github.com/tntim96/JSCover/issues/186)
  * Internal: Upgrade to Cobertura 2.0.3->2.1.1, Mockito 1.10.17 to 1.10.19

1.0.17 / 2015-02-07
==================
  * Add time-stamp to report (https://github.com/tntim96/JSCover/issues/184)
  * Include Rhino fix for empty switch statements (https://github.com/tntim96/JSCover/issues/179)
  * Improve memory usage when merging (https://github.com/tntim96/JSCover/issues/178)
  * Sort files in web-server (https://github.com/tntim96/JSCover/issues/177)

1.0.16 / 2015-01-06
==================
  * Fix view source failures in Internet Explorer (https://github.com/tntim96/JSCover/pull/171)
  * Add option to exclude coalesce from conditional coverage (https://github.com/tntim96/JSCover/issues/86)
  * Fix labelled loop with continue issue (https://github.com/tntim96/JSCover/issues/174)
  * Internal: Upgrade to JUnit 4.12, Jasmine 2.1.3, Mockito 1.10.17

1.0.15 / 2014-10-17
==================
  * Fix instrumentation for label without braces (https://github.com/tntim96/JSCover/issues/165)

1.0.14 / 2014-08-29
==================
  * Fix instrumentation for some cases without braces (https://github.com/tntim96/JSCover/issues/160)
  * Remove proxy headers to avoid persistent connections (https://github.com/tntim96/JSCover/pull/159)
  * Decode URI in proxy mode
  * Add logging to merge and report code
  * Internal: Upgrade to Jasmine 2.0.3

1.0.13 / 2014-07-08
==================
  * Fix Java 5 compatibility (https://github.com/tntim96/JSCover/issues/150)
  * Don't copy non-report files (https://github.com/tntim96/JSCover/issues/149)
  * Internal: Remove checked exception from public API

1.0.12 / 2014-07-02
==================
  * Add `--save-json-only` to only save coverage data (https://github.com/tntim96/JSCover/issues/142)
  * Allow merging if no `original-src` directory exists (https://github.com/tntim96/JSCover/issues/142)
  * Include `jscoverage-clear-local-storage.html` in file-system output if using HTML5 localStorage
  * Internal:
    * Fix tests failing with non-english locale (https://github.com/tntim96/JSCover/issues/141)
    * Remove checked exception from public API

1.0.11 / 2014-06-05
==================
  * Improve error when `Class-Path` not in manifest (https://github.com/tntim96/JSCover/pull/135)
  * Don't try to cover empty condition in loop (https://github.com/tntim96/JSCover/issues/137)

1.0.10 / 2014-06-03
==================
  * Add shutdown hook
  * Upgrade to Jasmine 2, HtmlUnit 2.15 (https://github.com/HtmlUnit/htmlunit-rhino-fork/pull/2)
  * Internal: Minor modifications to assist with Maven plugin

1.0.9 / 2014-05-23
==================
  * Fix some single variable branch conditions (https://github.com/tntim96/JSCover/issues/132)

1.0.8 / 2014-05-02
==================
  * Fix Content-Length return wrong length (https://github.com/tntim96/JSCover/issues/129)
  * Exclude dependencies from Maven JSCover JAR
  * Log program arguments
  * Internal:
    * Upgrade HTMLUnit to 2.14
    * Swap from Selenium to HTMLUnit for localStorage test
    * Add drone.io CI

1.0.7 / 2014-02-22
==================
  * Add sort by file name in the coverage report web UI (https://github.com/tntim96/JSCover/issues/108)
  * Fix handling of 'N/A' when sorting by line coverage (https://github.com/tntim96/JSCover/issues/115)
  * Proxy Mode: Add support for other HTTP methods (https://github.com/tntim96/JSCover/issues/117)
  * FireFox 27.0.1 Request To http://localhost:8080/ failing (https://github.com/tntim96/JSCover/issues/118)
  * Internal:
    * Upgrade selenium to 2.40
    * Use tntim96 Maven repository version of Rhino
    * Add more UI tests
    * Remove need for user to add maven-ant-tasks-2.1.3.jar to their ant lib directory

1.0.6 / 2013-11-03
==================
  * Fix JSON creation where object may have added properties (https://github.com/tntim96/JSCover/issues/105)
  * Adding support for single file instrumentation via stdio (https://github.com/tntim96/JSCover/pull/100)
  * Internal: Minor modifications to assist with Maven plugin (https://github.com/tntim96/JSCover/issues/103)

1.0.5 / 2013-09-17
==================
  * Using HTML5 localStorage instead of an iframe (https://github.com/tntim96/JSCover/issues/92)
  * Provide URI to File-System Path Translation (https://github.com/tntim96/JSCover/issues/98)
  * Fix LogFormatterTest time zone issue (https://github.com/tntim96/JSCover/issues/99)
  * Internal: Add check-style plugin to Maven POM and code quality improvements

1.0.4 / 2013-09-05
==================
  * Support `include-unloaded-js` in proxy mode (https://github.com/tntim96/JSCover/issues/93)
  * Fix inclusion logic for unloaded-js (https://github.com/tntim96/JSCover/issues/93)
  * Improve error message when invalid CL option supplied (https://github.com/tntim96/JSCover/issues/96)

1.0.3 / 2013-08-25
==================
  * Add enhanced logging using JUL (https://github.com/tntim96/JSCover/issues/88)
  * Add `--only-instrument-reg=URL` switch (https://github.com/tntim96/JSCover/pull/89)
  * Fix POSTs hanging due to persistent connections (https://github.com/tntim96/JSCover/issues/91)
  * Internal:
    * Move WebDriver samples to a separate project
    * Set up infrastructure to remove some code duplication

1.0.2 / 2013-07-27
==================
  * Proxy stream now forwarded exactly as received (https://github.com/tntim96/JSCover/issues/80)
  * Encoding problem with proxied binary data - fix by KPesendorfer (https://github.com/tntim96/JSCover/issues/80)
  * Document some ways to save a report in file-system mode (https://github.com/tntim96/JSCover/issues/83)

1.0.1 / 2013-07-14
==================
  * Empty JS Source not viewable (https://github.com/tntim96/JSCover/issues/79)
  * Empty JS source causes exception upon storing (https://github.com/tntim96/JSCover/issues/78)
  * Add WebDriver samples with FireFox, PhantomJS, Internet Explorer and Google Chrome

1.0.0 / 2013-07-13
==================
  * Remove difference in web-server and file-system instrumentation (https://github.com/tntim96/JSCover/issues/77)
  * Use Semantic Versioning 2.0.0 Guidelines (https://github.com/tntim96/JSCover/issues/76)
  * Reduce branch data JSON size (https://github.com/tntim96/JSCover/issues/73)
  * Add 'Stop Server' Button to UI (https://github.com/tntim96/JSCover/issues/74)
  * Allow `-fs` to be last option (https://github.com/tntim96/JSCover/issues/71)
  * Internal:
    * Move common JavaScript functions to common JavaScript file
    * Remove unused JavaScript functions

0.3.1 / 2013-06-28
==================
  * Add function data to `jscoverage_report(dir)` function call (https://github.com/tntim96/JSCover/issues/69)
  * Merging Empty Branches Causes IllegalStateException (https://github.com/tntim96/JSCover/issues/68)
  * Different Line Count When Unloaded (https://github.com/tntim96/JSCover/issues/70)
  * Null Pointer Exception when performing --merge (https://github.com/tntim96/JSCover/issues/66)
  * Internal: Use Maven for dependency management (https://github.com/tntim96/JSCover/issues/9)

0.3.0 / 2013-05-28
==================
  * Add function coverage (https://github.com/tntim96/JSCover/issues/61)
  * Include branch and function statistics from unloaded JavaScript (https://github.com/tntim96/JSCover/issues/63)
  * Include branch coverage by default. Replace `--branch` switch with `--no-branch`
  * Remove instrumentation code from branch data source
  * Make `jscoverage.html` XHTML compliant
  * Website - handle direct links to HTML pages

0.2.7 / 2013-04-15
==================
  * Add regular expression based path switch support (https://github.com/tntim96/JSCover/issues/57)
  * Add HTTP Server support for XML MIME type (https://github.com/tntim96/JSCover/issues/56)
  * Remember UI sort order (https://github.com/tntim96/JSCover/issues/59)
  * Disallow invalid web-server document-root

0.2.6 / 2013-03-11
==================
  * Fix Cobertura report for file-system instrumentation (https://github.com/tntim96/JSCover/pull/50)
  * Fix continue label handling (https://github.com/tntim96/JSCover/issues/51)
  * Fix MIME image mappings
  * Fix proxy report for viewing source (https://github.com/tntim96/JSCover/issues/53)
  * Fix "Refused to set unsafe header 'Content-Length'" (https://github.com/tntim96/JSCover/issues/54)
  * Internal:
    * Upgrade to HTMLUnit 2.12
    * Add tests for headers in proxy for '.js' files (https://github.com/tntim96/JSCover/issues/49)
    * Add PhantomJS samples

0.2.5 / 2013-03-04
==================
  * Include headers in proxy mode when fetching '.js' files (https://github.com/tntim96/JSCover/issues/49)

0.2.4 / 2013-02-27
==================
  * Fix NPE (https://github.com/tntim96/JSCover/issues/47)

0.2.3 / 2013-02-04
==================
  * Fix Cobertura XML source display (https://github.com/tntim96/JSCover/issues/39)

0.2.2 / 2013-02-01
==================
  * Synchronize threads saving JSON to the same report directory (https://github.com/tntim96/JSCover/pull/40).
  * Fix logger NPE in InstrumentingRequestHandler
  * Add Cobertura XML output (https://github.com/tntim96/JSCover/issues/39)
  * Fix handling of comma error (https://github.com/tntim96/JSCover/issues/41)
  * Add documentation for integration with PhantomJS

0.2.1 / 2013-01-20
==================
  * Fix report merging (https://github.com/tntim96/JSCover/issues/38)

0.2.0 / 2012-12-28
==================
  * Fix web-server for URLs with a space in them (https://github.com/tntim96/JSCover/issues/33)
  * Internal: Upgrade to JUnit-4.11, Hamcrest-1.3. Remove deprecated code.

0.2.0-RC1 / 2012-12-13
==================
  * Add report merging command line interface
  * Improve unloaded JavaScript parsing error logging issue https://github.com/tntim96/JSCover/issues/27
  * Internal:
    * Load original JS source from file-system instead of JSON for report viewing
    * Remove source from JSON
    * Alter _$jscoverage object and JSON to elegantly accommodate branch (and other) properties
    * Alter JSONDataMerger.mergeJSONCoverageStrings to accept and array of coverage strings to merge

0.1.1 / 2012-12-02
==================
  * Upgrade to HTMLUnit 2.11
  * Fix web-server looping issue https://github.com/tntim96/JSCover/issues/26

0.1.0 / 2012-11-30
==================
  * Add infrastructure to generate other report formats with XML Summary
  * Add JSON to LCov coverage data conversion
  * Internal: 
    * Update examples with v0.1.0-RC3
    * Update help text to use 'JSCover-all.jar'
    * Update YUI3/QUnit examples

0.1.0-RC3 / 2012-11-23
==================
  * Add support for getter/setter
  * Add YUI3 server report (from running yui3/src/test/tests/unit/index.html)
  * Add branch coverage support for expression statements
  * Add line coverage handling for function in braces
  * Fix bug where URI is ignored
  * Minor - Set title/heading to JSCover. Fix 'Brance' typo in documentation

0.1.0-RC2 / 2012-11-21
==================
  * Add proxy support for HEAD requests
  * Fix multiple NPE errors
  * Add FAQ on error log, and the manual on the error log and exit status
  * Set exit status code to 1 if any exceptions were logged in file-system mode or if invalid parameters were supplied
  * Fix bug where line is recorded as valid for line instrumentation but no instrumentation is added

0.1.0-RC1 / 2012-11-18
==================
  * Add branch coverage
  * Improve style of web-site

0.0.13 / 2012-11-14
==================
  * Fix detection of destination as sub-directory of source https://github.com/tntim96/JSCover/issues/19

0.0.12 / 2012-11-13
==================
  * Fix error message re: destination as sub-directory of source https://github.com/tntim96/JSCover/issues/18
  * Fix detection of destination as sub-directory of source https://github.com/tntim96/JSCover/issues/16

0.0.11 / 2012-11-07
==================
  * Use platform default encoding. Add documentation on -Dfile.encoding JVM property usage in manual.

0.0.10 / 2012-11-07
==================
  * Flawed and download. Replaced with 0.0.11

0.0.9 / 2012-11-05
==================
  * Fix https://github.com/tntim96/JSCover/issues/8, https://bugzilla.mozilla.org/show_bug.cgi?id=800616

0.0.8 / 2012-10-25
==================
  * Add simple non-instrumenting web-server used in the manual's examples
  * Improve manual to a usable state independent of JSCoverage's documentation
  * Fix bug where destination folder can be in the source folder

0.0.7 / 2012-10-23
==================
  * Add `--include-unloaded-js`, only for non-proxy web-server, to scan beneath www-root for unloaded/untested JS files
  * Leading slash in --no-instrument and --exclude are ignored for consistent internal handling.
  * Double forward slashes in URLs replaced with single forward slashes
  * Internal:
    * Replace URL based proxy with sockets
    * All headers now forwarded as received.

0.0.6 / 2012-10-17
==================
  * Fixed basic non-SSL proxy support
  * Add POST, cookie and redirect support for proxy mode

0.0.5 / 2012-10-16
==================
  * Add proxy support (flawed and download has been replaced with 0.0.6)
  * Message 'Report stored at' changed to 'Coverage data stored at' (important for HtmlUnit/Selenium)
  * Internal:
    * Swap from NanoHTTPD to JSCover's own web-server
    * index.htm(l) no longer served automatically

0.0.4 / 2012-10-12
==================
  * Include JSCover-all.jar, containing all JAR dependencies, in distribution
  * Fix https://github.com/tntim96/JSCover/issues/2, https://bugzilla.mozilla.org/show_bug.cgi?id=800616
  * Internal:
    * More tests. Inverted mode test
    * Remove Apache commons JARs
    * Upgrade Mockito

0.0.3 / 2012-10-09
==================
  * Add server handling of JavaScript-programmatic triggering of report storage
  * Add more tests

0.0.2 / 2012-10-03
==================
  * Addition of command line file instrumentation
  * Working example of QUnit test suite

0.0.1 / 2012-10-01
==================
  * Initial release comprising of web-server
