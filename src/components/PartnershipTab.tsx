import React, { useState } from 'react';
import { MapPin, Plus, Edit, RefreshCw, Landmark, Phone, Percent, Coins, Shield, Flame, Search } from 'lucide-react';
import { PartnershipArea, AreaType } from '../types';

interface PartnershipTabProps {
  areas: PartnershipArea[];
  customersCountByArea: Record<string, number>;
  driversCountByArea: Record<string, number>;
  merchantsCountByArea: Record<string, number>;
  onAddArea: (area: PartnershipArea) => void;
  onEditArea: (area: PartnershipArea) => void;
  onSimulateRegionalOrder: (areaId: string, amount: number) => void;
}

export default function PartnershipTab({
  areas,
  customersCountByArea,
  driversCountByArea,
  merchantsCountByArea,
  onAddArea,
  onEditArea,
  onSimulateRegionalOrder,
}: PartnershipTabProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // Forms
  const [newArea, setNewArea] = useState<PartnershipArea>({
    id: '',
    type: 'Kota',
    name: '',
    regionalPartnerName: '',
    phone: '',
    commissionRate: 2.5,
    status: 'Active',
    serviceFeeMultiplier: 1.0,
    totalRevenue: 0,
  });

  const [editingArea, setEditingArea] = useState<PartnershipArea | null>(null);
  const [selectedSimulateAreaId, setSelectedSimulateAreaId] = useState<string | null>(null);
  const [simulateAmount, setSimulateAmount] = useState<number>(25000);

  const filteredAreas = areas.filter(area => {
    const matchesSearch = 
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.regionalPartnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || area.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Calculate Cumulative totals
  const totalOmzetAllAreas = areas.reduce((sum, a) => sum + a.totalRevenue, 0);
  const totalPartnerCommShare = areas.reduce((sum, a) => sum + (a.totalRevenue * (a.commissionRate / 100)), 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.name || !newArea.regionalPartnerName) {
      alert('Mohon isi nama wilayah dan nama koordinator mitra!');
      return;
    }
    // Simple id generation
    const generatedId = newArea.name.toLowerCase().replace(/\s+/g, '-');
    onAddArea({
      ...newArea,
      id: generatedId,
    });
    setNewArea({
      id: '',
      type: 'Kota',
      name: '',
      regionalPartnerName: '',
      phone: '',
      commissionRate: 2.5,
      status: 'Active',
      serviceFeeMultiplier: 1.0,
      totalRevenue: 0,
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingArea) {
      onEditArea(editingArea);
      setIsEditModalOpen(false);
      setEditingArea(null);
    }
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSimulateAreaId && simulateAmount > 0) {
      onSimulateRegionalOrder(selectedSimulateAreaId, simulateAmount);
      setIsSimulateModalOpen(false);
      setSelectedSimulateAreaId(null);
      setSimulateAmount(25000);
    }
  };

  return (
    <div className="space-y-6" id="partnership-tab-root">
      
      {/* Vendor Area Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Total Omzet Nasional (Radjago)</span>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight mt-1">
              Rp {totalOmzetAllAreas.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Akumulasi dari seluruh area aktif</span>
            <Landmark className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Bagi Hasil Koordinator Daerah</span>
            <h3 className="text-3xl font-bold text-indigo-700 tracking-tight mt-1">
              Rp {totalPartnerCommShare.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-indigo-600 font-medium">
            <span>Estimasi dana terdistribusi ke daerah</span>
            <Percent className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-2 flex flex-col justify-between bg-indigo-50/20">
          <div>
            <span className="text-indigo-800 text-xs font-semibold uppercase tracking-wider block">Radjago Pusat Clean Share</span>
            <h3 className="text-3xl font-bold text-emerald-700 tracking-tight mt-1">
              Rp {(totalOmzetAllAreas - totalPartnerCommShare).toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="pt-3 border-t border-indigo-100 flex justify-between items-center text-xs text-emerald-600 font-semibold">
            <span>Bagi hasil bersih kantor pusat (Radjago)</span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Filter and Area search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari wilayah kabupaten/kota atau koordinator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-end">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Tipe Daerah</option>
              <option value="Kota">Kota Madya</option>
              <option value="Kabupaten">Kabupaten</option>
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Area Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regional Vendor Area Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="pl-6 py-4">Kode Area</th>
                <th className="py-4">Nama Wilayah</th>
                <th className="py-4">Koordinator Daerah</th>
                <th className="py-4">No. HP Hubungan</th>
                <th className="py-4 text-center">Bagi Hasil Mitra %</th>
                <th className="py-4 text-center">Faktor Tarif (Multiplier)</th>
                <th className="py-4 text-center">Data Terdaftar (P / D / M)</th>
                <th className="py-4 text-right">Akumulasi Omzet Daerah</th>
                <th className="py-4 text-right">Komisi Koordinator</th>
                <th className="py-4 text-center">Status</th>
                <th className="pr-6 py-4 text-right">Simulasi / Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area) => {
                  const areaP = customersCountByArea[area.id] || 0;
                  const areaD = driversCountByArea[area.id] || 0;
                  const areaM = merchantsCountByArea[area.id] || 0;

                  const partnerCommission = area.totalRevenue * (area.commissionRate / 100);

                  return (
                    <tr key={area.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 py-4 font-mono font-bold text-slate-400">#{area.id}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{area.name}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold px-1.5 py-0.5 bg-slate-100 rounded block w-max mt-0.5">
                          Tipe: {area.type}
                        </span>
                      </td>
                      <td className="py-4 font-semibold text-slate-800">{area.regionalPartnerName}</td>
                      <td className="py-4 font-mono text-slate-500">{area.phone || '-'}</td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 font-mono">
                          {area.commissionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`font-semibold px-2 py-1 rounded-lg text-[10px] ${
                          area.serviceFeeMultiplier > 1.0 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : area.serviceFeeMultiplier < 1.0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-50 text-slate-600 border border-slate-150'
                        }`}>
                          {area.serviceFeeMultiplier.toFixed(2)}x
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex justify-center items-center gap-1 font-mono text-[10px] text-slate-500 font-semibold">
                          <span className="text-indigo-600" title="Pelanggan">{areaP}P</span>
                          <span>/</span>
                          <span className="text-indigo-600" title="Driver">{areaD}D</span>
                          <span>/</span>
                          <span className="text-sky-600" title="Merchant">{areaM}M</span>
                        </div>
                      </td>
                      <td className="py-4 text-right font-bold text-slate-800 font-mono">
                        Rp {area.totalRevenue.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-right font-bold text-indigo-600 font-mono bg-indigo-50/30">
                        Rp {partnerCommission.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-center">
                        {area.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-semibold">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-full text-[10px] font-semibold">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="pr-6 py-4 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => {
                              setSelectedSimulateAreaId(area.id);
                              setIsSimulateModalOpen(true);
                            }}
                            title="Simulasikan Transaksi Order Daerah"
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/50 cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                          >
                            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-100 animate-pulse" />
                            <span>Simulasi Order</span>
                          </button>
                          <button
                            onClick={() => {
                              setEditingArea(area);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Wilayah"
                            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-400">
                    Tidak ada Vendor Area yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. MODAL TAMBAH AREA / DAFTAR BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Daftarkan Vendor Area Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Tipe Daerah *</label>
                  <select
                    value={newArea.type}
                    onChange={(e) => setNewArea({...newArea, type: e.target.value as AreaType})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Kota">Kota Madya (Kota)</option>
                    <option value="Kabupaten">Kabupaten</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Wilayah *</label>
                  <input
                    type="text"
                    required
                    value={newArea.name}
                    onChange={(e) => setNewArea({...newArea, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Kota Semarang"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Koordinator (Partner) *</label>
                  <input
                    type="text"
                    required
                    value={newArea.regionalPartnerName}
                    onChange={(e) => setNewArea({...newArea, regionalPartnerName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Bagus Permadi"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. HP Koordinator *</label>
                  <input
                    type="text"
                    required
                    value={newArea.phone}
                    onChange={(e) => setNewArea({...newArea, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="081233..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Bagi Hasil Vendor (%) *</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={newArea.commissionRate}
                    onChange={(e) => setNewArea({...newArea, commissionRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Faktor Multiplier Tarif *</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={newArea.serviceFeeMultiplier}
                    onChange={(e) => setNewArea({...newArea, serviceFeeMultiplier: parseFloat(e.target.value) || 1.0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Simpan Vendor Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT AREA */}
      {isEditModalOpen && editingArea && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Edit Data Vendor Area</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingArea(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Tipe Wilayah</label>
                  <select
                    value={editingArea.type}
                    onChange={(e) => setEditingArea({...editingArea, type: e.target.value as AreaType})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Kota">Kota</option>
                    <option value="Kabupaten">Kabupaten</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Wilayah *</label>
                  <input
                    type="text"
                    required
                    value={editingArea.name}
                    onChange={(e) => setEditingArea({...editingArea, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Koordinator Daerah *</label>
                  <input
                    type="text"
                    required
                    value={editingArea.regionalPartnerName}
                    onChange={(e) => setEditingArea({...editingArea, regionalPartnerName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. HP Hubungan *</label>
                  <input
                    type="text"
                    required
                    value={editingArea.phone}
                    onChange={(e) => setEditingArea({...editingArea, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Bagi Hasil Vendor (%)</label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={editingArea.commissionRate}
                    onChange={(e) => setEditingArea({...editingArea, commissionRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Faktor Multiplier Tarif</label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={editingArea.serviceFeeMultiplier}
                    onChange={(e) => setEditingArea({...editingArea, serviceFeeMultiplier: parseFloat(e.target.value) || 1.0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Status Vendor Area</label>
                  <select
                    value={editingArea.status}
                    onChange={(e) => setEditingArea({...editingArea, status: e.target.value as 'Active' | 'Inactive'})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingArea(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL SIMULASI ORDER WILAYAH */}
      {isSimulateModalOpen && selectedSimulateAreaId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 fill-rose-100" />
                <span>Simulasi Perjalanan / Order Daerah</span>
              </h3>
              <button onClick={() => { setIsSimulateModalOpen(false); setSelectedSimulateAreaId(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>

            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Fitur ini mensimulasikan orderan yang sukses di wilayah <b>{areas.find(a => a.id === selectedSimulateAreaId)?.name}</b>. Transaksi ini akan menyumbang pendapatan daerah (Omzet) dan memicu bagi hasil koordinator secara otomatis.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Total Nilai Perjalanan / Belanja (Rp)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[15000, 30000, 75000, 150000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSimulateAmount(amt)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        simulateAmount === amt
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={simulateAmount}
                  onChange={(e) => setSimulateAmount(parseInt(e.target.value) || 0)}
                  className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsSimulateModalOpen(false); setSelectedSimulateAreaId(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Simulasikan Order!
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
