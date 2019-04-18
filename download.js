const Fs = require('fs');
const request = require('request');

const consumerKey = "Qe80ldKorGgz5pSQ7Dccfrsut";
const consumerSecret = "yjBdS0fSd0IG03mRvIMC9lLniGfy7MrUrxOgoJm9g8fdG7Tkle";
const base64Consumer = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
const authEndpoint = "https://api.twitter.com/oauth2/token";
const searchEndpoint = "https://api.twitter.com/1.1/search/tweets.json";

const twitterQueryTerm = "@limebike"
let twitterData = [];

request.post(authEndpoint, {
    headers: {
        'Authorization': `Basic ${base64Consumer}`,
        'Content-type': 'application/x-www-form-urlencoded',
        'Response-type': 'application/json'
    },
    qs: {
        'grant_type': 'client_credentials'
    }
}, (error, response, body) => {
    if(error != null){
        console.log(error)
    } else {
        body = JSON.parse(body);
        const bearerToken = body.access_token;
        request.get(searchEndpoint, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-type': 'application/x-www-form-urlencoded',
                'Response-type': 'application/json'
            },
            qs: {
                'q': `${twitterQueryTerm} -filter:retweets`,
                'count': '100'
            }
        }, (error, response, body) => {
            if(error != null){
                console.log(error)
            } else {
                body = JSON.parse(body);
                twitterData = twitterData.concat(body.statuses);
                let next_results = body.search_metadata.next_results;
                console.log(`Request 1`)
                saveAllNextResult(next_results, bearerToken);
            }
        })
    }
});

async function saveAllNextResult(next_results, bearerToken){
    let i = 2
    while(next_results != null){
        next_results = await getNextResult(next_results, bearerToken);
        if(next_results != null){
            console.log(`Request ${i++}`)
        }
    }
    await next_results == null;
    console.log(`Finish with ${twitterData.length} tweets`)
    Fs.writeFileSync('data.json', JSON.stringify(twitterData)); 
}

function getNextResult(next_results, bearerToken){
    return new Promise((resolve, reject) => {
        request.get(searchEndpoint + next_results, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-type': 'application/x-www-form-urlencoded',
                'Response-type': 'application/json'
            }
        }, (error, response, body) => {
            if(error != null){
                reject(error);
            } else {
                body = JSON.parse(body);
                next_results = body.search_metadata.next_results;
                twitterData = twitterData.concat(body.statuses);
                resolve(next_results)
            }
        })
    })
}