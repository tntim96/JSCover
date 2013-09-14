PUSHD ..\..
java -cp target\dist\JSCover-all.jar jscover.server.SimpleWebServer doc/example 8080
POPD