import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth, getRoleLabel } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAddProject?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddProject }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="w-full">
      {/* Top bar with Add Project button */}
      <div className="flex items-center justify-between px-4 py-2 bg-background border-b">
        {profile && ['superadmin', 'admin', 'pi'].includes(profile.role) ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddProject}
            className="flex items-center gap-1 text-primary border-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        ) : <div />}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{profile?.email}</span>
          
          {/* User Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                <User className="h-4 w-4 text-primary-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.name || profile?.email}</span>
                  <span className="text-xs text-muted-foreground">{profile?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground">
                <span className="text-xs">{profile ? getRoleLabel(profile.role) : 'User'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Maroon banner with logo */}
      <div className="bg-primary px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/10 border-2 border-primary-foreground/30 flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">SIST</span>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-wide">
              SATHYABAMA
            </h1>
            <p className="text-xs text-primary-foreground/80 uppercase tracking-wider">
              Institute of Science and Technology
            </p>
            <p className="text-[10px] text-primary-foreground/60 uppercase">
              (Deemed to be University)
            </p>
            <p className="text-[8px] text-primary-foreground/50 mt-0.5">
              Accredited with Grade 'A++' by NAAC | 12B Status by UGC | Approved by AICTE
            </p>
          </div>
        </div>
      </div>

      {/* Role banner */}
      {profile && (
        <div className="bg-secondary py-2 text-center">
          <span className="text-sm font-medium text-secondary-foreground">
            {getRoleLabel(profile.role)}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
