import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function AccountPage() {
  const { user, logout } = useAuth();
  const linkBase =
    "pb-3 sm:pb-4 text-xs sm:text-sm uppercase tracking-wide transition whitespace-nowrap";
  const activeClass = "border-b-2 border-black text-black";
  const inactiveClass = "text-neutral-400 hover:text-black";
  return (
    <div className="min-h-screen bg-white pt-10 sm:pt-0 md:pt-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide">
            Hello, {user?.name}
          </h1>
          <p className="text-neutral-500 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
            Manage your account details, orders and addresses.
          </p>
        </div>
        {/* Navigation */}
        <nav className="border-b border-neutral-200 mb-4 sm:mb-6">
          <div className="flex items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
            <NavLink
              to="/account"
              end
              className={({ isActive }) =>
                `${linkBase} px-3 first:pl-0 ${isActive ? activeClass : inactiveClass}`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `${linkBase} px-3 ${isActive ? activeClass : inactiveClass}`
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="addresses"
              className={({ isActive }) =>
                `${linkBase} px-3 ${isActive ? activeClass : inactiveClass}`
              }
            >
              Addresses
            </NavLink>
            <div className="ml-auto flex-shrink-0 pl-2">
              <button
                onClick={logout}
                className="text-neutral-400 text-xs sm:text-sm uppercase tracking-wide transition hover:text-red-600 cursor-pointer pb-3 sm:pb-4"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        {/* Nested Route Content */}
        <div className="animate-fadeIn">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
}
