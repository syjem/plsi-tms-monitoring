import { Skeleton } from '@/components/ui/skeleton';

export function HeroSectionSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto text-center py-8 md:pt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-2 font-semibold text-base text-gray-700 mb-6 font-mono">
        Welcome, <Skeleton className="h-5 w-[150px] bg-primary/40" />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 font-sans">
        Phillogix Systems Employee <br /> Monitoring
      </h1>
    </div>
  );
}
