var map = L.map('map', {zoomControl: false}).setView([51.505, -0.09], 13);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 3,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var watercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
	minZoom: 1,
	maxZoom: 16,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
});

osm.addTo(map);

fetch("Markers.json")
            .then(response => response.json())
            .then(data => {
                // Loop through the markers in the JSON and add markers to the map
                data.markers.forEach(function(markerData) {
                    const lat = parseFloat(markerData.cords.lat);
                    const lon = parseFloat(markerData.cords.lon);

                    // Default Icon (Blue)
                    let icon = L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-blue.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34]
                    });

                    // Color tag icons
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
                    
                    const marker = L.marker([lat, lon], { icon: icon }).addTo(map);

                    //Label for marker
                    marker.bindTooltip(markerData.Name, {
                        permanent: true,  // Keep the label on the map even when not hovered
                        direction: "top",  // Position the label above the marker
                        offset: L.point(0, -35),  // Adjust the label's position (10 pixels above the marker)
                        className: "NB-Tool-Tip" // For css style No-Box
                      }).openTooltip();

                      //Event Listener Click on Marker
                      marker.on('click', function() {
                        updateLocationSlab(markerData); // Update the left menu with the marker's info
                      });
                });
            })
            .catch(error => console.error('Error loading the JSON file:', error));

map.on('click', function() {
    hideLocationSlab(); // Hide the menu if user clicks somewhere on the map
});

function updateLocationSlab(marker) {
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

function hideLocationSlab() {
    var menu = document.getElementById('LocationSlab');
    menu.style.display = 'none'; // Hide the menu when no marker is clicked
}