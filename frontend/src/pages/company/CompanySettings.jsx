import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Settings, Save, Lock, Info, Loader2, CheckCircle2 } from 'lucide-react'
import { companyApi } from '../../utils/api'

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    website: '',
    size: '1-10',
    description: ''
  })

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [accountInfo, setAccountInfo] = useState({
    company_id: '',
    email: '',
    created_at: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data } = await companyApi.get('/company/settings')
      setProfile({
        name: data.name || '',
        industry: data.industry || '',
        website: data.website || '',
        size: data.size || '1-10',
        description: data.description || ''
      })
      setAccountInfo({
        company_id: data.company_id || '',
        email: data.email || '',
        created_at: data.created_at || ''
      })
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to fetch settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleProfileSave = async () => {
    try {
      setSaving(true)
      await companyApi.patch('/company/settings/profile', profile)
      showMessage('Profile updated successfully')
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      return showMessage('New passwords do not match', 'error')
    }
    try {
      setSaving(true)
      await companyApi.post('/company/settings/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      })
      showMessage('Password changed successfully')
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      showMessage(err.response?.data?.detail || 'Failed to change password', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#c8601a]" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Preferences</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Company Settings</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Manage your company profile and account security.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex gap-2 p-1 bg-[#fffaf4] rounded-2xl w-max border border-[#f4f2ee]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-white text-[#0f1f3d] shadow-sm' : 'text-[#9c9a96] hover:text-[#5c5a57]'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'password' ? 'bg-white text-[#0f1f3d] shadow-sm' : 'text-[#9c9a96] hover:text-[#5c5a57]'}`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'account' ? 'bg-white text-[#0f1f3d] shadow-sm' : 'text-[#9c9a96] hover:text-[#5c5a57]'}`}
          >
            Account Info
          </button>
        </div>
      </motion.div>

      {/* Message Banner */}
      {message.text && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}
        >
          {message.type === 'error' ? <Info size={18} /> : <CheckCircle2 size={18} />}
          {message.text}
        </motion.div>
      )}

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="surface-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-6 flex items-center gap-2">
              <Settings className="text-[#c8601a]" size={20} />
              Company Details
            </h2>
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Company Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="warm-input w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Industry</label>
                  <input type="text" value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })} className="warm-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Company Size</label>
                  <select value={profile.size} onChange={e => setProfile({ ...profile, size: e.target.value })} className="warm-input w-full">
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Website URL</label>
                <input type="url" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} className="warm-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Description</label>
                <textarea value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} className="warm-input w-full h-32 resize-none" placeholder="Tell us about your company..."></textarea>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#c8601a] text-white font-semibold rounded-xl hover:bg-[#b8541a] transition flex items-center gap-2"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="surface-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-6 flex items-center gap-2">
              <Lock className="text-[#c8601a]" size={20} />
              Change Password
            </h2>
            <div className="space-y-5 max-w-lg">
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Current Password</label>
                <input type="password" value={passwordForm.current_password} onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })} className="warm-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">New Password</label>
                <input type="password" value={passwordForm.new_password} onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })} className="warm-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5c5a57] uppercase tracking-wide mb-1.5">Confirm New Password</label>
                <input type="password" value={passwordForm.confirm_password} onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} className="warm-input w-full" />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handlePasswordChange}
                  disabled={saving || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                  className="px-6 py-2.5 bg-[#0f1f3d] text-white font-semibold rounded-xl hover:bg-[#1a2f52] transition flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Info Tab */}
        {activeTab === 'account' && (
          <div className="surface-card p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#0f1f3d] mb-6 flex items-center gap-2">
              <Info className="text-[#c8601a]" size={20} />
              Account Information
            </h2>
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 bg-[#f4f2ee] rounded-xl border border-[#e0dbd3]">
                <p className="text-xs text-[#9c9a96] uppercase font-bold tracking-widest mb-1">Company ID</p>
                <p className="text-[#0f1f3d] font-mono text-sm">{accountInfo.company_id || 'N/A'}</p>
              </div>
              <div className="p-4 bg-[#f4f2ee] rounded-xl border border-[#e0dbd3]">
                <p className="text-xs text-[#9c9a96] uppercase font-bold tracking-widest mb-1">Registered Email</p>
                <p className="text-[#0f1f3d] font-medium">{accountInfo.email || 'N/A'}</p>
              </div>
              <div className="p-4 bg-[#f4f2ee] rounded-xl border border-[#e0dbd3]">
                <p className="text-xs text-[#9c9a96] uppercase font-bold tracking-widest mb-1">Account Created At</p>
                <p className="text-[#0f1f3d] font-medium">{accountInfo.created_at ? new Date(accountInfo.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  )
}
