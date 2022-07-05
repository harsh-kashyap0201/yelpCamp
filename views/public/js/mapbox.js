mapboxgl.accessToken =mapboxpk;
CurrentCamp=JSON.parse(CurrentCampground);

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: CurrentCamp.geometry.coordinates,
zoom: 12
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
.setLngLat(CurrentCamp.geometry.coordinates)
.setPopup(
new mapboxgl.Popup({ offset: 25 })
.setHTML('<h3>'+CurrentCamp.name+'</h3>'))
.addTo(map);
