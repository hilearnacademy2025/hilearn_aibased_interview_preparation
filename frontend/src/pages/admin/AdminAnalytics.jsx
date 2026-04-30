import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Loader2, Users, Clock, Activity, Target } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getAdminRealAnalytics } from '../../utils/api'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminRealAnalytics()
        setAnalytics(res.data)
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c8601a]" size={32}/></div>
  if (!analytics) return <div className="flex justify-center py-20">Failed to load analytics.</div>

  const dailyInterviews = analytics.daily_interviews?.map(d => ({ day: d.date.slice(5), count: d.count })) || []
  const topRoles = analytics.popular_roles || []

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Real-Time Overview</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Platform Analytics</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Live performance metrics and user activity</p>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="surface-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#6b7280]"><Users size={16}/> <span className="text-xs font-semibold uppercase">DAU (7d)</span></div>
          <p className="text-2xl font-bold text-[#0f1f3d]">{analytics.daily_active_users}</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="surface-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#6b7280]"><Activity size={16}/> <span className="text-xs font-semibold uppercase">New Users Today</span></div>
          <p className="text-2xl font-bold text-[#c8601a]">{analytics.new_users_today}</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="surface-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#6b7280]"><Clock size={16}/> <span className="text-xs font-semibold uppercase">Avg Session</span></div>
          <p className="text-2xl font-bold text-[#0f1f3d]">{analytics.avg_session_duration} min</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="surface-card p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#6b7280]"><Target size={16}/> <span className="text-xs font-semibold uppercase">Avg Score</span></div>
          <p className="text-2xl font-bold text-[#0f1f3d]">{analytics.platform_stats?.avg_score}/10</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Interviews Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyInterviews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee"/>
              <XAxis dataKey="day" tick={{fontSize:12,fill:'#9c9a96'}}/>
              <YAxis tick={{fontSize:12,fill:'#9c9a96'}}/>
              <Tooltip contentStyle={{borderRadius:12,border:'1px solid #e0dbd3',fontSize:12}} cursor={{fill:'rgba(200,96,26,0.05)'}}/>
              <Bar dataKey="count" fill="#c8601a" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Most Popular Roles</h2>
          <div className="space-y-4">
            {topRoles.length > 0 ? topRoles.slice(0,5).map((r, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-[#5c5a57] font-medium truncate pr-4">{r.role}</span>
                <span className="text-sm font-bold text-[#0f1f3d] bg-[#f4f2ee] px-2 py-1 rounded-md">{r.count}</span>
              </div>
            )) : <p className="text-sm text-[#9c9a96]">No data available.</p>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
