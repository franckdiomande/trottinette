const Fs = require('fs');
const request = require('request')

const pathToFolder = "./data_to_import";
const elasticSearchIndexName = "twitter"

let index = 0;
Fs.readdir(pathToFolder, (err, files) => {
    files.forEach(file => {
        let bulkData = "";
        let fileData = require(`${pathToFolder}/${file}`);

        fileData.forEach(tweet => {
            bulkData = bulkData + `{"create": {"_index": "${elasticSearchIndexName}", "_id": "${index++}", "_type": "tweet" }}\n`
            bulkData = bulkData + JSON.stringify(tweet) + '\n';
        })

        request.post('http://localhost:9200/_bulk', {
            headers: {
                'content-type': 'application/x-ndjson'
            },
            body: bulkData
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(`File ${file} save in Elastic`)
            }
        })
    });
});