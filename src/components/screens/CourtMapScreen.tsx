import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ArrowRight,
  X,
  MapPin,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourtFacility } from '../../types';
import { MAP_CLUSTERS } from '../../data/mockData';
import { playSelectSound } from '../../utils/retroAudio';

interface MapPinData {
  id: string;
  name: string;
  x: number;
  y: number;
  price: number;
  rating: number;
  reviews: number;
  distanceKm: number;
  location: string;
  amenities: string[];
  hasParking: boolean;
  hasShower: boolean;
  hasEvCharging: boolean;
  hasRacketRental: boolean;
  isBookable: boolean;
  imageUrl: string;
  surfaceType: 'BWF Taraflex (Green)' | 'Parquet Wood' | 'Synthetic Rubber';
  courtFacility?: CourtFacility;
}

export const CourtMapScreen: React.FC = () => {
  const { courts, setSelectedCourt, updateBooking, navigateTo, t } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showPricePerHour, setShowPricePerHour] = useState(true);
  const [onlyBookable, setOnlyBookable] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<string>('court_1');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Bottom Sheet Height State: 'peek' (~130px) | 'half' (~46vh) | 'full' (~84vh)
  const [sheetState, setSheetState] = useState<'peek' | 'half' | 'full'>('peek');
  const [sheetDragDeltaY, setSheetDragDeltaY] = useState(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartYRef = useRef(0);

  // Interactive Map State: Pan, Zoom, and Drag
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.05);
  const [isMapDragging, setIsMapDragging] = useState(false);
  const mapDragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // User location pulse indicator
  const [userLocationPulse, setUserLocationPulse] = useState(false);

  // Filter options matching user interface
  const filterOptions = [
    { id: 'parking', label: t.filterParking || 'ที่จอดรถ' },
    { id: 'shower', label: t.filterShower || 'ห้องอาบน้ำ' },
    { id: 'ev', label: t.filterEv || 'EV charging ⚡' },
    { id: 'rental', label: t.filterRental || 'บริการเช่าแร็กเกต' },
  ];

  // Comprehensive map pins linked to court facilities
  const allPins: MapPinData[] = useMemo(() => {
    const baseList: MapPinData[] = [
      {
        id: 'court_1',
        name: 'สนามแบดอินฟินิตี้ หทัยราษฎร์ (Infinity)',
        x: 295,
        y: 390,
        price: 200,
        rating: 4.8,
        reviews: 342,
        distanceKm: 1.8,
        location: '116/9 หทัยราษฎร์ 39 แขวงสามวาตะวันตก',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต', 'ติดแอร์'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[0],
      },
      {
        id: 'court_2',
        name: 'Sport Refresh ลำลูกกา คลอง 4',
        x: 260,
        y: 190,
        price: 220,
        rating: 4.7,
        reviews: 215,
        distanceKm: 2.5,
        location: '69, 18/141 ถ. ลำลูกกา ตำบลลาดสวาย',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[1],
      },
      {
        id: 'court_3',
        name: 'Winner Arena Badminton Rama 9',
        x: 380,
        y: 260,
        price: 280,
        rating: 4.9,
        reviews: 480,
        distanceKm: 2.4,
        location: 'พระราม 9 ซอย 13 (ใกล้ MRT พระราม 9)',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต', 'Pro Shop'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[2],
      },
      {
        id: 'court_6',
        name: 'Pro Court Ratchada 18',
        x: 440,
        y: 350,
        price: 300,
        rating: 4.9,
        reviews: 412,
        distanceKm: 3.2,
        location: 'รัชดาภิเษก ซอย 18 ห้วยขวาง',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต', 'แอร์'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[5] || courts[0],
      },
      {
        id: 'court_5',
        name: 'Smash Zone Bangna Arena',
        x: 180,
        y: 410,
        price: 240,
        rating: 4.6,
        reviews: 156,
        distanceKm: 5.9,
        location: 'บางนา-ตราด กม.4 (ตรงข้ามเซ็นทรัลบางนา)',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'บริการเช่าแร็กเกต'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: false,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'Parquet Wood',
        courtFacility: courts[4] || courts[0],
      },
      {
        id: 'court_4',
        name: '71 Sport Club Ekkamai-Pridi',
        x: 490,
        y: 520,
        price: 320,
        rating: 4.8,
        reviews: 189,
        distanceKm: 3.8,
        location: 'สุขุมวิท 71 เอกมัย-ปรีดีพนมยงค์',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'บริการเช่าแร็กเกต', 'เครื่องดื่ม'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: false,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[3] || courts[0],
      },
      {
        id: 'court_7',
        name: 'Siam Badminton Arena (พระราม 3)',
        x: 370,
        y: 640,
        price: 280,
        rating: 4.7,
        reviews: 198,
        distanceKm: 4.2,
        location: 'พระราม 3 ซอย 52 แขวงช่องนนทรี',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[0],
      },
      {
        id: 'court_8',
        name: 'Thonburi Court Club',
        x: 210,
        y: 760,
        price: 250,
        rating: 4.6,
        reviews: 124,
        distanceKm: 6.4,
        location: 'จรัญสนิทวงศ์ 13 บางแวก ภาษีเจริญ',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'บริการเช่าแร็กเกต'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: false,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[1],
      },
      {
        id: 'court_9',
        name: 'Bangna Taraflex Park',
        x: 480,
        y: 780,
        price: 260,
        rating: 4.8,
        reviews: 310,
        distanceKm: 7.1,
        location: 'อุดมสุข 58 บางนา กทม.',
        amenities: ['ที่จอดรถ', 'ห้องอาบน้ำ', 'EV charging ⚡', 'บริการเช่าแร็กเกต'],
        hasParking: true,
        hasShower: true,
        hasEvCharging: true,
        hasRacketRental: true,
        isBookable: true,
        imageUrl: '/src/assets/images/badminton_court_arena_1793695157813.jpg',
        surfaceType: 'BWF Taraflex (Green)',
        courtFacility: courts[2],
      },
    ];
    return baseList;
  }, [courts]);

  // Filtered Pins & Courts based on user input
  const filteredPins = useMemo(() => {
    return allPins.filter((pin) => {
      if (activeFilter === 'parking' && !pin.hasParking) return false;
      if (activeFilter === 'shower' && !pin.hasShower) return false;
      if (activeFilter === 'ev' && !pin.hasEvCharging) return false;
      if (activeFilter === 'rental' && !pin.hasRacketRental) return false;
      if (onlyBookable && !pin.isBookable) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          pin.name.toLowerCase().includes(query) ||
          pin.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allPins, activeFilter, onlyBookable, searchQuery]);

  // Selected Pin Data
  const selectedPin = useMemo(() => {
    return allPins.find((p) => p.id === selectedCourtId) || allPins[0];
  }, [allPins, selectedCourtId]);

  // Booking action
  const handleSelectCourt = (courtPin: MapPinData) => {
    playSelectSound();
    const courtToBook = courtPin.courtFacility || {
      id: courtPin.id,
      name: courtPin.name,
      location: courtPin.location,
      distanceKm: courtPin.distanceKm,
      rating: courtPin.rating,
      reviewCount: courtPin.reviews,
      pricePerHour: courtPin.price,
      hasAirCon: true,
      courtCount: 8,
      surfaceType: courtPin.surfaceType,
      bonusExpMultiplier: 2.0,
      imageUrl: courtPin.imageUrl,
      amenities: courtPin.amenities,
      slotsAvailableToday: 5,
      latitude: 13.78,
      longitude: 100.56,
      hasParking: courtPin.hasParking,
      hasShower: courtPin.hasShower,
      hasEvCharging: courtPin.hasEvCharging,
      hasRacketRental: courtPin.hasRacketRental,
      isBookable: courtPin.isBookable,
    };
    setSelectedCourt(courtToBook);
    updateBooking({ court: courtToBook, selectedCourtNumber: 1 });
    navigateTo('B2');
  };

  // Click Pin on map: center map and scroll card in sheet
  const handlePinClick = (pin: MapPinData) => {
    playSelectSound();
    setSelectedCourtId(pin.id);
    // Smoothly pan map to this pin
    setPan({
      x: 300 - pin.x,
      y: 450 - pin.y,
    });
    // Scroll corresponding card into view in the bottom sheet
    setTimeout(() => {
      const cardEl = document.getElementById(`court-card-${pin.id}`);
      if (cardEl && listContainerRef.current) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  // Re-center on user position
  const handleRecenter = () => {
    playSelectSound();
    setUserLocationPulse(true);
    setPan({ x: 0, y: 0 });
    setZoom(1.15);
    setShowToast('📍 ตำแหน่งปัจจุบัน: ถนนรัชดาภิเษก (ใกล้ 42 สนาม)');
    setTimeout(() => {
      setUserLocationPulse(false);
    }, 1800);
    setTimeout(() => {
      setShowToast(null);
    }, 2800);
  };

  // Zoom controls
  const handleZoomIn = () => {
    playSelectSound();
    setZoom((z) => Math.min(2.4, +(z + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    playSelectSound();
    setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)));
  };

  // Cluster click: zoom into that area
  const handleClusterClick = (cl: { id: string; count: number; x: number; y: number }) => {
    playSelectSound();
    setPan({
      x: 300 - cl.x,
      y: 450 - cl.y,
    });
    setZoom((z) => Math.min(2.2, +(z + 0.4).toFixed(2)));
    setShowToast(`🔍 ขยายดูคลัสเตอร์ ${cl.count} สนาม`);
    setTimeout(() => setShowToast(null), 1800);
  };

  // ================= MAP PAN / DRAG GESTURE HANDLERS =================
  const handleMapMouseDown = (e: React.MouseEvent) => {
    // Avoid dragging if clicking on a button or pin
    if ((e.target as HTMLElement).closest('button, g.interactive-pin, g.interactive-cluster')) {
      return;
    }
    setIsMapDragging(true);
    mapDragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isMapDragging) return;
    const dx = (e.clientX - mapDragStartRef.current.x) / zoom;
    const dy = (e.clientY - mapDragStartRef.current.y) / zoom;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMapMouseUp = () => {
    setIsMapDragging(false);
  };

  const handleMapTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if ((e.target as HTMLElement).closest('button, g.interactive-pin, g.interactive-cluster')) {
        return;
      }
      setIsMapDragging(true);
      const touch = e.touches[0];
      mapDragStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleMapTouchMove = (e: React.TouchEvent) => {
    if (!isMapDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = (touch.clientX - mapDragStartRef.current.x) / zoom;
    const dy = (touch.clientY - mapDragStartRef.current.y) / zoom;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMapTouchEnd = () => {
    setIsMapDragging(false);
  };

  // Mouse wheel zoom on map
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(2.4, +(z + 0.1).toFixed(2)));
    } else {
      setZoom((z) => Math.max(0.75, +(z - 0.1).toFixed(2)));
    }
  };

  // ================= BOTTOM SHEET DRAG GESTURE HANDLERS =================
  const handleSheetTouchStart = (e: React.TouchEvent) => {
    setIsDraggingSheet(true);
    dragStartYRef.current = e.touches[0].clientY;
    setSheetDragDeltaY(0);
  };

  const handleSheetTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSheet) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartYRef.current;
    // Allow dragging up and down with resistance
    setSheetDragDeltaY(deltaY);
  };

  const handleSheetTouchEnd = () => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    const deltaY = sheetDragDeltaY;
    setSheetDragDeltaY(0);

    // Upward drag (negative deltaY): expand sheet
    if (deltaY < -40) {
      if (sheetState === 'peek') {
        setSheetState(deltaY < -120 ? 'full' : 'half');
      } else if (sheetState === 'half') {
        setSheetState('full');
      }
    }
    // Downward drag (positive deltaY): collapse sheet
    else if (deltaY > 40) {
      if (sheetState === 'full') {
        setSheetState(deltaY > 120 ? 'peek' : 'half');
      } else if (sheetState === 'half') {
        setSheetState('peek');
      }
    }
  };

  // Mouse drag handlers for desktop support
  const handleSheetMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSheet(true);
    dragStartYRef.current = e.clientY;
    setSheetDragDeltaY(0);
  };

  const handleSheetMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSheet) return;
    const deltaY = e.clientY - dragStartYRef.current;
    setSheetDragDeltaY(deltaY);
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

  // Toggle state via expand button
  const toggleSheetState = () => {
    playSelectSound();
    if (sheetState === 'peek') setSheetState('half');
    else if (sheetState === 'half') setSheetState('full');
    else setSheetState('peek');
  };

  // Compute Sheet Height Style
  const getSheetHeightClass = () => {
    switch (sheetState) {
      case 'peek':
        return 'h-[148px]';
      case 'half':
        return 'h-[50vh]';
      case 'full':
        return 'h-[85vh]';
    }
  };

  return (
    <div
      ref={mapContainerRef}
      onMouseMove={handleMapMouseMove}
      onMouseUp={handleMapMouseUp}
      onWheel={handleWheel}
      className="flex-1 min-h-0 flex flex-col relative bg-[#dceeff] text-[#000000] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden select-none"
    >
      {/* 1. Interactive Map Canvas (Full Pan & Zoomable SVG Vector Map) */}
      <div
        onMouseDown={handleMapMouseDown}
        onTouchStart={handleMapTouchStart}
        onTouchMove={handleMapTouchMove}
        onTouchEnd={handleMapTouchEnd}
        className={`absolute inset-0 w-full h-full overflow-hidden ${
          isMapDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <svg
          viewBox="0 0 600 900"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Main Map Group with Dynamic Pan and Zoom Transform */}
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: '300px 450px',
              transition: isMapDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Base Land Fill */}
            <rect width="600" height="900" fill="#e8f3fc" />

            {/* Green Parks / Greenery Zones */}
            <path
              d="M 50,150 Q 120,130 180,190 T 220,320 T 140,420 T 40,360 Z"
              fill="#d1fae5"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.9"
            />
            <path
              d="M 380,80 Q 480,100 520,220 T 460,340 T 360,260 Z"
              fill="#d1fae5"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.9"
            />
            <path
              d="M 60,650 Q 140,580 240,640 T 260,780 T 120,820 Z"
              fill="#d1fae5"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.9"
            />
            <path
              d="M 350,560 Q 440,520 540,590 T 560,740 T 410,780 Z"
              fill="#d1fae5"
              stroke="#000000"
              strokeWidth="1"
              opacity="0.9"
            />

            {/* Waterways / Canals */}
            <path
              d="M 120,0 L 110,350 Q 105,480 80,620 L 70,900"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="14"
            />

            {/* Expressways and Highways with 1px black outline */}
            <path
              d="M 0,280 L 600,380"
              fill="none"
              stroke="#000000"
              strokeWidth="12"
            />
            <path
              d="M 0,280 L 600,380"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
            />

            {/* Main Road: Yellow Ratchadaphisek Corridor */}
            <path
              d="M 280,0 L 320,500 L 420,900"
              fill="none"
              stroke="#000000"
              strokeWidth="15"
            />
            <path
              d="M 280,0 L 320,500 L 420,900"
              fill="none"
              stroke="#ffd731"
              strokeWidth="10"
            />

            {/* Major Road Grid */}
            <path
              d="M 100,0 L 450,900"
              fill="none"
              stroke="#000000"
              strokeWidth="6"
            />
            <path
              d="M 100,0 L 450,900"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
            />

            <path
              d="M 550,0 L 50,750"
              fill="none"
              stroke="#ffffff"
              strokeWidth="6"
            />
            <path
              d="M 0,550 L 600,480"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
            />

            {/* Road Labels */}
            <text
              x="355"
              y="420"
              fill="#000000"
              fontSize="9"
              fontWeight="900"
              fontFamily="sans-serif"
              transform="rotate(78, 355, 420)"
            >
              RATCHADAPHISEK ROAD
            </text>
            <text
              x="430"
              y="240"
              fill="#000000"
              fontSize="9"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              PHAHONYOTHIN
            </text>
            <text
              x="180"
              y="700"
              fill="#000000"
              fontSize="10"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              CHATUCHAK
            </text>

            {/* Current User Location Blue Dot with Pulsing Radar Ring */}
            <g transform="translate(295, 510)">
              <circle
                cx="0"
                cy="0"
                r="24"
                fill="#5c4ade"
                fillOpacity="0.18"
                className="animate-ping"
              />
              {userLocationPulse && (
                <circle
                  cx="0"
                  cy="0"
                  r="36"
                  fill="#ffd731"
                  fillOpacity="0.35"
                  className="animate-ping"
                />
              )}
              <circle cx="0" cy="0" r="10" fill="#5c4ade" stroke="#000000" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>

            {/* Interactive Cluster Number Badges (Clicking zooms in) */}
            {MAP_CLUSTERS.map((cl, i) => {
              const clusterPos = {
                x: 180 + i * 85,
                y: 380 + (i % 2) * 180,
              };
              return (
                <g
                  key={cl.id}
                  transform={`translate(${clusterPos.x}, ${clusterPos.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClusterClick({ ...cl, ...clusterPos });
                  }}
                  className="interactive-cluster cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="16"
                    fill="#ffd731"
                    stroke="#000000"
                    strokeWidth="2"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="12"
                    fontWeight="900"
                    fontFamily="sans-serif"
                  >
                    {cl.count}
                  </text>
                </g>
              );
            })}

            {/* Interactive Badminton Court Pins */}
            {allPins.map((pin) => {
              const isSelected = selectedCourtId === pin.id;
              const isFilteredIn = filteredPins.some((fp) => fp.id === pin.id);

              return (
                <g
                  key={pin.id}
                  transform={`translate(${pin.x}, ${pin.y})`}
                  className={`interactive-pin cursor-pointer transition-all duration-200 ${
                    isFilteredIn ? 'opacity-100' : 'opacity-20 pointer-events-none'
                  } ${isSelected ? 'scale-125 z-30' : 'hover:scale-115'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinClick(pin);
                  }}
                >
                  {/* Selected Ripple Glow */}
                  {isSelected && (
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="#ffd731"
                      fillOpacity="0.4"
                      className="animate-pulse"
                    />
                  )}

                  {/* Pin Circle Body */}
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill={isSelected ? '#ffd731' : '#55db9c'}
                    stroke="#000000"
                    strokeWidth={isSelected ? '2.5' : '1.8'}
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.25))"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill="#000000"
                    fontSize="11"
                    className="select-none pointer-events-none"
                  >
                    🏸
                  </text>

                  {/* Price Tag Bubble if Enabled */}
                  {showPricePerHour && (
                    <g transform="translate(0, -22)">
                      <rect
                        x="-24"
                        y="-9"
                        width="48"
                        height="16"
                        rx="8"
                        fill={isSelected ? '#000000' : '#000000'}
                        stroke={isSelected ? '#ffd731' : '#000000'}
                        strokeWidth="1.5"
                        filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))"
                      />
                      <text
                        x="0"
                        y="2.5"
                        textAnchor="middle"
                        fill={isSelected ? '#ffd731' : '#ffffff'}
                        fontSize="8.5"
                        fontWeight="900"
                      >
                        ฿{pin.price}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Pin Floating Callout Bubble on Map */}
        {selectedPin && (
          <div
            className="absolute z-20 pointer-events-auto transition-transform duration-200"
            style={{
              left: `calc(50% + ${(selectedPin.x - 300) * zoom + pan.x}px)`,
              top: `calc(50% + ${(selectedPin.y - 450) * zoom + pan.y - 70}px)`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div
              onClick={() => handleSelectCourt(selectedPin)}
              className="bg-[#ffffff] rounded-[22px] p-2.5 shadow-xl border border-[#000000] cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center gap-2.5 min-w-[210px] max-w-[260px]"
            >
              <div className="w-12 h-12 rounded-[14px] overflow-hidden bg-[#e5e7eb] border border-[#000000] shrink-0">
                <img
                  src={selectedPin.imageUrl}
                  alt={selectedPin.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[9px] font-black text-[#55db9c]">
                  <span>● เปิดจอง</span>
                  <span className="text-[#000000]/40">·</span>
                  <span className="text-[#000000] flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-[#ffd731] stroke-[#000000]" />
                    {selectedPin.rating}
                  </span>
                </div>
                <h4 className="font-['Antonio',sans-serif] text-xs font-black uppercase text-[#000000] truncate leading-tight mt-0.5">
                  {selectedPin.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-[11px] text-[#000000]">
                    ฿{selectedPin.price}/ชม.
                  </span>
                  <span className="px-2 py-0.5 rounded-[1600px] bg-[#000000] text-[#ffffff] text-[8px] font-bold uppercase tracking-wider">
                    จองคอร์ท →
                  </span>
                </div>
              </div>
            </div>
            {/* Callout Triangle Arrow */}
            <div className="w-0 h-0 border-x-6 border-x-transparent border-t-8 border-t-[#000000] mx-auto -mt-0.5" />
          </div>
        )}
      </div>

      {/* 2. Top Search Bar & Filter Header in Slush CI */}
      <div className="relative z-20 px-4 pt-3 space-y-2 pointer-events-auto">
        {/* Search Input Box */}
        <div className="bg-[#ffffff] rounded-[1600px] p-2.5 shadow-sm border border-[#000000] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 pl-1">
            <Search className="w-4 h-4 text-[#000000]/60 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchMap || 'ค้นหาสนามแบดมินตัน...'}
              className="w-full bg-transparent text-xs font-bold text-[#000000] placeholder:text-[#000000]/50 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#000000]/60 hover:text-[#000000] p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSheetState}
            className="w-7 h-7 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center text-[#000000] hover:bg-[#e9e9e9] transition-colors cursor-pointer"
            title="Expand / Collapse List"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                sheetState !== 'peek' ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Filter Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
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
                className={`px-3 py-1.5 rounded-[1600px] text-xs font-bold shrink-0 border border-[#000000] transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs ${
                  isSelected
                    ? 'bg-[#000000] text-[#ffffff]'
                    : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setShowPricePerHour(!showPricePerHour);
            }}
            className={`px-3 py-1.5 rounded-[1600px] text-[11px] font-bold border border-[#000000] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs ${
              showPricePerHour
                ? 'bg-[#ffd731] text-[#000000]'
                : 'bg-[#ffffff] text-[#000000]/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#000000]" />
            <span>{t.btnShowPrice || 'แสดงราคา/ชม.'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSelectSound();
              setOnlyBookable(!onlyBookable);
            }}
            className={`px-3 py-1.5 rounded-[1600px] text-[11px] font-bold border border-[#000000] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs ${
              onlyBookable
                ? 'bg-[#55db9c] text-[#000000]'
                : 'bg-[#ffffff] text-[#000000]/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#000000]" />
            <span>{t.btnBookable || 'สนามที่เปิดจอง'}</span>
            <span className="px-1.5 py-0.2 rounded-[1600px] bg-[#fb4903] text-[#ffffff] border border-[#000000] text-[8px] font-black">
              {t.newBadge || 'ใหม่'}
            </span>
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {showToast && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#ffd731] text-xs font-bold shadow-lg animate-bounce whitespace-nowrap">
          {showToast}
        </div>
      )}

      {/* 3. Floating Map Controls (Right Side) */}
      <div
        className={`absolute right-4 z-20 flex flex-col gap-2 transition-all duration-300 pointer-events-auto ${
          sheetState === 'full' ? 'bottom-[88vh]' : sheetState === 'half' ? 'bottom-[52vh]' : 'bottom-40'
        }`}
      >
        {/* Recenter GPS Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="w-10 h-10 rounded-[1600px] bg-[#ffffff] border border-[#000000] shadow-md flex items-center justify-center text-[#000000] hover:bg-[#ffd731] transition-transform active:scale-90 cursor-pointer"
          title="ตำแหน่งปัจจุบัน (Recenter)"
        >
          <Navigation className="w-4 h-4 fill-current rotate-45 text-[#000000]" />
        </button>

        {/* Zoom In & Out Controls */}
        <div className="bg-[#ffffff] rounded-[1600px] border border-[#000000] shadow-md flex flex-col items-center overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-10 h-9 flex items-center justify-center text-[#000000] hover:bg-[#ffd731] active:bg-[#f3f4f6] cursor-pointer transition-colors"
            title="ซูมเข้า (Zoom In)"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="w-6 h-px bg-[#000000]" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-10 h-9 flex items-center justify-center text-[#000000] hover:bg-[#ffd731] active:bg-[#f3f4f6] cursor-pointer transition-colors"
            title="ซูมออก (Zoom Out)"
          >
            <Minus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 4. Draggable Expandable Bottom Sheet in Slush CI */}
      <div
        style={{
          transform: isDraggingSheet ? `translateY(${Math.max(-100, Math.min(100, sheetDragDeltaY))}px)` : 'none',
        }}
        className={`absolute bottom-0 left-0 right-0 z-30 bg-[#ffffff] rounded-t-[32px] shadow-2xl border-t border-[#000000] transition-all duration-300 flex flex-col pointer-events-auto ${getSheetHeightClass()}`}
      >
        {/* Drag Handle & Interactive Header Bar */}
        <div
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onMouseDown={handleSheetMouseDown}
          onMouseMove={handleSheetMouseMove}
          onMouseUp={handleSheetMouseUp}
          className="pt-2.5 pb-2 px-4 flex flex-col items-center cursor-grab active:cursor-grabbing select-none shrink-0 border-b border-[#000000]/10"
        >
          {/* Visual Pull-up Handle Pill */}
          <div className="w-12 h-1.5 rounded-[1600px] bg-[#000000] hover:bg-[#5c4ade] mb-2 transition-colors" />

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-['Antonio',sans-serif] text-2xl font-black text-[#000000] leading-none">
                {filteredPins.length}
              </span>
              <h3 className="font-bold text-sm text-[#000000]">
                {t.nearbyCourts || 'สนามแบดมินตันใกล้คุณ'}
              </h3>
            </div>

            {/* Tap to Toggle Expand/Collapse */}
            <button
              type="button"
              onClick={toggleSheetState}
              className="text-xs font-bold text-[#000000] flex items-center gap-1 hover:underline cursor-pointer bg-[#dceeff] px-2.5 py-1 rounded-[1600px] border border-[#000000]"
            >
              <span>
                {sheetState === 'full' ? 'ย่อหน้าต่าง' : sheetState === 'half' ? 'ขยายเต็มจอ' : 'ขยายดูทั้งหมด'}
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
          {filteredPins.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl">🔍</span>
              <p className="text-xs font-bold text-[#000000]/60 mt-2">
                ไม่พบสนามที่ตรงกับเงื่อนไขการค้นหา
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
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            filteredPins.map((court) => {
              const isSelected = selectedCourtId === court.id;

              return (
                <div
                  key={court.id}
                  id={`court-card-${court.id}`}
                  onClick={() => handlePinClick(court)}
                  className={`p-3 rounded-[24px] border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs ${
                    isSelected
                      ? 'bg-[#ffd731]/25 border-2 border-[#000000] scale-[1.01]'
                      : 'bg-[#ffffff] border-[#000000] hover:bg-[#dceeff]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* 16:9 Thumbnail Image */}
                    <div className="w-20 aspect-[16/9] rounded-[16px] overflow-hidden bg-[#e5e7eb] shrink-0 border border-[#000000] relative">
                      <img
                        src={court.imageUrl}
                        alt={court.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-[#55db9c] border border-[#000000]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.2 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[8px] font-black whitespace-nowrap">
                          {t.bookableTag || 'เปิดจอง'}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-[#000000]">
                          <Star className="w-3 h-3 text-[#ffd731] fill-[#ffd731]" />
                          <span>{court.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-xs text-[#000000] truncate">
                        {court.name}
                      </h4>
                      <p className="text-[10px] text-[#000000]/60 font-bold truncate">
                        {court.location} · {court.distanceKm} km
                      </p>
                    </div>
                  </div>

                  {/* Price & Book Action CTA */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-[#000000]">
                      ฿{court.price}/{t.hrUnit || 'ชม.'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCourt(court);
                      }}
                      className="mt-1 px-3 py-1 rounded-[1600px] bg-[#000000] text-[#ffffff] border border-[#000000] text-[10px] font-bold hover:bg-[#1a1a1a] transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      {t.bookCourtBtn || 'จองคอร์ท'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
