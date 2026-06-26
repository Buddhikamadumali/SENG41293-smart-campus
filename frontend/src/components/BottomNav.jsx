import { NavLink } from 'react-router-dom';
import { Home, Calendar, CheckSquare, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-2">
        
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <Home size={26} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </NavLink>

        <NavLink 
          to="/schedule" 
          className={({ isActive }) => 
            `flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <Calendar size={26} />
          <span className="text-[10px] mt-1 font-medium">Schedule</span>
        </NavLink>

        <NavLink 
          to="/assignments" 
          className={({ isActive }) => 
            `flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <CheckSquare size={26} />
          <span className="text-[10px] mt-1 font-medium">Assignments</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isActive 
              ? 'text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700'}`
          }
        >
          <User size={26} />
          <span className="text-[10px] mt-1 font-medium">Me</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;