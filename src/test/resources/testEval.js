var x = Object.defineProperty({
    helloWorld: function () {
        var methods = (eval("this"));
        methods.hello('world');
    },
    hello: function(who) {
        console.log('Hello '+who+' !');
    },
});
x.helloWorld();