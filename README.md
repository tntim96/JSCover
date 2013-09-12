[JSCover](http://tntim96.github.com/JSCover) - A JavaScript code coverage measurement tool.
================================

JSCover is an easy-to-use JavaScript code coverage measuring tool. It is an enhanced version of the popular
[JSCoverage](http://siliconforks.com/jscoverage/), having added several features including **branch coverage** and
**LCOV** reports.
It's big distinguishing factor from other JavaScript coverage tools is that it easily runs
in any browser (supporting JavaScript) allowing coverage measurement of tests that include DOM interaction.
It can be run with most tools (e.g.
[Jasmine](http://pivotal.github.com/jasmine/),
[QUnit](http://qunitjs.com/), etc...).

Development
-----------
Development with JSCover is simple. It is an Ant build using Maven's dependency management.
What you need:
* Java (minimum 1.5)
* Ant (developed with version 1.9.2)
* Ant's [Maven Task](http://maven.apache.org/ant-tasks/index.html) (developed with maven-ant-tasks-2.1.3.jar)

Most development has been done with IntelliJ ultimate edition, and some with Eclipse and IntelliJ community edition.
Project files for IDEs are checked in, but any editor can be used.
Before checking in any changes, be sure to run the build files `pre-commit`.
NB: `pre-commit` runs the report and enforces coverage limits on unit and integration tests.
Acceptance test coverage is collected and can be viewed by running the `coverage-report`
target manually after `pre-commit`.