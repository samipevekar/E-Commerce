import React from 'react'

export default function ProductDetailSkeleton() {
    return (
        <div>
            <div className="flex w-full h-[100vh] flex-col gap-4 p-8">
                <div className="skeleton h-[70vh] w-full"></div>
                <div className="skeleton h-8 w-28"></div>
                <div className="skeleton h-8 w-full"></div>
                <div className="skeleton h-8 w-full"></div>
            </div>
        </div>
    )
}
