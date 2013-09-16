PUSHD ..\..
java -cp target\dist\JSCover-all.jar jscover.server.SimpleWebServer target/example-fs-localStorage 8080
POPD