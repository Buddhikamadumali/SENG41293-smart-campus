import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import Profile from './pages/Profile';
import { useDeadlineNotifications } from './hooks/useDeadlineNotifications';

function App() {
  useDeadlineNotifications();

  return (
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          
          <header className="bg-blue-700 text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-3xl">
                  📚
                </div>
                <div>
                  <h1 className="font-bold text-2xl">StudyHub</h1>
                  <p className="text-xs text-blue-200 -mt-1">University of Kelaniya</p>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-md mx-auto w-full flex-1 px-4 pt-4 pb-20">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          <BottomNav />
        </div>
      </Router>
    
  );
}

export default App;