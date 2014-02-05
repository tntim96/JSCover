(function () {
    function increment(number) {
        return number + 1;
    }

    function sign(number) {
        if (number < 0)
            return -1;
        else if (number > 0)
            return 1;
        else
            return 0;
    }
    increment(1);
    sign(-1);
}());