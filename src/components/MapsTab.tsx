import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Info, MapPin, CheckCircle, Navigation } from 'lucide-react';

interface MapsTabProps {
  triggerToast: (msg: string) => void;
}

export default function MapsTab({ triggerToast }: MapsTabProps) {
  const [apiKey, setApiKey] = useState('AIzaSyA-MockKey-Radjago-2026-XyZ');
  const [showKey, setShowKey] = useState(false);
  const [mapStyle, setMapStyle] = useState('Standard (Light)');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('radjago_maps_key');
    const savedStyle = localStorage.getItem('radjago_maps_style');
    if (savedKey) setApiKey(savedKey);
    if (savedStyle) setMapStyle(savedStyle);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('radjago_maps_key', apiKey);
    localStorage.setItem('radjago_maps_style', mapStyle);
    setIsSaved(true);
    triggerToast('Konfigurasi Google Maps API berhasil disimpan!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Define visual styling for map preview based on selected style
  const getMapBgClass = () => {
    switch (mapStyle) {
      case 'Dark Mode':
        return 'bg-slate-950 border-slate-800 text-slate-400';
      case 'Silver / Retro':
        return 'bg-amber-50/40 border-amber-200/50 text-amber-900/60';
      case 'Satellite View':
        return 'bg-emerald-950 border-emerald-900 text-emerald-300';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="maps-tab">
      {/* Left Panel: Configuration Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h4 className="text-base font-bold text-slate-800">Konfigurasi Google Maps API</h4>
            <p className="text-xs text-slate-500 mt-0.5">Integrasi geolokasi penting untuk armada drone, kurir ojol, dan toko merchant.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Google Maps API Key</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API Key Google Maps Anda"
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title={showKey ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Key ini krusial untuk sinkronisasi koordinat GPS, visualisasi rute mitra driver, dan ketepatan titik jemput merchant Radjago.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Pilih Map Style</label>
              <select
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium transition-all"
              >
                <option value="Standard (Light)">Standard (Light)</option>
                <option value="Silver / Retro">Silver / Retro</option>
                <option value="Dark Mode">Dark Mode</option>
                <option value="Satellite View">Satellite View</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/10 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Konfigurasi</span>
              </button>
              {isSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  Tersimpan!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Informational Guidance */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Cara Mendapatkan API Key Google Maps Platform</span>
          </h5>
          <ol className="list-decimal list-inside text-xs text-slate-500 space-y-2 leading-relaxed">
            <li>
              Buka <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Google Cloud Console</a> dan buat atau pilih proyek Anda.
            </li>
            <li>
              Masuk ke menu <strong>APIs & Services &gt; Library</strong>, lalu cari dan aktifkan <strong>Maps JavaScript API</strong>, <strong>Geocoding API</strong>, dan <strong>Places API</strong>.
            </li>
            <li>
              Kembali ke <strong>APIs & Services &gt; Credentials</strong>, klik <strong>+ Create Credentials</strong> dan pilih <strong>API Key</strong>.
            </li>
            <li>
              Salin kode API Key tersebut dan masukkan ke dalam input konfigurasi di atas.
            </li>
          </ol>
        </div>
      </div>

      {/* Right Panel: Interactive Simulation Map Preview */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-between min-h-[360px]">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-base font-bold text-slate-800">Peta Preview Wilayah</h4>
            <p className="text-xs text-slate-400 mt-0.5">Representasi visual peta operasional Radjago</p>
          </div>

          {/* Interactive Styled Map Preview based on state */}
          <div className={`relative flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition-all ${getMapBgClass()}`}>
            
            {/* Visual simulation elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute top-4 left-6 w-24 h-12 border border-current rounded-full" />
              <div className="absolute bottom-8 right-12 w-32 h-16 border border-current rounded-full" />
              <div className="absolute top-1/2 left-1/3 w-px h-full bg-current" />
              <div className="absolute left-10 top-1/3 right-10 h-px bg-current" />
              <div className="absolute right-20 top-10 w-px h-24 bg-current" />
            </div>

            <div className="relative space-y-3 z-10">
              <div className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center text-indigo-600 mx-auto animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider">Style: {mapStyle}</h5>
                <p className="text-[11px] max-w-[240px] mx-auto mt-1 leading-normal opacity-80">
                  Peta simulasi operasional wilayah aktif. Jalur logistik ojol dan titik merchant terhubung secara real-time.
                </p>
              </div>
            </div>

            {/* Simulated active driver pins on map preview */}
            <div className="absolute top-1/4 right-1/4 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
              <span className="absolute -top-6 -left-6 bg-white/95 text-slate-800 text-[8px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200">Mitra #1</span>
            </div>
            
            <div className="absolute bottom-1/4 left-1/4 animate-pulse delay-700">
              <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-white shadow-md" />
              <span className="absolute -top-6 -left-6 bg-white/95 text-slate-800 text-[8px] font-bold px-1.5 py-0.5 rounded shadow border border-slate-200">Customer</span>
            </div>

            <div className="absolute top-1/2 left-12">
              <Navigation className="w-5 h-5 text-purple-500 rotate-45 animate-pulse" />
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Status: <strong className="text-slate-700">Connected</strong>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Tunnel ID: RAD-992-G</span>
          </div>
        </div>
      </div>
    </div>
  );
}
