import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function ProfileAvatar({
  profileImg,
  profileName,
  className,
}: Readonly<{ profileImg?: string; profileName: string; className?: string }>) {
  return (
    <Avatar className={cn('h-6 w-6', className)}>
      <AvatarImage src={profileImg} />
      <AvatarFallback className="text-sm bg-accent">
        {profileName[0]}
      </AvatarFallback>
    </Avatar>
  );
}
