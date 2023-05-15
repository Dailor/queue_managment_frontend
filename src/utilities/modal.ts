import {ReactNode} from "react"

export interface WithTriggerButtonProps {
    triggerButton: (onClick: Function) => ReactNode
}