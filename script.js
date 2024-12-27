/* Scripts for main page Index.html
Links to Markers.json which stores marker data
By Kieran U
*/

// Map Setup
var map = L.map('map', {zoomControl: false}).setView([20, 15], 3);

//Open Street Map Style
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

//Stadia Maps Watercolor Style
var watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 3,
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

//Open Street Maps Cat Style
var cat = L.tileLayer('https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png', {
	minZoom: 3,
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.openstreetmap.cat" target="_blank">Breton OpenStreetMap Team</a>'
});

//Add style to map
osm.addTo(map);

// Apply the scroll bounds to the map
var maxBounds = L.latLngBounds(
    L.latLng(90, -175),  // Northwest corner (lat, lon) 
    L.latLng(-90, 190)   // Southeast corner (lat, lon)
);
map.setMaxBounds(maxBounds);

// Create Markers On Map
var markers = L.markerClusterGroup({
    maxClusterRadius: 70,
    showCoverageOnHover: false
});

var markerDataArray = [];

//Get marker data from json file and create markers
fetch("Markers.json")
.then(response => response.json())
.then(data => {
    //Loop through the markers and add to map
    data.markers.forEach(function(markerData) {
        const lat = parseFloat(markerData.cords.lat);
        const lon = parseFloat(markerData.cords.lon);

        //Default icon (Blue)
        let icon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-blue.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });

        //Custom icons (By series tag)
        if (markerData.tags.series == "Percy Jackson") {
            icon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-red.png',  // Blue marker
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });
        } else if (markerData.tags.series == "Harry Potter") {
            icon = L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-green.png',  // Green marker
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            });
        }
                
        //create marker, bind icon
        const marker = L.marker([lat, lon], { icon: icon });

        // Add marker to the array for future use
        markerDataArray.push({
            marker: marker,
            name: markerData.Name
        });

        //Label for marker
        marker.bindTooltip(markerData.Name, {
            permanent: true,
            direction: "top",
            offset: L.point(0, -35), //35px above marker
            className: "NB-Tool-Tip" // For css style No-Box
        }).openTooltip();

        //Event listener setup (Click on marker)
        marker.on('click', function() {
            updateLocationSlab(markerData);
        });

        //save marker to layer
        markers.addLayer(marker);
    });
})
.catch(error => console.error('Error loading the JSON file:', error));

//add all markers in layer to map
map.addLayer(markers);

//Suggestion Icon Marker
icon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-gold.png',  // Gold marker
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
var suggestMarker = L.marker([20, 15], {icon: icon}).addTo(map);
suggestMarker.setOpacity(0);

//Event listener setup (Click on map)
map.on('click', function(e) {
    var suggestLocationBtn = document.getElementById('suggestLocationBtn');
    if (!suggestLocationBtn.classList.contains('active')) {
        hideLocationSlab();
    } else {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        suggestMarker.setLatLng([lat, lng]);
        suggestMarker.setOpacity(1);

        document.getElementById('latitude').value = `${lat}`;
        document.getElementById('longitude').value = `${lng}`
    }
});

//Event Listener Setup (Click on Navbar suggest location button)
document.getElementById('suggestLocationBtn').addEventListener('click', function (){
    var suggestLocationBtn = document.getElementById('suggestLocationBtn');
    if (!suggestLocationBtn.classList.contains('active')) {
        suggestLocationBtn.classList.add('active');
        displaySuggestionForm();
    }else{
        suggestLocationBtn.classList.remove('active');
        var LS = document.getElementById('LocationSlab');
        LS.style.display = 'none';
        suggestMarker.setOpacity(0);
    }
});

//Event Listener Setup (Random Location Button)
document.getElementById('randomBtn').addEventListener('click', function() {
    randomLocation();
});

//Hover Effect for Random Button in Navbar
const image = document.getElementById('randomBtn-img');
image.addEventListener('mouseover', function() {
    image.src = 'Assets/Images/rand-gold.png';
});
image.addEventListener('mouseout', function() {
    image.src = 'Assets/Images/rand-white.png';
});

