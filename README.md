# trottinette

# To download Tweets
Open the file "downloadTweets.js" and modify the const "twitterQueryTerm" with the wanted query term.
After that run the command "node downloadTweets.js" to start the script.
The output will be a new file named data.json

# To Import Tweets into Elastic
Move your data.json (you can rename it to import multiple file at once) into the folder "data_to_import"
And run the command "npm run import"
Warning Elastic need to listen on the port 9200

# Data à afficher

Les mots en liaison avec les trotinnettes les plus re-tweeter et liker dans le monde.
Dans l'ordre décroissant
```
GET twitter/_search
{
    "query": {
      "bool": {
        "must": [
          {
            "range": {
              "retweet_count": {
                "gt": 0
              }
            }
          }
        ],
        "should": [
          {
            "range": {
              "favorite_count": {
                "gt": 0
              }
            }
          }
        ]
      }
        
    },
    "sort": [
      { "retweet_count" : {"order" : "desc"}}
    ]
}
``