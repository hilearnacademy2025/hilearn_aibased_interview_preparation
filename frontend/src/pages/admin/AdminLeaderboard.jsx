import Leaderboard from '../user/Leaderboard'

// Admin sees the same leaderboard view — reuse the user component
export default function AdminLeaderboard() {
  return <Leaderboard />
}
