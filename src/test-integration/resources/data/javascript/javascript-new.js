function X() {}
x = new X();
x = new X(1);
x = new X(1, 2);
x = new X;
x = new (X)();
x = new (X)(1);
x = new (X)(1, 2);
x = new (X);
x = new (f())();
x = new (f())(1);
x = new (f())(1, 2);
x = new (f());
