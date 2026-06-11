import { useState } from 'react';
import { Menu, Maximize2, Bell, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user
    ? [user.FirstName, user.LastName].filter(Boolean).join(' ') || user.Email
    : 'Admin';

  const roleBadge = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : '';

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2 sticky top-0 z-10 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Menu size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <NavBtn color="bg-green-500" label="Visit Site" />
          <NavBtn color="bg-blue-500" label="Landing Page" />
          <NavBtn color="bg-orange-400" label="Visitors" />
          <NavBtn color="bg-pink-500" label="POS" />
          <NavBtn color="bg-emerald-500" label="Expense" />
          <NavBtn color="bg-red-500" label="Full Tutorial" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-gray-100 rounded">
          <Maximize2 size={18} className="text-gray-500" />
        </button>
        <button className="relative p-1 hover:bg-gray-100 rounded">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">70</span>
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
              {user?.image
                ? <img src={`http://localhost:5000/${user.image}`} alt="" className="w-8 h-8 rounded-full object-cover" />
                : <User size={15} className="text-white" />
              }
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">{displayName}</span>
              {roleBadge && <span className="text-[10px] text-orange-500 font-medium">{roleBadge}</span>}
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.Email}</p>
                  {roleBadge && (
                    <span className="inline-block mt-1 text-[10px] font-medium bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                      {roleBadge}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                >
                  <LogOut size={14} />
                  {loggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavBtn({ color, label }) {
  return (
    <button className={`${color} text-white text-xs font-medium px-3 py-1.5 rounded-full hover:opacity-90 transition`}>
      {label}
    </button>
  );
}
