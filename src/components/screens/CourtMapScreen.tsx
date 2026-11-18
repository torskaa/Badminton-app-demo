/// <reference types="google.maps" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Navigation,
  Plus,
  Minus,
  Star,
  Calendar,
  Zap,
  ArrowLeft,
  X,
  RotateCw,
  WifiOff,
  ExternalLink,
  MapPin,
  Loader2,
} from 'lucide-react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';
import { playSelectSound } from '../../utils/retroAudio';
import {
  CACHE_KEYS,
  CourtMapCacheData,
  formatCacheTimestamp,
  readCache,
  writeCache,
} from '../../utils/offlineCache';
import {
  BANGKOK_DEFAULT_CENTER,
  calculateHaversineKm,
  getGoogleMapsDirectionsUrl,
} from '../../utils/geoUtils';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

interface PartnerCourtPin {
  kind: 'partner';
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviews: number;
  distanceKm: number;
  location: string;
  slotsAvailableToday: number;
  hasParking: boolean;
  hasShower: boolean;
  hasEvCharging: boolean;
  hasRacketRental: boolean;
  isBookable: boolean;
  imageUrl: string;
  courtFacility: CourtFacility;
}

interface LivePlacePin {
  kind: 'places';
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  reviews?: number;
  isOpenNow?: boolean;
  distanceKm: number;
}

type SelectedPin = PartnerCourtPin | LivePlacePin;

