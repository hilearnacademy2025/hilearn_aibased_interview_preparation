// import { motion } from 'framer-motion'
// import { useState } from 'react'
// import { Save, CheckCircle, User, Bell, Lock } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext'

// export default function UserSettings() {
//   const { user } = useAuth()
//   const [saved, setSaved] = useState(false)
//   const [activeTab, setActiveTab] = useState('profile')
//   const [form, setForm] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     phone: '',
//     location: '',
//     targetRole: '',
//   })

//   const tabs = [
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'notifications', label: 'Notifications', icon: Bell },
//     { id: 'security', label: 'Security', icon: Lock },
//   ]

//   const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

//   return (
//     <div className="max-w-2xl space-y-6">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Account</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Settings</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Manage your account preferences</p>
//       </motion.div>

//       {/* Tabs */}
//       <div className="flex gap-1 surface-card p-1.5 w-fit rounded-2xl">
//         {tabs.map(tab => {
//           const Icon = tab.icon
//           return (
//             <button key={tab.id} onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-[#0f1f3d] text-white shadow' : 'text-[#9c9a96] hover:text-[#5c5a57]'}`}>
//               <Icon size={14} /> {tab.label}
//             </button>
//           )
//         })}
//       </div>

//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 space-y-5">
//         {activeTab === 'profile' && (
//           <>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-[#5c5a57]">Full Name</label>
//                 <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="warm-input" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-[#5c5a57]">Email</label>
//                 <input value={form.email} disabled className="warm-input opacity-60 cursor-not-allowed" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-[#5c5a57]">Phone</label>
//                 <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="warm-input" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-sm font-medium text-[#5c5a57]">Location</label>
//                 <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Bangalore" className="warm-input" />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <label className="text-sm font-medium text-[#5c5a57]">Target Role</label>
//                 <input value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})} placeholder="Backend Engineer" className="warm-input" />
//               </div>
//             </div>
//           </>
//         )}
//         {activeTab === 'notifications' && (
//           <div className="space-y-4">
//             {['Email Notifications', 'Interview Reminders', 'Weekly Progress Report', 'Community Updates'].map(label => (
//               <label key={label} className="flex items-center justify-between py-3 border-b border-[#f4f2ee] last:border-0 cursor-pointer">
//                 <span className="text-sm font-medium text-[#0f1f3d]">{label}</span>
//                 <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#c8601a]" />
//               </label>
//             ))}
//           </div>
//         )}
//         {activeTab === 'security' && (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-[#5c5a57]">Current Password</label>
//               <input type="password" className="warm-input" placeholder="Enter current password" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-[#5c5a57]">New Password</label>
//               <input type="password" className="warm-input" placeholder="Min 8 chars, uppercase, number, symbol" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-[#5c5a57]">Confirm New Password</label>
//               <input type="password" className="warm-input" placeholder="Repeat new password" />
//             </div>
//           </div>
//         )}

//         <button onClick={handleSave} className="flex items-center gap-2 bg-[#c8601a] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-[#c8601a]/20 hover:bg-[#b0541a] transition">
//           {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
//         </button>
//       </motion.div>
//     </div>
//   )
// }


import { motion } from 'framer-motion'
import { useState } from 'react'
import { Save, CheckCircle, User, Bell, Lock, Loader, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

export default function UserSettings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    target_role: '',
  })

  const [pwForm, setPwForm] = useState({
    current: '',
    newPw: '',
    confirm: '',
  })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)

  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security',      label: 'Security',      icon: Lock },
  ]

  // ── Profile Save ──────────────────────────────────────
  const handleSave = async () => {
    setError('')
    setSaving(true)
    try {
      await api.put('/auth/profile', {
        name:        form.name.trim() || undefined,
        phone:       form.phone.trim() || undefined,
        location:    form.location.trim() || undefined,
        target_role: form.target_role.trim() || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message || 'Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Password Change ───────────────────────────────────
  const handlePasswordSave = async () => {
    setPwError('')
    if (!pwForm.current) { setPwError('Enter your current password.'); return }
    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return }
    setPwSaving(true)
    try {
      await api.put('/auth/profile', {
        current_password: pwForm.current,
        new_password:     pwForm.newPw,
      })
      setPwSaved(true)
      setPwForm({ current: '', newPw: '', confirm: '' })
      setTimeout(() => setPwSaved(false), 2500)
    } catch (err) {
      setPwError(err.message || 'Failed to update password.')
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Account</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Settings</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Manage your account preferences</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 surface-card p-1.5 w-fit rounded-2xl">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-[#0f1f3d] text-white shadow' : 'text-[#9c9a96] hover:text-[#5c5a57]'}`}>
              <Icon size={14} /> {tab.label}
            </button>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-6 space-y-5">

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c5a57]">Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="warm-input" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c5a57]">Email</label>
                <input value={form.email} disabled className="warm-input opacity-60 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c5a57]">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 98765 43210" className="warm-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5c5a57]">Location</label>
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Bangalore" className="warm-input" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#5c5a57]">Target Role</label>
                <input value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value})} placeholder="Backend Engineer" className="warm-input" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-[#c8601a] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-[#c8601a]/20 hover:bg-[#b0541a] transition disabled:opacity-70">
              {saving ? <><Loader size={16} className="animate-spin" /> Saving…</>
               : saved ? <><CheckCircle size={16} /> Saved!</>
               : <><Save size={16} /> Save Changes</>}
            </button>
          </>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {['Email Notifications', 'Interview Reminders', 'Weekly Progress Report', 'Community Updates'].map(label => (
              <label key={label} className="flex items-center justify-between py-3 border-b border-[#f4f2ee] last:border-0 cursor-pointer">
                <span className="text-sm font-medium text-[#0f1f3d]">{label}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#c8601a]" />
              </label>
            ))}
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5c5a57]">Current Password</label>
              <input type="password" value={pwForm.current} onChange={e => setPwForm({...pwForm, current: e.target.value})} className="warm-input" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5c5a57]">New Password</label>
              <input type="password" value={pwForm.newPw} onChange={e => setPwForm({...pwForm, newPw: e.target.value})} className="warm-input" placeholder="Min 8 chars, uppercase, number, symbol" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#5c5a57]">Confirm New Password</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm({...pwForm, confirm: e.target.value})} className="warm-input" placeholder="Repeat new password" />
            </div>

            {pwError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                <AlertCircle size={15} /> {pwError}
              </div>
            )}

            <button onClick={handlePasswordSave} disabled={pwSaving}
              className="flex items-center gap-2 bg-[#c8601a] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-[#c8601a]/20 hover:bg-[#b0541a] transition disabled:opacity-70">
              {pwSaving ? <><Loader size={16} className="animate-spin" /> Updating…</>
               : pwSaved ? <><CheckCircle size={16} /> Password Updated!</>
               : <><Save size={16} /> Update Password</>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}