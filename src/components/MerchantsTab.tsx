import React, { useState } from 'react';
import { Search, Plus, Utensils, ShoppingCart, Truck, FlaskConical, Edit, Trash2, ArrowUpDown, UserCheck, ShieldAlert, CreditCard } from 'lucide-react';
import { Merchant, PartnershipArea, MerchantStatus, MerchantCategory } from '../types';

interface MerchantsTabProps {
  merchants: Merchant[];
  areas: PartnershipArea[];
  onAddMerchant: (merchant: Omit<Merchant, 'id' | 'createdAt'>) => void;
  onEditMerchant: (merchant: Merchant) => void;
  onDeleteMerchant: (id: string) => void;
  onApproveMerchant: (id: string) => void;
  onTopupMerchant: (id: string, amount: number) => void;
}

export default function MerchantsTab({
  merchants,
  areas,
  onAddMerchant,
  onEditMerchant,
  onDeleteMerchant,
  onApproveMerchant,
  onTopupMerchant,
}: MerchantsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  // Form states
  const [newMerchant, setNewMerchant] = useState({
    username: '',
    name: '', // Owner
    businessName: '', // Shop Name
    phone: '',
    email: '',
    wallet_balance: 0,
    category: 'Food' as MerchantCategory,
    commissionRate: 15, // Default 15%
    status: 'Active' as MerchantStatus,
    registeredAreaId: areas[0]?.id || 'surabaya',
  });

  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(100000);
  const [topupTargetId, setTopupTargetId] = useState<string | null>(null);

  // Sort state
  const [sortField, setSortField] = useState<keyof Merchant>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Merchant) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMerchants = merchants
    .filter(merchant => {
      const matchesSearch = 
        merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || merchant.category === categoryFilter;
      const matchesArea = areaFilter === 'all' || merchant.registeredAreaId === areaFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesArea;
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
    if (!newMerchant.username || !newMerchant.businessName || !newMerchant.name || !newMerchant.phone) {
      alert('Mohon isi kolom Username, Nama Toko, Nama Pemilik, dan No. Handphone!');
      return;
    }
    onAddMerchant(newMerchant);
    setNewMerchant({
      username: '',
      name: '',
      businessName: '',
      phone: '',
      email: '',
      wallet_balance: 0,
      category: 'Food',
      commissionRate: 15,
      status: 'Active',
      registeredAreaId: areas[0]?.id || 'surabaya',
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMerchant) {
      onEditMerchant(editingMerchant);
      setIsEditModalOpen(false);
      setEditingMerchant(null);
    }
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topupTargetId && topupAmount > 0) {
      onTopupMerchant(topupTargetId, topupAmount);
      setIsTopupModalOpen(false);
      setTopupTargetId(null);
      setTopupAmount(100000);
    }
  };

  const getCategoryIcon = (cat: MerchantCategory) => {
    switch (cat) {
      case 'Mart':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'Express':
        return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'Pharmacy':
        return <FlaskConical className="w-4 h-4 text-rose-600" />;
      default:
        return <Utensils className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6" id="merchants-tab-root">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari toko, pemilik, username, HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Kategori</option>
              <option value="Food">Kuliner (Food)</option>
              <option value="Mart">Belanja (Mart)</option>
              <option value="Express">Logistik (Express)</option>
              <option value="Pharmacy">Apotek (Pharmacy)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="Active">Aktif</option>
              <option value="Pending">Pending (Verifikasi)</option>
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
              <span>Tambah Mitra Merchant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Merchants List Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse align-middle">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th onClick={() => handleSort('id')} className="pl-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">ID <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => handleSort('businessName')} className="py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">Nama Usaha / Toko <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th onClick={() => handleSort('name')} className="py-4 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1">Nama Pemilik <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4">No. Handphone</th>
                <th className="py-4">Kategori</th>
                <th onClick={() => handleSort('commissionRate')} className="py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1 justify-center">Komisi <ArrowUpDown className="w-3 h-3" /></span>
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
              {filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => {
                  const merchantArea = areas.find(a => a.id === merchant.registeredAreaId);

                  return (
                    <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 py-4 font-mono font-semibold text-slate-400">#{merchant.id}</td>
                      <td className="py-4">
                        <span className="font-bold text-slate-900 block">{merchant.businessName}</span>
                        <span className="text-[10px] text-slate-400">usr: {merchant.username}</span>
                      </td>
                      <td className="py-4 font-medium text-slate-800">{merchant.name}</td>
                      <td className="py-4 font-mono text-slate-500">{merchant.phone}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          {getCategoryIcon(merchant.category)}
                          <span className="text-slate-700">{merchant.category}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg text-[10px]">
                          {merchant.commissionRate}%
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium text-[10px]">
                          {merchantArea?.name || 'Sistem Pusat'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-600">
                        Rp {merchant.wallet_balance.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-center">
                        {merchant.status === 'Active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold">
                            Aktif
                          </span>
                        )}
                        {merchant.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-semibold animate-pulse">
                            Pending Verifikasi
                          </span>
                        )}
                        {merchant.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-semibold">
                            <ShieldAlert className="w-3 h-3" /> Suspend
                          </span>
                        )}
                      </td>
                      <td className="pr-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {merchant.status === 'Pending' && (
                            <button
                              onClick={() => onApproveMerchant(merchant.id)}
                              title="Setujui Usaha"
                              className="p-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300/50 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setTopupTargetId(merchant.id);
                              setIsTopupModalOpen(true);
                            }}
                            title="Top Up Saldo"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/50 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingMerchant(merchant);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit"
                            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus mitra merchant ${merchant.businessName}?`)) {
                                onDeleteMerchant(merchant.id);
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
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    Tidak ada data merchant yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. MODAL TAMBAH MERCHANT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Registrasi Mitra Merchant Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Username Mitra *</label>
                  <input
                    type="text"
                    required
                    value={newMerchant.username}
                    onChange={(e) => setNewMerchant({...newMerchant, username: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="kopi_kenangan_sby"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Usaha/Toko *</label>
                  <input
                    type="text"
                    required
                    value={newMerchant.businessName}
                    onChange={(e) => setNewMerchant({...newMerchant, businessName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Kopi Kenangan Basuki Rahmat"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Pemilik *</label>
                  <input
                    type="text"
                    required
                    value={newMerchant.name}
                    onChange={(e) => setNewMerchant({...newMerchant, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Hasan Basri"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone HP *</label>
                  <input
                    type="text"
                    required
                    value={newMerchant.phone}
                    onChange={(e) => setNewMerchant({...newMerchant, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="081298..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Kategori Usaha *</label>
                  <select
                    value={newMerchant.category}
                    onChange={(e) => setNewMerchant({...newMerchant, category: e.target.value as MerchantCategory})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Food">Kuliner (Food)</option>
                    <option value="Mart">Toko Kelontong/Mart (Mart)</option>
                    <option value="Express">Logistik / Delivery (Express)</option>
                    <option value="Pharmacy">Apotek / Medis (Pharmacy)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Komisi Radjago (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newMerchant.commissionRate}
                    onChange={(e) => setNewMerchant({...newMerchant, commissionRate: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Saldo Dompet Awal (Rp)</label>
                  <input
                    type="number"
                    value={newMerchant.wallet_balance}
                    onChange={(e) => setNewMerchant({...newMerchant, wallet_balance: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah Registrasi *</label>
                  <select
                    value={newMerchant.registeredAreaId}
                    onChange={(e) => setNewMerchant({...newMerchant, registeredAreaId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Status Awal</label>
                <select
                  value={newMerchant.status}
                  onChange={(e) => setNewMerchant({...newMerchant, status: e.target.value as MerchantStatus})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                >
                  <option value="Active">Aktif (Langsung Buka)</option>
                  <option value="Pending">Tertunda (Butuh Verifikasi)</option>
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
                  Simpan Merchant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT MERCHANT */}
      {isEditModalOpen && editingMerchant && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Edit Data Merchant #{editingMerchant.id}</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingMerchant(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Toko/Usaha *</label>
                <input
                  type="text"
                  required
                  value={editingMerchant.businessName}
                  onChange={(e) => setEditingMerchant({...editingMerchant, businessName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Pemilik *</label>
                  <input
                    type="text"
                    required
                    value={editingMerchant.name}
                    onChange={(e) => setEditingMerchant({...editingMerchant, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone HP *</label>
                  <input
                    type="text"
                    required
                    value={editingMerchant.phone}
                    onChange={(e) => setEditingMerchant({...editingMerchant, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Kategori Usaha *</label>
                  <select
                    value={editingMerchant.category}
                    onChange={(e) => setEditingMerchant({...editingMerchant, category: e.target.value as MerchantCategory})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Food">Kuliner (Food)</option>
                    <option value="Mart">Belanja (Mart)</option>
                    <option value="Express">Kurir (Express)</option>
                    <option value="Pharmacy">Apotek (Pharmacy)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Komisi Radjago (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={editingMerchant.commissionRate}
                    onChange={(e) => setEditingMerchant({...editingMerchant, commissionRate: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah Operasional</label>
                  <select
                    value={editingMerchant.registeredAreaId}
                    onChange={(e) => setEditingMerchant({...editingMerchant, registeredAreaId: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    {areas.map(area => (
                      <option key={area.id} value={area.id}>{area.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Status</label>
                  <select
                    value={editingMerchant.status}
                    onChange={(e) => setEditingMerchant({...editingMerchant, status: e.target.value as MerchantStatus})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Pending">Butuh Verifikasi</option>
                    <option value="Suspended">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingMerchant(null); }}
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

      {/* 3. MODAL TOP UP SALDO */}
      {isTopupModalOpen && topupTargetId && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Isi Saldo Merchant</h3>
              <button onClick={() => { setIsTopupModalOpen(false); setTopupTargetId(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Lakukan pengisian saldo manual untuk usaha mitra <b>{merchants.find(m => m.id === topupTargetId)?.businessName}</b>.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nominal Top Up (Rp)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
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
                  step="10000"
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  Isi Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
