'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Map as MapIcon, Calendar } from 'lucide-react';
import { DataCard } from '../components/ui/DataCard';

const GibsMap = dynamic(() => import('./components/GibsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bg-card/50 flex items-center justify-center animate-pulse rounded-xl">
      <MapIcon className="w-8 h-8 text-text-muted animate-spin-slow" />
    </div>
  ),
});

const LAYERS = [
  { id: 'MODIS_Terra_Land_Surface_Temp_Day', name: 'Land Surface Temp' },
  { id: 'MODIS_Terra_CorrectedReflectance_TrueColor', name: 'True Color (Clouds)' },
  { id: 'MODIS_Terra_Sea_Ice', name: 'Sea Ice' },
  { id: 'MODIS_Terra_Aerosol', name: 'Air Quality (Aerosol)' },
];

export default function GibsClient() {
  const [activeLayer, setActiveLayer] = useState('none');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 py-4 h-[calc(100svh-64px)] md:h-[calc(100vh-80px)] flex flex-col animate-fade-in overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <MapIcon className="text-accent w-5 h-5 md:w-6 md:h-6" /> Earth Viewer (GIBS)
          </h1>
          <p className="text-text-secondary text-sm mt-1 max-w-xl">
            NASA Global Imagery Browse Services. Observe environmental layers like active fires, storms, sea ice, and atmospheric conditions.
          </p>
        </div>

        <div className="flex flex-row md:flex-col gap-2 items-center md:items-end shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex items-center gap-1 shrink-0">
            <Calendar size={12} /> Target Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full sm:w-auto bg-bg-card/50 border border-border text-sm rounded-md px-3 py-2 text-text-primary focus:ring-1 focus:ring-accent outline-none hover:border-border-hover transition-colors"
          />
        </div>
      </div>

      <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto pb-3 shrink-0 scrollbar-none mb-1">
        {LAYERS.map((l) => {
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
                isActive
                  ? 'bg-bg-card border-text-primary/40 text-text-primary shadow-sm'
                  : 'bg-bg-card/50 border-border text-text-secondary hover:bg-bg-card hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {l.name}
            </button>
          );
        })}
        <button
          onClick={() => setActiveLayer('none')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
            activeLayer === 'none'
               ? 'bg-bg-card border-text-primary/40 text-text-primary shadow-sm'
               : 'bg-bg-card/50 border-border text-text-secondary hover:bg-bg-card hover:border-border-hover hover:text-text-primary'
          }`}
        >
          Clear Overlay
        </button>
      </div>

      <DataCard className="flex-1 w-full relative min-h-[300px] overflow-hidden p-0 border-border/80 rounded-xl mb-4 sm:mb-0">
        <GibsMap layer={activeLayer} date={date} />
      </DataCard>
    </div>
  );
}
