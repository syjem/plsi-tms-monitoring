import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export function ErrorAlert({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center">
      <Alert variant="destructive" className="max-w-fit">
        <AlertCircleIcon />
        <AlertTitle>Internal Server Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
}
