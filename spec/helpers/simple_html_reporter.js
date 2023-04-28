/* Installation is not working with current dependency of Jasmine 4.6
// npm i jasmine-pretty-html-reporter -D


const HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;
const path = require('path');

// options object
jasmine.getEnv().addReporter(new HtmlReporter({
  path: path.join(__dirname,'../../reports')
}));


*/