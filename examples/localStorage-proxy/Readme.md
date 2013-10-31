Demonstrates:
 - running tests with intermediate page results stored in HTML5 local-storage (i.e. no iframes or child windows)
 - instrumenting the JavaScript as a proxy-server and save the report

To run this example:
 - Download and install Selenium IDE from http://docs.seleniumhq.org/download/
 - Add '127.0.0.1   localhost-proxy' to your hosts file
 - Set you browser proxy to localhost:3128
 - Start the non-instrumenting web-server web-server.bat/web-server.sh
 - Start the JSCover proxy jscover-proxy.bat/jscover-proxy.sh
 - Load selenium-ide-proxy.html in the Selenium IDE and run
 - Results should be stored in <JSCover-root>/target/local-storage-proxy