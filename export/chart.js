var data = JSON.stringify({
    "size": 20, 
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
      { "created_at": {"order" : "desc"}}
    ]
  });
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      var res = this.responseText;
      var obj = JSON.parse(res);
      console.log(obj.hits.hits);
      //console.log(obj.hits.total.value);
  
      $('#most_retweet').text('Nombre total de tweets trouvés : ' + obj.hits.total.value);
  
      var tab = [];
      var tab2 = [];
      var hits = obj.hits.hits;
      var datesTweets = []
  
      $(hits).each(function( index, val ) {
        $(val).each(function(k, v) {
          console.log(v._source.favorite_count)
          tab.push(v._source.favorite_count);
          tab2.push(v._source.retweet_count);
          datesTweets.push(v._source.created_at);
        });
      });
  
      // Chart number one
      /*
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'bar',
  
          data: {
              labels: datesTweets,
              datasets: [{
                  label: 'Nombre de likes concernant les Tweets de trottinettes électriques',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderColor: 'rgb(255, 99, 132)',
                  data: tab
              }]
          },
      });
      */

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
           spanGaps: true,
         }, {
           label: "Nombre de retweets",
           fill: false,
           lineTension: 0.1,
           backgroundColor: "#324eb7",
           borderColor: "#324eb7",
           borderCapStyle: 'butt',
           borderDash: [],
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
           // notice the gap in the data and the spanGaps: false
           data: tab2,
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
                          labelString: 'Graphiques Nombre Likes & Retweets',
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
  
      // Chart number two
      
      var ctx = document.getElementById('myChart2').getContext('2d');
      var chart = new Chart(ctx, {
          type: 'bar',
  
          data: {
              labels: datesTweets, tab2,
              datasets: [{
                  label: 'Nombre de retweets concernant les Tweets de trottinettes électriques',
                  backgroundColor: '#324eb7',
                  borderColor: '#324eb7',
                  data: tab2
              }]
          },
      });  
    }
  });
  
  xhr.open("POST", "http://localhost:9200/twitter/_search");
  xhr.setRequestHeader("cookie", "PHPSESSID=6ftkbi526eh2goofkon2u6gpj9");
  xhr.setRequestHeader("content-type", "application/json");
  
  xhr.send(data);