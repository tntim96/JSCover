function f() {}

function g() {
  ;
}

function h() {
  x();
  return 'x';
}

function i(a) {
  x();
}

function j(a, b) {
  x();
}

x = function() {
  x();
};

x = function k() {
  x();
};

(function () {
  print('x');
})();

(function l() {
  print('x');
})();

(function (a) {
  print('x');
})(1);

(function m(a) {
  print('x');
})(1);

(function (a, b) {
  print('x');
})(1, 2);

(function n(a, b) {
  print('x');
})(1, 2);

(function () {
  print('x');
}).call(window);

(function o() {
  print('x');
}).call(window);

// unusual call
(b - a)();
