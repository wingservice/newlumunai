
import React, { useState, useEffect } from 'react';
import { User, AdminStats, CreditPlan } from '../types';
import { mockBackend } from '../services/apiService';
import { ICONS } from '../constants';

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [editingPlans, setEditingPlans] = useState<CreditPlan[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'stats' | 'settings' | 'plans' | 'deploy'>('stats');
  const [search, setSearch] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = mockBackend.getAllUsers();
    const allStats = mockBackend.getAdminStats();
    const allPlans = mockBackend.getPlans();
    setUsers(allUsers);
    setStats(allStats);
    setPlans(allPlans);
    setEditingPlans(JSON.parse(JSON.stringify(allPlans))); 
  };

  const handleUpdateCredits = (userId: string, currentCredits: number) => {
    const newAmount = prompt("Enter new credit balance:", currentCredits.toString());
    if (newAmount !== null) {
      const amount = parseInt(newAmount);
      if (!isNaN(amount)) {
        mockBackend.updateAnyUserCredits(userId, amount);
        loadData();
      }
    }
  };

  const handleEditPlanField = (planId: string, field: keyof CreditPlan, value: any) => {
    setEditingPlans(prev => prev.map(p => p.id === planId ? { ...p, [field]: value } : p));
  };

  const handleSavePlan = (planId: string) => {
    const planToSave = editingPlans.find(p => p.id === planId);
    if (planToSave) {
      mockBackend.updatePlan(planToSave);
      setSaveStatus(planId);
      setTimeout(() => setSaveStatus(null), 2000);
      loadData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <ICONS.Shield />
            </div>
            Admin Control Center
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Manage global system state, users, and resources.</p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar">
          {['stats', 'users', 'plans', 'deploy', 'settings'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all flex-shrink-0 uppercase tracking-widest ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Users" value={stats.totalUsers} color="indigo" />
            <StatCard label="Circulating Credits" value={stats.totalCredits} color="amber" />
            <StatCard label="Generated Assets" value={stats.totalImages} color="purple" />
            <StatCard label="Daily Active Users" value={stats.activeToday} color="green" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Activity Overview</h3>
              <div className="h-48 flex items-end justify-between gap-2">
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-600/20 rounded-t-lg relative group transition-all hover:bg-indigo-600/40" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">System Health</h3>
              <div className="space-y-4">
                <HealthItem label="API Connectivity" status="online" />
                <HealthItem label="Database Latency" status="optimal" />
                <HealthItem label="Image Storage" status="92% capacity" />
                <HealthItem label="Payment Gateway" status="online" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deploy' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-4xl">
            <h2 className="text-2xl font-black mb-6">Hosting & API Deployment Guide</h2>
            
            <div className="space-y-8">
              <section className="space-y-3">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-400/10 flex items-center justify-center text-xs">1</span>
                  Select a Provider
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  We recommend <strong className="text-white">Vercel</strong> or <strong className="text-white">Netlify</strong> for high-performance frontend hosting. They handle Environment Variables securely during the build process.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-400/10 flex items-center justify-center text-xs">2</span>
                  Configure API Key
                </h3>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <p className="text-zinc-500"># In your Vercel/Netlify dashboard under 'Environment Variables':</p>
                  <p className="text-zinc-100"><span className="text-indigo-400">API_KEY</span>=your_google_gemini_key_here</p>
                </div>
                <p className="text-[10px] text-amber-500/80 uppercase font-bold tracking-widest mt-2">
                  ⚠️ Critical: Do not hardcode the key in your files before pushing to GitHub.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-400/10 flex items-center justify-center text-xs">3</span>
                  Build Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Build Command</p>
                    <code className="text-xs text-indigo-300">npm run build</code>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Output Directory</p>
                    <code className="text-xs text-indigo-300">dist / build</code>
                  </div>
                </div>
              </section>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-xs text-red-400 font-medium">
                  <strong>Production Security Note:</strong> This app currently calls Gemini directly from the browser. For a large-scale project, you should set up a server-side proxy (e.g., Vercel Functions) to hide your <code className="bg-red-500/20 px-1 rounded">API_KEY</code> from the browser's Network tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 pl-10 text-xs w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-all">EXPORT CSV</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-zinc-950 transition-colors group">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-zinc-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 uppercase text-[10px] font-black tracking-widest">
                    {user.isAdmin ? <span className="text-amber-500">Admin</span> : <span className="text-indigo-400">User</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-300">{user.credits}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleUpdateCredits(user.id, user.credits)} className="opacity-0 group-hover:opacity-100 text-indigo-400 text-[10px] font-black uppercase">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {editingPlans.map(plan => (
            <div key={plan.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <input 
                type="text" 
                value={plan.name} 
                onChange={(e) => handleEditPlanField(plan.id, 'name', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-bold"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  value={plan.price} 
                  onChange={(e) => handleEditPlanField(plan.id, 'price', parseFloat(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                  placeholder="Price"
                />
                <input 
                  type="number" 
                  value={plan.credits} 
                  onChange={(e) => handleEditPlanField(plan.id, 'credits', parseInt(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                  placeholder="Credits"
                />
              </div>
              <input 
                type="text" 
                value={plan.externalLink || ''} 
                onChange={(e) => handleEditPlanField(plan.id, 'externalLink', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs"
                placeholder="Payment Link (Stripe/PayPal)"
              />
              <button 
                onClick={() => handleSavePlan(plan.id)}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${saveStatus === plan.id ? 'bg-green-600' : 'bg-indigo-600'}`}
              >
                {saveStatus === plan.id ? 'SAVED' : 'SAVE PLAN'}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <ICONS.CreditCard /> Transaction Settings
            </h3>
            <div className="space-y-6">
              <SettingToggle label="Enable Stripe Integration" checked={true} />
              <SettingToggle label="Auto-refund failed generations" checked={true} />
              <button className="w-full py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-xl text-xs font-bold">
                SAVE TRANSACTION SETTINGS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black text-${color}-400`}>{value}</p>
  </div>
);

const HealthItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-lg border border-zinc-800">
    <span className="text-xs text-zinc-400">{label}</span>
    <span className="text-[10px] font-bold uppercase text-green-500">{status}</span>
  </div>
);

const SettingToggle = ({ label, checked }: { label: string, checked: boolean }) => {
  const [val, setVal] = useState(checked);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <div onClick={() => setVal(!val)} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${val ? 'bg-indigo-600' : 'bg-zinc-700'}`}>
        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${val ? 'translate-x-5' : ''}`}></div>
      </div>
    </div>
  );
};

export default Admin;
