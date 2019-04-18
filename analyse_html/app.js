function call_zones(request, exclude, handledata){

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let obj = JSON.parse(this.response)
            let arr = [];

            obj.hits.hits.forEach(function(element) {
                let data = {}
                element = element._source;

                if(element.provider.name === "Lime"){
                    var color = "blue";
                }
                else{
                    var color = "red";
                }

                if(exclude){
                    if(exclude !== element.provider.name){
                        data.type = "Feature";
                        data.properties = {
                            "title": element.provider.name,
                            "fill": color
                        };
                        data.geometry = { "type": "Polygon", "coordinates": element.geojson.coordinates }
                    }
                }
                else {
                    data.type = "Feature";
                    data.properties = {
                        "title": element.provider.name,
                        "fill": color
                    };
                    data.geometry = { "type": "Polygon", "coordinates": element.geojson.coordinates }
                }
                arr.push(data)
            });

            handledata(arr)
        }
    });

    xhr.open("GET", "http://localhost:9200/scoot_zone/_search");
    xhr.setRequestHeader("content-type", "application/json");

    xhr.send(data);
}

var data = JSON.stringify({
    "size": 100,
    "query": {
        "match_all": {}
    }
});

call_zones(data, false, function(json){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29kbWl0IiwiYSI6ImNqdW1pMXlkMTBvaTE0NG1xamI0YmFydXAifQ.N-4w7ltTgk4IHm0cEP15fw';
    var map = new mapboxgl.Map({
        container: 'map1',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [2.3488, 48.8534],
        zoom: 11
    });

    map.on('load', function() {

        var geojson = {
            'type': 'geojson',
            "data": {
                "type": "FeatureCollection",
                "features": json
            }
        }

        map.addSource("data", geojson);

        map.addLayer({
            "id": "test",
            "type": "fill",
            "source": "data",
            "layout": {},
            "paint": {
                'fill-color': { type: 'identity', property: 'fill' },
                'fill-opacity': 0.6
            }
        });

        map.addLayer({
            "id": "symbols",
            "type": "symbol",
            "source": "data",
            "layout": {
                "symbol-placement": "point",
                "text-font": ["Open Sans Regular"],
                "text-field": '{title}', // part 2 of this is how to do it
                "text-size": 16
            }
        });
    })
});

call_zones(data, "Bird", function(json){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29kbWl0IiwiYSI6ImNqdW1pMXlkMTBvaTE0NG1xamI0YmFydXAifQ.N-4w7ltTgk4IHm0cEP15fw';
    var map2 = new mapboxgl.Map({
        container: 'map2', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [2.3488, 48.8534], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

    map2.on('load', function() {

        var geojson = {
            'type': 'geojson',
            "data": {
                "type": "FeatureCollection",
                "features": json
            }
        }

        map2.addSource("data", geojson);

        map2.addLayer({
            "id": "test2",
            "type": "fill",
            "source": "data",
            "layout": {},
            "paint": {
                'fill-color': { type: 'identity', property: 'fill' },
                'fill-opacity': 0.6
            }
        });

        map2.addLayer({
            "id": "symbols",
            "type": "symbol",
            "source": "data",
            "layout": {
                "symbol-placement": "point",
                "text-font": ["Open Sans Regular"],
                "text-field": '{title}', // part 2 of this is how to do it
                "text-size": 16
            }
        });
    })
});

call_zones(data, "Lime", function(json){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia29kbWl0IiwiYSI6ImNqdW1pMXlkMTBvaTE0NG1xamI0YmFydXAifQ.N-4w7ltTgk4IHm0cEP15fw';
    var map3 = new mapboxgl.Map({
        container: 'map3', // container id
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [2.3488, 48.8534], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

    map3.on('load', function() {

        var geojson = {
            'type': 'geojson',
            "data": {
                "type": "FeatureCollection",
                "features": json
            }
        }

        map3.addSource("data", geojson);

        map3.addLayer({
            "id": "test3",
            "type": "fill",
            "source": "data",
            "layout": {},
            "paint": {
                'fill-color': { type: 'identity', property: 'fill' },
                'fill-opacity': 0.6
            }
        });

        map3.addLayer({
            "id": "symbols",
            "type": "symbol",
            "source": "data",
            "layout": {
                "symbol-placement": "point",
                "text-font": ["Open Sans Regular"],
                "text-field": '{title}', // part 2 of this is how to do it
                "text-size": 16
            }
        });
    })
});