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

var lat, lng;
var currentadd = "";
var polygonArray = [];

var session = new Session(map);


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
                let mark = new Marker([lat,lng],map);
                let name = "";
                let icon = "";

                bootbox.prompt({
                    title: "Please enter the Name of the Marker?",
                    callback: function (result) {       
                        name = result;     
                        mark.name = name;
                        mark.icon = icon;
                        console.log(lat + "/" + lng);
                        mark.draw();
                        session.addMarker(mark);
                        currentadd = "";
                    }
                });

                bootbox.prompt({
                    title: "Select the Markertype",
                    inputType: 'select',
                    inputOptions: [
                        {
                            text: "Fort",
                            value:"fort"
                        } ,
                        {
                            text: "Cannon",
                            value:"cannon"
                        }
                    ],
                    callback: function (result) {     
                        icon = result;       
                    }
                });
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
                    let name = jsonFile[i].name;
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
                } else if(jsonFile[i].type == "polyline") {
                    let marker1 = new Marker(jsonFile[i].marker1, map);
                    let marker2 = new Marker(jsonFile[i].marker2, map);

                    var polyline = new Polyline(marker1,marker2,map);
                    polyline.name = jsonFile[i].name;
                    polyline.draw();
                    session.addPolyline(polyline);
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
        let icon = session.marker[i].icon;
        mapArray.push({
            name: name,
            icon: icon,
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

    for(let i = 0; i < session.polylines.length; i++) {
        let marker1 = session.polylines[i].marker1.coords;
        let marker2 = session.polylines[i].marker2.coords;
        let name = session.polylines[i].name;
        mapArray.push({
            name: name,
            type: "polyline",
            marker1: marker1,
            marker2: marker2
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

document.getElementById("connectFortCannonBootbox").addEventListener("click", function() {
    let marker1 = "";
    let marker2 = "";
    let power = "";

    bootbox.prompt({
        title: "Power?",
        callback: function (result) {       
            power = result;     
            connectMarkersWithLine(marker1, marker2, power);
        }
    });

    bootbox.prompt({
        title: "Select the Fort",
        inputType: 'select',
        inputOptions: getMarkerForBootbox("fort"),
        callback: function (result) {     
            marker1 = result;       
        }
    });

    bootbox.prompt({
        title: "Select the Cannonposition",
        inputType: 'select',
        inputOptions: getMarkerForBootbox("cannon"),
        callback: function (result) {     
            marker2 = result;       
        }
    });

}); 

function getMarkerForBootbox(type) {
    var list = [];
    console.log(session.getMarkerByType(type));
    session.getMarkerByType(type).forEach(element => {
        list.push({
            text: element.name,
            value: element.name
        })
    });
    return list;
}

function getMarkerByName(markerName) {
    for(let marker of session.marker){
        if(marker.name == markerName) {
            console.log(marker)
            return marker;
        }
    }     
}

function connectMarkersWithLine(parmarker1, parmarker2, text) {
    let marker1 = getMarkerByName(parmarker1);
    let marker2 = getMarkerByName(parmarker2);
    if(marker1 == undefined || marker2 == undefined) {
        prompt("Failed to find a Marker");
        return;
    }
    var polyline = new Polyline(marker1, marker2, map);
    polyline.name = text;
    session.addPolyline(polyline);
    polyline.draw();
}

function drawCircle(lat,lng,parRadius) {
    //var coords =  [[48,-3],[50,5],[44,11],[48,-3]] ;     

    var circle = L.circle([lat, lng], {
        radius: parRadius
    });
    circle.addTo(map);

    map.fitBounds(circle.getBounds());
}        
   