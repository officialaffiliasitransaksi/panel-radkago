import React from 'react';
import { Users, Bike, Store, MapPin, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Customer, Driver, Merchant, PartnershipArea, ActivityLog } from '../types';

interface DashboardStatsProps {
  customers: Customer[];
  drivers: Driver[];
  merchants: Merchant[];
  areas: PartnershipArea[];
  logs: ActivityLog[];
  onNavigate: (tab: string) => void;
  onApproveDriver: (id: string) => void;
  onApproveMerchant: (id: string) => void;
}

export default function DashboardStats({
  customers,
  drivers,
  merchants,
  areas,
  logs,
  onNavigate,
  onApproveDriver,
  onApproveMerchant,
}: DashboardStatsProps) {
  // Compute Stats
  const totalCustomers = customers.length;
  const totalDrivers = drivers.length;
  const totalMerchants = merchants.length;
  const totalAreas = areas.length;

  const pendingDrivers = drivers.filter(d => d.status === 'Pending');
  const pendingMerchants = merchants.filter(m => m.status === 'Pending');
  const activeCustomers = customers.filter(c => c.status === 'Active').length;

  // Total system volume / balance simulation
  const totalCustomerBalances = customers.reduce((sum, c) => sum + c.wallet_balance, 0);
  const totalDriverBalances = drivers.reduce((sum, d) => sum + d.wallet_balance, 0);
  const totalMerchantBalances = merchants.reduce((sum, m) => sum + m.wallet_balance, 0);
  const totalRegionalRevenueSum = areas.reduce((sum, a) => sum + a.totalRevenue, 0);

  // Quick activity counts
  const recentLogs = [...logs].reverse().slice(0, 5);

  return (
    <div className="space-y-6" id="dashboard-stats-root">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Customers Stat Card */}
        <div 
          onClick={() => onNavigate('customers')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          id="stat-card-customers"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-500 text-sm font-medium">Total Pelanggan</span>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{totalCustomers}</h3>
              <p className="text-xs text-emerald-600 flex items-center font-medium gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{activeCustomers} Aktif ({Math.round((activeCustomers/totalCustomers)*100)}%)</span>
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors duration-300">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Drivers Stat Card */}
        <div 
          onClick={() => onNavigate('drivers')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          id="stat-card-drivers"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-500 text-sm font-medium">Driver</span>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{totalDrivers}</h3>
              <p className="text-xs flex items-center font-medium mt-1">
                {pendingDrivers.length > 0 ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pendingDrivers.length} Menunggu Verifikasi
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Semua driver terverifikasi
                  </span>
                )}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors duration-300">
              <Bike className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Merchants Stat Card */}
        <div 
          onClick={() => onNavigate('merchants')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          id="stat-card-merchants"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-500 text-sm font-medium">Merchant</span>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{totalMerchants}</h3>
              <p className="text-xs flex items-center font-medium mt-1">
                {pendingMerchants.length > 0 ? (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {pendingMerchants.length} Usaha Baru
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Semua merchant aktif
                  </span>
                )}
              </p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-100 transition-colors duration-300">
              <Store className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Partnership Areas Stat Card */}
        <div 
          onClick={() => onNavigate('partnerships')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          id="stat-card-areas"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <span className="text-slate-500 text-sm font-medium">Vendor Area</span>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{totalAreas}</h3>
              <p className="text-xs text-indigo-600 flex items-center font-medium gap-1 mt-1">
                <span>Vendor Area Terdaftar</span>
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors duration-300">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Simulation and System Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h4 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Simulasi Kas & Volume Transaksi Radjago</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Total Saldo</span>
              <span className="text-lg font-bold text-slate-800 block mt-1">
                Rp {totalCustomerBalances.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">Mengendap di sistem</span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Total Dompet Driver + Merchant</span>
              <span className="text-lg font-bold text-slate-800 block mt-1">
                Rp {(totalDriverBalances + totalMerchantBalances).toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-500">Omzet mitra belum ditarik (Withdraw)</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block">Estimasi Omzet Wilayah</span>
              <span className="text-lg font-bold text-emerald-700 block mt-1">
                Rp {totalRegionalRevenueSum.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">Berdasarkan data area</span>
            </div>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="text-xs font-semibold text-indigo-800">Catatan Sistem Vendor Area</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap transaksi perjalanan ojol dan pemesanan merchant secara otomatis memotong bagi hasil aplikasi Radjago. Area koordinator (Vendor Area) memperoleh bagi hasil berkisar antara <b>2.5% hingga 4.0%</b> dari volume transaksi wilayah masing-masing secara real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Action Needed / Pending Verification list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Butuh Verifikasi ({pendingDrivers.length + pendingMerchants.length})</span>
            </h4>
            
            <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
              {pendingDrivers.map(d => (
                <div key={d.id} className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">Mitra Driver: {d.name}</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Nopol: {d.vehiclePlate} ({d.vehicleType})</span>
                  </div>
                  <button 
                    onClick={() => onApproveDriver(d.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-1 px-3.5 rounded-lg transition-colors text-[10px]"
                  >
                    Setujui
                  </button>
                </div>
              ))}

              {pendingMerchants.map(m => (
                <div key={m.id} className="flex justify-between items-center p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">Mitra Toko: {m.businessName}</span>
                    <span className="text-slate-500 text-[10px] block mt-0.5">Kategori: {m.category} | Pemilik: {m.name}</span>
                  </div>
                  <button 
                    onClick={() => onApproveMerchant(m.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3.5 rounded-lg transition-colors text-[10px]"
                  >
                    Setujui
                  </button>
                </div>
              ))}

              {pendingDrivers.length === 0 && pendingMerchants.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                  <span>Semua mitra driver & usaha dalam keadaan aktif / terverifikasi!</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center text-xs">
            <span className="text-slate-500">Status Server:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live via Tunnel</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activities Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Aktivitas Sistem Terbaru</span>
          </h4>
          <span className="text-xs text-slate-400">Menampilkan 5 aksi terakhir</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentLogs.map((log) => {
            let categoryBadgeColor = "bg-slate-100 text-slate-700";
            if (log.category === "Customer") categoryBadgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100 border";
            if (log.category === "Driver") categoryBadgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100 border";
            if (log.category === "Merchant") categoryBadgeColor = "bg-sky-50 text-sky-700 border-sky-100 border";
            if (log.category === "Partnership") categoryBadgeColor = "bg-indigo-50 text-indigo-700 border-indigo-100 border";

            return (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="flex items-start sm:items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${categoryBadgeColor}`}>
                    {log.category}
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-slate-700 font-medium">{log.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Oleh: <b className="text-slate-500 font-semibold">{log.user}</b></span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 self-end sm:self-center">
                  #{log.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
