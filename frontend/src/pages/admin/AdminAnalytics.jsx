import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getAdminAnalytics } from '../../utils/api'

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState([])
  const [scoreData, setScoreData] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminAnalytics()
        setWeeklyData(res.data?.weekly_data || [])
        setScoreData(res.data?.score_trend || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#c8601a]" size={32}/></div>

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <p className="text-xs uppercase tracking-[0.2em] text-[#c8601a] font-semibold">Overview</p>
        <h1 className="display-font text-3xl font-bold text-[#0f1f3d] mt-1">Analytics</h1>
        <p className="text-sm text-[#9c9a96] mt-1">Platform performance metrics</p>
      </motion.div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Daily Interviews This Week</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee"/>
              <XAxis dataKey="day" tick={{fontSize:12,fill:'#9c9a96'}}/>
              <YAxis tick={{fontSize:12,fill:'#9c9a96'}}/>
              <Tooltip contentStyle={{borderRadius:12,border:'1px solid #e0dbd3',fontSize:12}}/>
              <Bar dataKey="interviews" fill="#c8601a" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="surface-card p-6">
          <h2 className="font-bold text-[#0f1f3d] mb-5">Avg Score Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f2ee"/>
              <XAxis dataKey="week" tick={{fontSize:12,fill:'#9c9a96'}}/>
              <YAxis domain={[0,100]} tick={{fontSize:12,fill:'#9c9a96'}}/>
              <Tooltip contentStyle={{borderRadius:12,border:'1px solid #e0dbd3',fontSize:12}}/>
              <Line type="monotone" dataKey="avg" stroke="#0f1f3d" strokeWidth={2} dot={{fill:'#c8601a',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
