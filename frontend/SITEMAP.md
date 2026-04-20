# 🗺️ HiLearn AI Interview Prep - Complete Site Map & Navigation

## 📍 Public Website (Marketing)

```
Landing Page (/)
├── Hero Section
├── Features Section (6 cards)
├── How It Works (4 steps)
├── Testimonials (3 students)
├── Pricing Preview (3 plans)
└── CTA Footer Section

├─ About (/about)
│  ├── Mission Statement
│  ├── Why HiLearn Different (6 points)
│  ├── Core Values (4 pillars)
│  └── Company Story

├─ Features (/features)
│  ├── Dynamic AI Interviews
│  ├── Voice Analysis
│  ├── Smart Feedback
│  ├── Peer-to-Peer Practice
│  ├── Analytics Dashboard
│  └── India-Specific Questions

├─ Pricing (/pricing)
│  ├── 3 Pricing Tiers
│  ├── Feature Comparison Table
│  ├── FAQ Section (6 questions)
│  └── CTA Section

├─ Login (/login)
│  ├── Email/Password Form
│  ├── Social Login (Google, GitHub)
│  ├── Demo Account Button
│  └── Link to Signup

└─ Signup (/signup)
   ├── Registration Form
   ├── Terms Agreement
   ├── Social Signup
   └── Benefits Highlight
```

---

## 🔐 Protected Dashboard (After Authentication)

### Root Dashboard

```
Dashboard (/app/dashboard) ⭐ HOME
├── Welcome Section (Streak Info)
├── Stats Grid (4 cards)
│  ├── Interviews Taken
│  ├── Average Score
│  ├── Longest Streak
│  └── Progress %
├── Performance Chart (7-day trend)
├── Quick Action Panel
├── Recent Interviews List (3 items)
├── Recommended Learning Tracks
└── Start Interview CTA

Sidebar Navigation (Always Visible)
├── 📊 Dashboard (current)
├── 💬 Interviews
├── 📈 Analytics
├── 👥 Peer Practice
├── ⚙️ Settings
└── 🚪 Logout
```

### Interview Flow

```
Interview Setup (/app/interview-setup)
├── Step 1: Select Job Role
│  └── 8 common roles to choose from
├── Step 2: Interview Type
│  ├── Technical (💻)
│  ├── HR Round (🤝)
│  ├── Behavioral (🧠)
│  └── Domain-Specific (🎯)
├── Step 3: Difficulty Level
│  ├── Beginner
│  ├── Intermediate
│  └── Advanced
├── Step 4: Tech Stack (optional)
├── Step 5: Resume Upload (drag & drop)
└── Start Interview Button

         ⬇️

Live Interview (/app/interview) 🎤
├── Header
│  ├── Interview Title
│  ├── Question Counter
│  ├── Difficulty Level
│  ├── Timer
│  └── End Interview Button
├── Progress Bar
├── Chat Interface
│  ├── AI Messages (chat bubbles)
│  ├── User Messages (chat bubbles)
│  ├── Real-time Transcription
│  └── Speaking Animation
├── Input Area
│  ├── Text Input (multiline)
│  ├── Voice Button (with recording indicator)
│  ├── Send Button
│  └── Pro Tips
└── Controls

         ⬇️

Feedback (/app/feedback) 📊
├── Overall Score Display (circular progress)
├── Tabs: Overview | Voice Analysis | Detailed
│
├── Overview Tab
│  ├── Performance Breakdown (4 metrics)
│  │  ├── Confidence Score
│  │  ├── Communication
│  │  ├── Technical Knowledge
│  │  └── Problem Solving
│  ├── Strengths (bulleted list)
│  ├── Areas for Improvement (bulleted list)
│  └── Recommended Next Steps
│
├── Voice Analysis Tab
│  ├── Speaking Speed
│  ├── Filler Words Count
│  ├── Average Pauses
│  └── Confidence Score Details
│
├── Detailed Tab
│  └── Full Feedback Text
│
└── Actions
   ├── Take Another Interview
   ├── Download Report
   └── Share Feedback
```

### Analytics Section

```
Analytics (/app/analytics) 📈
├── Quick Stats Grid (4 cards)
│  ├── Total Interviews
│  ├── Average Score
│  ├── Best Score
│  └── Current Streak
├── Performance Trend (line chart, 4 weeks)
├── Skill Breakdown (pie chart)
├── Interview Type Stats
└── Improvement Roadmap (4 skills with progress)
```

### Peer Practice

