// Source: Google Maps Platform Code Assist
import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Target, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  Navigation,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useLanguage } from './LanguageContext';

const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDA70TWR92fdHhvY4O-SQKVtdNK7QwwDGI';

// Sacred Islamic Sanctuaries
const SACRED_PLACES = [
  {
    id: 'kaaba',
    nameEn: 'The Holy Kaaba (Masjid al-Haram)',
    nameAr: 'الكعبة المشرفة - المسجد الحرام',
    city: 'Mecca',
    lat: 21.422487,
    lng: 39.826206,
    icon: '🕋',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    ringColor: 'ring-amber-400/40',
  },
  {
    id: 'madinah',
    nameEn: "Al-Masjid an-Nabawi (The Prophet's Mosque)",
    nameAr: 'المسجد النبوي الشريف',
    city: 'Medina',
    lat: 24.4672,
    lng: 39.6112,
    icon: '🕌',
    color: 'from-emerald-500 to-teal-600',
    ringColor: 'ring-emerald-400/40',
  },
  {
    id: 'alaqsa',
    nameEn: 'Al-Aqsa Sanctuary (Bayt al-Maqdis)',
    nameAr: 'المسجد الأقصى المبارك',
    city: 'Jerusalem',
    lat: 31.7761,
    lng: 35.2358,
    icon: '✨',
    color: 'from-sky-500 to-blue-600',
    ringColor: 'ring-sky-400/40',
  },
];

const KAABA_COORDS = { lat: 21.422487, lng: 39.826206 };

/**
 * Geodesic Polyline Component
 */
function GeodesicQiblaPolyline({
  userLat,
  userLng,
  targetLat,
  targetLng,
}: {
  userLat: number;
  userLng: number;
  targetLat: number;
  targetLng: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const path = [
      { lat: userLat, lng: userLng },
      { lat: targetLat, lng: targetLng },
    ];

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#059669', // Emerald-600
      strokeOpacity: 0.9,
      strokeWeight: 4,
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
          },
          offset: '50%',
          repeat: '120px',
        },
      ],
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, userLat, userLng, targetLat, targetLng]);

  return null;
}

/**
 * Map Camera Controller
 */
function MapCameraController({
  userLat,
  userLng,
  targetLat,
  targetLng,
  triggerFit,
}: {
  userLat: number;
  userLng: number;
  targetLat: number;
  targetLng: number;
  triggerFit: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;
    if (triggerFit === 0) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: userLat, lng: userLng });
    bounds.extend({ lat: targetLat, lng: targetLng });
    for (const p of SACRED_PLACES) {
      bounds.extend({ lat: p.lat, lng: p.lng });
    }
    map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
  }, [map, triggerFit, userLat, userLng, targetLat, targetLng]);

  return null;
}

interface GoogleMapExplorerProps {
  onOpenFullQibla?: () => void;
}