//Zoom to Random Location function
function randomLocation() {
    var randomIndex = Math.floor(Math.random() * markerDataArray.length);
    map.setView(markerDataArray[randomIndex].marker.getLatLng(), 13);
}

//Event Listener Setup (Navbar Search Button)
document.getElementById('searchBtn').addEventListener('click', function() {
    var searchContainer = document.getElementById('searchContainer');
    if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
        searchContainer.style.display = 'block'; 
        document.getElementById('searchInput').focus();
    } else {
        searchContainer.style.display = 'none';
    }
});

// Handle input events in the search field
document.getElementById('searchInput').addEventListener('input', function(e) {
    var query = e.target.value.trim();

    //update when more than 3 letters typed
    if (query.length >= 3) {
        searchLocation(query);
    }
});

//Search and Zoom function
function searchLocation(query) {
    var results = markerDataArray.filter(function(item) {
        return item.name.toLowerCase().includes(query.toLowerCase());
    });

    results.forEach(function(item) {
        map.setView(item.marker.getLatLng(), 13);  // Zoom to the matched location
    });
}

//Suggest a location form
function displaySuggestionForm() {

    //update left-side menu with suggestion form
    var LS = document.getElementById('LocationSlab');
    LS.innerHTML = `
        <form id="suggestionForm">
            <label for="name">Location Name:</label>
            <input type="text" id="name" name="name" required>
            
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>

            <label for="address">Address:</label>
            <input type="text" id="address" name="address" required>

            <label for="source">Source:</label>
            <input type="text" id="source" name="source" required>

            <label for="series">Series:</label>
            <select id="series" name="series">
            <option hidden disabled selected value></option>
                <option value="other">Other...</option>
            </select>
            <input type="text" id="newseries" placeholder="Enter Series" style="display:none;">

            <label for="author">Creator:</label>
            <select id="author" name="author" required>
            <option hidden disabled selected value></option>
                <option value="other">Other...</option>
            </select>
            <input type="text" id="newauthor" placeholder="Enter Author" style="display:none;">
            
            <label for="images">Image URLs (comma separated):</label>
            <input type="text" id="images" name="images">

            <label for="selectOnMap">
                <input type="checkbox" id="selectOnMap" checked> Select on Map
            </label>
            <div id="latLongInputs" style="display: none;">
                <label for="latitude">Latitude:</label>
                <input type="text" id="latitude" name="latitude">

                <label for="longitude">Longitude:</label>
                <input type="text" id="longitude" name="longitude">
            </div>
            
            <button type="submit">Submit</button>
        </form>
    `;
    LS.style.display = 'block';

    async function SuggestFormDropDownData() {
        try {
            // Fetch the JSON file with the data
            const response = await fetch('info.json');
            const data = await response.json();
    
            // Get the select elements for authors and series
            const authorSelect = document.getElementById('author'); // Correct ID used here
            const seriesSelect = document.getElementById('series'); // Correct ID used here
    
            // Populate the authors dropdown
            data.authors.forEach(author => {
                const option = document.createElement('option');
                option.value = author;
                option.textContent = author;
                authorSelect.insertBefore(option, authorSelect.firstChild);
                //authorSelect.appendChild(option);
            });
    
            // Populate the series dropdown
            data.series.forEach(series => {
                const option = document.createElement('option');
                option.value = series;
                option.textContent = series;
                seriesSelect.insertBefore(option, seriesSelect.firstChild);
                //seriesSelect.appendChild(option);
            });
    
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    // Call the function to populate the dropdowns
    SuggestFormDropDownData();


    function toggleNewTagInput(selectElement, inputElement) {
        if (selectElement.value === 'other') {
            inputElement.style.display = 'block';
        } else {
            inputElement.style.display = 'none';
        }
    }

    //Event Listener Setup (Changes in textbox for lat or long in side-left menu)
    document.getElementById('latitude').addEventListener('input', updateMarkerPosition);
    document.getElementById('longitude').addEventListener('input', updateMarkerPosition);

    const selectOnMapCheckbox = document.getElementById('selectOnMap');
    selectOnMapCheckbox.addEventListener('change', function() {
        if (selectOnMapCheckbox.checked) {
            latLongInputs.style.display = 'none';  // Hide the latitude/longitude inputs
        } else {
            latLongInputs.style.display = 'block';  // Show the latitude/longitude inputs
        }
    });

    document.getElementById('author').addEventListener('change', function() {
        toggleNewTagInput(this, document.getElementById('newauthor'));
    });

    document.getElementById('series').addEventListener('change', function() {
        toggleNewTagInput(this, document.getElementById('newseries'));
    });

    //form submission handling
    document.getElementById('suggestionForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const address = document.getElementById('address').value;
        const source = document.getElementById('source').value;
        const series = document.getElementById('series').value;
        const creator = document.getElementById('author').value;
        const images = document.getElementById('images').value.split(',').map(image => image.trim());
        const latLng = suggestMarker.getLatLng();
        const lat = latLng.lat;
        const long = latLng.lng;
        
        // Map your form fields to Google Form field names
        const formData = new URLSearchParams();
        formData.append('name', name); // Replace entry.XXXXXX with your actual form field entry ID
        formData.append('description', description); // Replace entry.YYYYYY with your actual form field entry ID
        formData.append('address', address); // Replace entry.ZZZZZZ with your actual form field entry ID
        formData.append('source', source);
        formData.append('series', series);
        formData.append('creator', creator);
        formData.append('images', images.join(',')); // Replace entry.AAAAAA with your actual form field entry ID
        formData.append('lat', lat);
        formData.append('long', long);

        //send data to google sheets (There are console errors being triggered CORS, however the data is successfully being sent)
        //temparily ingoring issues, might look into moving to proper backend in the future, Firebase? MangoDB?
        fetch('https://script.google.com/macros/s/AKfycbx24CyzFBNOSUNTQVCUA8zuH-tXl0Mi-Mt6aCwro77pBugl6EURl8mK1JrUTjye0I_2/exec', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text()) // Text is returned from Apps Script
        .then(result => {
            alert('Form submitted successfully!');
            //console.log(result); 
        })
        .catch(error => {
           // console.error('Error:', error);
        });

        //close form
        daSuggestLocationBtn();
        LS.style.display = 'none';
        suggestMarker.setOpacity(0);
    });
}

function updateMarkerPosition() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);
    
    if (!isNaN(lat) && !isNaN(lng)) {
        suggestMarker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
    }
}

