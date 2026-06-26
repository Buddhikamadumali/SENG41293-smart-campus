import { useState, useEffect } from 'react';
import { User, BookOpen, Award, Edit3, Save, X, GraduationCap, Mail, Phone, Hash } from 'lucide-react';

const STORAGE_KEY = 'profile';

const DEFAULT_PROFILE = {
  name: 'Student',
  studentId: 'Ex: SE/2021/001',
  email: 'Ex: student@gmail.com',
  phone: 'Ex: 0771234567',
  degree: 'BSc Hons in Software Engineering',
  faculty: 'Faculty of Science',
  year: 'Year 4',
  completedCredits: 0,
  totalCredits: 120,
};

const CREDIT_MILESTONES = [
  { label: 'Year 1', credits: 30 },
  { label: 'Year 2', credits: 60 },
  { label: 'Year 3', credits: 90 },
  { label: 'Year 4', credits: 120 },
];

export default function Profile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(DEFAULT_PROFILE);

  const loadFromStorage = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setEditData(parsed);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setEditData(parsed);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('focus', loadFromStorage);
    return () => window.removeEventListener('focus', loadFromStorage);
  }, []);

  const saveProfile = () => {
    const updated = {
      ...profile,         
      name: editData.name,
      studentId: editData.studentId,
      email: editData.email,
      phone: editData.phone,
      degree: editData.degree,
      faculty: editData.faculty,
      year: editData.year,
    };
    setProfile(updated);
    setEditData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditData(profile);
    setEditing(false);
  };

  const progressPercent = Math.round(
    (profile.completedCredits / profile.totalCredits) * 100
  );

  const getProgressColor = () => {
    if (progressPercent >= 75) return 'bg-green-500';
    if (progressPercent >= 50) return 'bg-blue-500';
    if (progressPercent >= 25) return 'bg-orange-500';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
          <p className="text-sm text-gray-400 mt-0.5">University of Kelaniya</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium"
          >
            <Edit3 size={15} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
            >
              <X size={15} />
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
            >
              <Save size={15} />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <User size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
                className="w-full bg-white/20 text-white placeholder-white/60 rounded-xl px-3 py-1.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            ) : (
              <h3 className="text-xl font-bold truncate">{profile.name}</h3>
            )}
            <p className="text-blue-200 text-sm mt-0.5">{profile.studentId}</p>
            <p className="text-blue-200 text-xs mt-0.5">{profile.year} · {profile.faculty}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Academic Details</h3>
          </div>
        </div>

        <div className="divide-y divide-gray-50">

          <div className="px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Degree Programme</p>
            {editing ? (
              <input
                type="text"
                value={editData.degree}
                onChange={e => setEditData({ ...editData, degree: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800">{profile.degree}</p>
            )}
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <Hash size={15} className="text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Student ID</p>
              {editing ? (
                <input
                  type="text"
                  value={editData.studentId}
                  onChange={e => setEditData({ ...editData, studentId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{profile.studentId}</p>
              )}
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <Mail size={15} className="text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Email</p>
              {editing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{profile.email}</p>
              )}
            </div>
          </div>

          <div className="px-4 py-3 flex items-center gap-3">
            <Phone size={15} className="text-gray-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              {editing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800">{profile.phone}</p>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-green-500" />
            <h3 className="font-semibold text-gray-800 text-sm">Credit Progress</h3>
          </div>
        </div>

        <div className="p-4 space-y-4">

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-blue-600">
                  {profile.completedCredits}
                </span>
                <span className="text-gray-400 font-medium mb-0.5">
                  / {profile.totalCredits} credits
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Auto-tracked from completed assignments
              </p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${
                progressPercent >= 75 ? 'text-green-500' :
                progressPercent >= 50 ? 'text-blue-500' : 'text-orange-500'
              }`}>{progressPercent}%</span>
              <p className="text-xs text-gray-400">Complete</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between">
              {CREDIT_MILESTONES.map(m => (
                <div key={m.label} className="text-center">
                  <div className={`w-1 h-1 rounded-full mx-auto mb-0.5 ${
                    profile.completedCredits >= m.credits ? getProgressColor() : 'bg-gray-200'
                  }`} />
                  <p className="text-[10px] text-gray-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-blue-400" />
              <p className="text-sm text-gray-600">Remaining credits</p>
            </div>
            <p className="text-sm font-bold text-gray-800">
              {profile.totalCredits - profile.completedCredits} credits
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}