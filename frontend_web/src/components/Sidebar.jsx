import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Video, 
  Folder, 
  Users,
  Menu,
  X,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { logout } from '../utils/auth';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      exact: true,
    },
    {
      title: 'Videos',
      icon: <Video size={20} />,
      submenu: [
        { title: 'All Videos', path: '/videos' },
      ],
    },
    {
      title: 'Categories',
      path: '/categories',
      icon: <Folder size={20} />,
    },
    {
      title: 'Users',
      path: '/users',
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleSubmenu = (title) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col h-screen border-r border-gray-200
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Video size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">AdminPanel</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`
                      flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors
                      ${location.pathname.startsWith('/videos')
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        ${location.pathname.startsWith('/videos')
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                        }
                      `}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`
                        transition-transform duration-200
                        ${activeSubmenu === item.title ? 'rotate-90' : ''}
                      `}
                    />
                  </button>
                  
                  {activeSubmenu === item.title && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          end
                          className={({ isActive }) => `
                            flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors
                            ${isActive
                              ? 'bg-indigo-100 text-indigo-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <span className="ml-7">{subItem.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`
                    ${location.pathname === item.path
                      ? 'text-indigo-600'
                      : 'text-gray-400'
                    }
                  `}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
          
          {/* User Info - You can make this dynamic later */}
          <div className="px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;