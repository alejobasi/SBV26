import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
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

export function MapCanvas({ places, selectedPlaceId, onMarkerClick }: Props) {
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

  const createCustomIcon = (emoji: string, color: string, isSelected: boolean) => {
    const size = isSelected ? 44 : 36;
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
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      ">
        ${emoji}
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

        {places.map((place) => {
          const isSelected = place.id === selectedPlaceId;
          const color = CATEGORY_COLORS[place.category] || '#4a7c59';
          const emoji = CATEGORY_EMOJIS[place.category] || '📍';
          return (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomIcon(emoji, color, isSelected)}
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
      <motion.button
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
      </motion.button>
    </div>
  );
}
