import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type: "card" | "product" | "store" | "list" | "detail";
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ type, count = 1, className }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        );

      case "product":
        return (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        );

      case "store":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        );

      case "detail":
        return (
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        );

      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className={className}>
      {count === 1 ? (
        renderSkeleton()
      ) : (
        <div className="grid gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      )}
    </div>
  );
}