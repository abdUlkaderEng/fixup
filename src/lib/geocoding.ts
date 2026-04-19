import { PhotonFeature, PhotonResponse, SearchResult } from '@/types/map';

const DAMASCUS_BBOX = '36.0,33.4,36.6,33.6';
const DAMASCUS_CENTER = { lng: 36.3, lat: 33.5 };
const PHOTON_API_URL = 'https://photon.komoot.io/api/';

function calculateDistanceSquared(
   coords: [number, number],
   center: { lng: number; lat: number }
): number {
   return (
      Math.pow(coords[0] - center.lng, 2) + Math.pow(coords[1] - center.lat, 2)
   );
}

function sortByProximity(features: PhotonFeature[]): PhotonFeature[] {
   return [...features].sort((a, b) => {
      const distA = calculateDistanceSquared(
         a.geometry.coordinates,
         DAMASCUS_CENTER
      );
      const distB = calculateDistanceSquared(
         b.geometry.coordinates,
         DAMASCUS_CENTER
      );
      return distA - distB;
   });
}

function formatPhotonFeature(feature: PhotonFeature): SearchResult {
   const { name, street, city, country, osm_key, osm_value } =
      feature.properties;

   const placeName = [name, street, city, country].filter(Boolean).join(', ');

   return {
      place_name: placeName,
      center: feature.geometry.coordinates,
      place_type: [osm_key || 'place', osm_value || 'address'],
   };
}

export async function searchLocation(query: string): Promise<SearchResult[]> {
   if (!query.trim()) {
      return [];
   }

   const url = new URL(PHOTON_API_URL);
   url.searchParams.set('q', query);
   url.searchParams.set('bbox', DAMASCUS_BBOX);
   url.searchParams.set('limit', '10');
   url.searchParams.set('lang', 'en');

   const response = await fetch(url.toString());

   if (!response.ok) {
      throw new Error('Search failed');
   }

   const data: PhotonResponse = await response.json();
   const features = data.features || [];

   const sortedFeatures = sortByProximity(features);

   return sortedFeatures.map(formatPhotonFeature);
}
