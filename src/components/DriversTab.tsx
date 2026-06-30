import React, { useState } from 'react';
import { Search, Plus, Bike, Car, Truck, Star, Edit, Trash2, ArrowUpDown, UserCheck, ShieldAlert, CreditCard } from 'lucide-react';
import { Driver, PartnershipArea, DriverStatus, VehicleType } from '../types';

interface DriversTabProps {
  drivers: Driver[];
  areas: PartnershipArea[];
  onAddDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void;
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
  onApproveDriver: (id: string) => void;
  onTopupDriver: (id: string, amount: number) => void;
}

export default function DriversTab({
  drivers,
  areas,
  onAddDriver,
  onEditDriver,
  onDeleteDriver,
  onApproveDriver,
  onTopupDriver,
}: DriversTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  // Form states
  const [newDriver, setNewDriver] = useState({
    username: '',
    name: '',
    phone: '',
    email: '',
    wallet_balance: 0,
    vehicleType: 'Motor' as VehicleType,
    vehiclePlate: '',
    rating: 5.0,
    status: 'Active' as DriverStatus,
    registeredAreaId: areas[0]?.id || 'surabaya',
  });

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(50000);
  const [topupTargetId, setTopupTargetId] = useState<string | null>(null);

  // Sort state
  const [sortField, setSortField] = useState<keyof Driver>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Driver) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredDrivers = drivers
    .filter(driver => {
      const matchesSearch = 
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
      const matchesVehicle = vehicleFilter === 'all' || driver.vehicleType === vehicleFilter;
      const matchesArea = areaFilter === 'all' || driver.registeredAreaId === areaFilter;

      return matchesSearch && matchesStatus && matchesVehicle && matchesArea;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.username || !newDriver.name || !newDriver.vehiclePlate) {
      alert('Mohon isi kolom Username, Nama, dan Plat Nomor!');
      return;
    }
    onAddDriver(newDriver);
    setNewDriver({
      username: '',
      name: '',
      phone: '',
      email: '',
      wallet_balance: 0,
      vehicleType: 'Motor',
      vehiclePlate: '',
      rating: 5.0,
      status: 'Active',
      registeredAreaId: areas[0]?.id || 'surabaya',
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      onEditDriver(editingDriver);
      setIsEditModalOpen(false);
      setEditingDriver(null);
    }
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topupTargetId && topupAmount > 0) {
      onTopupDriver(topupTargetId, topupAmount);
      setIsTopupModalOpen(false);
      setTopupTargetId(null);
      setTopupAmount(50000);
    }
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'Mobil':
        return <Car className="w-4 h-4 text-indigo-600" />;
      case 'Kurir':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bike className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6" id="drivers-tab-root">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari driver, nopol, username, HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Vehicle Type Filter */}
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Armada</option>
              <option value="Motor">Motor (Ojol)</option>
              <option value="Mobil">Mobil (Car)</option>
              <option value="Bentor">Bentor (Becak Motor)</option>
              <option value="Kurir">Kurir (Logistik)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="Active">Aktif (Terverifikasi)</option>
              <option value="Pending">Menunggu Verifikasi</option>
              <option value="Suspended">Ditangguhkan</option>
            </select>

            {/* Area Filter */}
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Wilayah</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mitra Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Drivers List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th onClick={() => handleSort('id')} className="pl-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => handleSort('username')} className="py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">Username <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => handleSort('name')} className="py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">Nama Driver <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4">No. Handphone</th>
                <th className="py-4">Armada</th>
                <th className="py-4">Plat Nomor</th>
                <th onClick={() => handleSort('rating')} className="py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1 justify-center">Rating <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4">Wilayah</th>
                <th onClick={() => handleSort('wallet_balance')} className="py-4 text-right cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1 justify-end">Saldo Dompet <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4 text-center">Status</th>
                <th className="pr-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => {
                  const driverArea = areas.find(a => a.id === driver.registeredAreaId);

                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 py-4 font-mono font-semibold text-slate-400">#{driver.id}</td>
                      <td className="py-4 font-semibold text-slate-900">{driver.username}</td>
                      <td className="py-4 font-medium text-slate-800">{driver.name}</td>
                      <td className="py-4 font-mono text-slate-500">{driver.phone}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-800">
                          {getVehicleIcon(driver.vehicleType)}
                          <span>{driver.vehicleType}</span>
                        </div>
                      </td>
                      <td className="py-4 font-mono font-bold text-slate-600 bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-150 inline-block mt-3 ml-2">
                        {driver.vehiclePlate}
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-800">{driver.rating > 0 ? driver.rating.toFixed(1) : '-'}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium text-[10px]">
                          {driverArea?.name || 'Sistem Pusat'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-600">
                        Rp {driver.wallet_balance.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-center">
                        {driver.status === 'Active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold">
                            Aktif
                          </span>
                        )}
                        {driver.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-semibold animate-pulse">
                            Pending Verifikasi
                          </span>
                        )}
                        {driver.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-semibold">
                            <ShieldAlert className="w-3 h-3" /> Suspend
                          </span>
                        )}
                      </td>
                      <td className="pr-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {driver.status === 'Pending' && (
                            <button
                              onClick={() => onApproveDriver(driver.id)}
                              title="Setujui Kemitraan"
                              className="p-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300/50 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setTopupTargetId(driver.id);
                              setIsTopupModalOpen(true);
                            }}
                            title="Bagi Hasil / Kredit"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/50 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingDriver(driver);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit"
                            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus mitra driver ${driver.name}?`)) {
                                onDeleteDriver(driver.id);
                              }
                            }}
                            title="Hapus"
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200/50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-400">
                    Tidak ada data driver yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. MODAL TAMBAH DRIVER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Registrasi Driver Baru (Ojol / Car)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Username *</label>
                  <input
                    type="text"
                    required
                    value={newDriver.username}
                    onChange={(e) => setNewDriver({...newDriver, username: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="supri_ojol"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Driver *</label>
                  <input
                    type="text"
                    required
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Supriadi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone *</label>
                  <input
                    type="text"
                    required
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="081299..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Email</label>
                  <input
                    type="email"
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="supri@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Jenis Armada *</label>
                  <select
                    value={newDriver.vehicleType}
                    onChange={(e) => setNewDriver({...newDriver, vehicleType: e.target.value as VehicleType})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Motor">Motor (Ojol)</option>
                    <option value="Mobil">Mobil (Ojol Car)</option>
                    <option value="Bentor">Bentor (Becak Motor)</option>
                    <option value="Kurir">Kurir (Logistik)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Plat Nomor Kendaraan *</label>
                  <input
                    type="text"
                    required
                    value={newDriver.vehiclePlate}
                    onChange={(e) => setNewDriver({...newDriver, vehiclePlate: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="L 1234 ABC"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Saldo Dompet Mitra</label>
                  <input
                    type="number"
                    value={newDriver.wallet_balance}
                    onChange={(e) => setNewDriver({...newDriver, wallet_balance: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah Operasional *</label>
                  <select
                    value={newDriver.registeredAreaId}
                    onChange={(e) => setNewDriver({...newDriver, registeredAreaId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Status Kemitraan</label>
                <select
                  value={newDriver.status}
                  onChange={(e) => setNewDriver({...newDriver, status: e.target.value as DriverStatus})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                >
                  <option value="Active">Aktif (Terverifikasi)</option>
                  <option value="Pending">Pending (Butuh Verifikasi)</option>
                  <option value="Suspended">Ditangguhkan</option>
                </select>
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
                  Simpan Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT DRIVER */}
      {isEditModalOpen && editingDriver && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Edit Data Driver #{editingDriver.id}</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingDriver(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editingDriver.name}
                  onChange={(e) => setEditingDriver({...editingDriver, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone *</label>
                  <input
                    type="text"
                    required
                    value={editingDriver.phone}
                    onChange={(e) => setEditingDriver({...editingDriver, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Email</label>
                  <input
                    type="email"
                    value={editingDriver.email}
                    onChange={(e) => setEditingDriver({...editingDriver, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Jenis Armada *</label>
                  <select
                    value={editingDriver.vehicleType}
                    onChange={(e) => setEditingDriver({...editingDriver, vehicleType: e.target.value as VehicleType})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Motor">Motor</option>
                    <option value="Mobil">Mobil</option>
                    <option value="Bentor">Bentor</option>
                    <option value="Kurir">Kurir</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Plat Nomor Kendaraan *</label>
                  <input
                    type="text"
                    required
                    value={editingDriver.vehiclePlate}
                    onChange={(e) => setEditingDriver({...editingDriver, vehiclePlate: e.target.value.toUpperCase()})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah Operasional</label>
                  <select
                    value={editingDriver.registeredAreaId}
                    onChange={(e) => setEditingDriver({...editingDriver, registeredAreaId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Rating Mitra (0.0 - 5.0)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editingDriver.rating}
                    onChange={(e) => setEditingDriver({...editingDriver, rating: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Status Kemitraan</label>
                <select
                  value={editingDriver.status}
                  onChange={(e) => setEditingDriver({...editingDriver, status: e.target.value as DriverStatus})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                >
                  <option value="Active">Aktif</option>
                  <option value="Pending">Butuh Verifikasi</option>
                  <option value="Suspended">Ditangguhkan</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingDriver(null); }}
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

      {/* 3. MODAL KREDIT / TOP UP SALDO */}
      {isTopupModalOpen && topupTargetId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Top Up Dompet Driver</h3>
              <button onClick={() => { setIsTopupModalOpen(false); setTopupTargetId(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Lakukan penambahan saldo/kredit manual untuk driver <b>{drivers.find(d => d.id === topupTargetId)?.name}</b>.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nominal (Rp)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000, 150000, 250000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopupAmount(amt)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        topupAmount === amt
                          ? 'bg-indigo-600 border-indigo-600 text-white'
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
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(parseInt(e.target.value) || 0)}
                  className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsTopupModalOpen(false); setTopupTargetId(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Top Up Kredit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
