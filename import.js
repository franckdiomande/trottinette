const Fs = require('fs');
const request = require('request');

// Index Tweet in Elasticsearch

let pathToFolder = "./scripts/TwitterScripts/data_to_import";
let elasticSearchIndexName = "twitter";

let index = 0;
Fs.readdir(pathToFolder, (err, files) => {
    files.forEach(file => {
        let bulkData = "";
        let fileData = require(`${pathToFolder}/${file}`);

        fileData.forEach(tweet => {
            bulkData = bulkData + `{"create": {"_index": "${elasticSearchIndexName}", "_id": "${index++}", "_type": "tweet" }}\n`;
            let date = new Date(tweet.created_at);
            let y = date.getFullYear();
            let month = date.getMonth() + 1;
            if (month < 10) {
                month = '0' + month;
            }
            let d = date.getDate();
            if (d < 10) {
                d = '0' + d;
            }
            let hour = date.getHours();
            if (hour < 10) {
                hour = '0' + hour;
            }
            let min = date.getMinutes();
            if (min < 10) {
                min = '0' + min;
            }
            let sec = date.getSeconds();
            if (sec < 10) {
                sec = '0' + sec;
            }
            tweet.created_at = y + '-' + month + '-' + d + ' ' + hour + ':' + min + ':' + sec;
            bulkData = bulkData + JSON.stringify(tweet) + '\n';
        });

        request.post('http://localhost:9200/_bulk', {
            headers: {
                'content-type': 'application/x-ndjson'
            },
            body: bulkData
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(`File ${file} save in Elastic`)
            }
        })
    });
});

// Index Scoot in Elasticsearch

let scootDir = "./scripts/MulticyclesAPI/json_files";
let elasticSearchIndexNames = ['scoot_location', 'scoot_provider', 'scoot_zone'];

let id = 0;
Fs.readdir(scootDir, (err, files) => {
    files.forEach((file, nameIndex) => {
        let bulkData = "";
        let fileData = require(`${scootDir}/${file}`);

        fileData.forEach(data => {
            bulkData = bulkData + `{"create": {"_index": "${elasticSearchIndexNames[nameIndex]}", "_id": "${id++}", "_type": "${elasticSearchIndexNames[nameIndex]}" }}\n`;
            if(data.lng != null || data.lat != null){
                data.location = {
                    lon: data.lng,
                    lat: data.lat
                }
                delete data.lng;
                delete data.lon;
            }
            bulkData = bulkData + JSON.stringify(data) + '\n';
        });
        console.log(elasticSearchIndexNames[nameIndex]);
        request.post('http://localhost:9200/_bulk', {
            headers: {
                'content-type': 'application/x-ndjson'
            },
            body: bulkData
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                console.log(`File ${file} save in Elastic`)
            }
        })
    });
});