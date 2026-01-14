import { getUser } from '@/app/actions/get-user';
import { CurrentUserAvatar } from '@/components/current-user-avatar';
import { AppLogo } from '@/components/icons';

export async function Header() {
  const user = await getUser();

  return (
    <header className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-3 px-4 rounded border-b">
        <div className="flex items-center gap-2">
          <AppLogo />
          <span className="font-medium">TMS Employee Monitoring</span>
        </div>
        <CurrentUserAvatar user={user} />
      </nav>
    </header>
  );
}
