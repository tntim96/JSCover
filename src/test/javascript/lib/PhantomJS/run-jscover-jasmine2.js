var system = require('system');
var fs = require('fs');

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10001, //< Default Max Timeout is 10s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms


};


if (system.args.length !== 2 && system.args.length !== 3) {
    console.log('Usage: run-jasmine2.js URL [dir]');
    phantom.exit(1);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.open(system.args[1], function(status) {
    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        waitFor(function(){
            return page.evaluate(function(){
                // https://github.com/jasmine/jasmine/blob/v2.0.0/src/html/HtmlReporter.js#L25
                // https://github.com/jasmine/jasmine/blob/v2.0.1/src/html/HtmlReporter.js#L24
                var elem = document.querySelector('.html-reporter .duration') ||
                           document.querySelector('.jasmine_html-reporter .duration') ||
                           document.querySelector('.jasmine-duration')

                return elem && elem.innerText.indexOf('finished') !== -1
            });
        }, function(){
            var exitCode = page.evaluate(function(){
                console.log('');

                var title = 'Jasmine';
                var version = jasmineRequire.version();
                var duration = (document.body.querySelector('.jasmine-duration') ||
                                document.body.querySelector('.jasmine_html-reporter .duration') ||
                                document.body.querySelector('.html-reporter .duration')).innerText

                var banner = title + ' ' + version + ' ' + duration;
                console.log(banner);

                // display jasmine summary
                var resultText = (
                    document.body.querySelector('.jasmine-alert > .jasmine-bar.jasmine-passed,.jasmine-alert > .jasmine-bar.jasmine-skipped') ||
                    document.body.querySelector('.jasmine_html-reporter .bar') ||
                    document.body.querySelector('.jasmine_html-reporter .jasmine-bar') ||
                    document.body.querySelector('.html-reporter .bar')
                ).innerText

                console.log(resultText);

                function getList() {
                    var list = document.body.querySelectorAll('.jasmine-results > .jasmine-failures > .jasmine-spec-detail.jasmine-failed')

                    if (list.length > 0) { return list }

                    list = document.body.querySelectorAll('.jasmine_html-reporter .failures > .spec-detail.failed')

                    return list
                }

                var list = getList()

                if (list && list.length > 0) {
                    console.log('');
                    console.log(list.length + ' test(s) FAILED:')

                    for (i = 0; i < list.length; ++i) {
                        var el = list[i],
                            desc = el.querySelector('.jasmine-description') || el.querySelector('.description'),
                            msg = el.querySelector('.jasmine-messages > .jasmine-result-message') || el.querySelector('.result-message');
                        console.log('');
                        console.log('    ' + desc.innerText);
                        console.log('    ' + msg.innerText);
                        console.log('');
                    }
                }

                // SHOW PENDING TESTS
                function getPending() {
                    var list = document.body.querySelectorAll('.jasmine_html-reporter .symbol-summary .pending')
                    if (list.length > 0) { return list }

                    list = document.body.querySelectorAll('.jasmine_html-reporter .symbol-summary .disabled')
                    if (list.length > 0) { return list }

                    list = document.body.querySelectorAll('.jasmine_html-reporter .jasmine-symbol-summary .jasmine-pending')
                    return list
                }

                var pending = getPending()

                if (pending.length > 0) {
                    console.log('')
                    console.log(pending.length + ' Pending test(s)')
                    Array.prototype.slice.call(pending).forEach(function (item) {
                        console.log('    - ' + item.getAttribute('title'))
                    })
                }

                return 0
            });

            if (system.args.length == 2) {
                page.evaluate(function(){
                    jscoverage_report('phantom');
                });
            } else {
                var json = page.evaluate(function(){
                    return jscoverage_serializeCoverageToJSON();
                });
                try {
                    fs.write(system.args[2] + '/jscoverage.json', json, 'w');
                } catch(e) {
                    console.log(e);
                }
            }
            phantom.exit(exitCode);
        });
    }
});
