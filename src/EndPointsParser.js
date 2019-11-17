class EndPointsParser {
    constructor({ appDir, file }) {
        const path = require('path');
        const absoluteFile = path.join(appDir, file);

        const rows = retrieveRowsFromFile(absoluteFile);

        const EndPoints = require('./Endpoints');
        this.endPoints = new EndPoints({ appDir, rows }).endPoints;
    }

    getList() {
        return this.endPoints;
    }
}

module.exports = EndPointsParser;

function retrieveRowsFromFile(file) {

    const rows = getRowsFromSheet(file);
    return rows;
}

function getRowsFromSheet(file) {
    const excelToJson = require('convert-excel-to-json');
    const jsonFile = excelToJson({
        sourceFile: file,
        header: {
            rows: 1
        },
        columnToKey: {
            '*': '{{columnHeader}}'
        }
    });

    // join all tabs in a single list
    let rows = [];
    let key, keys = Object.keys(jsonFile);
    let n = keys.length;
    while (n--) {
        key = keys[n];
        const newElements = jsonFile[key];
        //sign the tab as a test suite
        newElements.forEach(element => {
            element.suite = key;
        });

        rows = rows.concat(newElements);
    }

    return rows;
}