var data = JSON.stringify({
    "size": 20, 
    "query": {
      "bool": {
        "must": [
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
      { "created_at": {"order" : "desc"}}
    ]
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      var res = this.responseText;
      var obj = JSON.parse(res);
      console.log(obj)
  
      $('#most_retweet').text('Nombre total de tweets trouvés : ' + obj.hits.total.value);


      var tab = [];
      var tab2 = [];
      var hits = obj.hits.hits;
      var datesTweets = [];
      var retweetValTab = [];

      // Request 2
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:9200/twitter/_search",
            "method": "POST",
            "headers": {
            "cookie": "PHPSESSID=6ftkbi526eh2goofkon2u6gpj9",
            "content-type": "application/json"
            },
            "processData": false,
            "data": "{\n\t\"size\": 20, \n    \"query\": {\n      \"bool\": {\n        \"must\": [\n          {\n            \"range\": {\n              \"retweet_count\": {\n                \"gt\": 0\n              }\n            }\n          }\n        ]\n      }\n        \n    },\n    \"sort\": [\n      { \"created_at\": {\"order\" : \"desc\"}}\n    ]\n}\t\t\n\t\t"
        }
        

        $.ajax(settings).done(function (response) {
            console.log("response");
            console.log(response);
            console.log(response.hits.hits);

            var hitsRetweets = response.hits.hits;

            $(hitsRetweets).each(function( index, val ) {
                $(val).each(function(k, v) {
                  retweetValTab.push(v._source.retweet_count);
                });
              });
        });

        console.log("retweetValTab")
        console.log(retweetValTab)

  
      $(hits).each(function( index, val ) {
        $(val).each(function(k, v) {
          //console.log(v._source.favorite_count)
          tab.push(v._source.favorite_count);
          //tab2.push(v._source.retweet_count);
          datesTweets.push(v._source.created_at);
        });
      });

      console.log("tab")
      console.log(tab)

      console.log("datesTweets")
      console.log(datesTweets)

      var tabr = [2, 8, 9]

      
  
     var canvas = document.getElementById("myChart");
     var ctx = canvas.getContext('2d');
     
     // Global Options:
     Chart.defaults.global.defaultFontColor = 'black';
     Chart.defaults.global.defaultFontSize = 16;
     
     var data = {
       labels: datesTweets,
       datasets: [{
           label: "Nombre de likes",
           fill: false,
           lineTension: 0.1,
           backgroundColor: "rgb(255, 99, 132)",
           borderColor: "rgb(255, 99, 132)", // The main line color
           borderCapStyle: 'square',
           borderDash: [], // try [5, 15] for instance
           borderDashOffset: 0.0,
           borderJoinStyle: 'miter',
           pointBorderColor: "black",
           pointBackgroundColor: "white",
           pointBorderWidth: 1,
           pointHoverRadius: 8,
           pointHoverBackgroundColor: "rgb(255, 99, 132)",
           pointHoverBorderColor: "rgb(255, 99, 132)",
           pointHoverBorderWidth: 2,
           pointRadius: 4,
           pointHitRadius: 10,
           // notice the gap in the data and the spanGaps: true
           data: tab,
           spanGaps: false,
         }, {
            label: "Nombre de retweet",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#324eb7",
            borderColor: "#324eb7", // The main line color
            borderCapStyle: 'square',
            borderDash: [], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "black",
            pointBackgroundColor: "white",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "#324eb7",
            pointHoverBorderColor: "#324eb7",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            // notice the gap in the data and the spanGaps: true
            data: retweetValTab,
            spanGaps: false,
         }
     
       ]
     };
     
     // Notice the scaleLabel at the same level as Ticks
     var options = {
       scales: {
                 yAxes: [{
                     ticks: {
                         beginAtZero:true
                     },
                     scaleLabel: {
                          display: true,
                          labelString: 'Graphique Likes & Retweets',
                          fontSize: 20 
                       }
                 }]            
             }  
     };
     
     // Chart declaration:
     var myBarChart = new Chart(ctx, {
       type: 'line',
       data: data,
       options: options
     });

    }
  });
  
  xhr.open("POST", "http://localhost:9200/twitter/_search");
  xhr.setRequestHeader("cookie", "PHPSESSID=6ftkbi526eh2goofkon2u6gpj9");
  xhr.setRequestHeader("content-type", "application/json");
  
  xhr.send(data);