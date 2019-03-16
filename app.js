
API_KEY="pk.eyJ1IjoiZGF2aW5kZXJrZG9sZSIsImEiOiJjanN3bGtyOTMwajByNDlwcHNtYzlpN2Q1In0.PGue10TDaD8-mwwkqSrrjA"
// Creating map object

// Adding tile layer to the map
var satellite=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 13  ,
    id: 'mapbox.satellite',
    accessToken: API_KEY
})

var grayscale=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 13  ,
    id: 'mapbox.grayscale',
    accessToken: API_KEY
})

var outdoors=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 13  ,
    id: 'mapbox.outdoors',
    accessToken: API_KEY
})

function buildMap(data, plates){
  function pickColor(mag){
    if(mag>5) return 'lightgreen';
    else if(mag>4) return 'yellow';
    else if(mag>3) return 'pink';
    else if(mag>2) return 'gold';
    else if(mag>1) return 'orange';
    else if(mag>1) return 'red';
    }
  function makecircles(feature,latlong){
    var mag=feature.properties.mag;
    var radius=mag*50000;
    var color=pickColor(mag);
    var style={radius:radius, fillColor: color, opacity:0,fillOpacity:0.75};
    return L.circle(latlong,style).bindPopup(`${feature.properties.place} Magnitude: ${mag}`);
  }

var earthquakes=L.geoJSON(data,{'pointToLayer':makecircles});
var faultLines=L.geoJSON(plates,{'style':{'fillOpacity':0,color:'yellow'}});

var baselayer={
  'Satellite View':satellite,
  'Gray Scale': grayscale,
  'Out Doors': outdoors
}

var overlayLayers={
  "Earthquakes":earthquakes,
  "Fault Lines":faultLines
}


var myMap = L.map('map',
{'layers':[satellite,faultLines,earthquakes]}).setView([40, -30], 2);

L.control.layers(baselayer,overlayLayers).addTo(myMap);


//legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
     div.innerHTML = `<p><i style="background: lightgreen"></i>0-1 </p>
                      <p><i style="background:  yellow"></i>1-2</p>
                      <p><i style="background:  pink"></i>2-3</p>
                      <p><i style="background:  gold"></i>3-4</p>
                      <p><i style="background:  orange"></i>4-5</p>
                      <p><i style="background:  red"></i>5+</p>`
  return div;
};

legend.addTo(myMap);
};

d3.json('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json')
.then(plates=> {
    d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
      .then(data=>buildMap(data,plates));
});
