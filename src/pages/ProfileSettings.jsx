import { currentUser } from '../data/dummyData';

export default function ProfileSettings() {
  return (
    <div className="max-w-4xl mx-auto w-full animate-fade-in">
      {/* Mobile Header */}
      <div className="mb-8 hidden md:block">
        <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Profile Settings</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">Manage your account preferences and clinical security settings.</p>
      </div>

      {/* Profile Header Card (Glass Panel) */}
      <section className="bg-surface-container-lowest/85 backdrop-blur-[12px] border border-outline-variant/50 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left shadow-sm">
        <div className="relative group cursor-pointer">
          <img 
            alt={currentUser.name} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm" 
            src={currentUser.avatar}
          />
          {/* Upload Overlay */}
          <div className="absolute inset-0 bg-primary-container/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-headline text-xl font-bold text-on-surface">{currentUser.name}</h3>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-sm font-label text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">badge</span>
              {currentUser.role}
            </span>
            <span className="hidden md:inline text-outline-variant">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">domain</span>
              {currentUser.department}
            </span>
          </div>
          <div className="pt-4 flex gap-3 justify-center md:justify-start">
            <button className="bg-primary-container text-on-primary text-sm font-label px-4 py-2 rounded flex items-center gap-2 hover:bg-[#005b6f] transition-colors duration-150">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              Update Photo
            </button>
            <button className="border border-primary-container text-primary-container text-sm font-label px-4 py-2 rounded flex items-center gap-2 hover:bg-surface-variant transition-colors duration-150">
              Remove
            </button>
          </div>
        </div>
      </section>

      {/* Settings Sections Layout */}
      <div className="space-y-6">
        {/* General Settings */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">tune</span>
            <h4 className="font-headline font-bold text-on-surface">General</h4>
          </div>
          <div className="p-6 space-y-6">
            {/* Language */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="font-label text-sm font-semibold text-on-surface block">Language Interface</label>
                <p className="text-xs font-body text-on-surface-variant mt-1">Select your preferred system language.</p>
              </div>
              <div className="w-full md:w-64">
                <select className="w-full bg-surface border border-outline-variant/50 rounded text-sm font-body px-3 py-2 text-on-surface focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none">
                  <option>English (US)</option>
                  <option>Bahasa Indonesia</option>
                  <option>German</option>
                  <option>French</option>
                </select>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Dark Mode Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <label className="font-label text-sm font-semibold text-on-surface block">Dark Mode</label>
                <p className="text-xs font-body text-on-surface-variant mt-1">Reduce glare in low-light laboratory environments.</p>
              </div>
              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">notifications_active</span>
            <h4 className="font-headline font-bold text-on-surface">Notifications</h4>
          </div>
          <div className="p-6 space-y-6">
            {/* Push Notifications */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-outline mt-0.5">smartphone</span>
                <div>
                  <label className="font-label text-sm font-semibold text-on-surface block">Push Notifications</label>
                  <p className="text-xs font-body text-on-surface-variant mt-1">Receive alerts for molecule match successes on your device.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* Email Notifications */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-outline mt-0.5">mail</span>
                <div>
                  <label className="font-label text-sm font-semibold text-on-surface block">Email Reports</label>
                  <p className="text-xs font-body text-on-surface-variant mt-1">Weekly analytical digests sent to s.j@pharmamatch.ai</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">lock</span>
            <h4 className="font-headline font-bold text-on-surface">Security</h4>
          </div>
          <div className="p-6 space-y-6">
            {/* Change Password */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="font-label text-sm font-semibold text-on-surface block">Account Password</label>
                  <p className="text-xs font-body text-on-surface-variant mt-1">Last changed 45 days ago. Required rotation in 45 days.</p>
                </div>
                <button className="border border-primary-container text-primary-container text-sm font-label px-4 py-2 rounded hover:bg-surface-variant transition-colors duration-150">
                  Update
                </button>
              </div>
            </div>
            
            <hr className="border-outline-variant/30" />
            
            {/* API Keys */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <label className="font-label text-sm font-semibold text-on-surface block">Developer API Keys</label>
                  <p className="text-xs font-body text-on-surface-variant mt-1">Manage keys for external pipeline integration.</p>
                </div>
                <button className="bg-surface-variant text-on-surface-variant text-sm font-label px-4 py-2 rounded flex items-center gap-2 hover:bg-outline-variant transition-colors duration-150">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Generate Key
                </button>
              </div>
              
              {/* Key List (Bento-ish internal card) */}
              <div className="bg-surface rounded border border-outline-variant/50 p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-label font-semibold text-on-surface">Production Pipeline Key</p>
                  <p className="text-xs font-mono text-outline mt-1 truncate max-w-[150px] md:max-w-xs">sk_prod_...8f92a</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1.5 text-outline hover:text-primary-container transition-colors" title="Copy">
                    <span className="material-symbols-outlined text-[20px]">content_copy</span>
                  </button>
                  <button className="p-1.5 text-outline hover:text-error transition-colors" title="Revoke">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Save Actions */}
        <div className="flex justify-end gap-4 pt-4 pb-12 md:pb-4">
          <button className="border border-primary-container text-primary-container text-sm font-label px-6 py-2.5 rounded hover:bg-surface-variant transition-colors duration-150">
            Discard Changes
          </button>
          <button className="bg-primary-container text-on-primary text-sm font-label px-6 py-2.5 rounded hover:bg-[#005b6f] transition-colors duration-150 shadow-sm">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
