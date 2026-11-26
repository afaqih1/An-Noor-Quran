// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Navigation, 
  MapPin, 
  Sliders, 
  Info, 
  HelpCircle, 
  Smartphone, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  ArrowUp, 
  ArrowRight, 
  ShieldAlert, 
  Globe, 
  Layers, 
  LocateFixed, 
  Target, 
  Eye, 
  Map as MapIcon, 
  Maximize2 
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useLanguage } from './LanguageContext';
import { FridayPrayerTimes } from './FridayPrayerTimes';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDA70TWR92fdHhvY4O-SQKVtdNK7QwwDGI';

// Holy Kaaba in Mecca Coordinates
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

// Pre-defined global cities for fallback
const PRESET_CITIES = [
  { name: 'Mecca, Saudi Arabia', lat: 21.4225, lng: 39.8262 },
  { name: 'Medina, Saudi Arabia', lat: 24.4672, lng: 39.6112 },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'New York, United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
];

/**
 * Geodesic Polyline Component:
 * Traces the true spherical Great Circle Qibla flight path directly from user position to Mecca
 */
function GeodesicQiblaPolyline({
  userLat,
  userLng,
  kaabaLat,
  kaabaLng,
}: {
  userLat: number;
  userLng: number;
  kaabaLat: number;
  kaabaLng: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const path = [
      { lat: userLat, lng: userLng },
      { lat: kaabaLat, lng: kaabaLng },
    ];

    // Create authentic Geodesic polyline
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
  }, [map, userLat, userLng, kaabaLat, kaabaLng]);

  return null;
}

/**
 * Map Bounds & Camera Controller
 */
function MapBoundsController({
  userLat,
  userLng,
  kaabaLat,
  kaabaLng,
  fitTrigger,
}: {
  userLat: number;
  userLng: number;
  kaabaLat: number;
  kaabaLng: number;
  fitTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;
    if (fitTrigger === 0) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: userLat, lng: userLng });
    bounds.extend({ lat: kaabaLat, lng: kaabaLng });
    map.fitBounds(bounds, { top: 70, right: 70, bottom: 70, left: 70 });
  }, [map, fitTrigger, userLat, userLng, kaabaLat, kaabaLng]);

  return null;
}

