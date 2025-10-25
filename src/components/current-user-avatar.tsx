import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CurrentUserAvatar = ({
  userName,
  avatarUrl,
}: {
  userName: string;
  avatarUrl: string | null;
}) => {
  const initials = userName
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <Avatar>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={initials} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
