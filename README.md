[JSCover](http://tntim96.github.com/JSCover) - A JavaScript code coverage measurement tool.
================================

[![Build Status](https://drone.io/github.com/tntim96/JSCover/status.png)](https://drone.io/github.com/tntim96/JSCover/latest)

JSCover is an easy-to-use JavaScript code coverage measuring tool. It is an enhanced version of the popular
[JSCoverage](http://siliconforks.com/jscoverage/) tool, having added several features including **branch coverage**,
**LCOV** and **Cobertura XML** reports for CI integration, hooks for automated tests and **HTML Local Storage** to
maintain coverage data without the use of iFrames or JavaScript opened windows.

It's distinguishing factor from other JavaScript coverage tools is that it easily runs in any browser
(supporting JavaScript) allowing coverage measurement of tests that include DOM interaction.
It can be run with most tools (e.g.
[Jasmine](http://jasmine.github.io/),
[QUnit](http://qunitjs.com/), etc...).

Development
-----------
Development with JSCover is simple (clean check-out and build should just work). It is an Ant build using Maven's
dependency management. What you need:
* Java (minimum 1.5)
* Ant (developed with version 1.9.2/3/4)

Most development has been done with IntelliJ ultimate edition, and some with Eclipse and IntelliJ community edition.
Project files for IDEs are checked in, but any editor can be used.

Before checking in any changes, be sure to run `ant pre-commit` which runs the full build and test suite,
and enforces coverage limits on the combined unit and integration tests as well as on the combined unit,
integration and acceptance tests.

For eclipse you may need to install the tools.jar file with something like:

`mvn install:install-file -DgroupId=com.sun -DartifactId=tools -Dpackaging=jar -Dversion=0 -Dfile=tools.jar -DgeneratePom=true`