```
Peer Interview (/app/peer-practice) 👥
├── Tab 1: Find Peer
│  ├── Filters (System Design, DSA, etc.)
│  └── Peer Cards Grid
│     ├── Profile Picture + Name
│     ├── Role + Experience
│     ├── Location
│     ├── Expertise Tags
│     ├── Rating + Reviews
│     ├── Availability
│     └── Schedule Session Button
│
├── Tab 2: Upcoming Session
│  └── Session Cards
│     ├── Peer Name
│     ├── Date/Time
│     ├── Interview Type
│     ├── Message Button
│     └── Join Button
│
└── Tab 3: Completed Sessions
   └── Session History with Ratings & Feedback
```

### Settings & Account

```
Settings (/app/settings) ⚙️
├── Tab 1: Profile
│  ├── Profile Picture Section
│  ├── Form Fields (6 inputs)
│  │  ├── Full Name
│  │  ├── Email
│  │  ├── Phone
│  │  ├── Location
│  │  ├── Experience
│  │  └── Target Role
│  ├── Bio Text Area
│  └── Save Changes Button
│
├── Tab 2: Notifications
│  ├── Email Notifications (toggle)
│  ├── Interview Reminders (toggle)
│  ├── Weekly Progress Report (toggle)
│  └── Community Updates (toggle)
│
├── Tab 3: Security
│  ├── Change Password Section
│  │  ├── Current Password
│  │  ├── New Password
│  │  ├── Confirm Password
│  │  └── Update Button
│  └── Danger Zone
│     └── Delete Account Button
│
└── Tab 4: Billing
   ├── Current Plan Display
   │  ├── Plan Name (Pro)
   │  ├── Price/Month
   │  └── Renewal Date
   ├── Upgrade Button
   ├── Billing History (transaction list)
   └── Download Invoice Button
```

---

## 🔄 User Flows

### First Time Visitor
```
Landing (/) → Signup (/signup) → Dashboard (/app/dashboard)
```

### Existing User
```
Landing (/) → Login (/login) → Dashboard (/app/dashboard)
```

### Interview Session
```
Dashboard → Interview Setup → Live Interview → Feedback → Dashboard
```

### Analytics Check
```
Dashboard → Analytics → Performance Insights → Dashboard
```

### Peer Practice Scheduling
```
Dashboard → Peer Practice → Find Peer/Upcoming → Join Session
```

---

## 🎨 Component Hierarchy

```
App (Router)
├── PublicLayout
│  ├── Navbar
│  ├── Page Content
│  └── Footer
│
└── AppLayout (Protected)
   ├── Sidebar
   ├── TopBar
   └── Page Content (Outlet)
```

---

## 🔐 Authentication States

### Unauthenticated
- Access: Landing, About, Features, Pricing, Login, Signup
- Blocked: `/app/*` routes (redirect to login)

### Authenticated
- Access: All `/app/*` routes
- Blocked: Login/Signup (redirect to dashboard)

---

## 📊 Data Flow

```
User Input (Forms)
    ⬇️
State Management (React Hooks)
    ⬇️
API Ready (Ready for backend connection)
    ⬇️
Component Update & Render
    ⬇️
User Sees Result
```

---

## 🎯 Page Features Summary

| Page | Features | Status |
|------|----------|--------|
| Landing | Hero, Features, Testimonials, Pricing, CTA | ✅ Complete |
| About | Mission, Values, Why HiLearn | ✅ Complete |
| Features | Detailed explanations with visuals | ✅ Complete |
| Pricing | 3 tiers, comparison, FAQ | ✅ Complete |
| Login | Auth form, social, demo | ✅ Complete |
| Signup | Registration, terms, benefits | ✅ Complete |
| Dashboard | Stats, charts, recommendations | ✅ Complete |
| Interview Setup | Configuration, file upload | ✅ Complete |
| Live Interview | Chat UI, voice input | ✅ Complete |
| Feedback | Score, analysis, suggestions | ✅ Complete |
| Analytics | Charts, trends, progress | ✅ Complete |
| Peer Practice | Find, schedule,history | ✅ Complete |
| Settings | Profile, notifications, billing | ✅ Complete |

---

## 🚀 Next Steps for Development

1. **Connect Backend API** - Replace dummy data with real API calls
2. **Implement WebRTC** - For peer video calls
3. **Add Speech-to-Text** - Real voice transcription
4. **Deploy** - Vercel, Netlify, or custom server
5. **Mobile App** - React Native for iOS/Android

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (full stack layout)
- **Tablet**: 768px - 1024px (sidebar collapses)
- **Desktop**: > 1024px (full sidebar visible)

All pages are fully responsive! ✅

---

**Created with ❤️ for HiLearn - Making Interview Prep Affordable for India**
