import React from 'react';
import { User } from 'lucide-react';
import { SeatData } from '../types';

interface SeatProps {
  data: SeatData;
  onClick: () => void;
  className?: string;
}

export const Seat: React.FC<SeatProps> = ({ data, onClick, className }) => {
  const isOccupied = !!data.occupantName;

  return (
    <div 
      onClick={onClick}
      className={`
        relative w-full h-full border text-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none group
        ${isOccupied 
          ? 'bg-blue-100 border-blue-500 text-blue-900' 
          : 'bg-white border-slate-400 hover:bg-slate-50'}
        ${className}
      `}
    >
      {isOccupied ? (
        <>
          <span className="font-bold truncate w-full text-center px-2">{data.occupantName}</span>
        </>
      ) : (
        <span className="opacity-0 group-hover:opacity-50 text-slate-400 font-sans text-sm">点他</span>
      )}
      
      {/* Chair Visual - purely decorative, positioned based on simple CSS assuming standard desk orientation */}
      <div className={`absolute w-8 h-2 rounded-full border border-slate-300 transition-colors
        ${isOccupied ? 'bg-blue-200 border-blue-400' : 'bg-white'}
        ${className?.includes('bottom') ? '-bottom-3' : '-top-3'}
        left-1/2 -translate-x-1/2
      `}></div>
    </div>
  );
};