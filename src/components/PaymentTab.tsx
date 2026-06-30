import React, { useState, useEffect } from 'react';
import { CreditCard, Key, ShieldCheck, ToggleLeft, Save, CheckCircle, Info, Landmark } from 'lucide-react';

interface PaymentTabProps {
  triggerToast: (msg: string) => void;
}

export default function PaymentTab({ triggerToast }: PaymentTabProps) {
  const [provider, setProvider] = useState('Midtrans');
  const [serverKey, setServerKey] = useState('SB-Mid-server-KxP92mR01zQwLx');
  const [clientKey, setClientKey] = useState('SB-Mid-client-2zLqY9m78pPx');
  const [showServerKey, setShowServerKey] = useState(false);
  const [envMode, setEnvMode] = useState<'Sandbox' | 'Production'>('Sandbox');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem('radjago_pay_provider');
    const savedServerKey = localStorage.getItem('radjago_pay_server_key');
    const savedClientKey = localStorage.getItem('radjago_pay_client_key');
    const savedEnv = localStorage.getItem('radjago_pay_env');

    if (savedProvider) setProvider(savedProvider);
    if (savedServerKey) setServerKey(savedServerKey);
    if (savedClientKey) setClientKey(savedClientKey);
    if (savedEnv) setEnvMode(savedEnv as 'Sandbox' | 'Production');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('radjago_pay_provider', provider);
    localStorage.setItem('radjago_pay_server_key', serverKey);
    localStorage.setItem('radjago_pay_client_key', clientKey);
    localStorage.setItem('radjago_pay_env', envMode);

    setIsSaved(true);
    triggerToast(`Konfigurasi Payment Gateway (${provider}) berhasil disimpan!`);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="payment-tab">
      {/* Left Panel: Configuration Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h4 className="text-base font-bold text-slate-800">Konfigurasi Payment Gateway</h4>
            <p className="text-xs text-slate-500 mt-0.5">Sinkronkan gateway pembayaran pihak ketiga untuk otomatisasi pengisian saldo dompet pelanggan dan bagi hasil mitra.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Provider Gateway</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium transition-all"
              >
                <option value="Midtrans">Midtrans (Rekomendasi Indonesia)</option>
                <option value="Xendit">Xendit</option>
                <option value="Duitku">Duitku</option>
                <option value="Tripay">Tripay</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Server Key (Secret Key)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type={showServerKey ? 'text' : 'password'}
                  value={serverKey}
                  onChange={(e) => setServerKey(e.target.value)}
                  placeholder="Masukkan Server Key Anda"
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowServerKey(!showServerKey)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                  title={showServerKey ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showServerKey ? <span className="text-[10px] font-bold">HIDE</span> : <span className="text-[10px] font-bold">SHOW</span>}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Gunakan Kunci Rahasia/Secret Key ini khusus untuk pemrosesan backend yang aman. Jangan disebarkan ke klien.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Client Key (Public Key)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={clientKey}
                  onChange={(e) => setClientKey(e.target.value)}
                  placeholder="Masukkan Client Key Anda"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Kunci Publik/Client Key aman dikirim ke aplikasi klien Android/iOS untuk memicu SDK visual pembayaran.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Environment Mode</label>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                  <input
                    type="radio"
                    name="env_mode"
                    checked={envMode === 'Sandbox'}
                    onChange={() => setEnvMode('Sandbox')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Sandbox (Testing / Simulasi)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 select-none">
                  <input
                    type="radio"
                    name="env_mode"
                    checked={envMode === 'Production'}
                    onChange={() => setEnvMode('Production')}
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span>Production (Uang Asli / Live)</span>
                </label>
              </div>
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
      </div>

      {/* Right Panel: Status & Instructions */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h4 className="text-base font-bold text-slate-800">Status Gateway Pembayaran</h4>
              <p className="text-xs text-slate-400 mt-0.5">Integrasi saat ini pada sistem</p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200/60 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
                <Landmark className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Mode Terpilih: {envMode}</h5>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Sistem pembayaran saat ini diatur dalam mode <b>{envMode === 'Sandbox' ? 'Simulasi' : 'Produksi'}</b> menggunakan provider <b>{provider}</b>.
                </p>
              </div>
              <div className="inline-block px-3 py-1 bg-amber-100/60 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                {envMode === 'Sandbox' ? 'Sandbox Mode Aktif' : 'PROD MODE • Siap Transaksi'}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" />
              <span>Informasi Penggunaan Key</span>
            </h5>
            <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-2 leading-relaxed">
              <li>
                <strong>Server Key:</strong> Digunakan oleh endpoint server backend kita untuk mengecek status pembayaran otomatis.
              </li>
              <li>
                <strong>Client Key:</strong> Dilempar langsung ke SDK seluler untuk memuat interface snap/popup tagihan di HP pelanggan.
              </li>
              <li>
                Selalu uji coba transaksi menggunakan akun testing <strong>Sandbox</strong> sebelum mengaktifkan gerbang pembayaran <strong>Production (Uang Asli)</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
