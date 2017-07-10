function f() {}

try {
  f();
}
catch (e) {
  f();
}

try {
  f();
}
catch (e) {
  f();
}

try {
  f();
}
finally {
  f();
}

try {
  f();
}
catch (e) {
  f();
}
finally {
  f();
}
