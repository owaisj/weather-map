$(document).ready(function(){

    //Map
    var mymap = L.map('map').setView([38.9072, -77.0369], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    L.marker([38.9072, -77.0369]).addTo(mymap)
    .bindPopup('Washington DC')
    .openPopup();

    //Cities
    function City(name) {
        this.name = name,
        this.geocode = function() {
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(function(response){
                
            }).catch()
        },
        this.display = function() {
            console.log(`Name: ${this.name}\nCoordinate: ${this.geocode}`)
        }

    }

    async function getGeocode(city) {
        let queryURL = `https://nominatim.openstreetmap.org/?format=json&city=${city}`;
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(await function(response){
            let coordinates = {
                lat: parseFloat(response[0].lat),
                lon: parseFloat(response[0].lon)
            };
            return coordinates;
        }).catch()
    }

    //let DC = new City('Washington DC');
    console.log(getGeocode('Washington DC'));
});