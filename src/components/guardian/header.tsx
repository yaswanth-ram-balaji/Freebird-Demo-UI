'use client';

import type { User } from '@/lib/data';
import {
  AlertTriangle,
  CheckCircle,
  Ghost,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Moon,
  QrCode,
  Settings,
  Shield,
  Sun,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/context/theme-provider';
import { useAnonymity } from '@/context/anonymity-provider';

type HeaderProps = {
  currentUser: User;
  onStatusChange: (status: 'safe' | 'help' | 'danger') => void;
};

export function Header({
  currentUser,
  onStatusChange,
}: HeaderProps) {

  const { theme, setTheme } = useTheme();
  const { isAnonymous, setIsAnonymous } = useAnonymity();
  const isDarkMode = theme === 'dark';

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  const handleToggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  }

  const StatusIcon = ({ status }: { status: User['status'] }) => {
    switch (status) {
      case 'safe': return <CheckCircle className="text-green-500" />;
      case 'help': return <HelpCircle className="text-yellow-500" />;
      case 'danger': return <AlertTriangle className="text-red-500" />;
      default: return <UserIcon />;
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-card border-b">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-headline font-bold text-foreground">GuardianLink</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.anonymous ? 'https://i.pravatar.cc/150?u=anonymous' : currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {currentUser.anonymous ? 'Anonymous' : currentUser.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {currentUser.anonymous ? 'Hidden' : `user_id: ${currentUser.id}`}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <StatusIcon status={currentUser.status} />
                <span className="ml-2">Set Status</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onStatusChange('safe')}>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span>I'm Safe</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange('help')}>
                    <HelpCircle className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Need Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange('danger')}>
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    <span>In Danger</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="anonymous-mode" className="flex items-center">
                  <Ghost className="mr-2 h-4 w-4" />
                  Anonymous Mode
                </Label>
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={handleToggleAnonymous}
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
               <div className="flex items-center justify-between w-full">
                <Label htmlFor="dark-mode" className="flex items-center">
                    {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    Dark Mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
               </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
           <DropdownMenuGroup>
            <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
             <DropdownMenuItem>
                <QrCode className="mr-2 h-4 w-4" />
                <span>Sync Contacts</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Trusted Contacts</span>
            </DropdownMenuItem>
             <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
