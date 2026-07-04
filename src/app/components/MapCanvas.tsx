import { MapContainer, TileLayer, Marker, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'motion/react';
import { useEffect, useState, useCallback } from 'react';
import { Navigation2 } from 'lucide-react';
import { Place, CATEGORY_COLORS, CATEGORY_EMOJIS } from './data/places';
import 'leaflet/dist/leaflet.css';

interface Props {
  places: Place[];
  selectedPlaceId: string | null;
  onMarkerClick: (id: string) => void;
  showLocationButton?: boolean;
}

interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

function MapUpdater({
  selectedPlaceId,
  places,
  flyTo,
}: {
  selectedPlaceId: string | null;
  places: Place[];
  flyTo: UserLocation | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlaceId) {
      const place = places.find((p) => p.id === selectedPlaceId);
      if (place) map.setView([place.lat, place.lng], 16, { animate: true });
    }
  }, [selectedPlaceId, map, places]);

  useEffect(() => {
    if (flyTo) map.setView([flyTo.lat, flyTo.lng], 17, { animate: true });
  }, [flyTo, map]);

  return null;
}

const userDotIcon = L.divIcon({
  html: `
    <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
      <div style="
        position:absolute;width:20px;height:20px;border-radius:50%;
        background:rgba(59,130,246,0.25);
        animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        width:12px;height:12px;border-radius:50%;
        background:#3b82f6;
        border:2.5px solid white;
        box-shadow:0 2px 8px rgba(59,130,246,0.6);
        position:relative;z-index:1;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  className: '',
});

const recorridoEncierro: [number, number][] = [
  [40.063947, -6.662324],
  [40.064089, -6.662714],
  [40.064516, -6.662312],
  [40.064986, -6.662001],
  [40.066202, -6.661579],
  [40.06663, -6.66135],
  [40.066725, -6.661292],
  [40.067013, -6.661253],
  [40.067226, -6.661068],
  [40.067373, -6.66097],
  [40.067604, -6.660746],
  [40.067747, -6.66052],
  [40.067924, -6.660268],
  [40.068133, -6.660097],
  [40.068394, -6.659994],
  [40.068626, -6.659952],
  [40.068634, -6.660236],
  [40.068675, -6.66036],
];

const recorridoToro: [number, number][] = [
  [40.068614, -6.660431],
  [40.068732, -6.660414],
  [40.06882, -6.660574],
  [40.068651, -6.660751],
  [40.068512, -6.661045],
  [40.068241, -6.661673],
  [40.068188, -6.661893],
  [40.068256, -6.661577],
  [40.067986, -6.661314],
  [40.068081, -6.661147],
  [40.068105, -6.660987],
  [40.068295, -6.660986],
  [40.068453, -6.661164],
  [40.068295, -6.660986],
  [40.068105, -6.660987],
  [40.068081, -6.661147],
  [40.067986, -6.661314],
  [40.06763, -6.661324],
  [40.06733, -6.661324],
  [40.066984, -6.661282],
  [40.067103, -6.661143],
  [40.067359, -6.660981],
  [40.067591, -6.660756],
  [40.067723, -6.660585],
  [40.068024, -6.660949],
  [40.068105, -6.660987],
  [40.068024, -6.660949],
  [40.067723, -6.660585],
  [40.067774, -6.660455],
  [40.067961, -6.660215],
  [40.068196, -6.660053],
  [40.068397, -6.659983],
  [40.068652, -6.659935],
  [40.068638, -6.660268],
  [40.068701, -6.660385],
];

export function MapCanvas({ places, selectedPlaceId, onMarkerClick, showLocationButton = true }: Props) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [flyTo, setFlyTo] = useState<UserLocation | null>(null);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setUserLocation(loc);
        setFlyTo(loc);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const createCustomIcon = (emoji: string, color: string, isSelected: boolean, imgSrc?: string) => {
    const size = isSelected ? 44 : 36;
    const inner = imgSrc
      ? `<img src="${imgSrc}" style="width:${size - 8}px;height:${size - 8}px;border-radius:50%;object-fit:cover;" />`
      : `<span style="font-size:${isSelected ? 22 : 18}px;line-height:1;">${emoji}</span>`;
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${isSelected ? color : 'white'};
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        overflow: hidden;
      ">
        ${inner}
      </div>
    `;
    return L.divIcon({ html, iconSize: [size, size], className: 'custom-icon' });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={[40.068614, -6.660431]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <MapUpdater selectedPlaceId={selectedPlaceId} places={places} flyTo={flyTo} />

        {/* Recorrido del encierro */}
        <Polyline
          positions={recorridoEncierro}
          pathOptions={{
            color: '#f9a826',
            weight: 4,
            opacity: 0.55,
            dashArray: '1, 10',
            lineCap: 'round',
          }}
        />

        {/* Recorrido del toro */}
        <Polyline
          positions={recorridoToro}
          pathOptions={{
            color: '#e0575f',
            weight: 4,
            opacity: 0.55,
            dashArray: '1, 10',
            lineCap: 'round',
          }}
        />

        {places.map((place) => {
          const isSelected = place.id === selectedPlaceId;
          const color = CATEGORY_COLORS[place.category] || '#4a7c59';
          const emoji = CATEGORY_EMOJIS[place.category] || '📍';
          const imgSrc = place.category === 'Nightlife' ? '/SBV_logo_redondo.png' : undefined;
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomIcon(emoji, color, isSelected, imgSrc)}
              eventHandlers={{ click: () => onMarkerClick(place.id) }}
            />
          );
        })}

        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1 }}
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userDotIcon} />
          </>
        )}
      </MapContainer>

      {/* Botón de localización */}
      {showLocationButton && <motion.button
        onClick={handleLocate}
        style={{
          position: 'absolute',
          bottom: 108,
          right: 14,
          zIndex: 400,
          width: 42,
          height: 42,
          borderRadius: 14,
          background: 'white',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: userLocation ? '2px solid #3b82f6' : '2px solid transparent',
          cursor: 'pointer',
        }}
        whileTap={{ scale: 0.88 }}
        animate={locating ? { rotate: [0, 360] } : { rotate: 0 }}
        transition={locating ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Navigation2
          size={18}
          color={userLocation ? '#3b82f6' : '#2d4038'}
          strokeWidth={2.5}
          fill={userLocation ? '#3b82f620' : 'none'}
        />
      </motion.button>}
    </div>
  );
}