export default function QiblaSection() {
  const { t, language } = useLanguage();
  
  // Coordinates State (default to Mecca as starting anchor)
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  
  // Geolocation states
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoSuccess, setGeoSuccess] = useState<boolean>(false);
  
  // Compass state
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0); // in km
  
  // Sensor Heading (real-time device orientation)
  const [heading, setHeading] = useState<number>(0); // angle from North clockwise (0 - 359)
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [sensorPermission, setSensorPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  
  // Manual alignment state (for desktops and fallback)
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [isManualMode, setIsManualMode] = useState<boolean>(true);
  
  // General helper variables
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // View Mode: 'split' (dual view), 'map' (full map), 'compass' (compass only)
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'compass'>('split');
  // Map Type: 'hybrid' | 'roadmap' | 'satellite' | 'terrain'
  const [mapType, setMapType] = useState<string>('hybrid');
  // Fit Bounds trigger count
  const [fitTrigger, setFitTrigger] = useState<number>(1);

  // Active lat/lng fallback for map rendering
  const activeLat = lat ?? 21.4225;
  const activeLng = lng ?? 39.8262;

  // Calculate Qibla bearing and Distance when lat/lng changes
  useEffect(() => {
    if (lat !== null && lng !== null) {
      // 1. Calculate Qibla bearing (Great Circle formula)
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;
      const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
      const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

      const dLng = kaabaLngRad - lngRad;

      const y = Math.sin(dLng);
      const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

      let bearing = (Math.atan2(y, x) * 180) / Math.PI;
      bearing = (bearing + 360) % 360;
      setQiblaBearing(bearing);

      // 2. Calculate Distance (Haversine formula)
      const R = 6371; // Earth radius in km
      const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
      const dLon = ((KAABA_LNG - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((KAABA_LAT * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setDistance(R * c);
    }
  }, [lat, lng]);

  // Request browser Geolocation
  const detectLocation = () => {
    setGeoLoading(true);
    setGeoError(null);
    setGeoSuccess(false);

    if (!navigator.geolocation) {
      setGeoError(
        language === 'ar'
          ? 'تحديد الموقع الجغرافي غير مدعوم في هذا المتصفح.'
          : 'Geolocation is not supported by your browser.'
      );
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        setLocationName(
          language === 'ar'
            ? 'موقعك المكتشف تلقائياً'
            : 'Your Auto-Detected Location'
        );
        setGeoSuccess(true);
        setGeoLoading(false);
        setFitTrigger((prev) => prev + 1);
      },
      (error) => {
        console.error('Error fetching location: ', error);
        let errorMsg = language === 'ar' ? 'فشل في تحديد الموقع الجغرافي.' : 'Failed to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            language === 'ar'
              ? 'تم رفض إذن الوصول إلى الموقع الجغرافي. يرجى اختيار مدينة أو تحديد الموقع من الخريطة.'
              : 'Location permission denied. Please select a city or click on the map.';
        }
        setGeoError(errorMsg);
        setGeoLoading(false);
        
        // Fallback to Medina coordinates if none selected yet
        if (lat === null) {
          selectCity(PRESET_CITIES[1]);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Select predefined preset city
  const selectCity = (city: typeof PRESET_CITIES[0]) => {
    setLat(city.lat);
    setLng(city.lng);
    setLocationName(city.name);
    setGeoSuccess(false);
    setGeoError(null);
    setFitTrigger((prev) => prev + 1);
  };

  // Interactive map click handler: set user position anywhere on the globe
  const handleMapClick = (e: MapMouseEvent) => {
    if (e.detail?.latLng) {
      const clickedLat = e.detail.latLng.lat;
      const clickedLng = e.detail.latLng.lng;
      setLat(clickedLat);
      setLng(clickedLng);
      setLocationName(
        language === 'ar'
          ? `موقع محدد على الخريطة (${clickedLat.toFixed(2)}°, ${clickedLng.toFixed(2)}°)`
          : `Map Clicked Location (${clickedLat.toFixed(2)}°, ${clickedLng.toFixed(2)}°)`
      );
      setGeoSuccess(false);
      setGeoError(null);
    }
  };

  // Listen to Device Orientation for real compass
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // 1. Check iOS specific webkitCompassHeading
      if ('webkitCompassHeading' in e) {
        const iosHeading = (e as any).webkitCompassHeading;
        if (typeof iosHeading === 'number') {
          setHeading(iosHeading);
          setIsSensorActive(true);
          setIsManualMode(false);
        }
      } 
      // 2. Check standard absolute alpha
      else if (e.absolute && e.alpha !== null) {
        const stdHeading = (360 - e.alpha) % 360;
        setHeading(stdHeading);
        setIsSensorActive(true);
        setIsManualMode(false);
      }
    };

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        setSensorPermission('default');
      } else {
        setSensorPermission('granted');
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('deviceorientationabsolute', handleOrientation);
      }
    } else {
      setSensorPermission('unsupported');
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  // Handle iOS compass sensor permission request
  const requestCompassPermission = async () => {
    const requestPermission = (DeviceOrientationEvent as any).requestPermission;
    if (typeof requestPermission === 'function') {
      try {
        const permission = await requestPermission();
        if (permission === 'granted') {
          setSensorPermission('granted');
          
          const handleOrientation = (e: DeviceOrientationEvent) => {
            if ('webkitCompassHeading' in e) {
              const iosHeading = (e as any).webkitCompassHeading;
              if (typeof iosHeading === 'number') {
                setHeading(iosHeading);
                setIsSensorActive(true);
                setIsManualMode(false);
              }
            }
          };
          window.addEventListener('deviceorientation', handleOrientation);
        } else {
          setSensorPermission('denied');
          setIsManualMode(true);
        }
      } catch (err) {
        console.error('Sensor permission request error:', err);
        setSensorPermission('denied');
        setIsManualMode(true);
      }
    } else {
      setSensorPermission('granted');
      setIsManualMode(false);
    }
  };

  // Initialize with GPS or Medina
  useEffect(() => {
    detectLocation();
  }, []);

  // Active heading value depends on mode
  const currentHeading = isManualMode ? manualHeading : heading;

  // Relative Qibla direction (pointing angle on the device screen)
  const relativeQiblaAngle = (qiblaBearing - currentHeading + 360) % 360;

  // Is aligned state (within +/- 3 degrees of target Qibla bearing)
  const isAligned = Math.abs(relativeQiblaAngle) < 3 || Math.abs(relativeQiblaAngle - 360) < 3;

  // Helper translations for Qibla layout
  const translationsLocal = {
    en: {
      title: 'Qibla Finder & Google Maps Compass',
      subtitle: 'Identify the exact direction of the Kaaba with interactive Google Maps & Geodesic Great Circle flight trajectory.',
      detectBtn: 'Detect My Location',
      gpsSuccess: 'GPS Location successfully detected!',
      presetTitle: 'Or select a major city:',
      coordsTitle: 'Current Coordinates',
      bearingTitle: 'Qibla Bearing',
      distTitle: 'Distance to Mecca',
      alignSuccess: 'PERFECTLY ALIGNED!',
      alignSuccessDesc: 'You are facing the Holy Kaaba in Mecca.',
      compassHelper: 'Locate North in your room, then use the slider below to align North (N) on the compass to the top. The golden Kaaba pointer will show the exact Qibla direction!',
      manualModeTitle: 'Manual Dial Mode (Laptop/Desktop)',
      sensorModeTitle: 'Live Compass Mode (Mobile Sensors)',
      allowSensors: 'Enable Compass Sensors',
      notSupportSensors: 'Compass sensors not active. Standard manual alignment active.',
      latitude: 'Latitude',
      longitude: 'Longitude',
      howToUse: 'How to use:',
      step1: 'Allow location services or click anywhere on the Google Map to set your custom prayer location.',
      step2: 'The green geodesic line traces the exact Great Circle flight vector pointing toward the Holy Kaaba in Mecca.',
      step3: 'On mobile, hold your phone flat like a real compass. On desktops, use the alignment dial below to face North.',
      calibrationNote: 'Calibration tip: If the compass behaves erratically, wave your mobile phone in a figure-8 motion to recalibrate the magnetometer.',
      tabSplit: 'Dual View (Map & Compass)',
      tabMap: 'Interactive Google Map',
      tabCompass: 'Compass Dial Only',
      fitBoth: 'Fit You & Kaaba',
      mapClickHint: 'Click anywhere on the map to set prayer location and trace Qibla trajectory.',
      geodesicLabel: 'Geodesic Great Circle Vector to Mecca',
    },
    ar: {
      title: 'محدد اتجاه القبلة وخريطة جوجل التفاعلية',
      subtitle: 'حدد اتجاه الكعبة المشرفة بدقة متناهية مع خريطة جوجل التفاعلية ومسار القبلة الكروي الجيوديسي.',
      detectBtn: 'تحديد موقعي التلقائي',
      gpsSuccess: 'تم تحديد موقعك الجغرافي بنجاح!',
      presetTitle: 'أو اختر مدينة رئيسية:',
      coordsTitle: 'الإحداثيات الحالية',
      bearingTitle: 'زاوية انحراف القبلة',
      distTitle: 'المسافة إلى مكة المكرمة',
      alignSuccess: 'محاذاة مثالية للقبلة!',
      alignSuccessDesc: 'أنت تتجه الآن مباشرة إلى الكعبة المشرفة في مكة المكرمة.',
      compassHelper: 'حدد الشمال في غرفتك، ثم استخدم المنزلق أدناه لتدوير البوصلة بحيث يتطابق حرف (N) مع الأعلى. سيشير مؤشر الكعبة الذهبي إلى اتجاه القبلة الدقيق!',
      manualModeTitle: 'وضع التوجيه اليدوي (للأجهزة المحمولة/المكتبية)',
      sensorModeTitle: 'وضع البوصلة المباشر (مستشعرات الهاتف)',
      allowSensors: 'تفعيل مستشعر البوصلة',
      notSupportSensors: 'مستشعر الاتجاه غير نشط حالياً. تم تفعيل التوجيه اليدوي القياسي.',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      howToUse: 'طريقة الاستخدام:',
      step1: 'اسمح للتطبيق بالوصول لموقعك أو اضغط في أي مكان على خريطة جوجل لتحديد نقطة الصلاة.',
      step2: 'الخط الأخضر الجيوديسي يرسم أقصر مسار كروي مباشر نحو الكعبة المشرفة في مكة المكرمة.',
      step3: 'على الهواتف، أمسك الهاتف مسطحاً كالبوصلة الحقيقية. على الحاسوب استخدم المنزلق لمحاذاة الشمال.',
      calibrationNote: 'ملاحظة للمعايرة: إذا كانت البوصلة غير دقيقة، قم بتحريك هاتفك المحمول على شكل رقم 8 في الهواء لمعايرة مستشعر المغناطيسية.',
      tabSplit: 'عرض مزدوج (خريطة وبوصلة)',
      tabMap: 'خريطة جوجل التفاعلية',
      tabCompass: 'قرص البوصلة فقط',
      fitBoth: 'إظهار موقعك والكعبة',
      mapClickHint: 'انقر في أي مكان على الخريطة لتحديد مكانك وحساب زاوية القبلة والمسافة فوراً.',
      geodesicLabel: 'مسار القبلة الكروي الجيوديسي المباشر إلى مكة',
    },
    am: {
      title: 'የቂብላ አቅጣጫ ጠቋሚ እና የጉግል ካርታ',
      subtitle: 'በመረጡት ወይም ባሉበት ቦታ መሰረት የካዕባን ትክክለኛ አቅጣጫ በጉግል ካርታ ይመልከቱ።',
      detectBtn: 'የእኔን ቦታ ፈልግ',
      gpsSuccess: 'የአሁኑ ቦታዎ በጂፒኤስ ተገኝቷል!',
      presetTitle: 'ወይም ትልቅ ከተማ ይምረጡ:',
      coordsTitle: 'የአሁኑ መጋጠሚያዎች',
      bearingTitle: 'የቂብላ አቅጣጫ ዲግሪ',
      distTitle: 'ወደ መካ ያለው ርቀት',
      alignSuccess: 'በትክክል ተስተካክሏል!',
      alignSuccessDesc: 'አሁን ፊትዎን ወደ ተቀደሰችው ካዕባ አዙረዋል።',
      compassHelper: 'በክፍልዎ ውስጥ ሰሜንን ይፈልጉ፣ ከዚያ ሰሜንን (N) በኮምፓሱ ላይ ወደ ላይ ለማስተካከል ከታች ያለውን ተንሸራታች ይጠቀሙ።',
      manualModeTitle: 'በእጅ ማስተካከያ ሁነታ',
      sensorModeTitle: 'የቀጥታ ኮምፓስ ሁነታ (ሞባይል)',
      allowSensors: 'ኮምፓስ ሴንሰር ፍቀድ',
      notSupportSensors: 'የኮምፓስ ሴንሰር አልተገኘም። በእጅ ማስተካከያ ሁነታ ነቅቷል።',
      latitude: 'ላቲቲዩድ',
      longitude: 'ሎንጊቲዩድ',
      howToUse: 'እንዴት መጠቀም እንደሚቻል:',
      step1: 'የአካባቢ አገልግሎት ይፍቀዱ ወይም በካርታው ላይ በማንኛውም ቦታ በመጫን ቦታዎን ይምረጡ።',
      step2: 'አረንጓዴው መስመር ወደ መካ ካዕባ የሚወስደውን ትክክለኛ የቂብላ አቅጣጫ ያሳያል።',
      step3: 'በሞባይል ላይ ስልክዎን ጠፍጣፋ አድርገው ይያዙት።',
      calibrationNote: 'ምክር፡ ስልክዎን በአየር ላይ የ8 ቁጥር ቅርጽ በማሰራት ሴንሰሩን ያስተካክሉ።',
      tabSplit: 'የተጣመረ እይታ (ካርታ እና ኮምፓስ)',
      tabMap: 'የጉግል ካርታ እይታ',
      tabCompass: 'ኮምፓስ ብቻ',
      fitBoth: 'ሁለቱንም አሳይ',
      mapClickHint: 'ቦታዎን ለመምረጥ በካርታው ላይ ይጫኑ።',
      geodesicLabel: 'ወደ መካ የሚወስደው ትክክለኛ የቂብላ መስመር',
    },
    har: {
      title: 'የቂብላ አቅጣጫ ጠቋሚ እና የጉግል ካርታ',
      subtitle: 'በመረጡት ወይም ባሉበት ቦታ መሰረት የካዕባን ትክክለኛ አቅጣጫ በጉግል ካርታ ይመልከቱ።',
      detectBtn: 'የእኔን ቦታ ፈልግ',
      gpsSuccess: 'የአሁኑ ቦታዎ በጂፒኤስ ተገኝቷል!',
      presetTitle: 'ወይም ትልቅ ከተማ ይምረጡ:',
      coordsTitle: 'የአሁኑ መጋጠሚያዎች',
      bearingTitle: 'የቂብላ አቅጣጫ ዲግሪ',
      distTitle: 'ወደ መካ ያለው ርቀት',
      alignSuccess: 'በትክክል ተስተካክሏል!',
      alignSuccessDesc: 'አሁን ፊትዎን ወደ ተቀደሰችው ካዕባ አዙረዋል።',
      compassHelper: 'በክፍልዎ ውስጥ ሰሜንን ይፈልጉ፣ ከዚያ ሰሜንን (N) በኮምፓሱ ላይ ወደ ላይ ለማስተካከል ከታች ያለውን ተንሸራታች ይጠቀሙ።',
      manualModeTitle: 'በእጅ ማስተካከያ ሁነታ',
      sensorModeTitle: 'የቀጥታ ኮምፓስ ሁነታ (ሞባይል)',
      allowSensors: 'ኮምፓስ ሴንሰር ፍቀድ',
      notSupportSensors: 'የኮምፓስ ሴንሰር አልተገኘም። በእጅ ማስተካከያ ሁነታ ነቅቷል።',
      latitude: 'ላቲቲዩድ',
      longitude: 'ሎንጊቲዩድ',
      howToUse: 'እንዴት መጠቀም እንደሚቻል:',
      step1: 'የአካባቢ አገልግሎት ይፍቀዱ ወይም በካርታው ላይ በማንኛውም ቦታ በመጫን ቦታዎን ይምረጡ።',
      step2: 'አረንጓዴው መስመር ወደ መካ ካዕባ የሚወስደውን ትክክለኛ የቂብላ አቅጣጫ ያሳያል።',
      step3: 'በሞባይል ላይ ስልክዎን ጠፍጣፋ አድርገው ይያዙት።',
      calibrationNote: 'ምክር፡ ስልክዎን በአየር ላይ የ8 ቁጥር ቅርጽ በማሰራት ሴንሰሩን ያስተካክሉ።',
      tabSplit: 'የተጣመረ እይታ (ካርታ እና ኮምፓስ)',
      tabMap: 'የጉግል ካርታ እይታ',
      tabCompass: 'ኮምፓስ ብቻ',
      fitBoth: 'ሁለቱንም አሳይ',
      mapClickHint: 'ቦታዎን ለመምረጥ በካርታው ላይ ይጫኑ።',
      geodesicLabel: 'ወደ መካ የሚወስደው ትክክለኛ የቂብላ መስመር',
    }
  };

  const currentT = translationsLocal[language as keyof typeof translationsLocal] || translationsLocal.en;

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div id="qibla-finder-section" className="space-y-8 animate-in fade-in duration-300">
        
        {/* HEADER CARD */}
        <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-sm relative overflow-hidden dark:bg-slate-900/95 dark:border-slate-800">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl dark:bg-primary-950/20" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full border border-primary-100 text-xs text-primary-700 font-semibold dark:bg-primary-950/40 dark:border-primary-900 dark:text-primary-400">
                <Compass size={13} className="animate-spin-slow text-primary-500" />
                <span>{language === 'ar' ? 'تحصين الاتجاه والمواقيت' : 'Al-Qibla Direction & Google Maps'}</span>
              </div>
              <h2 className="text-3xl font-bold font-serif text-slate-800 dark:text-slate-100">{currentT.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl text-sm leading-relaxed">
                {currentT.subtitle}
              </p>
            </div>

            {/* Quick Info & Help button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold shadow-sm transition-all dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer self-start md:self-auto"
            >
              <HelpCircle size={15} />
              <span>{currentT.howToUse}</span>
            </button>
          </div>

          {/* Dynamic Help Panel */}
          {showHelp && (
            <div className="mt-6 p-4 sm:p-5 bg-secondary-50/50 rounded-xl border border-secondary-200/60 text-slate-700 text-xs sm:text-sm space-y-3 animate-in slide-in-from-top-4 duration-300 dark:bg-slate-800/20 dark:border-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-serif text-sm">
                <Info size={16} className="text-primary-600 dark:text-secondary-400" />
                {currentT.howToUse}
              </h4>
              <ul className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 text-xs font-medium pl-1">
                <li>{currentT.step1}</li>
                <li>{currentT.step2}</li>
                <li>{currentT.step3}</li>
              </ul>
              <div className="pt-2 border-t border-dashed border-secondary-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                ⚠️ {currentT.calibrationNote}
              </div>
            </div>
          )}
        </div>

        {/* Friday Prayer Times and Schedule Section */}
        <FridayPrayerTimes />

        {/* VIEW MODE TABS */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-2xl border border-secondary-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers size={14} />
              <span>{currentT.tabSplit}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MapIcon size={14} />
              <span>{currentT.tabMap}</span>
            </button>
            <button
              onClick={() => setViewMode('compass')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                viewMode === 'compass'
                  ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Compass size={14} />
              <span>{currentT.tabCompass}</span>
            </button>
          </div>

          {/* Quick Fit Map Bounds Button */}
          {viewMode !== 'compass' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFitTrigger((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Fit both your location and the Holy Kaaba into the map viewport"
              >
                <Target size={13} />
                <span>{currentT.fitBoth}</span>
              </button>
            </div>
          )}
        </div>

        {/* INTERACTIVE GOOGLE MAP SECTION (Visible in 'map' or 'split' view) */}
        {viewMode !== 'compass' && (
          <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-secondary-200 shadow-sm space-y-4 dark:bg-slate-900/95 dark:border-slate-800 animate-in fade-in duration-300">
            {/* Map Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MapIcon size={18} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-800 dark:text-slate-100">
                    {language === 'ar' ? 'خريطة القبلة والمسار الجيوديسي' : 'Live Google Map & Geodesic Qibla Vector'}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {currentT.mapClickHint}
                  </p>
                </div>
              </div>

              {/* Map Type Buttons */}
              <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                {[
                  { id: 'hybrid', label: 'Hybrid' },
                  { id: 'roadmap', label: 'Road' },
                  { id: 'satellite', label: 'Satellite' },
                  { id: 'terrain', label: 'Terrain' },
                ].map((mt) => (
                  <button
                    key={mt.id}
                    onClick={() => setMapType(mt.id)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      mapType === mt.id
                        ? 'bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {mt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Map Container with explicit height (satisfies CF2 height collapse) */}
            <div className="w-full h-[440px] sm:h-[500px] rounded-2xl overflow-hidden relative shadow-inner border border-secondary-200 dark:border-slate-800">
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={{ lat: activeLat, lng: activeLng }}
                defaultZoom={3}
                mapTypeId={mapType}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={handleMapClick}
                style={{ width: '100%', height: '100%' }}
              >
                {/* User Location AdvancedMarker */}
                <AdvancedMarker
                  position={{ lat: activeLat, lng: activeLng }}
                  title={language === 'ar' ? 'موقعك الحالي' : 'Your Location'}
                >
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-emerald-500/40 animate-ping" />
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-emerald-500">
                        <MapPin size={18} />
                      </div>
                    </div>
                    <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[10px] font-bold rounded-md shadow-md backdrop-blur-sm whitespace-nowrap">
                      {language === 'ar' ? 'موقعك' : 'Your Location'}
                    </span>
                  </div>
                </AdvancedMarker>

                {/* Holy Kaaba AdvancedMarker */}
                <AdvancedMarker
                  position={{ lat: KAABA_LAT, lng: KAABA_LNG }}
                  title={language === 'ar' ? 'الكعبة المشرفة - مكة المكرمة' : 'The Holy Kaaba - Mecca'}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-amber-400/30 animate-pulse">
                      <span className="text-xl">🕋</span>
                    </div>
                    <span className="mt-1 px-2.5 py-0.5 bg-amber-950/90 text-amber-200 text-[10px] font-bold rounded-md shadow-md backdrop-blur-sm border border-amber-500/30 whitespace-nowrap">
                      {language === 'ar' ? 'الكعبة المشرفة' : 'Holy Kaaba (Mecca)'}
                    </span>
                  </div>
                </AdvancedMarker>

                {/* Geodesic Great Circle Line to Mecca */}
                <GeodesicQiblaPolyline
                  userLat={activeLat}
                  userLng={activeLng}
                  kaabaLat={KAABA_LAT}
                  kaabaLng={KAABA_LNG}
                />

                {/* Bounds Controller */}
                <MapBoundsController
                  userLat={activeLat}
                  userLng={activeLng}
                  kaabaLat={KAABA_LAT}
                  kaabaLng={KAABA_LNG}
                  fitTrigger={fitTrigger}
                />
              </Map>

              {/* Floating Live Telemetry HUD inside Map */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-secondary-200/80 dark:border-slate-700/80 shadow-lg text-xs space-y-2 pointer-events-auto">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] uppercase tracking-wider">
                      {currentT.geodesicLabel}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                    {qiblaBearing.toFixed(1)}°
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{currentT.distTitle}</span>
                    <span className="font-mono font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                      {Math.round(distance).toLocaleString()} km
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      ({Math.round(distance * 0.621371).toLocaleString()} mi)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">{language === 'ar' ? 'الموقع النشط' : 'Active Anchor'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate block">
                      {locationName || (language === 'ar' ? 'محدد على الخريطة' : 'Map Pin')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {activeLat.toFixed(2)}°, {activeLng.toFixed(2)}°
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TWO COLUMN GRID layout for Compass & Details */}
        <div className={`grid grid-cols-1 ${viewMode === 'map' ? 'hidden' : 'lg:grid-cols-12'} gap-8`}>
          
          {/* LEFT COLUMN: Compass Visual Display */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-secondary-200 shadow-sm flex flex-col items-center justify-center gap-6 dark:bg-slate-900/95 dark:border-slate-800">
              
              {/* COMPASS COMPONENT WRAPPER */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* Perfect Alignment Golden Outer Glow */}
                <div className={`absolute inset-0 rounded-full transition-all duration-700 ${isAligned ? 'bg-emerald-500/10 blur-2xl scale-110 animate-pulse' : 'bg-transparent blur-none'}`} />
                
                {/* Outer compass rim decoration */}
                <div className={`absolute inset-0 rounded-full border-4 transition-all duration-300 flex items-center justify-center shadow-md
                  ${isAligned 
                    ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/15 ring-8 ring-emerald-500/10' 
                    : 'border-secondary-300 dark:border-slate-700 bg-slate-50/20'}`} 
                />

                {/* ROTATING COMPASS DIAL */}
                <div 
                  className="absolute w-[92%] h-[92%] rounded-full bg-white border border-secondary-200 shadow-inner flex items-center justify-center transition-transform duration-300 ease-out dark:bg-slate-950 dark:border-slate-800"
                  style={{ transform: `rotate(${-currentHeading}deg)` }}
                >
                  {/* Compass Cardinal Points */}
                  <span className="absolute top-3.5 text-red-600 font-extrabold text-lg tracking-widest">N</span>
                  <span className="absolute right-3.5 text-slate-700 font-extrabold text-sm dark:text-slate-300">E</span>
                  <span className="absolute bottom-3.5 text-slate-700 font-extrabold text-sm dark:text-slate-300">S</span>
                  <span className="absolute left-3.5 text-slate-700 font-extrabold text-sm dark:text-slate-300">W</span>

                  {/* Sub-cardinal points */}
                  <span className="absolute top-10 right-10 text-[10px] text-slate-400 font-bold">NE</span>
                  <span className="absolute bottom-10 right-10 text-[10px] text-slate-400 font-bold">SE</span>
                  <span className="absolute bottom-10 left-10 text-[10px] text-slate-400 font-bold">SW</span>
                  <span className="absolute top-10 left-10 text-[10px] text-slate-400 font-bold">NW</span>

                  {/* Compass ticks around dial */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 opacity-60 dark:border-slate-800" />
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-0.5 h-3 bg-slate-300 dark:bg-slate-700"
                      style={{ transform: `rotate(${i * 30}deg) translateY(-118px)` }}
                    />
                  ))}

                  {/* FIXED QIBLA GOLDEN KAABA POINTER (relative to North) */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ transform: `rotate(${qiblaBearing}deg)` }}
                  >
                    {/* Arrow pointing to Qibla */}
                    <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end h-[106px] w-8">
                      {/* Golden Kaaba Icon at the tip */}
                      <div className="w-9 h-9 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full shadow-lg border border-white flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
                        <span className="text-white text-[10px] font-bold">🕋</span>
                      </div>
                      {/* Golden indicator line */}
                      <div className="w-1.5 bg-gradient-to-b from-amber-500 to-amber-300 flex-grow rounded-full shadow-sm" />
                      {/* Feather/Fin */}
                      <div className="w-3 h-4 bg-amber-400 clip-triangle" />
                    </div>
                  </div>

                  {/* Center Dial Hub */}
                  <div className="absolute w-4 h-4 bg-slate-800 rounded-full border-2 border-white shadow-md dark:bg-slate-100 dark:border-slate-900 z-10" />
                </div>

                {/* SCREEN-RELATIVE KAABA INDICATOR */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ transform: `rotate(${relativeQiblaAngle}deg)` }}
                >
                  <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <ArrowUp size={16} className={`animate-bounce ${isAligned ? 'text-emerald-500' : 'text-amber-500'}`} />
                  </div>
                </div>

              </div>

              {/* ALIGNMENT BANNER AND CURRENT HEADING DETAILS */}
              <div className="w-full text-center space-y-2 mt-2">
                <div className={`py-3 px-6 rounded-2xl border font-bold text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2
                  ${isAligned 
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30 ring-4 ring-emerald-500/20' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}`}
                >
                  {isAligned ? (
                    <>
                      <CheckCircle size={18} className="animate-bounce" />
                      <span>{currentT.alignSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Compass size={18} className="text-primary-600 dark:text-secondary-400 animate-spin-slow" />
                      <span>
                        {language === 'ar'
                          ? `انحراف البوصلة: ${Math.round(relativeQiblaAngle)}°`
                          : `Relative Angle: ${Math.round(relativeQiblaAngle)}° to Kaaba`}
                      </span>
                    </>
                  )}
                </div>

                {isAligned && (
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 animate-in fade-in">
                    ✨ {currentT.alignSuccessDesc}
                  </p>
                )}
              </div>

              {/* HEADING CONTROLS (Manual Slider vs Device Sensors) */}
              <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders size={15} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isManualMode ? currentT.manualModeTitle : currentT.sensorModeTitle}
                    </span>
                  </div>

                  {sensorPermission === 'granted' && (
                    <button
                      onClick={() => setIsManualMode(!isManualMode)}
                      className="text-[10px] font-bold text-primary-600 hover:text-primary-800 border border-primary-200 hover:border-primary-400 px-2.5 py-1 rounded-lg transition-all cursor-pointer dark:text-secondary-400 dark:border-secondary-900"
                    >
                      {isManualMode 
                        ? (language === 'ar' ? 'تفعيل البوصلة التفاعلية' : 'Switch to Live Compass') 
                        : (language === 'ar' ? 'تفعيل التدوير اليدوي' : 'Switch to Manual Slider')}
                    </button>
                  )}
                </div>

                {isManualMode ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
                      <span>{language === 'ar' ? 'محاذاة الشمال (N)' : 'Align North (N) angle'}:</span>
                      <span className="text-slate-800 dark:text-slate-200">{manualHeading}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={manualHeading}
                      onChange={(e) => setManualHeading(parseInt(e.target.value))}
                      className="w-full accent-primary-600 bg-secondary-200/80 hover:bg-secondary-300 rounded-lg h-1.5 appearance-none cursor-pointer focus:outline-none transition-all"
                    />
                    <p className="text-[10px] text-slate-500 leading-relaxed dark:text-slate-400 font-medium">
                      💡 {currentT.compassHelper}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 dark:bg-slate-800/30 dark:border-slate-800">
                    <Smartphone className="text-emerald-500 animate-pulse shrink-0" size={18} />
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-normal">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                        {language === 'ar' ? 'مستشعرات البوصلة نشطة' : 'Sensors fully active'}
                      </span>
                      {language === 'ar' 
                        ? 'امسك جهازك بشكل مسطح بالكامل وقم بالتدوير لتوجيه الكعبة مباشرة.' 
                        : 'Hold your phone flat and rotate physically to face Mecca.'}
                    </div>
                  </div>
                )}

                {/* Sensor Permission Activator for iOS devices inside iframe */}
                {sensorPermission === 'default' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex flex-col gap-2.5 dark:bg-amber-950/20 dark:border-amber-900">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={15} className="text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        {language === 'ar' ? 'جهاز ذكي مكتشف' : 'Mobile Compass Device Detected'}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-700 leading-relaxed dark:text-amber-400">
                      {language === 'ar' 
                        ? 'للحصول على بوصلة مباشرة وحساب اتجاه القبلة التفاعلي، يرجى تفعيل إذن الوصول إلى المستشعرات.' 
                        : 'To experience real-time interactive compass alignment, grant permission to use device orientation sensors.'}
                    </p>
                    <button
                      onClick={requestCompassPermission}
                      className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer self-start"
                    >
                      {currentT.allowSensors}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Location search, details and presets */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* GEOLOCATION CONTROL CARD */}
            <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-secondary-200 shadow-sm space-y-5 dark:bg-slate-900/95 dark:border-slate-800">
              <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MapPin size={18} className="text-primary-600 dark:text-secondary-400" />
                <span>{language === 'ar' ? 'تحديد الموقع والإحداثيات' : 'GPS Location & Presets'}</span>
              </h3>

              {/* GPS Detection Button */}
              <button
                onClick={detectLocation}
                disabled={geoLoading}
                className={`w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none`}
              >
                <RefreshCw size={14} className={geoLoading ? 'animate-spin' : ''} />
                <span>{currentT.detectBtn}</span>
              </button>

              {/* GPS Feedback Banners */}
              {geoSuccess && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/50 flex items-center gap-2 text-xs text-emerald-800 font-semibold dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-300">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <span>{currentT.gpsSuccess}</span>
                </div>
              )}

              {geoError && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/50 flex items-start gap-2 text-xs text-rose-800 font-medium dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-300">
                  <ShieldAlert size={15} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{geoError}</span>
                </div>
              )}

              {/* PRESETS SELECTION LIST */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {currentT.presetTitle}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {PRESET_CITIES.map((city, idx) => {
                    const isSelected = city.name === locationName || (Math.abs((city.lat) - (lat || 0)) < 0.01 && Math.abs((city.lng) - (lng || 0)) < 0.01);
                    return (
                      <button
                        key={idx}
                        onClick={() => selectCity(city)}
                        className={`px-3 py-2 rounded-xl text-xs text-left border cursor-pointer font-medium transition-all flex items-center justify-between group
                          ${isSelected 
                            ? 'bg-primary-50 border-primary-300 text-primary-800 dark:bg-primary-950/30 dark:border-primary-900 dark:text-primary-300 font-bold shadow-inner' 
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                      >
                        <span className="truncate">{city.name.split(',')[0]}</span>
                        <ArrowRight size={11} className={`text-slate-400 group-hover:translate-x-0.5 transition-transform ${isSelected ? 'text-primary-600' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* CALCULATED DATA OUTPUT DETAILS */}
            {lat !== null && lng !== null && (
              <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-7 rounded-2xl border border-secondary-200 shadow-sm space-y-4 dark:bg-slate-900/95 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-dashed border-secondary-200 dark:border-slate-800 pb-3">
                  <Globe size={18} className="text-amber-500" />
                  <span>{language === 'ar' ? 'النتائج الجغرافية والمحاسبة' : 'Navigation Calculations'}</span>
                </h3>

                {/* Data Rows */}
                <div className="space-y-3">
                  
                  {/* Active City Name */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">{language === 'ar' ? 'الموقع النشط' : 'Active Location'}:</span>
                    <span className="font-serif font-bold text-slate-800 dark:text-slate-200 bg-secondary-100/30 dark:bg-slate-800/40 px-2.5 py-1 rounded-lg">
                      {locationName || (language === 'ar' ? 'إحداثيات مخصصة' : 'Custom Coordinates')}
                    </span>
                  </div>

                  {/* Coords details */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {currentT.coordsTitle}
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">{currentT.latitude}</span>
                        <span>{lat.toFixed(6)}°</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">{currentT.longitude}</span>
                        <span>{lng.toFixed(6)}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Bearing angle */}
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">{currentT.bearingTitle}:</span>
                    <span className="font-mono font-extrabold text-sm text-primary-700 dark:text-primary-400 bg-primary-100/30 dark:bg-primary-950/40 px-2.5 py-1 rounded-lg">
                      {qiblaBearing.toFixed(2)}° N
                    </span>
                  </div>

                  {/* Geodesic Distance */}
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">{currentT.distTitle}:</span>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg block">
                        {Math.round(distance).toLocaleString()} km
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1 font-mono">
                        ({Math.round(distance * 0.621371).toLocaleString()} miles)
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </APIProvider>
  );
}
