import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { AppLogo } from "./icons";

export function Header() {
  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center">
        <AppLogo />
        <CurrentUserAvatar />
      </nav>
    </header>
  );
}
