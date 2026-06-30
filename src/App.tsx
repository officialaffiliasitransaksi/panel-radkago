import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  Store, 
  MapPin, 
  RotateCw, 
  Menu, 
  X, 
  CircleAlert, 
  TrendingUp, 
  Smartphone,
  Sparkles,
  Map,
  CreditCard
} from 'lucide-react';
import { 
  INITIAL_AREAS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DRIVERS, 
  INITIAL_MERCHANTS, 
  INITIAL_LOGS 
} from './data';
import { 
  Customer, 
  Driver, 
  Merchant, 
  PartnershipArea, 
  ActivityLog,
  UserStatus,
  DriverStatus,
  MerchantStatus
} from './types';

import DashboardStats from './components/DashboardStats';
import CustomersTab from './components/CustomersTab';
import DriversTab from './components/DriversTab';
import MerchantsTab from './components/MerchantsTab';
import PartnershipTab from './components/PartnershipTab';
import MapsTab from './components/MapsTab';
import PaymentTab from './components/PaymentTab';

export default function App() {
  // Navigation tabs: 'dashboard', 'customers', 'drivers', 'merchants', 'partnerships'
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core application states
  const [areas, setAreas] = useState<PartnershipArea[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Toast / notification feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from localStorage or default static mock data
  useEffect(() => {
    const savedAreas = localStorage.getItem('radjago_areas');
    const savedCustomers = localStorage.getItem('radjago_customers');
    const savedDrivers = localStorage.getItem('radjago_drivers');
    const savedMerchants = localStorage.getItem('radjago_merchants');
    const savedLogs = localStorage.getItem('radjago_logs');

    if (savedAreas) setAreas(JSON.parse(savedAreas));
    else setAreas(INITIAL_AREAS);

    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    else setCustomers(INITIAL_CUSTOMERS);

    if (savedDrivers) setDrivers(JSON.parse(savedDrivers));
    else setDrivers(INITIAL_DRIVERS);

    if (savedMerchants) setMerchants(JSON.parse(savedMerchants));
    else setMerchants(INITIAL_MERCHANTS);

    if (savedLogs) setLogs(JSON.parse(savedLogs));
    else setLogs(INITIAL_LOGS);
  }, []);

  // Save states helper
  const saveState = (
    updatedAreas?: PartnershipArea[],
    updatedCustomers?: Customer[],
    updatedDrivers?: Driver[],
    updatedMerchants?: Merchant[],
    updatedLogs?: ActivityLog[]
  ) => {
    if (updatedAreas) {
      setAreas(updatedAreas);
      localStorage.setItem('radjago_areas', JSON.stringify(updatedAreas));
    }
    if (updatedCustomers) {
      setCustomers(updatedCustomers);
      localStorage.setItem('radjago_customers', JSON.stringify(updatedCustomers));
    }
    if (updatedDrivers) {
      setDrivers(updatedDrivers);
      localStorage.setItem('radjago_drivers', JSON.stringify(updatedDrivers));
    }
    if (updatedMerchants) {
      setMerchants(updatedMerchants);
      localStorage.setItem('radjago_merchants', JSON.stringify(updatedMerchants));
    }
    if (updatedLogs) {
      setLogs(updatedLogs);
      localStorage.setItem('radjago_logs', JSON.stringify(updatedLogs));
    }
  };

  // Toast handler
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add a helper for activity log creation
  const addLog = (
    category: ActivityLog['category'],
    type: ActivityLog['type'],
    description: string,
    currentLogs: ActivityLog[]
  ): ActivityLog[] => {
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 16);
    const newLog: ActivityLog = {
      id: `L-${Date.now().toString().slice(-4)}`,
      category,
      type,
      description,
      timestamp: formattedTime,
      user: 'Admin Utama',
    };
    const updated = [...currentLogs, newLog];
    saveState(undefined, undefined, undefined, undefined, updated);
    return updated;
  };

  // ----------------------------------------------------
  // CUSTOMER ACTIONS
  // ----------------------------------------------------
  const handleAddCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...custData,
      id: `C-${(customers.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newCust, ...customers];
    saveState(undefined, updated, undefined, undefined, undefined);
    
    // Log
    const areaName = areas.find(a => a.id === custData.registeredAreaId)?.name || 'Pusat';
    addLog('Customer', 'Create', `Menambahkan pelanggan baru ${custData.name} (${custData.username}) di ${areaName}`, logs);
    triggerToast(`Pelanggan ${custData.name} berhasil terdaftar!`);
  };

  const handleEditCustomer = (editedCust: Customer) => {
    const updated = customers.map(c => c.id === editedCust.id ? editedCust : c);
    saveState(undefined, updated, undefined, undefined, undefined);

    // Log
    addLog('Customer', 'Update', `Memperbarui data profil pelanggan ${editedCust.name} (ID: ${editedCust.id})`, logs);
    triggerToast(`Data ${editedCust.name} berhasil diperbarui!`);
  };

  const handleDeleteCustomer = (id: string) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;
    const updated = customers.filter(c => c.id !== id);
    saveState(undefined, updated, undefined, undefined, undefined);

    // Log
    addLog('Customer', 'Delete', `Menghapus pelanggan ${target.name} dari sistem`, logs);
    triggerToast(`Pelanggan ${target.name} dihapus dari database.`);
  };

  const handleTopupCustomer = (id: string, amount: number) => {
    const target = customers.find(c => c.id === id);
    if (!target) return;
    
    const updated = customers.map(c => {
      if (c.id === id) {
        return { ...c, wallet_balance: c.wallet_balance + amount };
      }
      return c;
    });
    saveState(undefined, updated, undefined, undefined, undefined);

    // Log
    addLog('Customer', 'Transaction', `Pengisian saldo manual (Top Up) untuk ${target.name} sebesar Rp ${amount.toLocaleString('id-ID')}`, logs);
    triggerToast(`Berhasil Top Up Rp ${amount.toLocaleString('id-ID')} untuk ${target.name}`);
  };

  // ----------------------------------------------------
  // DRIVER ACTIONS
  // ----------------------------------------------------
  const handleAddDriver = (driverData: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDrv: Driver = {
      ...driverData,
      id: `D-${(drivers.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newDrv, ...drivers];
    saveState(undefined, undefined, updated, undefined, undefined);

    // Log
    const areaName = areas.find(a => a.id === driverData.registeredAreaId)?.name || 'Pusat';
    addLog('Driver', 'Create', `Registrasi driver baru ${driverData.name} armada ${driverData.vehicleType} [${driverData.vehiclePlate}] di ${areaName}`, logs);
    triggerToast(`Driver ${driverData.name} berhasil terdaftar.`);
  };

  const handleEditDriver = (editedDrv: Driver) => {
    const updated = drivers.map(d => d.id === editedDrv.id ? editedDrv : d);
    saveState(undefined, undefined, updated, undefined, undefined);

    addLog('Driver', 'Update', `Memperbarui profil & armada driver ${editedDrv.name} (${editedDrv.vehiclePlate})`, logs);
    triggerToast(`Data driver ${editedDrv.name} diperbarui!`);
  };

  const handleDeleteDriver = (id: string) => {
    const target = drivers.find(d => d.id === id);
    if (!target) return;
    const updated = drivers.filter(d => d.id !== id);
    saveState(undefined, undefined, updated, undefined, undefined);

    addLog('Driver', 'Delete', `Menghapus driver ${target.name} dari sistem`, logs);
    triggerToast(`Driver ${target.name} telah dihapus.`);
  };

  const handleApproveDriver = (id: string) => {
    const target = drivers.find(d => d.id === id);
    if (!target) return;
    const updated = drivers.map(d => {
      if (d.id === id) {
        return { ...d, status: 'Active' as DriverStatus };
      }
      return d;
    });
    saveState(undefined, undefined, updated, undefined, undefined);

    addLog('Driver', 'Verify', `Memverifikasi & mengaktifkan akun kemitraan driver ${target.name}`, logs);
    triggerToast(`Akun driver ${target.name} diaktifkan!`);
  };

  const handleTopupDriver = (id: string, amount: number) => {
    const target = drivers.find(d => d.id === id);
    if (!target) return;

    const updated = drivers.map(d => {
      if (d.id === id) {
        return { ...d, wallet_balance: d.wallet_balance + amount };
      }
      return d;
    });
    saveState(undefined, undefined, updated, undefined, undefined);

    addLog('Driver', 'Transaction', `Kredit dompet driver (Top Up) ${target.name} sebesar Rp ${amount.toLocaleString('id-ID')}`, logs);
    triggerToast(`Berhasil menambahkan saldo Rp ${amount.toLocaleString('id-ID')} ke dompet driver ${target.name}`);
  };

  // ----------------------------------------------------
  // MERCHANT ACTIONS
  // ----------------------------------------------------
  const handleAddMerchant = (merchData: Omit<Merchant, 'id' | 'createdAt'>) => {
    const newMerch: Merchant = {
      ...merchData,
      id: `M-${(merchants.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newMerch, ...merchants];
    saveState(undefined, undefined, undefined, updated, undefined);

    const areaName = areas.find(a => a.id === merchData.registeredAreaId)?.name || 'Pusat';
    addLog('Merchant', 'Create', `Registrasi usaha baru ${merchData.businessName} (${merchData.category}) milik ${merchData.name} di ${areaName}`, logs);
    triggerToast(`Toko ${merchData.businessName} terdaftar.`);
  };

  const handleEditMerchant = (editedMerch: Merchant) => {
    const updated = merchants.map(m => m.id === editedMerch.id ? editedMerch : m);
    saveState(undefined, undefined, undefined, updated, undefined);

    addLog('Merchant', 'Update', `Memperbarui profil usaha merchant ${editedMerch.businessName}`, logs);
    triggerToast(`Data merchant ${editedMerch.businessName} diperbarui!`);
  };

  const handleDeleteMerchant = (id: string) => {
    const target = merchants.find(m => m.id === id);
    if (!target) return;
    const updated = merchants.filter(m => m.id !== id);
    saveState(undefined, undefined, undefined, updated, undefined);

    addLog('Merchant', 'Delete', `Menghapus kemitraan merchant ${target.businessName}`, logs);
    triggerToast(`Merchant ${target.businessName} telah dihapus.`);
  };

  const handleApproveMerchant = (id: string) => {
    const target = merchants.find(m => m.id === id);
    if (!target) return;
    const updated = merchants.map(m => {
      if (m.id === id) {
        return { ...m, status: 'Active' as MerchantStatus };
      }
      return m;
    });
    saveState(undefined, undefined, undefined, updated, undefined);

    addLog('Merchant', 'Verify', `Verifikasi & merestui pembukaan toko merchant ${target.businessName} secara nasional`, logs);
    triggerToast(`Merchant ${target.businessName} sekarang aktif!`);
  };

  const handleTopupMerchant = (id: string, amount: number) => {
    const target = merchants.find(m => m.id === id);
    if (!target) return;

    const updated = merchants.map(m => {
      if (m.id === id) {
        return { ...m, wallet_balance: m.wallet_balance + amount };
      }
      return m;
    });
    saveState(undefined, undefined, undefined, updated, undefined);

    addLog('Merchant', 'Transaction', `Pengisian saldo dompet merchant ${target.businessName} sebesar Rp ${amount.toLocaleString('id-ID')}`, logs);
    triggerToast(`Berhasil mengisi saldo Rp ${amount.toLocaleString('id-ID')} untuk merchant ${target.businessName}`);
  };

  // ----------------------------------------------------
  // PARTNERSHIP / REGIONAL AREA ACTIONS
  // ----------------------------------------------------
  const handleAddArea = (newArea: PartnershipArea) => {
    const updated = [...areas, newArea];
    saveState(updated, undefined, undefined, undefined, undefined);

    addLog('Partnership', 'Create', `Mendaftarkan kemitraan wilayah baru: ${newArea.name} koordinator ${newArea.regionalPartnerName}`, logs);
    triggerToast(`Wilayah ${newArea.name} berhasil terdaftar.`);
  };

  const handleEditArea = (editedArea: PartnershipArea) => {
    const updated = areas.map(a => a.id === editedArea.id ? editedArea : a);
    saveState(updated, undefined, undefined, undefined, undefined);

    addLog('Partnership', 'Update', `Memperbarui rincian kemitraan wilayah ${editedArea.name} (Bagi hasil: ${editedArea.commissionRate}%)`, logs);
    triggerToast(`Data kemitraan ${editedArea.name} diperbarui!`);
  };

  const handleSimulateRegionalOrder = (areaId: string, amount: number) => {
    const area = areas.find(a => a.id === areaId);
    if (!area) return;

    // Simulate order increases regional total revenue
    const updatedAreas = areas.map(a => {
      if (a.id === areaId) {
        return { ...a, totalRevenue: a.totalRevenue + amount };
      }
      return a;
    });

    saveState(updatedAreas, undefined, undefined, undefined, undefined);

    // Calculate simulated share
    const sharedAmount = amount * (area.commissionRate / 100);
    addLog('Partnership', 'Transaction', `Simulasi Order Daerah di ${area.name} bernilai Rp ${amount.toLocaleString('id-ID')} (Bagi Hasil Koordinator: Rp ${sharedAmount.toLocaleString('id-ID')})`, logs);
    triggerToast(`Simulasi Sukses! Omzet wilayah ${area.name} bertambah Rp ${amount.toLocaleString('id-ID')}`);
  };

  // Helper counters
  const customersCountByArea: Record<string, number> = {};
  const driversCountByArea: Record<string, number> = {};
  const merchantsCountByArea: Record<string, number> = {};

  customers.forEach(c => {
    customersCountByArea[c.registeredAreaId] = (customersCountByArea[c.registeredAreaId] || 0) + 1;
  });
  drivers.forEach(d => {
    driversCountByArea[d.registeredAreaId] = (driversCountByArea[d.registeredAreaId] || 0) + 1;
  });
  merchants.forEach(m => {
    merchantsCountByArea[m.registeredAreaId] = (merchantsCountByArea[m.registeredAreaId] || 0) + 1;
  });

  // Master reset
  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang database ke data bawaan Radjago? Semua input baru Anda akan hilang.')) {
      localStorage.removeItem('radjago_areas');
      localStorage.removeItem('radjago_customers');
      localStorage.removeItem('radjago_drivers');
      localStorage.removeItem('radjago_merchants');
      localStorage.removeItem('radjago_logs');

      setAreas(INITIAL_AREAS);
      setCustomers(INITIAL_CUSTOMERS);
      setDrivers(INITIAL_DRIVERS);
      setMerchants(INITIAL_MERCHANTS);
      setLogs(INITIAL_LOGS);

      triggerToast('Database Radjago berhasil di-reset!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root">
      {/* Dynamic Toast Feedback banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold py-3.5 px-5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container with Sidebar on Desktop */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white text-slate-600 border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div>
            {/* Sidebar Logo Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 text-white">
                  <Smartphone className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-slate-800 text-base tracking-tight">Radjago Admin</h1>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Ojol Dashboard</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sidebar Navigation items */}
            <nav className="p-4 space-y-1">
              <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Main Menu</span>
              
              {/* Dashboard overview */}
              <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Overview</span>
              </button>

              {/* Customers tab */}
              <button
                onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'customers'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <div className="flex justify-between items-center w-full">
                  <span>Pelanggan (Customers)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === 'customers' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {customers.length}
                  </span>
                </div>
              </button>

              {/* Drivers Tab */}
              <button
                onClick={() => { setActiveTab('drivers'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'drivers'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <Bike className="w-4 h-4 shrink-0" />
                <div className="flex justify-between items-center w-full">
                  <span>Mitra Driver</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === 'drivers' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {drivers.length}
                  </span>
                </div>
              </button>

              {/* Merchants Tab */}
              <button
                onClick={() => { setActiveTab('merchants'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'merchants'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <div className="flex justify-between items-center w-full">
                  <span>Mitra Merchant (Usaha)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    activeTab === 'merchants' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {merchants.length}
                  </span>
                </div>
              </button>

              {/* Partnership area */}
              <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-6 mb-2">Regional Partnership</span>

              <button
                onClick={() => { setActiveTab('partnerships'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'partnerships'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <div className="flex justify-between items-center w-full">
                  <span>Vendor Area</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'partnerships' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {areas.length}
                  </span>
                </div>
              </button>

              {/* Settings area */}
              <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-6 mb-2">System Settings</span>

              <button
                onClick={() => { setActiveTab('maps'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'maps'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <Map className="w-4 h-4 shrink-0" />
                <span>API Maps</span>
              </button>

              <button
                onClick={() => { setActiveTab('payment'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'payment'
                    ? 'bg-slate-50 text-indigo-600 font-bold'
                    : 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600 font-medium'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>API Payment</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer with system status & reset */}
          <div className="p-4 border-t border-slate-100 bg-white space-y-4">
            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 font-semibold rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset Simulasi Data</span>
            </button>
            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/50">
              <p className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">Server Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-indigo-600 font-medium">Online via Tunnel</p>
              </div>
            </div>
            <div className="text-center text-[10px] text-slate-400 mt-3 font-mono">
              V1.2.0-stable • Radjago
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
          />
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* TOP BAR / HEADER */}
          <header className="sticky top-0 z-10 bg-white text-slate-800 border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-none">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg md:hidden cursor-pointer border border-slate-200"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Radjago Utama</span>
                  <span className="text-[10px] text-slate-400 font-medium">• Admin Portal</span>
                </div>
                <h2 className="font-display font-bold text-slate-800 text-lg tracking-tight mt-0.5">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'customers' && 'Manajemen Pelanggan'}
                  {activeTab === 'drivers' && 'Kemitraan Driver'}
                  {activeTab === 'merchants' && 'Kemitraan Merchant'}
                  {activeTab === 'partnerships' && 'Sistem Vendor Area'}
                  {activeTab === 'maps' && 'Konfigurasi Google Maps API'}
                  {activeTab === 'payment' && 'Konfigurasi Payment Gateway'}
                </h2>
              </div>
            </div>

            {/* Status indicators and Action button */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px]">Server Live via Tunnel</span>
              </span>

              <button
                onClick={() => {
                  triggerToast('Database disegarkan!');
                }}
                className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-colors cursor-pointer animate-none"
                title="Refresh Data"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* TAB CONTENT PANEL */}
          <div className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
            
            {/* Header intro per tab */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {activeTab === 'dashboard' && 'Selamat Datang di Portal Radjago'}
                  {activeTab === 'customers' && 'Database Pelanggan Baru'}
                  {activeTab === 'drivers' && 'Armada Mitra Driver'}
                  {activeTab === 'merchants' && 'Daftar Outlet & Restoran'}
                  {activeTab === 'partnerships' && 'Vendor Area'}
                  {activeTab === 'maps' && 'Manajemen Maps & Geolokasi'}
                  {activeTab === 'payment' && 'Manajemen Sistem Gerbang Pembayaran'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeTab === 'dashboard' && 'Memantau aktivitas, verifikasi pendaftaran ojol, dan statistik kemitraan daerah secara real-time.'}
                  {activeTab === 'customers' && 'Katalog pengguna aplikasi Radjago. Anda dapat menyunting akun, melakukan suspend, dan mengisi saldo dompet pelanggan.'}
                  {activeTab === 'drivers' && 'Kelola mitra pengemudi (Motor, Mobil, Bentor, Kurir). Setujui registrasi yang tertunda dan sesuaikan saldo dompet.'}
                  {activeTab === 'merchants' && 'Daftar mitra usaha makanan dan toko kelontong. Sesuaikan persentase potongan bagi hasil / komisi Radjago.'}
                  {activeTab === 'partnerships' && 'Kelola koordinator daerah, komisi pendapatan regional, serta faktor multiplier tarif khusus tiap Vendor Area.'}
                  {activeTab === 'maps' && 'Konfigurasikan kunci Google Maps Platform Anda untuk merender rute driver, drone, dan koordinat maps merchant.'}
                  {activeTab === 'payment' && 'Konfigurasikan server key dan client key untuk otomatisasi invoice top-up e-wallet via gerbang pembayaran.'}
                </p>
              </div>

              {activeTab === 'dashboard' && (
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl text-xs text-indigo-950 font-semibold flex items-center gap-2 max-w-sm shadow-sm">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="block font-bold">Radjago Kemitraan V1.2</span>
                    <span className="block text-[10px] text-slate-500 font-normal">Manajemen ojol tersentralisasi</span>
                  </div>
                </div>
              )}
            </div>

            {/* Render Tab components based on active selection */}
            {activeTab === 'dashboard' && (
              <DashboardStats
                customers={customers}
                drivers={drivers}
                merchants={merchants}
                areas={areas}
                logs={logs}
                onNavigate={(tab) => setActiveTab(tab)}
                onApproveDriver={handleApproveDriver}
                onApproveMerchant={handleApproveMerchant}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersTab
                customers={customers}
                areas={areas}
                onAddCustomer={handleAddCustomer}
                onEditCustomer={handleEditCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onTopupCustomer={handleTopupCustomer}
              />
            )}

            {activeTab === 'drivers' && (
              <DriversTab
                drivers={drivers}
                areas={areas}
                onAddDriver={handleAddDriver}
                onEditDriver={handleEditDriver}
                onDeleteDriver={handleDeleteDriver}
                onApproveDriver={handleApproveDriver}
                onTopupDriver={handleTopupDriver}
              />
            )}

            {activeTab === 'merchants' && (
              <MerchantsTab
                merchants={merchants}
                areas={areas}
                onAddMerchant={handleAddMerchant}
                onEditMerchant={handleEditMerchant}
                onDeleteMerchant={handleDeleteMerchant}
                onApproveMerchant={handleApproveMerchant}
                onTopupMerchant={handleTopupMerchant}
              />
            )}

            {activeTab === 'partnerships' && (
              <PartnershipTab
                areas={areas}
                customersCountByArea={customersCountByArea}
                driversCountByArea={driversCountByArea}
                merchantsCountByArea={merchantsCountByArea}
                onAddArea={handleAddArea}
                onEditArea={handleEditArea}
                onSimulateRegionalOrder={handleSimulateRegionalOrder}
              />
            )}

            {activeTab === 'maps' && (
              <MapsTab triggerToast={triggerToast} />
            )}

            {activeTab === 'payment' && (
              <PaymentTab triggerToast={triggerToast} />
            )}
          </div>

          {/* SIMPLE FOOTER */}
          <footer className="border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-400 bg-white">
            <p>© 2026 Radjago Indonesia Admin Panel. Semua hak cipta dilindungi.</p>
            <p className="text-[10px] text-slate-300 mt-1 font-mono">Dibuat untuk operasional kemitraan wilayah ojek online kabupaten / kota.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
