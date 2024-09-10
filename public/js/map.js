/* eslint-disable */
'use strict';
import { APIRequest } from '../utils/APIRequest.mjs';
import { Alert } from '../utils/alerts.mjs';
//! Selectors
const addressEl = document.querySelector('#address');
const streetEl = document.querySelector('#street');
const buildingNoEl = document.querySelector('#building-number');
const specialLandMarkEl = document.querySelector('#special-landmarks');
const proceedBtnEl = document.querySelector('#proceed-btn');
let locationCoordinates;

/* const res = await APIRequest.sendQueryRequest('/cart', 'GET');
if (res.data.items.length === 0) window.location.href = '/'; */

//! Helpers
const constructLocationObj = (locationCoordinates) => {
  //! Required fields
  const location = {
    location: `https://www.google.com/maps?q=${locationCoordinates.lat},${locationCoordinates.lng}`,
    address: addressEl.value,
    street: streetEl.value,
    buildingno: buildingNoEl.value,
    specialLandmarks: specialLandMarkEl.value,
  };
  localStorage.setItem('location', JSON.stringify(location));
};
//! Listeners
var googleMapsIcon = L.icon({
  iconUrl:
    'https://w7.pngwing.com/pngs/129/41/png-transparent-google-map-pin-thumbnail.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

var marker;
var useGoogleMapsIcon = false;

function recenterMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // console.log({ lat, lng });
        locationCoordinates = { lat, lng };
        // Set the map view to the user's location
        map.setView([lat, lng], 13);

        var icon = useGoogleMapsIcon ? googleMapsIcon : null;

        // Place a marker at the user's location
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng], {
            draggable: true,
            ...(icon && { icon: icon }),
          }).addTo(map);
        }
      },
      function (error) {
        console.error('Geolocation error: ' + error.message);
      },
      { enableHighAccuracy: true },
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

// Initialize the map with a fallback location (0, 0)
var map = L.map('map').setView([0, 0], 2);

// Attempt to set the map view to the user's location on load
recenterMap();

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Add geocoding search bar to the map
var geocoder = L.Control.Geocoder.nominatim();
L.Control.geocoder({
  geocoder: geocoder,
  defaultMarkGeocode: false,
})
  .on('markgeocode', function (e) {
    var latlng = e.geocode.center;
    map.setView(latlng, 13);
    // locationCoordinates = { ...latlng };
    locationCoordinates = { ...latlng };

    // Remove existing marker
    if (marker) {
      map.removeLayer(marker);
    }

    // Add new marker at the found location with selected icon
    var icon = useGoogleMapsIcon ? googleMapsIcon : null;
    marker = L.marker(latlng, {
      draggable: true,
      ...(icon && { icon: icon }),
    }).addTo(map);
  })
  .addTo(map);

// Function to place or move the marker
function onMapClick(e) {
  var icon = useGoogleMapsIcon ? googleMapsIcon : null;
  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng, {
      draggable: true,
      ...(icon && { icon: icon }),
    }).addTo(map);
  }
  locationCoordinates = { ...e.latlng };
  //   console.log(locationCoordinates);
}

// Add event listener for map clicks
map.on('click', onMapClick);

// Create a custom control for repositioning
var RepositionControl = L.Control.extend({
  options: { position: 'topright' },
  onAdd: function () {
    var container = L.DomUtil.create(
      'div',
      'leaflet-bar leaflet-control leaflet-control-custom',
    );
    var icon = L.DomUtil.create('a', 'fas fa-crosshairs', container); // Using Font Awesome crosshairs icon
    icon.title = 'Recenter map to your location';
    icon.style.backgroundColor = 'white';
    icon.style.width = '30px';
    icon.style.height = '30px';
    icon.style.lineHeight = '30px';
    icon.style.textAlign = 'center';
    icon.style.cursor = 'pointer';

    // Add event listener to the icon
    L.DomEvent.on(icon, 'click', recenterMap);

    return container;
  },
});

// Add the custom control to the map
map.addControl(new RepositionControl());
proceedBtnEl.addEventListener('click', (e) => {
  e.preventDefault();
  if (!addressEl.value || !streetEl.value)
    return Alert.displayFailure(
      'Address and Street fields are required!',
      2000,
    );
  //!1) Constructing the location
  constructLocationObj(locationCoordinates);
  //!2) Redirect to checkout page
  window.location.href = '/pay';
});
