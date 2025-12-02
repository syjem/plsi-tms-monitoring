import { checkUserExists } from '@/app/actions/auth/check-user-exists';

export default async function DemoPage() {
  const userExists = await checkUserExists('jrepoylo143@gmail.com');

  return <div>User exists: {userExists.toString()}</div>;
}
