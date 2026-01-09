import { Skeleton } from "@/shared/components/ui/Skeleton"

export default function PhoneDetailSkeleton() {
    return (
        <div className="w-full max-w-[480px] mx-auto bg-white min-h-screen pb-24 animate-pulse">
            {/* Carousel Placeholder */}
            <div className="w-full aspect-square bg-gray-50 relative overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="px-5">
                {/* Title Area */}
                <div className="py-6 border-b border-gray-100">
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Option Selector Placeholder */}
                <div className="py-6">
                    {/* Capacity Section */}
                    <div className="mb-6">
                        <Skeleton className="h-4 w-20 mb-3" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                        </div>
                    </div>

                    {/* Color Section */}
                    <div>
                        <Skeleton className="h-4 w-20 mb-3" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                            <Skeleton className="h-14 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bar Placeholder */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 p-4 z-50">
                <Skeleton className="h-[56px] w-full rounded-[14px]" />
            </div>
        </div>
    )
}
