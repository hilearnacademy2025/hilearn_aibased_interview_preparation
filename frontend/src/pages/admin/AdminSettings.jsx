// import { motion } from 'framer-motion'
// import { useState } from 'react'
// import { Save, CheckCircle, Shield } from 'lucide-react'

// export default function AdminSettings() {
//   const [saved, setSaved] = useState(false)
//   const [form, setForm] = useState({ adminEmail: '', newPassword: '', confirmPassword: '' })

//   const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

//   return (
//     <div className="space-y-6 max-w-2xl">
//       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
//         <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">System</p>
//         <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Admin Settings</h1>
//         <p className="text-sm text-[#9c9a96] mt-1">Platform configuration</p>
//       </motion.div>

//       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6 space-y-5">
//         <div className="flex items-center gap-3 pb-4 border-b border-[#f4f2ee]">
//           <div className="w-10 h-10 rounded-xl bg-[#c8601a]/10 flex items-center justify-center">
//             <Shield size={18} className="text-[#c8601a]" />
//           </div>
//           <div>
//             <p className="font-bold text-[#0f1f3d]">Admin Credentials</p>
//             <p className="text-xs text-[#9c9a96]">Stored securely in your .env file</p>
//           </div>
//         </div>

//         <div className="rounded-xl bg-[#fffaf4] border border-[#e0dbd3] p-4 text-sm text-[#5c5a57]">
//           ⚠️ Admin credentials are set via the <code className="bg-[#f4f2ee] px-1 rounded">.env</code> file on the server. Edit <code className="bg-[#f4f2ee] px-1 rounded">ADMIN_EMAIL</code> and <code className="bg-[#f4f2ee] px-1 rounded">ADMIN_PASSWORD</code> there and restart the backend.
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium text-[#5c5a57]">Free Tier Limit (interviews/month)</label>
//           <input type="number" defaultValue="3" className="warm-input" />
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-[#5c5a57]">Pro Plan Price (INR/month)</label>
//           <input type="number" defaultValue="299" className="warm-input" />
//         </div>

//         <button onClick={handleSave} className="flex items-center gap-2 bg-[#c8601a] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-[#c8601a]/25 hover:bg-[#b0541a] transition">
//           {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
//         </button>
//       </motion.div>
//     </div>
//   )
// }



import { motion } from 'framer-motion'
import { useState } from 'react'
import { Save, CheckCircle, Shield } from 'lucide-react'

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ adminEmail: '', newPassword: '', confirmPassword: '' })

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  return (
    <div className="w-full space-y-6">   {/* changed from max-w-2xl to w-full */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">System</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Admin Settings</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Platform configuration</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="surface-card p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f4f2ee]">
          <div className="w-10 h-10 rounded-xl bg-[#c8601a]/10 flex items-center justify-center">
            <Shield size={18} className="text-[#c8601a]" />
          </div>
          <div>
            <p className="font-bold text-[#0f1f3d]">Admin Credentials</p>
            <p className="text-xs text-[#9c9a96]">Stored securely in your .env file</p>
          </div>
        </div>

        {/* ⚠️ Warning div removed completely */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#5c5a57]">Free Tier Limit (interviews/month)</label>
          <input type="number" defaultValue="3" className="warm-input" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#5c5a57]">Pro Plan Price (INR/month)</label>
          <input type="number" defaultValue="299" className="warm-input" />
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 bg-[#c8601a] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-md shadow-[#c8601a]/25 hover:bg-[#b0541a] transition">
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </motion.div>
    </div>
  )
}