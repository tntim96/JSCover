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
  * Internal: Upgrade to HTMLUnit 2.12
              Add tests for headers in proxy for '.js' files (https://github.com/tntim96/JSCover/issues/49)
              Add PhantomJS samples

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
        Load original JS source from file-system instead of JSON for report viewing
        Remove source from JSON
        Alter _$jscoverage object and JSON to elegantly accommodate branch (and other) properties
        Alter JSONDataMerger.mergeJSONCoverageStrings to accept and array of coverage strings to merge

0.1.1 / 2012-12-02
==================
  * Upgrade to HTMLUnit 2.11
  * Fix web-server looping issue https://github.com/tntim96/JSCover/issues/26

0.1.0 / 2012-11-30
==================
  * Add infrastructure to generate other report formats with XML Summary
  * Add JSON to LCov coverage data conversion
  * Minor - Update examples with v0.1.0-RC3. Update help text to use 'JSCover-all.jar'. Update YUI3/QUnit examples.

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
  * Internal - Replace URL based proxy with sockets. All headers now forwarded as received.

0.0.6 / 2012-10-17
==================
  * Fixed basic non-SSL proxy support
  * Add POST, cookie and redirect support for proxy mode

0.0.5 / 2012-10-16
==================
  * Add proxy support (flawed and download has been replaced with 0.0.6)
  * Message 'Report stored at' changed to 'Coverage data stored at' (important for HtmlUnit/Selenium)
  * Internal - Swap from NanoHTTPD to JSCover's own web-server - index.htm(l) no longer served automatically

0.0.4 / 2012-10-12
==================
  * Include JSCover-all.jar, containing all JAR dependencies, in distribution
  * Fix https://github.com/tntim96/JSCover/issues/2, https://bugzilla.mozilla.org/show_bug.cgi?id=800616
  * Internal - More tests, remove Apache commons JARs, upgrade Mockito, Inverted mode test

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
