import {useCallback, useState} from "react"
import {Button, ButtonProps} from "@mui/material"

type CoolDownButtonProps = ButtonProps & {
    onClick: Function
    coolDownSeconds: number
}

const CoolDownButton = ({children, coolDownSeconds, onClick, disabled, ...props}: CoolDownButtonProps) => {
    const [coolDownLeft, setCoolDownLeft] = useState<number | null>()

    const coolDownTimerRefresher = useCallback(() => {
        setCoolDownLeft(coolDownSeconds)

        const finishDate = new Date() / 1000 + coolDownSeconds

        const intervalId = setInterval(() => {
            const dSeconds = Math.max((finishDate - new Date() / 1000), 0)

            if (dSeconds < 1) {
                clearInterval(intervalId)
                setCoolDownLeft(null)
            }

            setCoolDownLeft(Math.floor(dSeconds))
        }, 500)
    }, [])

    const onClickWrapper = useCallback(() => {
        onClick()
        coolDownTimerRefresher()
    }, [coolDownTimerRefresher, onClick])

    return (
        <Button onClick={onClickWrapper} disabled={!!coolDownLeft || !!disabled} {...props}>
            {children}
            {(!!coolDownLeft) && (
                <> | {coolDownLeft}</>
            )}
        </Button>
    )
}

export default CoolDownButton