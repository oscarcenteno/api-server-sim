// setup console reporter
// https://github.com/onury/jasmine-console-reporter
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 3,       // (0|false)|(1|true)|2|3
    verbosity: { pending: true, disabled: true, specs: true, summary: true },        // (0|false)|1|2|(3|true)|4|Object
    listStyle: 'indent', // "flat"|"indent"
    timeUnit: 's',      // "ms"|"ns"|"s"
    timeThreshold: { ok: 500, warn: 1000, ouch: 3000 }, // Object|Number
    activity: false, // boolean or string ("dots"|"star"|"flip"|"bouncingBar"|...)
    emoji:   true,         // boolean or emoji-map object
    beep: true
});

jasmine.getEnv().clearReporters();
// initialize and execute
jasmine.getEnv().addReporter(reporter);