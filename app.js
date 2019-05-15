//TODO: Create Initialize Map Function
let mymap = L.map('map').setView([38.9072, -77.0369], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(mymap);

let theMarker = L.marker([38.9072, -77.0369]);
theMarker.addTo(mymap)
.bindPopup('Washington DC')
.openPopup();

//TODO: App Object Method
function tempConvert(temp) {
    let fTemp = (temp - 273.15) * 9/5 + 32
    let cTemp = (temp - 273.15);
    let array = [fTemp.toFixed(2), cTemp.toFixed(2)]
    return array;
}

//TODO: App Object Method
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

//TODO: App Object Method
function updateMap(map, lat, lon, name) {
    if (name == null) name = 'Your Location';
    map.setView([lat, lon], 13).removeLayer(theMarker);
    theMarker = L.marker([lat,lon]).addTo(map)
    .bindPopup(name)
    .openPopup();
}

//TODO: App Object Method
function displayWeather(lat, lon) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ca67279e6bde699866879e8526bb828a`
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response);
        let temps = tempConvert(response.main.temp)
        $('#weather-container').empty()
        .html(`
            <h1>${response.name}</h1>
            <span>Current Temperature: ${temps[0]}&deg;F / ${temps[1]}&deg;C</span><br />
            <span><img src='http://openweathermap.org/img/w/${response.weather[0].icon}.png' alt='${response.weather[0].description}' /></span>
        `);
    }).catch();
}

//TODO: App Object Method
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

//TODO: Place inside App Object
let cities = ['Austin', 'Seattle','Boston', 'Vancouver']
cities.forEach(function(item){
    geoCodeButton(item);
});

$(document).ready(function(){
    displayWeather(38.9072, -77.0369);
}).on('click', ".mapper", function(){
    let lat = $(this).attr('lat');
    let lon = $(this).attr('lon');
    let name = $(this).attr('name');

    updateMap(mymap, lat, lon, name);
    displayWeather(lat, lon);
})