//De-activate Suggest location button
function daSuggestLocationBtn() {
    var suggestLocationBtn = document.getElementById('suggestLocationBtn');
    suggestLocationBtn.classList.remove('active');
}

//Update left-side menu with location info
function updateLocationSlab(marker) {
    var suggestLocationBtn = document.getElementById('suggestLocationBtn');
    if (!suggestLocationBtn.classList.contains('active')) {
        markers.refreshClusters();
        var LS = document.getElementById('LocationSlab');
        LS.innerHTML = `
            <div class="LS-img">${marker.images.map(image => `<img src="${image}" alt="Image">`).join('')}</div>
            <h2>${marker.Name}</h2>
            <div class="tags">${Object.values(marker.tags).map(tagValue => {
                // Replace spaces with underscores in the tag value
                const tagClass = tagValue.replace(/\s+/g, '_'); 
                return tagValue ? `<span class="tag ${tagClass}">${tagValue}</span>` : '';
            }).join('')}</div>
            <p>${marker.description}</p>
        `;
        LS.style.display = 'block';
    }
}

//hide left-side menu
function hideLocationSlab() {
    var suggestLocationBtn = document.getElementById('suggestLocationBtn');
    if (!suggestLocationBtn.classList.contains('active')) {
        var LS = document.getElementById('LocationSlab');
        LS.style.display = 'none'; // Hide the menu when no marker is clicked
        daSuggestLocationBtn();
    }
}