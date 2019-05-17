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
            <a href="#" class="btn mapper light-blue darken-2" 
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
        //console.log(response);
        let temps = tempConvert(response.main.temp)
        $('#weather-container').empty()
        .html(`
            <h1 class='flow-text'>${response.name}</h1>
            <span>Current Temperature: ${temps[0]}&deg;F / ${temps[1]}&deg;C</span><br />
            <span><img src='http://openweathermap.org/img/w/${response.weather[0].icon}.png' alt='${response.weather[0].description}' /></span><br />
            <div id='snippet'>Loading Wikipedia Snippet...</div>
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
            <a href="#" class="btn mapper light-blue darken-2" 
                lat="${you.lat}"
                lon="${you.lon}">
            You!
            </a>`);
        },function(error){
            if (error.code == 1) return geoCodeButton('Washington DC');
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

//TODO: Place inside App Object
function snipWiki(city) {
    let queryURL = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${city}`
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        let query = response.query.pages;
        let pageId = Object.keys(response.query.pages)[0];
        let data = query[pageId];
        let snippet = data.extract.split('\n')[0];
        let wikilink = '';
        if (snippet.includes('Undefined')) {
            snippet = 'No wikipedia data available for this city.';
        } else {
            wikilink = `https://en.wikipedia.org/?curid=${pageId}`;
        }

        $('#snippet').empty();
        $('#snippet').append(`
            <p id='wiki-text'>${snippet}</p>
            <span><a href='${wikilink}' target='_blank'>View full article here.</a></span>    
        `);
    }).catch();
}

//TODO: Document Object
function renderNav() {
    let links = `
        <li><a href="https://github.com/owaisj/weather-map/" target="_blank">View Code</a></li>
        <li><a href="https://owaisj.github.io/" target="_blank">Back to Portfolio</a></li>
        <li><a href="https://weather.com/" target="_blank">Weather.com</a></li>
    `;

    $('#navbar').append(`
        <div class="container">
            <span class="brand-logo">${document.title}</span>
            <a href="#" class="sidenav-trigger" data-target="mobile-nav">
                <i class="material-icons">menu</i>
            </a>
            <ul class="right hide-on-med-and-down">
                ${links}
            </ul>
        </div>
    `);

    $('.sidenav').append(links).sidenav();
}

$(document).ready(function(){
    displayWeather(38.9072, -77.0369);
    document.body.style.backgroundColor = 'whitesmoke';
    renderNav();
}).on('click', ".mapper", function(){
    let lat = $(this).attr('lat');
    let lon = $(this).attr('lon');
    let name = $(this).attr('name');
    document.body.style.backgroundColor = '#81d4fa';
    updateMap(mymap, lat, lon, name);
    displayWeather(lat, lon);
    snipWiki(name);
})