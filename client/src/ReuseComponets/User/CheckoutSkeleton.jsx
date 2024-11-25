import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-7xl">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </section>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="w-20 h-30 rounded-md" />
                <div className="flex-grow">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>

          <Skeleton className="h-px w-full my-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full my-4" />
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex space-x-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

