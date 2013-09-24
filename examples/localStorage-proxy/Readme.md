To run this example:
 - Download and install Selenium IDE from http://docs.seleniumhq.org/download/
 - Add '127.0.0.1   localhost-proxy' to your hosts file
 - Set you browser proxy to localhost:3128
 - Start the non-instrumenting web-server web-server.bat/web-server.sh
 - Start the JSCover proxy jscover-proxy.bat/jscover-proxy.sh
 - Load selenium-ide-proxy.html in the Selenium IDE and run
 - Results should be stored in <JSCover-root>/target/local-storage-proxy