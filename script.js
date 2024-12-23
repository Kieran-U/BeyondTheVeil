var map = L.map('map').setView([51.505, -0.09], 13);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                    if (markerData.tags.color == "red") {
                        icon = L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-red.png',  // Blue marker
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34]
                        });
                    } else if (markerData.tags.color == "green") {
                        icon = L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/refs/heads/master/img/marker-icon-2x-green.png',  // Green marker
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34]
                        });
                    }
                    
                    const marker = L.marker([lat, lon], { icon: icon }).addTo(map);
                    marker.bindPopup(`<b>${markerData.Name}</b><br>${markerData.description}`);
                });
            })
            .catch(error => console.error('Error loading the JSON file:', error));