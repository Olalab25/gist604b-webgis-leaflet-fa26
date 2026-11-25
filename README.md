# GIST 604B – WebGIS & Full-Stack Orchestration
Repository for building an interactive web mapping application using HTML, CSS, JavaScript, and Leaflet.

## Repository Structure
    .
    ├── data/
    │   ├── your_point_layer.geojson
    │   ├── your_line_layer.geojson
    │   └── your_polygon_layer.geojson
    ├── js/
    │   └── your_js_file.js
    ├── css/
    │   └── your_css_file.css
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
    └── README.md

## Notes
- Replace the placeholder filenames in `data/`, `js/`, and `css/` with your own files.
- All GeoJSON datasets must be in WGS84 (EPSG:4326) and placed in the `data/` folder.
- `data/Tempe_Amenities.geojson` combines public amenity points from the City of Tempe's [Park Amenities public view](https://www.arcgis.com/home/item.html?id=728bcfecac5b4b9fb3ad8a198c5f5231), licensed under CC BY 4.0.
- The road line layer in `data/Tempe_Road_Geometry.geojson` is sourced from the City of Tempe's [Pavement Quality Index Segments](https://www.arcgis.com/home/item.html?id=70aedb833ab04e76b4a917ef12c7da23); the separate road detail dataset contains attributes without geometry.
- Run `npm install` to install dependencies and `npm start` to launch the local development server.
- Open `http://localhost:8080` in your browser to preview your map during development.
- The final web map is published using GitHub Pages.
