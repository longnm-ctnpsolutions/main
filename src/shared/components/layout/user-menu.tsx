import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useUserMenu } from "@/shared/components/layout/hooks/header-menu-state";
import type { User } from "@/shared/components/layout/types/header-menu.type";

interface UserMenuProps {
  user?: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const { userMenuActions } = useUserMenu(user);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={user?.avatar || "https://placehold.co/40x40"} 
              alt={user?.name || "User"} 
            />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user?.name || 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenuActions.map((action, index) => (
          <div key={action.key}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem 
              onClick={action.onClick}
              className="flex items-center gap-2"
              disabled={action.disabled}
            >
              {action.icon && <span className="text-sm">{action.icon}</span>}
              <span>{action.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}