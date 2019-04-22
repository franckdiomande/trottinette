const Fs = require('fs');
const request = require('request');

// Index Tweet in Elasticsearch

let pathToFolder = "./scripts/TwitterScripts/data_to_import";
let elasticSearchIndexName = "twitter";

let idCache = {};

let index = 0;
Fs.readdir(pathToFolder, (err, files) => {
    files.forEach(file => {
        let bulkData = "";
        let fileData = require(`${pathToFolder}/${file}`);

        fileData.forEach(tweet => {

            if(idCache[tweet.id]){
                return false;
            }

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
            tweet.created_at = y + '-' + month + '-' + d + 'T' + hour + ':' + min + ':' + sec;
            bulkData = bulkData + JSON.stringify(tweet) + '\n';

            idCache[tweet.id] = true;
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

        fileData.forEach(scoot => {

            if(elasticSearchIndexNames[nameIndex] === 'scoot_location'){
                scoot['provider_name'] = scoot.provider.name;
                console.log(scoot['provider_name']);
            }

            bulkData = bulkData + `{"create": {"_index": "${elasticSearchIndexNames[nameIndex]}", "_id": "${id++}", "_type": "${elasticSearchIndexNames[nameIndex]}" }}\n`;
            bulkData = bulkData + JSON.stringify(scoot) + '\n';
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