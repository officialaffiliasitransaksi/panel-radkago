import React, { useState } from 'react';
import { Search, Plus, CreditCard, Edit, Trash2, ArrowUpDown, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Customer, PartnershipArea, UserStatus } from '../types';

interface CustomersTabProps {
  customers: Customer[];
  areas: PartnershipArea[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onTopupCustomer: (id: string, amount: number) => void;
}

export default function CustomersTab({
  customers,
  areas,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onTopupCustomer,
}: CustomersTabProps) {
  // Local state for Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);

  // Form states
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    name: '',
    phone: '',
    email: '',
    wallet_balance: 0,
    status: 'Active' as UserStatus,
    registeredAreaId: areas[0]?.id || 'surabaya',
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [topupAmount, setTopupAmount] = useState<number>(50000);
  const [topupTargetId, setTopupTargetId] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof Customer>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and Sorted list
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesArea = areaFilter === 'all' || customer.registeredAreaId === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
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
    if (!newCustomer.username || !newCustomer.name || !newCustomer.phone) {
      alert('Mohon isi kolom Username, Nama, dan No. Handphone!');
      return;
    }
    onAddCustomer(newCustomer);
    setNewCustomer({
      username: '',
      name: '',
      phone: '',
      email: '',
      wallet_balance: 0,
      status: 'Active',
      registeredAreaId: areas[0]?.id || 'surabaya',
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onEditCustomer(editingCustomer);
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    }
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topupTargetId && topupAmount > 0) {
      onTopupCustomer(topupTargetId, topupAmount);
      setIsTopupModalOpen(false);
      setTopupTargetId(null);
      setTopupAmount(50000);
    }
  };

  return (
    <div className="space-y-6" id="customers-tab-root">
      {/* Search and Filters panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, username, HP, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-600 font-medium"
            >
              <option value="all">Semua Status</option>
              <option value="Active">Aktif</option>
              <option value="Pending">Tertunda</option>
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
              <span>Tambah Pelanggan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
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
                  <span className="flex items-center gap-1">Nama Lengkap <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4">No. Handphone</th>
                <th className="py-4">Email</th>
                <th className="py-4">Wilayah</th>
                <th onClick={() => handleSort('wallet_balance')} className="py-4 text-right cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="flex items-center gap-1 justify-end">Saldo <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-4 text-center">Status</th>
                <th className="pr-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const customerArea = areas.find(a => a.id === customer.registeredAreaId);

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="pl-6 py-4 font-mono font-semibold text-slate-400">#{customer.id}</td>
                      <td className="py-4 font-semibold text-slate-900">{customer.username}</td>
                      <td className="py-4 font-medium text-slate-800">{customer.name}</td>
                      <td className="py-4 font-mono text-slate-500">{customer.phone}</td>
                      <td className="py-4 text-slate-500">{customer.email || '-'}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg font-medium text-[10px]">
                          {customerArea?.name || 'Sistem Pusat'}
                        </span>
                      </td>
                      <td className="py-4 text-right font-bold text-emerald-600">
                        Rp {customer.wallet_balance.toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-center">
                        {customer.status === 'Active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-semibold">
                            <ShieldCheck className="w-3 h-3" /> Aktif
                          </span>
                        )}
                        {customer.status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-semibold">
                            Tertunda
                          </span>
                        )}
                        {customer.status === 'Suspended' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[10px] font-semibold">
                            <ShieldAlert className="w-3 h-3" /> Suspend
                          </span>
                        )}
                      </td>
                      <td className="pr-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setTopupTargetId(customer.id);
                              setIsTopupModalOpen(true);
                            }}
                            title="Top Up Saldo"
                            className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/50 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCustomer(customer);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit"
                            className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus pelanggan ${customer.name}?`)) {
                                onDeleteCustomer(customer.id);
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
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    Tidak ada data pelanggan yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. MODAL TAMBAH PELANGGAN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Registrasi Pelanggan Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Username *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.username}
                    onChange={(e) => setNewCustomer({...newCustomer, username: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="budis"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="081234..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="budi@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Saldo Awal (Rp)</label>
                  <input
                    type="number"
                    value={newCustomer.wallet_balance}
                    onChange={(e) => setNewCustomer({...newCustomer, wallet_balance: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah *</label>
                  <select
                    value={newCustomer.registeredAreaId}
                    onChange={(e) => setNewCustomer({...newCustomer, registeredAreaId: e.target.value})}
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
                  value={newCustomer.status}
                  onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value as UserStatus})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                >
                  <option value="Active">Aktif</option>
                  <option value="Pending">Tertunda</option>
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
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT PELANGGAN */}
      {isEditModalOpen && editingCustomer && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Edit Data Pelanggan #{editingCustomer.id}</h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingCustomer(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">No. Handphone *</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Email</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase block">Wilayah</label>
                  <select
                    value={editingCustomer.registeredAreaId}
                    onChange={(e) => setEditingCustomer({...editingCustomer, registeredAreaId: e.target.value})}
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
                    value={editingCustomer.status}
                    onChange={(e) => setEditingCustomer({...editingCustomer, status: e.target.value as UserStatus})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-600 font-medium"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Pending">Tertunda</option>
                    <option value="Suspended">Ditangguhkan</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingCustomer(null); }}
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
              <h3 className="font-semibold text-slate-800 text-sm">Top Up Saldo Dompet</h3>
              <button onClick={() => { setIsTopupModalOpen(false); setTopupTargetId(null); }} className="text-slate-400 hover:text-slate-600 text-base">&times;</button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Lakukan pengisian saldo manual untuk pelanggan <b>{customers.find(c => c.id === topupTargetId)?.name}</b>.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Nominal Top Up (Rp)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[20000, 50000, 100000, 200000, 500000].map((amt) => (
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
                  Proses Top Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
