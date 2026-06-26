import { useState, useEffect } from 'react';
import { MapPin, User, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DAY_COLORS = {
  Monday: 'bg-blue-500',
  Tuesday: 'bg-purple-500',
  Wednesday: 'bg-green-500',
  Thursday: 'bg-orange-500',
  Friday: 'bg-rose-500',
};

const getTodayName = () => {
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  return DAYS.includes(day) ? day : 'Monday';
};

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState(getTodayName());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch(`${API_BASE}/schedules`);
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const filteredSchedules = schedules
    .filter(s => s.day === selectedDay)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-4">

      <div>
        <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
        <p className="text-sm text-gray-400 mt-0.5">University of Kelaniya</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedDay === day
                ? `${DAY_COLORS[day]} text-white shadow-md`
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 font-medium">No classes on {selectedDay}</p>
          <p className="text-gray-400 text-sm mt-1">Enjoy your free day!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${DAY_COLORS[selectedDay]}`} />
            <p className="text-sm text-gray-500">
              {filteredSchedules.length} class{filteredSchedules.length > 1 ? 'es' : ''} on {selectedDay}
            </p>
          </div>

          {filteredSchedules.map((cls, index) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className={`h-1 ${DAY_COLORS[selectedDay]}`} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug flex-1">
                    {cls.subject}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                    #{index + 1}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs">{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={14} className="text-green-400 shrink-0" />
                    <span className="text-xs">{cls.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <User size={14} className="text-purple-400 shrink-0" />
                    <span className="text-xs">{cls.lecturer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}