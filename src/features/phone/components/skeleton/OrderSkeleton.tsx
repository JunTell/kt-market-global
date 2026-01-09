import { Skeleton } from "@/shared/components/ui/Skeleton"

export default function OrderSkeleton() {
    return (
        <div className="w-full max-w-[480px] mx-auto px-5 pt-5 pb-[120px] bg-white min-h-screen">

            {/* Product Summary Skeleton */}
            <div className="w-full rounded-[20px] flex items-center gap-5 py-2.5 mb-6">
                <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3 mt-1" />
                </div>
            </div>

            <div className="w-full h-px bg-[#F2F4F6] my-6" />

            {/* User Info Form Skeleton */}
            <div className="flex flex-col gap-6">
                {/* Section Title */}
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Input Fields */}
                <div className="space-y-6">
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-[58px] w-full rounded-xl" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-[58px] w-full rounded-xl" />
                    </div>
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-[58px] w-full rounded-xl" />
                    </div>
                </div>

                <div className="w-full h-px bg-[#F2F4F6] my-6" />

                {/* Next Section Title */}
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-4 pl-1">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Skeleton className="h-[60px] w-full rounded-[14px]" />
            </div>
        </div>
    )
}
