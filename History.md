1.0.13 / 2014-??-??
==================
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
  * Improve error when 'Class-Path' not in manifest (https://github.com/tntim96/JSCover/pull/135)
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
  * Support 'include-unloaded-js' in proxy mode (https://github.com/tntim96/JSCover/issues/93)
  * Fix inclusion logic for unloaded-js (https://github.com/tntim96/JSCover/issues/93)
  * Improve error message when invalid CL option supplied (https://github.com/tntim96/JSCover/issues/96)

1.0.3 / 2013-08-25
==================
  * Add enhanced logging using JUL (https://github.com/tntim96/JSCover/issues/88)
  * Add '--only-instrument-reg=URL' switch (https://github.com/tntim96/JSCover/pull/89)
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
  * Include branch coverage by default. Replace '--branch' switch with '--no-branch'
  * Remove instrumentation code from branch data source
  * Make 'jscoverage.html' XHTML compliant
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
  * Add '--include-unloaded-js', only for non-proxy web-server, to scan beneath www-root for unloaded/untested JS files
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
