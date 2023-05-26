import webSocketEndpoints from "@/wsEndpoints"
import BaseSocketService from "@/utilities/socket"
import OperatorEvents from "@/services/events/OperatorEvents"


class TerminalSocketService extends BaseSocketService {
    setCountInQueue: Function
    setCurrentNumber: Function

    constructor({setCountInQueue, setCurrentNumber}) {
        super()

        this.setCountInQueue = setCountInQueue
        this.setCurrentNumber = setCurrentNumber
    }

    init(token) {
        this.socket = new WebSocket(webSocketEndpoints.operator() + `?token=${token}`)

        this.socket.onopen = () => {
            this.sendObject(
                {type: OperatorEvents.UPDATE_IN_QUEUE_COUNT}
            )
        }

        this.socket.onclose = (event) => {
            console.log(event)
        }

        this.socket.onmessage = (event) => {
            const data = this.parse(event.data)

            const eventType = data.type
            const payload = data.payload

            console.log(data)

            switch (eventType) {
                case OperatorEvents.UPDATE_IN_QUEUE_COUNT:
                    return this.setCountInQueue(payload.count)
                case OperatorEvents.SET_CURRENT:
                    return this.setCurrentNumber(payload.ticket.number)
                default:
                    break
            }
        }
    }

    callNext(){
        this.sendObject({
            type: OperatorEvents.CALL_NEXT
        })
    }
}

export default TerminalSocketService