export const GoogleMapExplorer: React.FC<GoogleMapExplorerProps> = ({ onOpenFullQibla }) => {
  const { language } = useLanguage();

  const [lat, setLat] = useState<number>(24.4672); // Default to Medina
  const [lng, setLng] = useState<number>(39.6112);
  const [locationName, setLocationName] = useState<string>('Medina, Saudi Arabia');
  const [mapType, setMapType] = useState<string>('hybrid');
  const [fitTrigger, setFitTrigger] = useState<number>(1);
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  // Compute Qibla bearing & distance
  useEffect(() => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_COORDS.lat * Math.PI) / 180;
    const kaabaLngRad = (KAABA_COORDS.lng * Math.PI) / 180;

    const dLng = kaabaLngRad - lngRad;
    const y = Math.sin(dLng);
    const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    setQiblaBearing(bearing);

    // Haversine distance
    const R = 6371;
    const dLat = ((KAABA_COORDS.lat - lat) * Math.PI) / 180;
    const dLon = ((KAABA_COORDS.lng - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(latRad) * Math.cos(kaabaLatRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistanceKm(R * c);
  }, [lat, lng]);

  // Request browser location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationName(language === 'ar' ? 'موقعك المكتشف تلقائياً' : 'Your Detected Location');
        setIsDetecting(false);
        setFitTrigger((prev) => prev + 1);
      },
      () => {
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Map click
  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail?.latLng) {
      const clickedLat = e.detail.latLng.lat;
      const clickedLng = e.detail.latLng.lng;
      setLat(clickedLat);
      setLng(clickedLng);
      setLocationName(
        language === 'ar'
          ? `موقع تم اختياره (${clickedLat.toFixed(2)}°, ${clickedLng.toFixed(2)}°)`
          : `Custom Point (${clickedLat.toFixed(2)}°, ${clickedLng.toFixed(2)}°)`
      );
    }
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 border border-secondary-200 dark:border-slate-800 shadow-sm space-y-4 text-left relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <Globe size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Google Maps Platform</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-850 dark:text-slate-100">
              {language === 'ar' ? 'خريطة جوجل: المعالم المقدسة واتجاه القبلة' : 'Google Map: Sacred Sanctuaries & Qibla Trajectory'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar'
                ? 'استكشف مسار القبلة الكروي الجيوديسي المباشر إلى مكة المكرمة والمعالم الإسلامية الثلاثة المقدسة.'
                : 'Explore the live Great Circle geodesic vector directly to Mecca and view the Three Sacred Islamic Sanctuaries.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Detect your GPS coordinates"
            >
              <RefreshCw size={12} className={isDetecting ? 'animate-spin' : ''} />
              <span>{language === 'ar' ? 'موقعي' : 'Locate Me'}</span>
            </button>
            <button
              onClick={() => setFitTrigger((p) => p + 1)}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Fit both your location and sacred sanctuaries into view"
            >
              <Target size={12} />
              <span>{language === 'ar' ? 'إظهار الكل' : 'Fit Sanctuaries'}</span>
            </button>
            {onOpenFullQibla && (
              <button
                onClick={onOpenFullQibla}
                className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Compass size={13} />
                <span>{language === 'ar' ? 'البوصلة الكاملة' : 'Full Qibla Compass'}</span>
                <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Map Type Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
            <span className="hidden sm:inline">{language === 'ar' ? 'نوع الخريطة:' : 'Map Style:'}</span>
            {[
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'roadmap', label: 'Roadmap' },
              { id: 'satellite', label: 'Satellite' },
              { id: 'terrain', label: 'Terrain' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setMapType(type.id)}
                className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                  mapType === type.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            💡 {language === 'ar' ? 'اضغط على أي نقطة لتحديث المسار' : 'Click on map to recalculate'}
          </span>
        </div>

        {/* Google Map Viewport with explicit CSS height (CF2 mandate) */}
        <div className="w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden relative shadow-inner border border-secondary-200 dark:border-slate-800">
          <Map
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            defaultCenter={{ lat, lng }}
            defaultZoom={4}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            onClick={handleMapClick}
            style={{ width: '100%', height: '100%' }}
          >
            {/* User Location Marker */}
            <AdvancedMarker position={{ lat, lng }} title="Your Location">
              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-7 h-7 rounded-full bg-emerald-500/40 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-500">
                    <MapPin size={16} />
                  </div>
                </div>
                <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[9px] font-bold rounded shadow-md backdrop-blur-sm whitespace-nowrap">
                  {language === 'ar' ? 'موقعك' : 'Your Location'}
                </span>
              </div>
            </AdvancedMarker>

            {/* Sacred Sanctuaries Advanced Markers */}
            {SACRED_PLACES.map((place) => (
              <AdvancedMarker
                key={place.id}
                position={{ lat: place.lat, lng: place.lng }}
                title={language === 'ar' ? place.nameAr : place.nameEn}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${place.color} text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ${place.ringColor}`}
                  >
                    <span className="text-base">{place.icon}</span>
                  </div>
                  <span className="mt-1 px-2 py-0.5 bg-slate-950/90 text-white text-[9px] font-bold rounded shadow-md backdrop-blur-sm whitespace-nowrap">
                    {language === 'ar' ? place.city : place.city}
                  </span>
                </div>
              </AdvancedMarker>
            ))}

            {/* Geodesic Flight Line */}
            <GeodesicQiblaPolyline
              userLat={lat}
              userLng={lng}
              targetLat={KAABA_COORDS.lat}
              targetLng={KAABA_COORDS.lng}
            />

            {/* Camera bounds helper */}
            <MapCameraController
              userLat={lat}
              userLng={lng}
              targetLat={KAABA_COORDS.lat}
              targetLng={KAABA_COORDS.lng}
              triggerFit={fitTrigger}
            />
          </Map>

          {/* Floating Telemetry HUD */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-secondary-200/80 dark:border-slate-700/80 shadow-md text-xs space-y-1.5 pointer-events-auto">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {language === 'ar' ? 'اتجاه القبلة والمسافة' : 'Qibla Bearing & Distance'}
              </span>
              <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                {qiblaBearing.toFixed(1)}° N
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">{language === 'ar' ? 'المسافة إلى مكة' : 'Distance to Kaaba'}</span>
                <span className="font-mono font-extrabold text-slate-800 dark:text-slate-100">
                  {Math.round(distanceKm).toLocaleString()} km
                </span>
                <span className="text-[9px] text-slate-400 font-mono ml-1">
                  ({Math.round(distanceKm * 0.621371).toLocaleString()} mi)
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">{language === 'ar' ? 'الموقع النشط' : 'Active Location'}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] block">
                  {locationName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};
