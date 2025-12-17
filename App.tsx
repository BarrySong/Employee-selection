import React, { useState, useEffect, useCallback } from 'react';
import { Share2, Check } from 'lucide-react';
import { Zone } from './components/Zone';
import { EditSeatModal } from './components/EditSeatModal';
import { SeatData, SeatMap, ZoneData } from './types';
import { encodeStateToUrl, decodeStateFromUrl } from './services/urlState';

// 6 Zones for the main staff area (24 people)
const ZONES: ZoneData[] = [
  // Left Column
  { id: 0, row: 0, col: 0 },
  { id: 1, row: 1, col: 0 },
  { id: 2, row: 2, col: 0 },
  // Right Column
  { id: 3, row: 0, col: 1 },
  { id: 4, row: 1, col: 1 },
  { id: 5, row: 2, col: 1 },
];

const App: React.FC = () => {
  const [seats, setSeats] = useState<SeatMap>({});
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlState = decodeStateFromUrl();
    if (urlState) setSeats(urlState);
    else {
      try {
        const local = localStorage.getItem('office_seats');
        if (local) setSeats(JSON.parse(local));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(seats).length > 0) {
       encodeStateToUrl(seats);
       localStorage.setItem('office_seats', JSON.stringify(seats));
    }
  }, [seats]);

  const handleSeatClick = useCallback((zoneId: number, seatIndex: number) => {
    const seatId = `${zoneId}-${seatIndex}`;
    const currentData = seats[seatId] || { id: seatId, zoneId, seatIndex, occupantName: '' };
    setSelectedSeat(currentData);
    setIsModalOpen(true);
  }, [seats]);

  const handleSaveSeat = (updatedSeat: SeatData) => {
    setSeats((prev) => ({ ...prev, [updatedSeat.id]: updatedSeat }));
  };

  const handleShare = () => {
    const url = encodeStateToUrl(seats);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Group zones by column
  const leftZones = ZONES.filter(z => z.col === 0).sort((a,b) => a.row - b.row);
  const rightZones = ZONES.filter(z => z.col === 1).sort((a,b) => a.row - b.row);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 font-mono text-slate-800">
      
      {/* Header Controls */}
      <div className="w-full max-w-4xl flex justify-between items-end mb-8 px-6">
        <div>
           <h1 className="text-3xl font-black uppercase tracking-widest leading-none">Staff Area</h1>
           <p className="text-sm text-slate-500 font-bold mt-2 border-l-4 border-slate-900 pl-3">
             24 SEATS / OPEN PLAN
           </p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg hover:-translate-y-0.5"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? 'Link Copied' : 'Share Layout'}
        </button>
      </div>

      {/* Main Floor Plan Container */}
      <div className="bg-white p-12 lg:p-16 shadow-2xl border-t-8 border-slate-900 relative overflow-hidden">
        
        {/* Subtle Gradient Background for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#ffffff_0%,_#f1f5f9_100%)] pointer-events-none"></div>

        {/* Floor Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none mix-blend-multiply"></div>

        {/* MAIN STAFF SEATING AREA */}
        <div className="relative flex gap-24 lg:gap-32 justify-center z-0">
          
          {/* Left Column */}
          <div className="flex flex-col gap-12 relative">
             <div className="absolute -left-8 top-0 bottom-0 border-l border-dashed border-slate-300"></div>
             <span className="absolute -left-12 top-1/2 -rotate-90 text-xs text-slate-400 font-bold tracking-widest whitespace-nowrap">SECTION A</span>
             
             {leftZones.map(zone => (
               <Zone key={zone.id} zone={zone} seats={seats} onSeatClick={handleSeatClick} />
             ))}
          </div>

          {/* Central Walkway Marker */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col items-center justify-center opacity-30 pointer-events-none">
             <div className="h-full border-r-2 border-dashed border-slate-400"></div>
             <span className="bg-white py-4 text-xs font-bold text-slate-500 tracking-[0.5em] rotate-90 absolute">WALKWAY</span>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-12 relative">
             <div className="absolute -right-8 top-0 bottom-0 border-r border-dashed border-slate-300"></div>
             <span className="absolute -right-12 top-1/2 rotate-90 text-xs text-slate-400 font-bold tracking-widest whitespace-nowrap">SECTION B</span>

             {rightZones.map(zone => (
               <Zone key={zone.id} zone={zone} seats={seats} onSeatClick={handleSeatClick} />
             ))}
          </div>

        </div>

        {/* Scale/Info Footer */}
        <div className="mt-12 pt-4 border-t-2 border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider relative z-10">
            <span>办公室大门>ban'go
        </div>

      </div>

      {/* Modals */}
      {selectedSeat && (
        <EditSeatModal
          seat={selectedSeat}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSeat}
        />
      )}
    </div>
  );
};

export default App;
