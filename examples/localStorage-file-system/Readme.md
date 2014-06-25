Demonstrates:
- running existing tests with minimal changes (i.e. no iframes or child windows - using HTML5 local-storage)
- running existing tests without a proxy
- saving the coverage report without a server

To run this example:
- Download and install Selenium IDE from http://docs.seleniumhq.org/download/
- Run the JSCover file-system instrumentation jscover-filesystem.bat/jscover-filesystem.sh
- Start the non-instrumenting web-server web-server.bat/web-server.sh
- Load selenium-ide.html in the Selenium IDE and run

or
- Download and install Ruby and rspec
- Run the JSCover file-system instrumentation jscover-filesystem.bat/jscover-filesystem.sh
- Start the non-instrumenting web-server web-server.bat/web-server.sh
- Run 'rspec selenium-ide.rb'

The second example was generated from 'selenium-ide.html' and then modified to:

1. Save the coverage JSON to 'target/example-fs-localStorage/jscoverage.json'
2. Append 'jscoverage_isReport = true;' to jscoverage.js so it will load the JSON above and display the coverage results