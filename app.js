$(document).ready(function(){

    //Map
    let mymap = L.map('map').setView([38.9072, -77.0369], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(mymap);

    let theMarker = L.marker([38.9072, -77.0369]);
    theMarker.addTo(mymap)
    .bindPopup('Washington DC')
    .openPopup();

    displayWeather(38.9072, -77.0369);

    //Convert Temperature
    function kToF(temp) {
        let value = (temp - 273.15) * 9/5 + 32
        return value.toFixed(2);
    }

    function geoCodeButton(city) {
        let queryURL = `https://nominatim.openstreetmap.org/?format=json&city=${city}`;
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response){
            let coordinates = {
                lat: parseFloat(response[0].lat),
                lon: parseFloat(response[0].lon)
            };

            $('#button-container').append(`
                <a href="#" class="btn mapper" 
                    lat="${coordinates.lat}"
                    lon="${coordinates.lon}"
                    name="${city}">
                    ${city}
                </a>
            `)
        }).catch()
    }
    
    function updateMap(map, lat, lon, name) {
        if (name == null) name = 'Your Location';
        map.setView([lat, lon], 13).removeLayer(theMarker);
        theMarker = L.marker([lat,lon]).addTo(map)
        .bindPopup(name)
        .openPopup();
    }

    function displayWeather(lat, lon) {
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ca67279e6bde699866879e8526bb828a`
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response){
            console.log(response);
            $('#weather-container').empty()
            .html(`
                <h1>${response.name}</h1>
                <span>Current Temperature (in F): ${kToF(response.main.temp)}</span>
            `);
        }).catch();
    }

    (function yourButton() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos){
                let you = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }
                $('#button-container').append(`
                <a href="#" class="btn mapper" 
                    lat="${you.lat}"
                    lon="${you.lon}">
                Your City
                </a>`);
            })
        } else {
            geoCodeButton('Washington DC');
        }
    })();

    let cities = ['Austin', 'Seattle','Boston', 'Vancouver']
    cities.forEach(function(item){
        geoCodeButton(item);
    });

    $(document).on('click', ".mapper", function(){
        let lat = $(this).attr('lat');
        let lon = $(this).attr('lon');
        let name = $(this).attr('name');

        updateMap(mymap, lat, lon, name);
        displayWeather(lat, lon);
    })
});