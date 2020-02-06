
const geocode_api = "https://maps.googleapis.com/maps/api/geocode/json";
const geocoding_api_key = "#";

var script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://maps.googleapis.com/maps/api/js?key='+geocoding_api_key;
document.body.appendChild(script);

var map;
var marker;

function zoomInArea(){
    let pin_code = $('#pin').val()
    let name = $('#restaurant-name').val()
    let locality = $('#locality').val()
    let address = name.split(' ').join('+');
    let local = locality.split(' ').join('+');
    if(pin_code.length == 6){
        let query = "?address="+address+","+local+"&components=postal_code:"+pin_code+"|country:IN&key="+geocoding_api_key;
        let geo_url = geocode_api+query
        
        $.ajax({url: geo_url, success: function(result){
            let status = result['status']
            if(status == "OK"){
                let lat_lng = result['results'][0]['geometry']['location']
                $('#map_container').show();
                initialize(lat_lng['lat'],lat_lng['lng'])
            }else{
                return
            }
          }});
    }
}

function initialize(lat,lag){
var myLatlng = new google.maps.LatLng(lat,lag);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var mapOptions = {
    zoom: 18,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

map = new google.maps.Map(document.getElementById("gMap"), mapOptions);

marker = new google.maps.Marker({
    map: map,
    position: myLatlng,
    draggable: true 
}); 

geocoder.geocode({'latLng': myLatlng }, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
    if (results[0]) {
        $('#latitude,#longitude').show();
        $('#address').val(results[0].formatted_address);
        $('#latitude').val(marker.getPosition().lat());
        $('#longitude').val(marker.getPosition().lng());
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
        }
    }
});

google.maps.event.addListener(marker, 'dragend', function() {

geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
        $('#address').val(results[0].formatted_address);
        $('#latitude').val(marker.getPosition().lat());
        $('#longitude').val(marker.getPosition().lng());
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
        }
    }
});
});

}

