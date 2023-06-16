mapboxgl.accessToken =
    'pk.eyJ1Ijoia2hvYWRhbmciLCJhIjoiY2xncXF0MWtvMTQ5eDNlcDl0YW9qYWdvdSJ9.WbMvnU51FN6MAi4gAmUqtw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 10,
    scrollZoom: false,
});
document.querySelector('.mapboxgl-canvas').style.position = 'relative';
const stores = JSON.parse(document.querySelector('#map').dataset.stores);
const citySelect = document.querySelector('.map-select');
const filterStores = (city) => {
    const bounds = new mapboxgl.LngLatBounds();
    stores.forEach((store) => {
        if (store.city !== city) return;
        const el = document.createElement('div');
        el.innerHTML = '<i class="fas fa-map-marker-alt text-danger"></i>';
        let marker = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(store.location.coordinates)
            .addTo(map);
        let popup = new mapboxgl.Popup({
            offset: 10,
            closeButton: false,
            closeOnClick: false,
        });

        marker.getElement().addEventListener('mouseenter', function () {
            popup
                .setLngLat(store.location.coordinates)
                .setHTML(`<p>${store.address} </p>`)

                .addTo(map);
        });
        marker.getElement().addEventListener('mouseleave', function () {
            popup.remove();
        });
        bounds.extend(store.location.coordinates);
    });
    map.fitBounds(bounds.toArray(), {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
    });
};
citySelect.onchange = () => {
    filterStores(citySelect.value);
};
filterStores('Hanoi');
