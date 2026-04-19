export interface Location {
   lng: number;
   lat: number;
}

export interface PhotonFeature {
   geometry: {
      coordinates: [number, number];
   };
   properties: {
      name?: string;
      street?: string;
      city?: string;
      country?: string;
      osm_key?: string;
      osm_value?: string;
   };
}

export interface PhotonResponse {
   features: PhotonFeature[];
}

export interface SearchResult {
   place_name: string;
   center: [number, number];
   place_type: string[];
}

export interface MapPickerProps {
   initialLng?: number;
   initialLat?: number;
   zoom?: number;
   onLocationSelect?: (lng: number, lat: number) => void;
   className?: string;
   mapTilerKey: string;
}
