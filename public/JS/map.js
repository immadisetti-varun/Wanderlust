	mapboxgl.accessToken = process.env.MAP_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(`<h4>${loc}</h4><p>Exact location is provided after booking</p>`)
    )
        .addTo(map);