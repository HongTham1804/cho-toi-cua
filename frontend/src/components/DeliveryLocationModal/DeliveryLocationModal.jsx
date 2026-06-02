import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DeliveryLocationModal.css';

const DEFAULT_POSITION = {
  lat: 10.856496093453933,
  lng: 106.77405206796195,
};

const STORE_FALLBACKS = [
  {
    id: 1,
    name: 'Bách Hóa Xanh Lê Văn Chí',
    latitude: 10.856496093453933,
    longitude: 106.77405206796195,
  },
  {
    id: 2,
    name: 'WinMart Lê Văn Việt',
    latitude: 10.845183433582347,
    longitude: 106.7785716799879,
  },
  {
    id: 3,
    name: 'GO! Dĩ An',
    latitude: 10.889120952863461,
    longitude: 106.77583425300035,
  },
];

const customerIcon = L.divIcon({
  className: 'delivery-map-marker delivery-map-marker--customer',
  html: '<i class="fa-solid fa-location-dot"></i>',
  iconSize: [34, 34],
  iconAnchor: [17, 32],
  popupAnchor: [0, -28],
});

const storeIcon = L.divIcon({
  className: 'delivery-map-marker delivery-map-marker--store',
  html: '<i class="fa-solid fa-store"></i>',
  iconSize: [32, 32],
  iconAnchor: [16, 28],
  popupAnchor: [0, -24],
});

function LocationPicker({ onPick }) {
  useMapEvents({
    click(event) {
      onPick({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView([position.lat, position.lng], Math.max(map.getZoom(), 14));
  }, [map, position.lat, position.lng]);

  return null;
}

export default function DeliveryLocationModal({
  currentLocation,
  stores = STORE_FALLBACKS,
  onClose,
  onConfirm,
}) {
  const [position, setPosition] = useState(
    currentLocation?.lat && currentLocation?.lng
      ? { lat: currentLocation.lat, lng: currentLocation.lng }
      : DEFAULT_POSITION
  );
  const [address, setAddress] = useState(currentLocation?.address || '');
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lng) {
      setPosition({ lat: currentLocation.lat, lng: currentLocation.lng });
      setAddress(currentLocation.address || '');
    }
  }, [currentLocation]);

  const normalizedStores = useMemo(() => {
    const source = stores.length > 0 ? stores : STORE_FALLBACKS;

    return source
      .map((store, index) => ({
        id: Number(store.id || index + 1),
        name: store.name || STORE_FALLBACKS[index]?.name || 'Siêu thị',
        latitude: Number(store.latitude || STORE_FALLBACKS[index]?.latitude),
        longitude: Number(store.longitude || STORE_FALLBACKS[index]?.longitude),
      }))
      .filter((store) => Number.isFinite(store.latitude) && Number.isFinite(store.longitude));
  }, [stores]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Trình duyệt không hỗ trợ lấy vị trí hiện tại.');
      return;
    }

    setLocationStatus('Đang lấy vị trí hiện tại...');

    navigator.geolocation.getCurrentPosition(
      (result) => {
        setPosition({
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        });
        setLocationStatus('Đã cập nhật vị trí hiện tại. Bạn có thể kéo ghim để chỉnh lại.');
      },
      () => {
        setLocationStatus('Không lấy được vị trí hiện tại. Bạn hãy kéo ghim trên bản đồ.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirm = () => {
    onConfirm({
      address: address.trim(),
      lat: position.lat,
      lng: position.lng,
    });
  };

  return (
    <div className="delivery-location-overlay" onClick={onClose}>
      <section className="delivery-location-modal" onClick={(event) => event.stopPropagation()}>
        <header className="delivery-location-head">
          <div>
            <p>Vị trí nhận hàng</p>
            <h2>Cập nhật địa chỉ giao hàng</h2>
          </div>
          <button className="delivery-location-close" type="button" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </header>

        <div className="delivery-location-body">
          <div className="delivery-location-map-wrap">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={14}
              scrollWheelZoom
              className="delivery-location-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onPick={setPosition} />
              <RecenterMap position={position} />
              {normalizedStores.map((store) => (
                <Marker
                  key={store.id}
                  position={[store.latitude, store.longitude]}
                  icon={storeIcon}
                >
                  <Popup>{store.name}</Popup>
                </Marker>
              ))}
              <Marker
                position={[position.lat, position.lng]}
                icon={customerIcon}
                draggable
                eventHandlers={{
                  dragend(event) {
                    const marker = event.target;
                    const next = marker.getLatLng();
                    setPosition({ lat: next.lat, lng: next.lng });
                  },
                }}
              >
                <Popup>Vị trí nhận hàng của bạn</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="delivery-location-panel">
            <button
              className="delivery-location-current"
              type="button"
              onClick={handleUseCurrentLocation}
            >
              <i className="fa-solid fa-location-crosshairs" />
              Dùng vị trí hiện tại
            </button>

            <label className="delivery-location-field">
              <span>Địa chỉ chi tiết</span>
              <textarea
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Ví dụ: Số nhà, tên đường, phường/xã, ghi chú cho shipper..."
              />
            </label>

            {locationStatus && <p className="delivery-location-status">{locationStatus}</p>}
          </div>
        </div>

        <footer className="delivery-location-footer">
          <button className="delivery-location-secondary" type="button" onClick={onClose}>
            Hủy
          </button>
          <button className="delivery-location-primary" type="button" onClick={handleConfirm}>
            Xác nhận vị trí
          </button>
        </footer>
      </section>
    </div>
  );
}