interface MapCameraControllerProps {
  panRequest: { lat: number; lng: number; zoom?: number; seq: number } | null;
  zoomDeltaRequest: { delta: number; seq: number } | null;
  placesSearchTrigger: { query: string; center: { lat: number; lng: number }; seq: number } | null;
  onPlacesResult: (places: LivePlacePin[]) => void;
  onPlacesLoading: (loading: boolean) => void;
  onToast: (msg: string) => void;
  isThai: boolean;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({
  panRequest,
  zoomDeltaRequest,
  placesSearchTrigger,
  onPlacesResult,
  onPlacesLoading,
  onToast,
  isThai,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  // Pan / zoom smoothly when user taps a pin, chip, or GPS recenter button
  useEffect(() => {
    if (!map || !panRequest) return;
    map.panTo({ lat: panRequest.lat, lng: panRequest.lng });
    if (typeof panRequest.zoom === 'number') {
      map.setZoom(panRequest.zoom);
    }
  }, [map, panRequest]);

  // Handle + / - zoom buttons
  useEffect(() => {
    if (!map || !zoomDeltaRequest) return;
    const current = map.getZoom() ?? 12;
    const next = Math.max(5, Math.min(20, current + zoomDeltaRequest.delta));
    map.setZoom(next);
  }, [map, zoomDeltaRequest]);

  // On-demand Google Places API (New) text search — ONLY triggered by explicit user search/button
  useEffect(() => {
    if (!placesSearchTrigger || !placesLib) return;

    let cancelled = false;
    const runSearch = async () => {
      onPlacesLoading(true);
      try {
        const PlaceClass = placesLib.Place;
        if (!PlaceClass || typeof PlaceClass.searchByText !== 'function') {
          onPlacesLoading(false);
          return;
        }

        const cleanQuery = placesSearchTrigger.query.trim();
        const textQuery = cleanQuery
          ? cleanQuery.toLowerCase().includes('badminton') || cleanQuery.includes('แบด')
            ? cleanQuery
            : `${cleanQuery} badminton court`
          : isThai
            ? 'สนามแบดมินตัน'
            : 'badminton court';

        const response = await PlaceClass.searchByText({
          textQuery,
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'regularOpeningHours',
          ],
          locationBias: {
            center: placesSearchTrigger.center,
            radius: 15000,
          },
          maxResultCount: 8,
        });

        if (cancelled) return;

        const rawPlaces = response?.places ?? [];
        const mapped: LivePlacePin[] = [];

        for (const p of rawPlaces) {
          if (!p?.location) continue;
          const lat = typeof p.location.lat === 'function' ? p.location.lat() : Number(p.location.lat);
          const lng = typeof p.location.lng === 'function' ? p.location.lng() : Number(p.location.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

          const distanceKm = calculateHaversineKm(placesSearchTrigger.center, { lat, lng });
          mapped.push({
            kind: 'places',
            id: `place_${p.id || `${lat}_${lng}`}`,
            name: p.displayName || (isThai ? 'สนามแบดมินตัน' : 'Badminton Venue'),
            lat,
            lng,
            address: p.formattedAddress || '',
            rating: typeof p.rating === 'number' ? p.rating : undefined,
            reviews: typeof p.userRatingCount === 'number' ? p.userRatingCount : undefined,
            isOpenNow: p.regularOpeningHours?.periods ? true : undefined,
            distanceKm,
          });
        }

        mapped.sort((a, b) => a.distanceKm - b.distanceKm);
        onPlacesResult(mapped);

        if (mapped.length > 0 && map) {
          map.panTo({ lat: mapped[0].lat, lng: mapped[0].lng });
          map.setZoom(13);
          onToast(
            isThai
              ? `พบสนามจริงใกล้คุณ ${mapped.length} แห่งจาก Google Maps`
              : `Found ${mapped.length} real venues from Google Maps`
          );
        } else {
          onToast(
            isThai
              ? 'ไม่พบสถานที่เพิ่มเติมจากคำค้นนี้'
              : 'No additional Google Maps places matched'
          );
        }
      } catch (err: any) {
        if (cancelled) return;
        const msg = String(err?.message || err || '');
        const status = String(err?.status || err?.code || '');
        if (
          status === 'OVER_QUERY_LIMIT' ||
          status === 'RESOURCE_EXHAUSTED' ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('429') ||
          msg.toLowerCase().includes('quota')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onToast(
          isThai
            ? 'ค้นหาจาก Google Places ไม่สำเร็จ กำลังแสดงสนามพันธมิตร'
            : 'Places lookup unavailable; showing partner courts'
        );
      } finally {
        if (!cancelled) {
          onPlacesLoading(false);
        }
      }
    };

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [placesSearchTrigger, placesLib, map, isThai, onPlacesLoading, onPlacesResult, onToast]);

  return null;
};

export const CourtMapScreen: React.FC = () => {
  const {
    courts,
    setSelectedCourt,
    updateBooking,
    navigateTo,
    goBack,
    t,
    simulateDataFetch,
    isOnline,
    lastSyncedAt,
    refreshOfflineCache,
    language,
    userLocation,
    gpsPermissionState,
    requestLiveLocation,
  } = useApp();

  const isThai = language === 'th';

  const initialMapCache = useMemo(() => readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP), []);

  const [searchQuery, setSearchQuery] = useState(() => initialMapCache?.searchQuery ?? '');
  const [activeFilter, setActiveFilter] = useState<string | null>(() => initialMapCache?.activeFilter ?? null);
  const [showPricePerHour, setShowPricePerHour] = useState(() => initialMapCache?.showPricePerHour ?? true);
  const [onlyBookable, setOnlyBookable] = useState(() => initialMapCache?.onlyBookable ?? false);
  const [selectedPinId, setSelectedPinId] = useState<string>(
    () => initialMapCache?.selectedCourtId ?? courts[0]?.id ?? 'court_1'
  );
  const [showToast, setShowToast] = useState<string | null>(null);

  // Ephemeral Google Places search results (held in React state only — never persisted to cache/storage)
  const [livePlaces, setLivePlaces] = useState<LivePlacePin[]>([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  // Imperative camera / Places requests for MapCameraController
  const [panRequest, setPanRequest] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    seq: number;
  } | null>(null);
  const [zoomDeltaRequest, setZoomDeltaRequest] = useState<{ delta: number; seq: number } | null>(null);
  const [fallbackZoom, setFallbackZoom] = useState<number>(1);
  const [placesSearchTrigger, setPlacesSearchTrigger] = useState<{
    query: string;
    center: { lat: number; lng: number };
    seq: number;
  } | null>(null);

  // Bottom sheet state
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'full'>(
    () => initialMapCache?.sheetState ?? 'peek'
  );
  const [sheetDragDeltaY, setSheetDragDeltaY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartYRef = useRef(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const showTemporaryToast = useCallback((msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Persist partner court filter & UI state to offlineCache (NEVER Google Places results)
  useEffect(() => {
    const existing = readCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP);
    writeCache<CourtMapCacheData>(CACHE_KEYS.COURT_MAP, {
      courts: courts.length > 0 ? courts : (existing?.courts ?? []),
      selectedCourtId: selectedPinId.startsWith('place_') ? (existing?.selectedCourtId ?? 'court_1') : selectedPinId,
      activeFilter,
      searchQuery,
      onlyBookable,
      showPricePerHour,
      sheetState,
      pan: existing?.pan ?? { x: 0, y: 0 },
      zoom: existing?.zoom ?? 12,
      lastSyncedAt: isOnline ? Date.now() : (existing?.lastSyncedAt || Date.now()),
    });
  }, [courts, selectedPinId, activeFilter, searchQuery, onlyBookable, showPricePerHour, sheetState, isOnline]);

  const filterOptions = [
    { id: 'parking', label: t.filterParking || (isThai ? 'ที่จอดรถ' : 'Parking') },
    { id: 'shower', label: t.filterShower || (isThai ? 'ห้องอาบน้ำ' : 'Shower') },
    { id: 'ev', label: t.filterEv || (isThai ? 'จุดชาร์จ EV' : 'EV Charging') },
    { id: 'rental', label: t.filterRental || (isThai ? 'เช่าไม้แบด' : 'Racket Rental') },
  ];

  // Partner courts mapped to real lat/lng & live distanceKm sorted nearest-first by AppContext
  const partnerPins: PartnerCourtPin[] = useMemo(() => {
    return courts.map((court) => ({
      kind: 'partner',
      id: court.id,
      name: court.name,
      lat: court.latitude ?? BANGKOK_DEFAULT_CENTER.lat,
      lng: court.longitude ?? BANGKOK_DEFAULT_CENTER.lng,
      price: court.pricePerHour,
      rating: court.rating,
      reviews: court.reviewCount,
      distanceKm: court.distanceKm,
      location: court.location,
      slotsAvailableToday: court.slotsAvailableToday,
      hasParking: Boolean(court.hasParking),
      hasShower: Boolean(court.hasShower),
      hasEvCharging: Boolean(court.hasEvCharging),
      hasRacketRental: Boolean(court.hasRacketRental),
      isBookable: court.isBookable !== false,
      imageUrl: court.imageUrl,
      courtFacility: court,
    }));
  }, [courts]);

  const filteredPartnerPins = useMemo(() => {
    return partnerPins.filter((pin) => {
      if (activeFilter === 'parking' && !pin.hasParking) return false;
      if (activeFilter === 'shower' && !pin.hasShower) return false;
      if (activeFilter === 'ev' && !pin.hasEvCharging) return false;
      if (activeFilter === 'rental' && !pin.hasRacketRental) return false;
      if (onlyBookable && (!pin.isBookable || pin.slotsAvailableToday === 0)) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          pin.name.toLowerCase().includes(query) ||
          pin.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [partnerPins, activeFilter, onlyBookable, searchQuery]);

  const allSelectablePins: SelectedPin[] = useMemo(
    () => [...filteredPartnerPins, ...livePlaces],
    [filteredPartnerPins, livePlaces]
  );

  const selectedPin: SelectedPin | null = useMemo(() => {
    return (
      allSelectablePins.find((p) => p.id === selectedPinId) ||
      partnerPins.find((p) => p.id === selectedPinId) ||
      filteredPartnerPins[0] ||
      partnerPins[0] ||
      null
    );
  }, [allSelectablePins, partnerPins, filteredPartnerPins, selectedPinId]);

  const closestPartnerPin = partnerPins[0] || null;

  const handleBookCourt = (pin: PartnerCourtPin) => {
    playSelectSound();
    setSelectedCourt(pin.courtFacility);
    updateBooking({ court: pin.courtFacility, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  const handlePinSelect = (pin: SelectedPin) => {
    playSelectSound();
    setSelectedPinId(pin.id);
    setPanRequest({
      lat: pin.lat,
      lng: pin.lng,
      zoom: 14,
      seq: Date.now(),
    });
    setTimeout(() => {
      const cardEl = document.getElementById(`court-card-${pin.id}`);
      if (cardEl && listContainerRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleRecenterGps = async () => {
    playSelectSound();
    showTemporaryToast(isThai ? 'กำลังดึงพิกัด GPS ปัจจุบัน...' : 'Locating live GPS...');
    const liveLoc = await requestLiveLocation();
    if (liveLoc) {
      setPanRequest({
        lat: liveLoc.lat,
        lng: liveLoc.lng,
        zoom: 14,
        seq: Date.now(),
      });
      showTemporaryToast(
        isThai
          ? `📍 GPS สดแม่นยำ ±${liveLoc.accuracyM ?? 20} ม.`
          : `📍 Live GPS locked (±${liveLoc.accuracyM ?? 20}m)`
      );
    } else {
      setPanRequest({
        lat: userLocation.lat,
        lng: userLocation.lng,
        zoom: 13,
        seq: Date.now(),
      });
      showTemporaryToast(
        gpsPermissionState === 'denied'
          ? isThai
            ? 'กรุณาอนุญาตการเข้าถึงตำแหน่งในเบราว์เซอร์'
            : 'Please enable location access in browser settings'
          : isThai
            ? 'ใช้พิกัดกลางกรุงเทพฯ ชั่วคราว'
            : 'Centered on Bangkok default area'
      );
    }
  };

  const handleZoomIn = () => {
    playSelectSound();
    setZoomDeltaRequest({ delta: 1, seq: Date.now() });
    setFallbackZoom((z) => Math.min(1.5, Number((z + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    playSelectSound();
    setZoomDeltaRequest({ delta: -1, seq: Date.now() });
    setFallbackZoom((z) => Math.max(0.8, Number((z - 0.15).toFixed(2))));
  };

  const handleTriggerGooglePlacesSearch = () => {
    playSelectSound();
    if (!isOnline || !MAPS_API_KEY) {
      showTemporaryToast(
        isThai
          ? 'โหมดออฟไลน์: แสดงสนามพันธมิตรจากแคช'
          : 'Offline mode: showing cached partner courts'
      );
      return;
    }
    setPlacesSearchTrigger({
      query: searchQuery,
      center: { lat: userLocation.lat, lng: userLocation.lng },
      seq: Date.now(),
    });
  };

  // Bottom sheet drag handlers
  const handleSheetTouchStart = (e: React.TouchEvent) => {
    setIsDraggingSheet(true);
    dragStartYRef.current = e.touches[0].clientY;
    setSheetDragDeltaY(0);
  };
  const handleSheetTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSheet) return;
    setSheetDragDeltaY(e.touches[0].clientY - dragStartYRef.current);
  };
  const handleSheetTouchEnd = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    const deltaY = sheetDragDeltaY;
    setSheetDragDeltaY(0);
    if (deltaY < -40) {
      if (sheetState === 'peek') setSheetState(deltaY < -120 ? 'full' : 'half');
      else if (sheetState === 'half') setSheetState('full');
    } else if (deltaY > 40) {
      if (sheetState === 'full') setSheetState(deltaY > 120 ? 'peek' : 'half');
      else if (sheetState === 'half') setSheetState('peek');
    }
  };
  const handleSheetMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSheet(true);
    dragStartYRef.current = e.clientY;
    setSheetDragDeltaY(0);
  };
  const handleSheetMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSheet) return;
    setSheetDragDeltaY(e.clientY - dragStartYRef.current);
  };
  const handleSheetMouseUp = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    const deltaY = sheetDragDeltaY;
    setSheetDragDeltaY(0);
    if (deltaY < -40) {
      if (sheetState === 'peek') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    } else if (deltaY > 40) {
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('peek');
    }
  };
  const toggleSheetState = () => {
    playSelectSound();
    if (sheetState === 'peek') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('peek');
  };
  const getSheetHeightClass = () => {
    switch (sheetState) {
      case 'peek':
        return 'h-[148px]';
      case 'half':
        return 'h-[48vh]';
      case 'full':
        return 'h-[82vh]';
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col relative bg-[#e8f3fc] text-[#000000] overflow-hidden select-none">
      {/* 1. Live Google Maps Canvas */}
      <div className="absolute inset-0 w-full h-full">
        {MAPS_API_KEY && isOnline ? (
          <APIProvider
            apiKey={MAPS_API_KEY}
            libraries={['marker', 'places']}
            language={isThai ? 'th' : 'en'}
            region="TH"
          >
            <GoogleMap
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI
              clickableIcons={false}
              style={{ width: '100%', height: '100%' }}
            >
              <MapCameraController
                panRequest={panRequest}
                zoomDeltaRequest={zoomDeltaRequest}
                placesSearchTrigger={placesSearchTrigger}
                onPlacesResult={setLivePlaces}
                onPlacesLoading={setIsSearchingPlaces}
                onToast={showTemporaryToast}
                isThai={isThai}
              />

              {/* Real User GPS Marker */}
              <AdvancedMarker
                position={{ lat: userLocation.lat, lng: userLocation.lng }}
                zIndex={1500}
                title={userLocation.isLiveGps ? (isThai ? 'ตำแหน่ง GPS ของคุณ' : 'Your Live GPS') : 'Bangkok Center'}
              >
                <div className="relative flex items-center justify-center pointer-events-none">
                  <span className="absolute w-9 h-9 rounded-full bg-[#2563eb]/25 animate-ping" />
                  <span className="w-5 h-5 rounded-full bg-[#2563eb] border-2 border-[#ffffff] shadow-md flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#ffffff]" />
                  </span>
                </div>
              </AdvancedMarker>

              {/* SmashAI Partner Court Markers */}
              {filteredPartnerPins.map((pin) => {
                const isSelected = selectedPin?.id === pin.id;
                return (
                  <AdvancedMarker
                    key={pin.id}
                    position={{ lat: pin.lat, lng: pin.lng }}
                    zIndex={isSelected ? 1200 : 100}
                    onClick={() => handlePinSelect(pin)}
                  >
                    <div className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105">
                      {showPricePerHour && (
                        <div
                          className={`mb-1 px-2 py-0.5 rounded-[1600px] border text-[10px] font-black shadow-md whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#000000] text-[#e85729] border-[#e85729]'
                              : 'bg-[#000000] text-[#ffffff] border-[#000000]'
                          }`}
                        >
                          ฿{pin.price}
                          <span className="ml-1 text-[9px] font-bold text-[#7cd7a0]">
                            · {pin.slotsAvailableToday}
                          </span>
                        </div>
                      )}
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-[#000000] shadow-md flex items-center justify-center text-sm ${
                          isSelected ? 'bg-[#e85729] scale-110' : 'bg-[#7cd7a0]'
                        }`}
                      >
                        🏸
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {/* Ephemeral Google Places Live Discovered Markers */}
              {livePlaces.map((place) => {
                const isSelected = selectedPin?.id === place.id;
                return (
                  <AdvancedMarker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    zIndex={isSelected ? 1150 : 90}
                    onClick={() => handlePinSelect(place)}
                  >
                    <div className="flex flex-col items-center cursor-pointer">
                      <div
                        className={`w-7 h-7 rounded-full border-2 border-[#000000] shadow-md flex items-center justify-center ${
                          isSelected ? 'bg-[#000000] text-[#ffffff] scale-110' : 'bg-[#ffffff] text-[#e85729]'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </GoogleMap>
          </APIProvider>
        ) : (
          (() => {
            // Interactive SmashAI CI Bangkok Coordinate Map (used automatically when offline or Google Maps key is unset)
            const allPoints = [
              ...filteredPartnerPins.map((p) => ({ lat: p.lat, lng: p.lng })),
              { lat: userLocation.lat, lng: userLocation.lng },
            ];
            const lats = allPoints.map((p) => p.lat);
            const lngs = allPoints.map((p) => p.lng);
            const minLat = Math.min(...lats) - 0.03;
            const maxLat = Math.max(...lats) + 0.03;
            const minLng = Math.min(...lngs) - 0.03;
            const maxLng = Math.max(...lngs) + 0.03;
            const latSpan = Math.max(0.04, maxLat - minLat);
            const lngSpan = Math.max(0.04, maxLng - minLng);

            const toScreenPct = (lat: number, lng: number) => {
              const x = 14 + ((lng - minLng) / lngSpan) * 72;
              const y = 30 + ((maxLat - lat) / latSpan) * 44;
              return { x, y };
            };

            const userPos = toScreenPct(userLocation.lat, userLocation.lng);

            return (
              <div className="relative w-full h-full bg-[#eef5eb] overflow-hidden">
                {/* Architectural Bangkok Road Grid & Chao Phraya River SVG */}
                <div
                  className="absolute inset-0 transition-transform duration-300 origin-center"
                  style={{ transform: `scale(${fallbackZoom})` }}
                >
                  <svg
                    className="w-full h-full opacity-90"
                    viewBox="0 0 400 720"
                    preserveAspectRatio="xMidYMid slice"
                    aria-hidden="true"
                  >
                    {/* Soft green park blocks */}
                    <rect x="45" y="190" width="68" height="44" rx="10" fill="#d9eed7" />
                    <rect x="260" y="340" width="76" height="58" rx="12" fill="#d9eed7" />
                    <rect x="145" y="450" width="60" height="42" rx="10" fill="#d9eed7" />

                    {/* Chao Phraya River curve */}
                    <path
                      d="M 85 0 C 95 140, 50 250, 95 380 C 130 480, 75 590, 110 720"
                      fill="none"
                      stroke="#cde4f0"
                      strokeWidth="22"
                      strokeLinecap="round"
                    />

                    {/* Expressways & Major Roads */}
                    <path d="M 0 240 L 400 220" stroke="#ffffff" strokeWidth="7" />
                    <path d="M 0 365 L 400 390" stroke="#ffffff" strokeWidth="8" />
                    <path d="M 0 490 L 400 470" stroke="#ffffff" strokeWidth="6" />
                    <path d="M 185 0 L 210 720" stroke="#ffffff" strokeWidth="8" />
                    <path d="M 305 0 L 285 720" stroke="#ffffff" strokeWidth="6" />
                    <path d="M 110 150 L 365 560" stroke="#e2ece0" strokeWidth="4" strokeDasharray="6 6" />
                  </svg>

                  {/* User Live GPS Marker */}
                  <div
                    style={{ left: `${userPos.x}%`, top: `${userPos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-9 h-9 rounded-full bg-[#2563eb]/25 animate-ping" />
                      <span className="w-4 h-4 rounded-full bg-[#2563eb] border-2 border-[#ffffff] shadow-md flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffffff]" />
                      </span>
                    </div>
                  </div>

                  {/* Interactive Partner Court Markers */}
                  {filteredPartnerPins.map((pin) => {
                    const pos = toScreenPct(pin.lat, pin.lng);
                    const isSelected = selectedPin?.id === pin.id;
                    return (
                      <button
                        key={pin.id}
                        type="button"
                        onClick={() => handlePinSelect(pin)}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        className={`no-doodle absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform hover:scale-105 ${
                          isSelected ? 'z-30 scale-110' : 'z-20'
                        }`}
                      >
                        {showPricePerHour && (
                          <div
                            className={`mb-1 px-2 py-0.5 rounded-full border text-[10px] font-bold shadow-sm whitespace-nowrap ${
                              isSelected
                                ? 'bg-[#004d2c] text-[#ffffff] border-[#004d2c]'
                                : 'bg-[#ffffff] text-[#142608] border-[#d4dfd0]'
                            }`}
                          >
                            ฿{pin.price}
                            <span
                              className={`ml-1 text-[9px] font-semibold ${
                                isSelected ? 'text-[#7cd7a0]' : 'text-[#15803d]'
                              }`}
                            >
                              · {pin.slotsAvailableToday}
                            </span>
                          </div>
                        )}
                        <div
                          className={`w-8 h-8 rounded-full border-2 shadow-md flex items-center justify-center text-sm ${
                            isSelected
                              ? 'bg-[#e85729] border-[#ffffff]'
                              : 'bg-[#7cd7a0] border-[#004d2c]'
                          }`}
                        >
                          🏸
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Subtle Map Engine Indicator Pill */}
                <div className="absolute left-4 top-[184px] z-10 px-2.5 py-1 rounded-full bg-[#ffffff]/90 border border-[#d4dfd0] text-[10px] font-semibold text-[#5c6f5e] flex items-center gap-1.5 shadow-2xs pointer-events-none">
                  {!isOnline ? (
                    <>
                      <WifiOff className="w-3 h-3 text-[#e85729]" />
                      <span>{isThai ? 'แผนที่ออฟไลน์ (พิกัดจริง)' : 'Offline Vector Map'}</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 text-[#15803d]" />
                      <span>{isThai ? 'แผนที่สนาม SmashAI (พิกัด GPS จริง)' : 'SmashAI Live Coordinate Map'}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* 2. Top Profile-Style Bar & Floating Search Header */}
      <div className="relative z-20 app-header-safe px-5 space-y-2 pointer-events-none">
        <div className="flex items-center justify-between gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              goBack();
            }}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff]/95 border border-[#d4dfd0] hover:border-[#2d4d14] backdrop-blur-md shadow-sm flex items-center justify-center text-[#142608] active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={isThai ? 'ย้อนกลับ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <div className="px-4 py-1.5 rounded-full bg-[#ffffff]/95 border border-[#d4dfd0] backdrop-blur-md shadow-sm min-w-0 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                userLocation.isLiveGps ? 'bg-[#15803d] animate-pulse' : 'bg-[#e85729]'
              }`}
            />
            <h1 className="text-[13px] font-semibold text-[#142608] tracking-tight leading-tight truncate text-center">
              {isThai ? 'แผนที่สนามเรียลไทม์' : 'Live Court Map'}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              if (!isOnline) {
                showTemporaryToast(
                  isThai
                    ? `กำลังใช้ข้อมูลออฟไลน์ (อัปเดต ${formatCacheTimestamp(lastSyncedAt, 'th')})`
                    : `Using cached court map (Synced ${formatCacheTimestamp(lastSyncedAt, 'en')})`
                );
                return;
              }
              refreshOfflineCache();
              simulateDataFetch(400);
              showTemporaryToast(isThai ? 'รีเฟรชข้อมูลสนามและเวลาว่างแล้ว' : 'Refreshed live slots');
            }}
            className="no-doodle w-11 h-11 rounded-full bg-[#ffffff]/95 border border-[#d4dfd0] hover:border-[#2d4d14] backdrop-blur-md shadow-sm flex items-center justify-center text-[#142608] active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label={isThai ? 'รีเฟรชสนาม' : 'Refresh courts'}
          >
            <RotateCw className="w-4 h-4 stroke-[1.9]" />
          </button>
        </div>

        {/* Search Input Box (Enter triggers Google Places search on demand) */}
        <div className="bg-[#ffffff]/95 border border-[#d4dfd0] focus-within:border-[#2d4d14] backdrop-blur-md rounded-full px-3.5 py-2 shadow-sm flex items-center justify-between gap-2 pointer-events-auto transition-colors">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#71717a] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTriggerGooglePlacesSearch();
                }
              }}
              placeholder={t.searchMap || (isThai ? 'ค้นหาสนามแบดมินตัน...' : 'Search badminton courts...')}
              className="w-full bg-transparent text-xs font-medium text-[#111111] placeholder:text-[#71717a] outline-none truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="no-doodle text-[#71717a] hover:text-[#111111] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSheetState}
            className="no-doodle w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#111111] hover:bg-[#e5e7eb] transition-colors cursor-pointer shrink-0"
            title={isThai ? 'ย่อ/ขยายรายการสนาม' : 'Expand / Collapse List'}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                sheetState !== 'peek' ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Action & Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 pointer-events-auto">
          <button
            type="button"
            disabled={isSearchingPlaces}
            onClick={handleTriggerGooglePlacesSearch}
            className="px-3 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold hover:bg-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-xs disabled:opacity-60"
          >
            {isSearchingPlaces ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <MapPin className="w-3 h-3 text-[#7cd7a0]" />
            )}
            <span>{isThai ? 'ค้นหาสนามจริง (Google Places)' : 'Search Google Places'}</span>
          </button>

          {closestPartnerPin && (
            <button
              type="button"
              onClick={() => {
                handlePinSelect(closestPartnerPin);
                showTemporaryToast(
                  isThai
                    ? `ใกล้สุด: ${closestPartnerPin.name} (${closestPartnerPin.distanceKm} กม.)`
                    : `Closest: ${closestPartnerPin.name} (${closestPartnerPin.distanceKm} km)`
                );
              }}
              className="px-2.5 py-1 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[10px] font-black text-[#000000] hover:bg-[#f4f8fb] transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 shadow-xs"
            >
              <span>
                {isThai
                  ? `⚡ ใกล้สุด (${closestPartnerPin.distanceKm} กม.)`
                  : `⚡ Closest (${closestPartnerPin.distanceKm} km)`}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setShowPricePerHour(!showPricePerHour);
            }}
            className={`px-2.5 py-1 rounded-[1600px] text-[10px] font-bold border border-[#000000] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
              showPricePerHour ? 'bg-[#e85729] text-[#000000]' : 'bg-[#ffffff] text-[#000000]/70'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{t.btnShowPrice || (isThai ? 'ราคา/ชม.' : 'Price/hr')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setOnlyBookable(!onlyBookable);
            }}
            className={`px-2.5 py-1 rounded-[1600px] text-[10px] font-bold border border-[#000000] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${
              onlyBookable ? 'bg-[#7cd7a0] text-[#000000]' : 'bg-[#ffffff] text-[#000000]/70'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{isThai ? 'มีรอบว่างวันนี้' : 'Open Today'}</span>
          </button>
        </div>

        {/* Facility Filter Pills Strip */}
        <div
          data-filter="true"
          className="bg-[#ececef]/95 backdrop-blur-sm p-1 rounded-full flex items-center gap-1 overflow-x-auto no-scrollbar shadow-xs pointer-events-auto"
        >
          {filterOptions.map((f) => {
            const isSelected = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setActiveFilter(isSelected ? null : f.id);
                }}
                className={`no-doodle min-h-[32px] px-3 py-1 rounded-full text-[11px] font-medium shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#ffffff] text-[#111111] shadow-[0_1px_4px_rgba(0,0,0,0.08)]'
                    : 'text-[#6b7280] hover:text-[#111111]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notification Banner */}
      {showToast && (
        <div className="absolute top-44 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#7cd7a0] text-xs font-bold shadow-lg whitespace-nowrap">
          {showToast}
        </div>
      )}

      {/* Selected Venue Quick Card anchored neatly above bottom sheet in peek mode */}
      {selectedPin && sheetState === 'peek' && (
        <div className="absolute bottom-[160px] left-4 right-16 z-20 pointer-events-auto">
          <div className="bg-[#ffffff] rounded-[22px] p-2.5 shadow-xl border border-[#000000]/10 flex items-center justify-between gap-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span
                  className={
                    selectedPin.kind === 'partner'
                      ? 'text-[#15803d]'
                      : 'text-[#e85729]'
                  }
                >
                  {selectedPin.kind === 'partner'
                    ? isThai
                      ? `● ว่าง ${selectedPin.slotsAvailableToday} รอบวันนี้`
                      : `● ${selectedPin.slotsAvailableToday} open today`
                    : isThai
                      ? '● Google Maps จริง'
                      : '● Live Google Place'}
                </span>
                {selectedPin.rating && (
                  <span className="flex items-center gap-0.5 text-[#000000]">
                    <Star className="w-2.5 h-2.5 fill-[#e85729] stroke-[#000000]" />
                    {selectedPin.rating}
                  </span>
                )}
                <span className="text-[#000000]/55">{selectedPin.distanceKm} {isThai ? 'กม.' : 'km'}</span>
              </div>
              <h4 className="font-['Antonio',sans-serif] text-sm font-black uppercase text-[#000000] truncate mt-0.5">
                {selectedPin.name}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={getGoogleMapsDirectionsUrl(selectedPin.lat, selectedPin.lng, selectedPin.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-[1600px] bg-[#f4f8fb] border border-[#000000] text-[#000000] text-[10px] font-bold flex items-center gap-1 hover:bg-[#7cd7a0]"
              >
                <Navigation className="w-3 h-3" />
                <span>{isThai ? 'นำทาง' : 'Go'}</span>
              </a>

              {selectedPin.kind === 'partner' && (
                <button
                  type="button"
                  onClick={() => handleBookCourt(selectedPin)}
                  className="px-3 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold cursor-pointer hover:bg-[#1a1a1a]"
                >
                  {isThai ? 'จองคอร์ท →' : 'Book →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Map Controls (Right Side) */}
      <div
        className={`absolute right-4 z-20 flex flex-col gap-2 transition-all duration-300 pointer-events-auto ${
          sheetState === 'full' ? 'bottom-[84vh]' : sheetState === 'half' ? 'bottom-[50vh]' : 'bottom-40'
        }`}
      >
        {/* Recenter GPS Button */}
        <button
          type="button"
          onClick={handleRecenterGps}
          className="w-10 h-10 rounded-[1600px] bg-[#ffffff] border border-[#000000] shadow-md flex items-center justify-center text-[#000000] hover:bg-[#7cd7a0] transition-transform active:scale-90 cursor-pointer"
          title={isThai ? 'ตำแหน่ง GPS ปัจจุบัน' : 'Live GPS location'}
        >
          <Navigation className="w-4 h-4 fill-current rotate-45 text-[#000000]" />
        </button>

        {/* Zoom In & Out Controls */}
        <div className="bg-[#ffffff] rounded-[1600px] border border-[#000000] shadow-md flex flex-col items-center overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-9 flex items-center justify-center text-[#000000] hover:bg-[#7cd7a0] cursor-pointer transition-colors"
            title={isThai ? 'ซูมเข้า' : 'Zoom In'}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="w-6 h-px bg-[#000000]" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-9 flex items-center justify-center text-[#000000] hover:bg-[#7cd7a0] cursor-pointer transition-colors"
            title={isThai ? 'ซูมออก' : 'Zoom Out'}
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 4. Draggable Expandable Bottom Sheet */}
      <div
        style={{
          transform: isDraggingSheet ? `translateY(${Math.max(-100, Math.min(100, sheetDragDeltaY))}px)` : 'none',
        }}
        className={`absolute bottom-0 left-0 right-0 z-30 bg-[#ffffff] rounded-t-[32px] shadow-2xl transition-all duration-300 flex flex-col pointer-events-auto ${getSheetHeightClass()}`}
      >
        {/* Drag Handle & Interactive Header Bar */}
        <div
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onMouseDown={handleSheetMouseDown}
          onMouseMove={handleSheetMouseMove}
          onMouseUp={handleSheetMouseUp}
          className="pt-2.5 pb-2 px-4 flex flex-col items-center cursor-grab active:cursor-grabbing select-none shrink-0"
        >
          <div className="w-12 h-1.5 rounded-[1600px] bg-[#000000] hover:bg-[#15803d] mb-2 transition-colors" />

          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none shrink-0">
                {allSelectablePins.length}
              </span>
              <h3 className="font-bold text-sm text-[#000000] truncate">
                {t.nearbyCourts || (isThai ? 'สนามแบดมินตันใกล้คุณ' : 'Nearby Badminton Courts')}
              </h3>
              {!isOnline && (
                <span className="px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] border border-[#000000] text-[9px] font-black flex items-center gap-1 shrink-0">
                  <WifiOff className="w-2.5 h-2.5" />
                  {isThai ? 'แคชออฟไลน์' : 'Cached'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={toggleSheetState}
              className="text-xs font-bold text-[#000000] flex items-center gap-1 hover:underline cursor-pointer bg-[#f4f8fb] px-2.5 py-1 rounded-[1600px] border border-[#000000]"
            >
              <span>
                {sheetState === 'full'
                  ? isThai
                    ? 'ย่อหน้าต่าง'
                    : 'Collapse'
                  : sheetState === 'half'
                    ? isThai
                      ? 'ขยายเต็มจอ'
                      : 'Full'
                    : isThai
                      ? 'ขยายดูทั้งหมด'
                      : 'Expand'}
              </span>
              <ChevronUp
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  sheetState === 'full' ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Scrollable Court Cards List inside Bottom Sheet */}
        <div
          ref={listContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar p-3.5 space-y-2.5"
        >
          {allSelectablePins.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl">🔍</span>
              <p className="text-xs font-bold text-[#000000]/60 mt-2">
                {isThai ? 'ไม่พบสนามที่ตรงกับเงื่อนไขการค้นหา' : 'No courts match your filters'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter(null);
                  setOnlyBookable(false);
                }}
                className="mt-3 px-4 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-xs font-bold cursor-pointer"
              >
                {isThai ? 'ล้างตัวกรองทั้งหมด' : 'Clear all filters'}
              </button>
            </div>
          ) : (
            <>
              {filteredPartnerPins.map((court) => {
                const isSelected = selectedPin?.id === court.id;
                return (
                  <div
                    key={court.id}
                    id={`court-card-${court.id}`}
                    onClick={() => handlePinSelect(court)}
                    className={`p-3 rounded-[24px] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                      isSelected ? 'bg-[#e8f7ee] border border-[#15803d]' : 'bg-[#ffffff] hover:bg-[#f4f8fb]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-20 aspect-[16/9] rounded-[16px] overflow-hidden bg-[#e5e7eb] shrink-0 relative">
                        <img
                          src={court.imageUrl}
                          alt={court.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded-[1600px] bg-[#7cd7a0] text-[#000000] text-[8px] font-black whitespace-nowrap shrink-0">
                            {court.slotsAvailableToday > 0
                              ? isThai
                                ? `ว่าง ${court.slotsAvailableToday} รอบวันนี้`
                                : `${court.slotsAvailableToday} open today`
                              : isThai
                                ? 'วันนี้เต็ม'
                                : 'Full today'}
                          </span>
                          <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#000000]">
                            <Star className="w-3 h-3 text-[#e85729] fill-[#e85729]" />
                            <span>{court.rating}</span>
                          </div>
                        </div>

                        <h4 className="font-bold text-xs text-[#000000] truncate">{court.name}</h4>
                        <p className="text-[10px] text-[#000000]/60 font-bold truncate">
                          {court.location} · {court.distanceKm} {isThai ? 'กม.' : 'km'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <div className="text-xs font-black text-[#000000]">
                        ฿{court.price}/{t.hrUnit || (isThai ? 'ชม.' : 'hr')}
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={getGoogleMapsDirectionsUrl(court.lat, court.lng, court.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full bg-[#f4f8fb] border border-[#000000]/20 text-[#000000] hover:bg-[#7cd7a0]"
                          title={isThai ? 'นำทาง Google Maps' : 'Directions'}
                        >
                          <Navigation className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookCourt(court);
                          }}
                          className="px-3 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                          {t.bookCourtBtn || (isThai ? 'จองคอร์ท' : 'Book')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {livePlaces.length > 0 && (
                <div className="pt-2 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#000000]/60 px-1">
                    {isThai
                      ? 'สถานที่จริงจาก Google Maps (กดนำทางได้ทันที)'
                      : 'Live Venues from Google Maps'}
                  </div>
                  {livePlaces.map((place) => {
                    const isSelected = selectedPin?.id === place.id;
                    return (
                      <div
                        key={place.id}
                        id={`court-card-${place.id}`}
                        onClick={() => handlePinSelect(place)}
                        className={`p-3 rounded-[24px] transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                          isSelected
                            ? 'bg-[#fff3ee] border-[#e85729]'
                            : 'bg-[#f4f8fb] border-[#000000]/10 hover:bg-[#e8f7ee]'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-2 py-0.5 rounded-[1600px] bg-[#e85729] text-[#ffffff] text-[8px] font-black">
                              Google Maps
                            </span>
                            {place.rating && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold">
                                <Star className="w-3 h-3 text-[#e85729] fill-[#e85729]" />
                                {place.rating}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-xs text-[#000000] truncate">{place.name}</h4>
                          <p className="text-[10px] text-[#000000]/65 font-medium truncate">
                            {place.address} · {place.distanceKm} {isThai ? 'กม.' : 'km'}
                          </p>
                        </div>

                        <a
                          href={getGoogleMapsDirectionsUrl(place.lat, place.lng, place.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[10px] font-bold flex items-center gap-1 shrink-0"
                        >
                          <span>{isThai ? 'นำทาง' : 'Directions'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
