import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckSquare, BookOpen, ChevronRight, Quote } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getTodayName = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default function Dashboard() {
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleRes = await fetch(`${API_BASE}/schedules`);
        const scheduleData = await scheduleRes.json();
        const today = getTodayName();
        setTodaySchedule(scheduleData.filter(s => s.day === today).slice(0, 3));

        const assignRes = await fetch(`${API_BASE}/assignments`);
        const assignData = await assignRes.json();
        setAssignments(assignData);

      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  const profile = JSON.parse(localStorage.getItem('profile') || '{"name":"Student","completedCredits":0}');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-blue-200 text-sm">{getFormattedDate()}</p>
        <h2 className="text-2xl font-bold mt-1">{getGreeting()}, {profile.name} 👋</h2>
        <p className="text-blue-200 text-sm mt-1">Here's your academic overview for today.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center border border-gray-100">
          <Calendar size={22} className="text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{todaySchedule.length}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Classes Today</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center border border-gray-100">
          <CheckSquare size={22} className="text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Pending Tasks</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center border border-gray-100">
          <BookOpen size={22} className="text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{profile.completedCredits}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Credits Done</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800">Today's Classes</h3>
          <Link to="/schedule" className="text-blue-600 text-sm flex items-center gap-0.5">
            View all <ChevronRight size={15} />
          </Link>
        </div>

        {todaySchedule.length === 0 ? (
          <div className="px-4 pb-4 text-center text-gray-400 text-sm py-6">
            No classes today!
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {todaySchedule.map(cls => (
              <div key={cls.id} className="px-4 py-3 flex items-start gap-3">
                <div className="bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap mt-0.5">
                  {cls.time}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{cls.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cls.venue} · {cls.lecturer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800">Upcoming Deadlines</h3>
          <Link to="/assignments" className="text-blue-600 text-sm flex items-center gap-0.5">
            View all <ChevronRight size={15} />
          </Link>
        </div>

        {pendingCount === 0 ? (
          <div className="px-4 pb-4 text-center text-gray-400 text-sm py-6">
            All caught up!
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {assignments
              .filter(a => a.status === 'pending')
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 2)
              .map(a => (
                <div key={a.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.subject}</p>
                  </div>
                  <span className="text-[11px] bg-orange-50 text-orange-600 font-medium px-2 py-1 rounded-lg whitespace-nowrap">
                    {new Date(a.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}