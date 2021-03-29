
var pointMarker = null;
var html_element = document.getElementById("map");

var mapProp = {
    center: new google.maps.LatLng(50.464379, 30.519131),
    zoom: 11
};

var Deliverable = false;

var map = new google.maps.Map(html_element, mapProp);
var point = new google.maps.LatLng(50.464379, 30.519131);

function initialize() {
    var marker1 = new google.maps.Marker({
        map: map,
        position: point,
        icon: "assets/images/map-icon.png"
    });


    google.maps.event.addListener(map, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, address) {
            if (err === null) {
                if (pointMarker !== null){
                    pointMarker.setMap(null);
                }
                pointMarker = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });
                $("#inputAddress").val(address);
                $("#addressDeliver").html(address);
                calculateRoute(point, coordinates, duration);
                directionsDisplay.setMap(map);
                Deliverable = true;
            } else {
                Deliverable = false;
            }
            checkAddress();
        });
    });
}



google.maps.event.addDomListener(window, 'load', initialize);
function geocodeLatLng(latlng, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            Deliverable = true;
            callback(null, address);
        } else {
            Deliverable = false;
            callback(new Error("Can't find address"));
        }
        checkAddress();
    });
}


var directionsDisplay = null;
function calculateRoute(A_latlng, B_latlng,  callback) {
    if (directionsDisplay !==null) {
        directionsDisplay.setMap(null);
    }
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    },
        function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var leg = response.routes[0].legs[0];
            Deliverable = true;
            callback(null, {
                duration: leg.duration
            });
        } else {
            Deliverable = false;
            callback(new Error("Can' not find direction"));
        }
            checkAddress();
    });
}

function geocodeAddress(address,  callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK&& results[0])  {
            var coordinates = results[0].geometry.location;
            Deliverable = true;
            callback(null, coordinates);
        } else {
            Deliverable = false;
            callback(new Error("Can not find the adress"));
        }
        checkAddress();
    });
}

function findAddress(err, coordinates) {
    if (err === null){
        geocodeLatLng(coordinates, function (err, address) {
            if (err === null) {
                if (pointMarker !== null){
                    pointMarker.setMap(null);
                }
                pointMarker = new google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: "assets/images/home-icon.png"
                });
                $("#inputAddress").val(address);
                $("#addressDeliver").html(address);
                calculateRoute(point, coordinates, duration);
                directionsDisplay.setMap(map);
            }
        });
    }
}
function checkAddress() {
    if (Deliverable) {
        $("#addressGroup").removeClass("has-error");
        $("#addressGroup").addClass("has-success");
        $("#addressError").removeClass("visible");
        $("#addressError").addClass("notVisible");
    } else {
        $("#addressGroup").removeClass("has-success");
        $("#addressGroup").addClass("has-error");
        $("#addressError").removeClass("notVisible");
        $("#addressError").addClass("visible");
        $("#inputAddress").val("");
        $("#addressDeliver").html("невідома");
        if (directionsDisplay!==null) {
            directionsDisplay.setMap(null);
        }
        if (pointMarker !==null) {
            pointMarker.setMap(null);
        }
    }
}
$("#findPlaceButton").click(function (){
        var addr = $("#inputAddress").val();
            geocodeAddress(addr, findAddress);
});


function duration(err, time){
    if (err === null && Deliverable){
        $("#timeDeliver").html(time.duration.text);
    } else {
        $("#timeDeliver").html("невідомий");
    }
}