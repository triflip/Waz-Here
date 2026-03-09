import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (
  L.Icon.Default.prototype as typeof L.Icon.Default.prototype & {
    _getIconUrl?: string;
  }
)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const TILE_LAYER_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_LAYER_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedPosition: { lat: number; lng: number } | null;
}

const ClickHandler = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LeafletMap = ({
  onLocationSelect,
  selectedPosition,
}: LeafletMapProps) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-64 rounded-xl z-0"
    >
      <TileLayer 
      url={TILE_LAYER_URL} 
      attribution={TILE_LAYER_ATTRIBUTION} />

      <ClickHandler onLocationSelect={onLocationSelect} />

      {selectedPosition && (
        <Marker position={[selectedPosition.lat, selectedPosition.lng]} />
      )}
    </MapContainer>
  );
};

export default LeafletMap;
