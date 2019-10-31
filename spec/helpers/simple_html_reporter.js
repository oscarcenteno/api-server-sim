const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
const path = require('path');

// options object
jasmine.getEnv().addReporter(new HtmlReporter({
  path: path.join(__dirname,'../../reports')
}));