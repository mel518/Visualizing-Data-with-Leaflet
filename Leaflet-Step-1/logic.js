url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
var earthquakes = new L.LayerGroup();
var myMap = L.map("map", {
    center: [14.71, 17.46],
    zoom: 2,
    layers: [earthquakes]
    
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


d3.json(url).then(function(earthquakeData) {
    console.log(earthquakeData)
    
    function markerSize(magnitude) {
        if (magnitude === 0) return 1;
        else return magnitude * 2;
    }
    function chooseColor(depth) {
        if (depth > 50) return "firebrick";
        else if (depth > 40) return "red";
        else if (depth > 30) return "orange";
        else if (depth > 20) return "yellow";
        else if (depth > 10) return "green";
        else return "greenyellow";
        }
    // marker size/color based on depth/mag
    function styleInfo(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          radius: markerSize(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
    }
   
    
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        //popup
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4>Location: " + feature.properties.place + 
            "</h4><hr><p>Date & Time: " + new Date(feature.properties.time) + 
            "</p><hr><p>Magnitude: " + feature.properties.mag + 
            "</p><hr><p>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    }).addTo(myMap);

    // legend
    var legend = L.control({ position: "topright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        depthLevels = [0, 10, 20, 30, 40, 50];

        div.innerHTML += "<h3>Depth</h3>"

        for (var i = 0; i < depthLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(depthLevels[i] + 1) + '"></i> ' +
                depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    
    legend.addTo(myMap);
});
