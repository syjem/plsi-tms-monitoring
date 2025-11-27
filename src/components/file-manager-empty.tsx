'use client';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';

export function EmptyFileManager({ visible }: { visible?: boolean }) {
  return (
    <div className="p-4.5">
      <Empty
        className={cn(
          'transition-all duration-500 ease-out',
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
      >
        <EmptyHeader className="space-y-2">
          <EmptyMedia variant="icon" className="dark:bg-slate-800">
            <CloudUpload className="size-4" />
          </EmptyMedia>
          <EmptyTitle>Logs Empty</EmptyTitle>
          <EmptyDescription>
            Upload your daily logs to see them here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
