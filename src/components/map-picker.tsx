'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePhotonSearch } from '@/hooks/use-photon-search';
import { SearchControl } from '@/components/search-control';
import { MapPickerProps, Location } from '@/types/map';
import { SearchResult } from '@/types/map';

const DEFAULT_CENTER = { lng: 0, lat: 20 };
const DEFAULT_ZOOM = 2;

// Global flag to ensure RTL plugin is only loaded once
let rtlPluginLoaded = false;

export function MapPicker({
   initialLng = DEFAULT_CENTER.lng,
   initialLat = DEFAULT_CENTER.lat,
   zoom = DEFAULT_ZOOM,
   onLocationSelect,
   className,
   mapTilerKey,
}: MapPickerProps) {
   const mapContainer = useRef<HTMLDivElement>(null);
   const map = useRef<maplibregl.Map | null>(null);
   const marker = useRef<maplibregl.Marker | null>(null);
   const onLocationSelectRef = useRef(onLocationSelect);

   const hasInitialLocation =
      initialLng !== DEFAULT_CENTER.lng || initialLat !== DEFAULT_CENTER.lat;
   const initialLocationRef = useRef<Location | null>(
      hasInitialLocation ? { lng: initialLng, lat: initialLat } : null
   );

   const [selectedLocation, setSelectedLocation] = useState<Location | null>(
      initialLocationRef.current
   );
   const [isLocating, setIsLocating] = useState(false);
   const [locationError, setLocationError] = useState<string | null>(null);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');

   const {
      results: searchResults,
      isSearching,
      error: searchError,
   } = usePhotonSearch(searchQuery);

   onLocationSelectRef.current = onLocationSelect;

   const updateLocation = useCallback((lng: number, lat: number) => {
      setSelectedLocation({ lng, lat });
      onLocationSelectRef.current?.(lng, lat);
   }, []);

   useEffect(() => {
      if (!mapContainer.current || map.current) return;

      if (!rtlPluginLoaded) {
         maplibregl.setRTLTextPlugin(
            'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
            true
         );
         rtlPluginLoaded = true;
      }
      const newMap = new maplibregl.Map({
         container: mapContainer.current,
         style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerKey}`,
         center: [initialLng, initialLat],
         zoom: zoom,
      });

      newMap.addControl(new maplibregl.NavigationControl(), 'top-right');

      const handleClick = (e: maplibregl.MapMouseEvent) => {
         const { lng, lat } = e.lngLat;

         if (marker.current) {
            marker.current.setLngLat([lng, lat]);
         } else {
            marker.current = new maplibregl.Marker({
               color: '#ef4444',
               draggable: true,
            })
               .setLngLat([lng, lat])
               .addTo(newMap);

            marker.current.on('dragend', () => {
               const pos = marker.current?.getLngLat();
               if (pos) {
                  setSelectedLocation({ lng: pos.lng, lat: pos.lat });
                  onLocationSelectRef.current?.(pos.lng, pos.lat);
               }
            });
         }

         setSelectedLocation({ lng, lat });
         onLocationSelectRef.current?.(lng, lat);
         setLocationError(null);
      };

      const addMarkerToMap = (
         targetMap: maplibregl.Map,
         location: Location | null
      ) => {
         if (!location) return;

         marker.current = new maplibregl.Marker({
            color: '#ef4444',
            draggable: true,
         })
            .setLngLat([location.lng, location.lat])
            .addTo(targetMap);

         marker.current.on('dragend', () => {
            const pos = marker.current?.getLngLat();
            if (pos) {
               updateLocation(pos.lng, pos.lat);
            }
         });
      };

      const cleanupMap = (
         targetMap: maplibregl.Map,
         clickHandler: (e: maplibregl.MapMouseEvent) => void
      ) => {
         targetMap.off('click', clickHandler);
         marker.current?.remove();
         targetMap.remove();
         map.current = null;
         marker.current = null;
      };

      newMap.on('click', handleClick);
      addMarkerToMap(newMap, initialLocationRef.current);

      map.current = newMap;

      return () => cleanupMap(newMap, handleClick);
   }, [initialLng, initialLat, zoom, mapTilerKey, updateLocation]);

   const handleGetCurrentLocation = () => {
      if (!navigator.geolocation) {
         setLocationError('Geolocation is not supported by your browser');
         return;
      }

      setIsLocating(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
         (position) => {
            const { longitude, latitude } = position.coords;

            map.current?.flyTo({
               center: [longitude, latitude],
               zoom: 15,
               duration: 1000,
            });

            if (marker.current) {
               marker.current.setLngLat([longitude, latitude]);
            } else {
               marker.current = new maplibregl.Marker({
                  color: '#ef4444',
                  draggable: true,
               })
                  .setLngLat([longitude, latitude])
                  .addTo(map.current!);

               marker.current.on('dragend', () => {
                  const pos = marker.current?.getLngLat();
                  if (pos) {
                     updateLocation(pos.lng, pos.lat);
                  }
               });
            }

            updateLocation(longitude, latitude);
            setIsLocating(false);
         },
         (err) => {
            setIsLocating(false);
            switch (err.code) {
               case err.PERMISSION_DENIED:
                  setLocationError('Location access denied by user');
                  break;
               case err.POSITION_UNAVAILABLE:
                  setLocationError('Location information unavailable');
                  break;
               case err.TIMEOUT:
                  setLocationError('Location request timed out');
                  break;
               default:
                  setLocationError('An error occurred while getting location');
            }
         },
         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
   };

   const handleSelectResult = (result: SearchResult) => {
      const [lng, lat] = result.center;

      map.current?.flyTo({
         center: [lng, lat],
         zoom: 16,
         duration: 1000,
      });

      if (marker.current) {
         marker.current.setLngLat([lng, lat]);
      } else {
         marker.current = new maplibregl.Marker({
            color: '#ef4444',
            draggable: true,
         })
            .setLngLat([lng, lat])
            .addTo(map.current!);

         marker.current.on('dragend', () => {
            const pos = marker.current?.getLngLat();
            if (pos) {
               updateLocation(pos.lng, pos.lat);
            }
         });
      }

      updateLocation(lng, lat);
      closeSearch();
   };

   const closeSearch = () => {
      setIsSearchOpen(false);
      setSearchQuery('');
   };

   return (
      <div className={cn('flex flex-col gap-3', className)}>
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <MapPin className="size-4" />
               {selectedLocation ? (
                  <span>
                     Lng: <strong>{selectedLocation.lng.toFixed(6)}</strong>,
                     Lat: <strong>{selectedLocation.lat.toFixed(6)}</strong>
                  </span>
               ) : (
                  <span>Click on the map to select a location</span>
               )}
            </div>
            <Button
               variant="outline"
               size="sm"
               onClick={handleGetCurrentLocation}
               disabled={isLocating}
               className="gap-1.5"
            >
               <Crosshair className="size-3.5" />
               {isLocating ? 'Locating...' : 'Current Location'}
            </Button>
         </div>

         {(searchError || locationError) && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
               {searchError || locationError}
            </div>
         )}

         <div
            ref={mapContainer}
            className="relative h-100 w-full overflow-hidden rounded-lg border"
         >
            <SearchControl
               isOpen={isSearchOpen}
               query={searchQuery}
               results={searchResults}
               isSearching={isSearching}
               onOpen={() => setIsSearchOpen(true)}
               onClose={closeSearch}
               onQueryChange={setSearchQuery}
               onSelect={handleSelectResult}
            />
         </div>
      </div>
   );
}
