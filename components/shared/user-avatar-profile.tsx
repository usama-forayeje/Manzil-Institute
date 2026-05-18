import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    imageUrl?: string;
    fullName?: string | null;
    emailAddresses?: Array<{ emailAddress: string }>;
    name?: string | null;
    email?: string;
  } | null;
}

export function UserAvatarProfile({ className, showInfo = false, user }: UserAvatarProfileProps) {
  const displayName = user?.fullName || user?.name || 'User';
  const displayEmail = user?.emailAddresses?.[0]?.emailAddress || user?.email || '';

  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl || ''} alt={displayName} />
        <AvatarFallback className='rounded-lg'>
          {displayName?.slice(0, 2)?.toUpperCase() || 'CN'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{displayName}</span>
          <span className='truncate text-xs text-muted-foreground'>{displayEmail}</span>
        </div>
      )}
    </div>
  );
}
