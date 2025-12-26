
import React from 'react';
import { ICONS } from '../constants';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-black mb-2">Account Settings</h1>
        <p className="text-zinc-500">Manage your profile, API keys, and platform preferences.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ICONS.Settings /> Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Display Name</label>
              <input type="text" placeholder="Your name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
              <input type="email" disabled placeholder="email@example.com" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500 cursor-not-allowed" />
            </div>
          </div>
          <button className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition-all">
            Save Profile
          </button>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
            <ICONS.Shield /> Deployment Help
          </h3>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Ready to share Lumina AI with the world? Deploying your own instance is easy.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <h4 className="font-bold text-sm mb-2">Recommended: Vercel</h4>
              <p className="text-xs text-zinc-500 mb-3">One-click deployment with built-in environment variable protection.</p>
              <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside">
                <li>Push code to GitHub</li>
                <li>Import Project in Vercel</li>
                <li>Add <code className="text-indigo-400">API_KEY</code> in Environment Variables</li>
                <li>Deploy!</li>
              </ol>
            </div>

            <div className="p-4 border border-zinc-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Need a Custom Setup?</h4>
                <p className="text-xs text-zinc-500">Consult our technical documentation for Docker or AWS hosting.</p>
              </div>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors">
                Read Docs
              </button>
            </div>
          </div>
        </section>

        <section className="pt-8 border-t border-zinc-800">
           <button className="px-6 py-2 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
              DELETE ACCOUNT
           </button>
           <p className="text-[10px] text-zinc-600 mt-2 font-medium">This action is permanent and will remove all your credits and image history.</p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
