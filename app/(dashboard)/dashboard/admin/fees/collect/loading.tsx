import { Skeleton } from '@/components/ui/skeleton';

export default function PageLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => (
          <div key={i} className="rounded-xl border p-4 flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <div className="border-b bg-muted/40 px-4 py-3 flex gap-4">
          {['w-40','w-28','w-32','w-24','w-20'].map((w,i) => <Skeleton key={i} className={`h-4 ${w}`} />)}
        </div>
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <div key={i} className="px-4 py-3 flex gap-4 border-b last:border-b-0">
            {['w-40','w-28','w-32','w-24','w-20'].map((w,j) => <Skeleton key={j} className={`h-4 ${w}`} />)}
          </div>
        ))}
      </div>
    </div>
  );
}