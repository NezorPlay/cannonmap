var tile_url = 'map-layer/{z}/map_{x}_{y}.png';

var map = L.map('mapid', {
    maxZoom: 5,
    minZoom: 1,
    crs: L.CRS.Simple
}).setView([0,0], 2);
        //65409x32839
var southWest = map.unproject([0, 24576], map.getMaxZoom());
var northEast = map.unproject([39936, 0], map.getMaxZoom());
map.setMaxBounds(new L.LatLngBounds(southWest, northEast));
L.tileLayer(tile_url, {
    attribution: 'Map data somethinglovely.net',
    tileSize: 256,
    maxZoom: 5
}).addTo(map);

var lat, lng;1
var currentadd = "";
var polygonArray = [];

var session = new Session(map);




//static elements
var marker = L.marker([413.71875,424.65625],{icon: Marker.getIconByType("cannon")}).addTo(map);
var polygon = L.polygon([
    [414, 338], 
    [359, 385], 
    [380, 458], 
    [399, 508], 
    [498, 437]
]).addTo(map);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

//Eventlistener
map.addEventListener('mousemove', function(ev) {
    lat = ev.latlng.lat;
    lng = ev.latlng.lng;
});


document.body.addEventListener('keypress', function(e) {
    if (e.key == "Escape") {
        currentadd = "";
        polygonArray = [];
    }
  });

//rmb
document.getElementById("mapid").addEventListener("contextmenu", function (event) {
    // Prevent the browser's context menu from appearing
    event.preventDefault();

    switch(currentadd) {
        case "":
            {break;}
        case "polygon":
            {                        
                //draw polygon
                var poly = new Polygon(polygonArray,map);
                name = prompt("Please enter the Name of the polygon", "polygon" + Math.random());
                poly.name = name;
                poly.draw();
                session.addPolygon(poly)
                //drawPolygon(polygonArray)
                //clear polygon array
                polygonArray=[];
                //clear for switch case
                currentadd="";
                break;
            }
    }
    
    //console.log(currentadd)
    //console.log("[" + lat + ", " + lng+"],")
    
    return false; // To disable default popup.
});

//lmb
document.getElementById("mapid").addEventListener("click", function (event) {
    //console.log(currentadd)
    switch(currentadd) {
        case "":
            {break;}
        case "polygon":
            {
                polygonArray.push([lat,lng])
                break;
            }
        case "marker":
            {
                //console.log("test");
                let mark = new Marker([lat,lng],map);
                let name = prompt("Please enter the Name of the Marker", "maker" + Math.random());
                let icon = prompt("What type of icon (fort/cannon)", "fort");
                mark.name = name;
                mark.draw();
                session.addMarker(mark);
                currentadd = "";
                break;
            }
    }
   
    //console.log(currentadd)
    //console.log("[" + lat + ", " + lng+"],")
    
    return false; // To disable default popup.
});

//polygon button
document.getElementById("polygon").addEventListener("click", function() {
    //console.log("polygon button");
    if(currentadd!="") {
        window.alert("finish " + currentadd + " first");
    } else currentadd="polygon";
}); 

//marker button
document.getElementById("marker").addEventListener("click", function() {
    //console.log("marker button");
    if(currentadd!="") {
        window.alert("finish " + currentadd + " first");
    } else currentadd="marker";
}); 

//circle button
document.getElementById("circle").addEventListener("click", function() {
    //console.log("circle button");
    if(currentadd!="") {
        window.alert("finish " + currentadd + " first");
    } else currentadd="circle";
}); 

//importFromJSON button
document.getElementById("importFromJSON").addEventListener("click", function() {
    //console.log("importFromJSON button");
    var files = document.getElementById('selectFiles').files;
        console.log(files);
        if (files.length <= 0) {
            return false;
        }
      
        var fr = new FileReader();
      
        fr.onload = function(e) { 
            console.log(e);
            var result = JSON.parse(e.target.result);
            var formatted = JSON.stringify(result);
            console.log(formatted);
            let jsonFile = eval('(' + JSON.stringify(result)+')');
            for(let i = 0; i < jsonFile.length; i++) {
                if(jsonFile[i].type == "marker") {
                    let mark = new Marker(jsonFile[i].coords,map);
                    letname = jsonFile[i].name;
                    mark.icon = jsonFile[i].icon;
                    mark.name = name;
                    mark.draw();
                    session.addMarker(mark);
                } else if(jsonFile[i].type == "polygon") {
                    var poly = new Polygon(jsonFile[i].coords,map);
                    poly.name = jsonFile[i].name;
                    poly.color = jsonFile[i].color;
                    poly.draw();
                    session.addPolygon(poly);
                }
            }
        }
      
        fr.readAsText(files.item(0));
    
}); 

//saveToJSON button
document.getElementById("saveToJSON").addEventListener("click", function() {
    //console.log("saveToJSON button");

    var mapArray = [];

    for(let i = 0; i < session.marker.length; i++) {
        let tmpLat = session.marker[i].coords[0];
        let tmpLng = session.marker[i].coords[1];
        let name = session.marker[i].name;
        mapArray.push({
            name: name,
            type: "marker",
            coords: [tmpLat,tmpLng]
        })
    }

    //console.log(test)



    for(let i = 0; i < session.polygons.length; i++) {
        let name = session.polygons[i].name;
        let coords = session.polygons[i].coords;
        let color = session.polygons[i].color;
        mapArray.push({
            name: name,
            type: "polygon",
            coords: coords,
            color: color
        })
    }


    let test = "";
    test = JSON.stringify(mapArray);
    console.log(test);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(test);
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "mapData"+ new Date().getTime() +".json");
    dlAnchorElem.click();
}); 



function connectMarkersWithLine(marker1, marker2) {
    var connectMarkerArray = [];
    connectMarkerArray.push([marker1.lat,marker1.lng]);
    connectMarkerArray.push([marker2.lat,marker2.lng]);
    drawPolygon(connectMarkerArray);
}

function drawCircle(lat,lng,parRadius) {
    //var coords =  [[48,-3],[50,5],[44,11],[48,-3]] ;     

    var circle = L.circle([lat, lng], {
        radius: parRadius
    });
    circle.addTo(map);

    map.fitBounds(circle.getBounds());
}        
   