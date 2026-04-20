import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Bell, Lock, Trash2, Download, Save, CheckCircle } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore",
    experience: "2 years",
    targetRole: "Backend Engineer",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    interviewReminders: true,
    weeklyProgress: true,
    communityUpdates: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: "₹" },
  ];

  return (
    <div className="max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        {tabs.map((tab) => {
          const Icon = typeof tab.icon === "string" ? null : tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {Icon && <Icon size={18} />}
              {!Icon && tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Avatar Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              <button className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-gray-400 transition-colors">
                Change Avatar
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "tel" },
                { label: "Location", key: "location", type: "text" },
                { label: "Experience", key: "experience", type: "text" },
                { label: "Target Role", key: "targetRole", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50"
                  />
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bio / About You
              </label>
              <textarea
                placeholder="Tell others about yourself..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="mt-6 flex items-center gap-3">
              <motion.button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </motion.button>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-green-600"
                >
                  <CheckCircle size={18} />
                  <span className="font-semibold">Saved successfully!</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-6">
            {[
              { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates about your account" },
              { key: "interviewReminders", label: "Interview Reminders", desc: "Get reminded before scheduled interviews" },
              { key: "weeklyProgress", label: "Weekly Progress Report", desc: "Receive weekly stats and insights" },
              { key: "communityUpdates", label: "Community Updates", desc: "Stay informed about HiLearn news" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-semibold text-gray-900">{setting.label}</p>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
                <label className="relative inline-block w-12 h-6 bg-gray-300 rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[setting.key]}
                    onChange={(e) => setNotifications({ ...notifications, [setting.key]: e.target.checked })}
                    className="hidden"
                  />
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    notifications[setting.key] ? "left-6 bg-blue-600" : ""
                  }`}></span>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Change Password */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
                <input type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-50" />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Update Password
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-lg font-bold text-red-600 mb-6">Danger Zone</h2>
            <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
              <Trash2 size={18} />
              Delete My Account
            </button>
          </div>
        </motion.div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">Billing & Subscription</h2>
          
          {/* Current Plan */}
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-gray-900">Pro Plan</p>
                <p className="text-sm text-gray-600 mt-2">₹299/month • Renews on Dec 15, 2024</p>
              </div>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>

          {/* Billing History */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">Billing History</h3>
          <div className="space-y-3">
            {[
              { date: "Nov 15, 2024", description: "Pro Plan", amount: "₹299", status: "Paid" },
              { date: "Oct 15, 2024", description: "Pro Plan", amount: "₹299", status: "Paid" },
              { date: "Sep 15, 2024", description: "Pro Plan", amount: "₹299", status: "Paid" },
            ].map((transaction, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{transaction.amount}</p>
                  <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded mt-1">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Download Invoice */}
          <button className="mt-6 flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold hover:border-gray-400 transition-colors">
            <Download size={18} />
            Download Invoice
          </button>
        </motion.div>
      )}
    </div>
  );
}
