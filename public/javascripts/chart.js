var data = JSON.stringify({
    "size": 20,
    "query": {
        "range": {
          "retweet_count": {
            "gt": 0
          }
        }
      }
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