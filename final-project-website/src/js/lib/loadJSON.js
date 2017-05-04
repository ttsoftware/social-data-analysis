require('core-js');

import * as d3 from 'd3';

export function loadJSON(jsonFiles) {

    let jsonPromises = [];

    // iterate through json files
    jsonFiles.forEach(function(jsonFile) {

        if (jsonFile && jsonFile != '') {

            let jsonPromise = new Promise(function(resolve, reject) {

                d3.json(jsonFile, function(jsonData) {
                    resolve(jsonData);
                });
            });

            jsonPromises.push(jsonPromise);
        }
    });

    return jsonPromises;
}
