fetch("https://api.nextbike.net/maps/nextbike-live.json").then(function(response) {
    let contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(function(json) {
            console.log(json);
        });
    } else {
        console.log("Oops, nous n'avons pas du JSON!");
    }
});
