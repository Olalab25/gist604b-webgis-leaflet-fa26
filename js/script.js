// Initialize the map in Tempe, Arizona (latitude, longitude).
const map = L.map('map', { zoomControl: false }).setView([33.4255, -111.9400], 12);
map.attributionControl.addAttribution(
    '<a href="https://www.arcgis.com/home/item.html?id=70aedb833ab04e76b4a917ef12c7da23">Road geometry: City of Tempe</a>'
);
map.attributionControl.addAttribution(
    '<a href="https://www.arcgis.com/home/item.html?id=728bcfecac5b4b9fb3ad8a198c5f5231">Public amenities: City of Tempe (CC BY 4.0)</a>'
);

// Basemap and navigation controls.
const basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);
L.control.zoom({ position: 'topleft' }).addTo(map);
L.control.scale({ position: 'bottomleft', metric: true, imperial: true }).addTo(map);

// Separate layer groups for each geometry type.
const parks = L.layerGroup().addTo(map);
const roads = L.layerGroup().addTo(map);
const amenities = L.layerGroup().addTo(map);
map.createPane('amenities').style.zIndex = '650';
L.control.layers({ 'OpenStreetMap': basemap }, {
    'Public amenities': amenities, 'Roads and streets': roads, 'Public parks': parks
}, { collapsed: false }).addTo(map);

// Build safe popup content from feature attributes.
function popup(feature, layer, category, field) {
    const p = feature.properties || {};
    const content = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = p.Name || p.RamadaName || p.CourtName || p.FieldName || p.Type ||
        p.ParkName || p.Park || p.name || p.RM_STREET || p.ON_STREET || p['@id'] || 'Unnamed feature';
    const detail = document.createElement('div');
    detail.textContent = `${category}: ${p[field] || 'Not specified'}`;
    content.append(name, detail);
    layer.bindPopup(content);
}

// Load GeoJSON and report missing or invalid files.
async function loadGeoJSON(path, group, options) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    const data = await response.json();
    if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
        throw new Error(`${path}: invalid FeatureCollection`);
    }
    L.geoJSON(data, options).addTo(group);
    return data.features.length;
}

const jobs = [
    loadGeoJSON('data/Tempe_Amenities.geojson', amenities, {
        pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
            pane: 'amenities',
            radius: 6, color: '#ffffff', weight: 1.5,
            fillColor: '#2563eb', fillOpacity: 0.9
        }),
        onEachFeature: (feature, layer) => popup(feature, layer, 'Amenity type', 'AmenityType')
    }),
    loadGeoJSON('data/Tempe_Road_Geometry.geojson', roads, {
        style: { color: '#e88732', weight: 2, opacity: 0.85 },
        onEachFeature: (feature, layer) => popup(feature, layer, 'Road class', 'rm_func')
    }),
    loadGeoJSON('data/Tempe_Park_Boundaries_and_Amenities.geojson', parks, {
        style: { color: '#08df57', weight: 2, fillColor: '#22c55e', fillOpacity: 0.35 },
        onEachFeature: (feature, layer) => popup(feature, layer, 'Park class', 'ParkClass')
    })
];
Promise.allSettled(jobs).then(results => {
    const labels = ['Amenities', 'Roads', 'Parks'];
    document.getElementById('status').textContent = results.map((r, i) =>
        r.status === 'fulfilled' ? `${labels[i]}: ${r.value} features${r.value < 10 ? ' (below minimum)' : ''}` : `${labels[i]}: failed to load (${r.reason.message})`
    ).join(' | ');
});

// Map legend.
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<strong>Map legend</strong><div><i class="point"></i>Public amenities</div><div><i class="line"></i>Roads</div><div><i class="polygon"></i>Parks</div>';
    return div;
};
legend.addTo(map);
