var HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
var path = require('path');

// options object
jasmine.getEnv().addReporter(new HtmlReporter({
  path: path.join(__dirname,'../../reports')
}));