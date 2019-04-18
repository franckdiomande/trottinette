var data = JSON.stringify({
    "query": {
        "match_all": {}
    }
});

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log(this);
    }
});

xhr.open("GET", "http://localhost:9200/twitter/_search");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vdmllIiwiaWF0IjoxNTUxOTc2MzUxLCJleHAiOjE1NTE5Nzk5NTF9.jpHNm2xXOSrtHKOVSfKR6TMMrrp4_L-VBUZMg8Neyf4");
xhr.setRequestHeader("cache-control", "no-cache");
xhr.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:3000");
xhr.setRequestHeader("Postman-Token", "40e0af34-c8ae-4eea-8e70-2317ead8530b");

xhr.send(data);


/*fetch("https://api.nextbike.net/maps/nextbike-live.json").then(function(response) {
    let contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function(json) {
            console.log(json);
        });
    } else {
        console.log("Oops, nous n'avons pas du JSON!");
    }
});*/

/*

var data = [30, 86, 168, 281, 303, 365];

d3.select(".chart")
    .selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });

*/

/*var data = [4, 8, 15, 16, 23, 42];

var width = 420,
    barHeight = 20;

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", x)
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d; });*/
