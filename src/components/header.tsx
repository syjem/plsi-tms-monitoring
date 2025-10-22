import { CurrentUserAvatar } from "@/components/current-user-avatar";

export function Header() {
  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center shadow-sm py-3 px-4 bg-white rounded-md">
        <span className="text-xl font-bold">Phillogix Systems Inc.</span>
        <CurrentUserAvatar />
      </nav>
    </header>
  );
}
