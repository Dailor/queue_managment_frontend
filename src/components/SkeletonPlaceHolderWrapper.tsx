import React from "react"
import {SkeletonProps} from "@mui/material/Skeleton/Skeleton"
import {Skeleton} from "@mui/material"


type SkeletonPlaceHolderWrapperProps = {
    children: React.ReactNode,
    skeletonProps: SkeletonProps
    isReady: boolean
}

export const SkeletonPlaceHolderWrapper = ({children, isReady, skeletonProps}: SkeletonPlaceHolderWrapperProps) => {
    if (isReady) {
        return (
            <>{children}</>
        )
    }
    return <Skeleton {...skeletonProps} />
}
