import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Save, X, User as UserIcon, Mail, Calendar, Shield } from "lucide-react";
import api from "../api/axios";

const AvatarOption = ({ avatar, isSelected, onSelect, index }) => {
  const [error, setError] = useState(false);

  return (
    <button
      onClick={() => onSelect(avatar)}
      className={`relative rounded-full overflow-hidden aspect-square transition-all ${
        isSelected 
          ? "ring-4 ring-violet-600 ring-offset-2 scale-105" 
          : "hover:scale-105 hover:shadow-lg"
      }`}
    >
      {!error ? (
        <img 
          src={avatar} 
          alt="Avatar" 
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center border border-slate-200">
           <span className="text-sm font-bold text-slate-400">#{index + 1}</span>
        </div>
      )}
    </button>
  );
};

export default function Profile() {
  const { user, fetchMe } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [activeTab, setActiveTab] = useState("boys");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!user) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }

  const boysAvatars = [
    "Alexander", "Christopher", "Benjamin", "Daniel", "Elijah", "James", "William", "Lucas", "Mason", "Logan", "Jacob", "Michael", "Ethan", "David", "Oliver"
  ].map(seed => `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`);

  const girlsAvatars = [
    "Sophia", "Emma", "Olivia", "Isabella", "Ava", "Mia", "Emily", "Abigail", "Madison", "Elizabeth", "Sofia", "Avery", "Ella", "Scarlett", "Grace"
  ].map(seed => `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put("/auth/profile", { avatar: selectedAvatar });
      await fetchMe();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 h-48"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-20 mb-6">
            <div className="relative group">
              <div className="w-40 h-40 bg-white p-1.5 rounded-full shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-gray-100 flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.username}`;
                      }}
                    />
                  ) : (
                    <span className="text-5xl font-bold text-gray-400">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-2 right-2 p-3 bg-violet-600 text-white rounded-full shadow-lg hover:bg-violet-700 transition-all hover:scale-110"
              >
                <Camera size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500 text-lg">{user.email}</p>
            {user.bio && (
              <p className="text-gray-600 mt-4 max-w-2xl italic">"{user.bio}"</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-bold text-gray-900 capitalize">{user.role || "User"}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-bold text-gray-900">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-bold text-gray-900">{user.fullName || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Choose Avatar</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setActiveTab("boys")}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      activeTab === "boys" 
                        ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500 ring-offset-2" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Boys
                  </button>
                  <button 
                    onClick={() => setActiveTab("girls")}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      activeTab === "girls" 
                        ? "bg-pink-100 text-pink-600 ring-2 ring-pink-500 ring-offset-2" 
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Girls
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto p-2">
                  {(activeTab === "boys" ? boysAvatars : girlsAvatars).map((avatar, idx) => (
                    <AvatarOption 
                      key={idx}
                      avatar={avatar}
                      isSelected={selectedAvatar === avatar}
                      onSelect={setSelectedAvatar}
                      index={idx}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-bold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30 flex items-center gap-2"
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
