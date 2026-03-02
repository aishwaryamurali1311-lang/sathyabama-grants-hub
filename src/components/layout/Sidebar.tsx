import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Megaphone, 
  FileText, 
  Table, 
  Key, 
  LogOut,
  LayoutDashboard,
  FolderOpen,
  UserPlus
} from 'lucide-react';
import { useAuth, getRoleLabel } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = profile?.role;

  const getNavItems = () => {
    const baseItems = [
      { to: '/home', icon: Home, label: 'Home' },
    ];

    if (role === 'admin' || role === 'superadmin') {
      baseItems.push({ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' });
    }

    if (role === 'admin' || role === 'superadmin') {
      baseItems.push({ to: '/projects', icon: FolderOpen, label: 'Projects' });
    }

    baseItems.push(
      { to: '/announcements', icon: Megaphone, label: 'Announcements' },
      { to: '/request-status', icon: FileText, label: 'Request Status' },
      { to: '/projects-table', icon: Table, label: 'Projects Table' },
    );

    if (role === 'admin' || role === 'superadmin') {
      baseItems.push({ to: '/create-user', icon: UserPlus, label: 'Create User' });
    }

    baseItems.push({ to: '/change-password', icon: Key, label: 'Change Password' });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <aside className="w-60 min-h-screen bg-background border-r flex flex-col">
      {/* Portal title */}
      <div className="p-4 border-b">
        <div className="bg-primary rounded-md px-4 py-3 text-center">
          <h2 className="text-sm font-semibold text-primary-foreground">
            Project Monitoring Portal
          </h2>
        </div>
        {profile && (
          <p className="text-xs text-primary text-center mt-2 font-medium">
            {getRoleLabel(profile.role)}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium w-full text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
